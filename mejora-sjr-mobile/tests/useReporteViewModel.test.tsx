/// <reference types="node" />
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement } from 'react';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';
import { useReporteViewModel, validarReporte } from '../src/viewModels/useReporteViewModel';
import type { ReporteFormulario, CrearReportePayload } from '../src/models/Reporte';
import type { IReporteApiService } from '../src/services/contracts/IReporteApiService';
import { ReporteApiService } from '../src/services/api/ReporteApiService';
import { conUsuarioTemporal } from '../src/services/mocks/conUsuarioTemporal';
import { CATEGORIAS_REPORTE } from '../src/constants/categoriasReporte';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
test('las cinco categorías confirmadas permiten preparar un reporte', () => {
  assert.deepEqual(CATEGORIAS_REPORTE.map(categoria => categoria.IdCategoria), [1, 2, 3, 4, 5]);
  for (const { IdCategoria } of CATEGORIAS_REPORTE) {
    assert.ok(validarReporte({ ...formulario, IdCategoria }, CATEGORIAS_REPORTE).payload);
  }
});

test('adaptador temporal envía IdUsuario 1 por HTTP sin mutar los siete campos del formulario', async () => {
  const originalFetch = globalThis.fetch;
  const payload = Object.freeze(validarReporte({ ...formulario, IdCategoria: 1 }, CATEGORIAS_REPORTE).payload!);
  const service = conUsuarioTemporal(new ReporteApiService('https://example.test/api', { getToken: async () => null }));
  try {
    globalThis.fetch = async (_url, options) => {
      assert.deepEqual(JSON.parse(options?.body as string), { ...payload, IdUsuario: 1 });
      return new Response(JSON.stringify({ success: true }), { status: 201 });
    };
    await service.crearReporte(payload);
    assert.equal(Object.keys(payload).length, 7);
    assert.equal('IdUsuario' in payload, false);
  } finally { globalThis.fetch = originalFetch; }
});
// IDs únicamente de prueba; no constituyen un catálogo de producción.
const categorias = [{ IdCategoria: 7, Nombre: 'Categoría de prueba' }];
const formulario: ReporteFormulario = {
  Titulo: ' Bache ', Descripcion: ' Frente al parque ',
  UbicacionLatitud: '0', UbicacionLongitud: '-99,9961',
  DireccionFisica: '', EvidenciaUrl: '', IdCategoria: 7,
};

test('transforma números y conserva exactamente las siete llaves SQL', () => {
  assert.deepEqual(validarReporte(formulario, categorias).payload, {
    Titulo: 'Bache', Descripcion: 'Frente al parque', UbicacionLatitud: 0,
    UbicacionLongitud: -99.9961, DireccionFisica: '', EvidenciaUrl: '', IdCategoria: 7,
  });
});

test('rechaza blancos, coordenadas inválidas, categoría ajena y URL no HTTP', () => {
  for (const cambio of [
    { Titulo: ' ' }, { Descripcion: '' }, { UbicacionLatitud: '' },
    { UbicacionLatitud: '91' }, { UbicacionLongitud: '-181' },
    { UbicacionLongitud: 'Infinity' }, { UbicacionLatitud: '0x10' },
    { IdCategoria: null }, { IdCategoria: 8 }, { EvidenciaUrl: 'file:///foto' },
  ]) {
    assert.equal(validarReporte({ ...formulario, ...cambio }, categorias).payload, null);
  }
  assert.equal(validarReporte(formulario, []).payload, null);
});

async function montar(service: IReporteApiService) {
  let vm!: ReturnType<typeof useReporteViewModel>;
  let root!: ReactTestRenderer;
  function Consumer() { vm = useReporteViewModel(service, categorias); return null; }
  await act(async () => { root = create(createElement(Consumer)); });
  const llenar = async () => {
    await act(async () => {
      for (const campo of Object.keys(formulario) as (keyof ReporteFormulario)[]) {
        vm.cambiarCampo(campo, formulario[campo]);
      }
    });
  };
  return { get vm() { return vm; }, llenar, cerrar: async () => { await act(async () => root.unmount()); } };
}

test('no llama HTTP cuando el formulario es inválido', async () => {
  let llamadas = 0;
  const hook = await montar({ crearReporte: async () => { llamadas++; } });
  try {
    await act(async () => hook.vm.enviarReporte());
    assert.equal(llamadas, 0);
    assert.ok(hook.vm.errores.Titulo);
  } finally { await hook.cerrar(); }
});

test('expone carga, impide doble envío y confirma éxito; permite crear otro', async () => {
  let resolver!: () => void;
  let llamadas = 0;
  let enviado: CrearReportePayload | undefined;
  const hook = await montar({ crearReporte: payload => {
    llamadas++; enviado = payload;
    return new Promise<void>(resolve => { resolver = resolve; });
  } });
  try {
    await hook.llenar();
    let solicitud!: Promise<void>;
    await act(async () => { solicitud = hook.vm.enviarReporte(); void hook.vm.enviarReporte(); });
    assert.equal(hook.vm.isLoading, true);
    assert.equal(llamadas, 1);
    assert.equal(enviado?.UbicacionLatitud, 0);
    await act(async () => { resolver(); await solicitud; });
    assert.equal(hook.vm.isLoading, false);
    assert.equal(hook.vm.isSuccess, true);
    await act(async () => hook.vm.enviarReporte());
    assert.equal(llamadas, 1);
    await act(async () => hook.vm.reiniciarFormulario());
    assert.equal(hook.vm.formulario.Titulo, '');
    assert.equal(hook.vm.isSuccess, false);
  } finally { await hook.cerrar(); }
});

test('conserva campos ante error y permite reintentar', async () => {
  let llamadas = 0;
  const hook = await montar({ crearReporte: async () => {
    if (++llamadas === 1) throw new Error('Sin conexión');
  } });
  try {
    await hook.llenar();
    await act(async () => hook.vm.enviarReporte());
    assert.equal(hook.vm.error, 'Sin conexión');
    assert.equal(hook.vm.formulario.Titulo, formulario.Titulo);
    assert.equal(hook.vm.isLoading, false);
    await act(async () => hook.vm.enviarReporte());
    assert.equal(hook.vm.error, null);
    assert.equal(hook.vm.isSuccess, true);
  } finally { await hook.cerrar(); }
});

test('servicio envía JSON exacto y token, rechaza error HTTP y éxito inválido', async () => {
  const originalFetch = globalThis.fetch;
  const payload = validarReporte(formulario, categorias).payload!;
  const service = new ReporteApiService('https://example.test/api/', { getToken: async () => 'token-prueba' });
  try {
    globalThis.fetch = async (url, options) => {
      assert.equal(url, 'https://example.test/api/reportes');
      assert.equal(options?.method, 'POST');
      assert.deepEqual(JSON.parse(options?.body as string), payload);
      assert.equal((options?.headers as Record<string, string>).Authorization, 'Bearer token-prueba');
      return new Response(JSON.stringify({ success: true }), { status: 201 });
    };
    await service.crearReporte(payload);
    globalThis.fetch = async () => new Response(JSON.stringify({ message: 'Falta IdUsuario' }), { status: 400 });
    await assert.rejects(service.crearReporte(payload), /Falta IdUsuario/);
    globalThis.fetch = async () => new Response('{}', { status: 200 });
    await assert.rejects(service.crearReporte(payload), /confirmar/);
  } finally { globalThis.fetch = originalFetch; }
});
