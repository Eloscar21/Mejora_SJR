import React, { useState } from 'react';
import { LoginView } from '../views/LoginView';
import { RegisterView } from '../views/RegisterView';
import { AuthResponse } from '../models/Auth';

export default function AuthScreen() {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'register'>('login');

  const handleLoginSuccess = (auth: AuthResponse | null) => {
    console.log('✅ Sesión iniciada exitosamente:', auth);
  };

  const handleRegisterSuccess = (auth: AuthResponse | null) => {
    console.log('✅ Registro exitoso:', auth);
  };

  if (currentScreen === 'register') {
    return (
      <RegisterView
        onNavigateToLogin={() => setCurrentScreen('login')}
        onRegisterSuccess={handleRegisterSuccess}
      />
    );
  }

  return (
    <LoginView
      onNavigateToRegister={() => setCurrentScreen('register')}
      onLoginSuccess={handleLoginSuccess}
    />
  );
}
