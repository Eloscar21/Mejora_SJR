import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { CategoriaReporte, ErroresReporte, ReporteFormulario } from '../models/Reporte';

export interface ReporteViewProps {
  formulario: ReporteFormulario;
  categorias: readonly CategoriaReporte[];
  errores: ErroresReporte;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  cambiarCampo: <K extends keyof ReporteFormulario>(campo: K, valor: ReporteFormulario[K]) => void;
  enviarReporte: () => Promise<void>;
  reiniciarFormulario: () => void;
}

type CampoTexto = Exclude<keyof ReporteFormulario, 'IdCategoria'>;
const campos: readonly { campo: CampoTexto; etiqueta: string; ejemplo: string }[] = [
  { campo: 'Titulo', etiqueta: 'Título *', ejemplo: 'Bache frente al parque' },
  { campo: 'Descripcion', etiqueta: 'Descripción *', ejemplo: 'Describe qué ocurre y dónde se encuentra' },
  { campo: 'UbicacionLatitud', etiqueta: 'Latitud *', ejemplo: '20.3889' },
  { campo: 'UbicacionLongitud', etiqueta: 'Longitud *', ejemplo: '-99.9961' },
  { campo: 'DireccionFisica', etiqueta: 'Dirección (opcional)', ejemplo: 'Calle, colonia y referencias' },
  { campo: 'EvidenciaUrl', etiqueta: 'URL de evidencia (opcional)', ejemplo: 'https://ejemplo.com/foto.jpg' },
];

/** UI declarativa: únicamente datos y callbacks; sin hooks ni servicios. */
export function ReporteView({ formulario, categorias, errores, isLoading, error, isSuccess, cambiarCampo, enviarReporte, reiniciarFormulario }: ReporteViewProps) {
  return (
    <SafeAreaView style={styles.page} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView style={styles.page} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Nueva incidencia</Text>
          <Text style={styles.description}>Ayúdanos a mejorar San Juan del Río. Los campos con * son obligatorios. Escribe las coordenadas del lugar de la incidencia.</Text>
          {isSuccess ? (
            <View style={styles.card}>
              <Text accessibilityRole="alert" style={styles.success}>Tu reporte se creó correctamente.</Text>
              <Pressable accessibilityRole="button" style={styles.button} onPress={reiniciarFormulario}>
                <Text style={styles.buttonText}>Crear otro reporte</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.card}>
              {campos.map(({ campo, etiqueta, ejemplo }) => (
                <View key={campo} style={styles.field}>
                  <Text style={styles.label}>{etiqueta}</Text>
                  <TextInput
                    accessibilityLabel={etiqueta}
                    style={[styles.input, campo === 'Descripcion' && styles.multiline, !!errores[campo] && styles.invalid]}
                    value={formulario[campo]}
                    onChangeText={valor => cambiarCampo(campo, valor)}
                    placeholder={ejemplo}
                    placeholderTextColor="#64748B"
                    editable={!isLoading}
                    multiline={campo === 'Descripcion'}
                    autoCapitalize={campo === 'EvidenciaUrl' ? 'none' : 'sentences'}
                    autoCorrect={campo !== 'EvidenciaUrl'}
                    // El teclado normal permite escribir el signo negativo en iOS.
                    keyboardType={campo === 'EvidenciaUrl' ? 'url' : 'default'}
                  />
                  {errores[campo] ? <Text accessibilityRole="alert" style={styles.error}>{errores[campo]}</Text> : null}
                </View>
              ))}
              <Text style={styles.label}>Categoría *</Text>
              <View accessibilityRole="radiogroup" accessibilityLabel="Categoría de la incidencia" style={styles.categories}>
                {categorias.map(({ IdCategoria, Nombre }) => (
                  <Pressable
                    key={IdCategoria}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: formulario.IdCategoria === IdCategoria, disabled: isLoading }}
                    disabled={isLoading}
                    onPress={() => cambiarCampo('IdCategoria', IdCategoria)}
                    style={[styles.category, formulario.IdCategoria === IdCategoria && styles.selected]}
                  >
                    <Text style={styles.label}>{formulario.IdCategoria === IdCategoria ? '● ' : '○ '}{Nombre}</Text>
                  </Pressable>
                ))}
              </View>
              {!categorias.length ? <Text style={styles.error}>No hay categorías disponibles. No es posible enviar el reporte por ahora.</Text> : null}
              {errores.IdCategoria ? <Text accessibilityRole="alert" style={styles.error}>{errores.IdCategoria}</Text> : null}
              {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: isLoading || !categorias.length, busy: isLoading }}
                disabled={isLoading || !categorias.length}
                style={[styles.button, (isLoading || !categorias.length) && styles.disabled]}
                onPress={enviarReporte}
              >
                {isLoading ? <ActivityIndicator color="#FFFFFF" /> : null}
                <Text style={styles.buttonText}>{isLoading ? 'Enviando…' : 'Enviar reporte'}</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 24, gap: 16, maxWidth: 600, width: '100%', alignSelf: 'center' },
  title: { fontSize: 28, fontWeight: '800', color: '#0F172A' },
  description: { color: '#475569', lineHeight: 22 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, gap: 16 },
  field: { gap: 6 },
  label: { color: '#334155', fontWeight: '600', fontSize: 15 },
  input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, padding: 12, color: '#0F172A', fontSize: 16 },
  multiline: { minHeight: 110, textAlignVertical: 'top' },
  invalid: { borderColor: '#B91C1C' },
  error: { color: '#B91C1C', lineHeight: 20 },
  success: { color: '#166534', fontSize: 18 },
  categories: { gap: 8 },
  category: { padding: 14, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10 },
  selected: { backgroundColor: '#EEF2FF', borderColor: '#4F46E5' },
  button: { backgroundColor: '#4F46E5', padding: 16, borderRadius: 12, alignItems: 'center', gap: 8 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  disabled: { opacity: 0.6 },
});
