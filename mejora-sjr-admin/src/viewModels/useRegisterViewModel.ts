import { useState } from "react";
import type { IAuthService, RegisterPayload } from "@/services/IAuthService";
import { authApiService } from "@/services/AuthApiService";

export function useRegisterViewModel(apiService: IAuthService = authApiService) {
  // Estado local que respeta el PascalCase del backend
  const [formData, setFormData] = useState<RegisterPayload>({
    NombreCompleto: "",
    Correo: "",
    PasswordHash: "",
    Telefono: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Manejador genérico de inputs
  const handleChange = (field: keyof RegisterPayload, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null); // Limpiar errores si el usuario vuelve a escribir
  };

  // Función principal de registro
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.NombreCompleto || !formData.Correo || !formData.PasswordHash) {
      setError("Por favor completa los campos obligatorios.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Llamada HTTP aislada en el servicio
      await apiService.register(formData);
      
      setSuccess(true);
      // Aquí podrías redireccionar al login: router.push('/login')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido al registrar.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    error,
    success,
    handleChange,
    handleSubmit,
  };
}
