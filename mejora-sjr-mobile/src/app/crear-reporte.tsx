import { CATEGORIAS_REPORTE } from '../constants/categoriasReporte';
import { reporteApiService } from '../providers/reporteDependencies';
import { useReporteViewModel } from '../viewModels/useReporteViewModel';
import { ReporteView } from '../views/ReporteView';

export default function CrearReporteScreen() {
  const vm = useReporteViewModel(reporteApiService, CATEGORIAS_REPORTE);
  return <ReporteView
    formulario={vm.formulario} categorias={vm.categorias} errores={vm.errores}
    isLoading={vm.isLoading} error={vm.error} isSuccess={vm.isSuccess}
    cambiarCampo={vm.cambiarCampo} enviarReporte={vm.enviarReporte}
    reiniciarFormulario={vm.reiniciarFormulario}
  />;
}
