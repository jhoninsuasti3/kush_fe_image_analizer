import { Sparkles, Shield, Zap, Image as ImageIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm, RegisterForm } from '@/features/auth';

type AuthMode = 'login' | 'register';

const AUTH_COPY: Record<AuthMode, { title: string; description: string }> = {
  login: {
    title: 'Bienvenido de nuevo',
    description: 'Inicia sesión para acceder al analizador de imágenes con IA.',
  },
  register: {
    title: 'Crear una cuenta',
    description: 'Regístrate para comenzar a analizar imágenes con inteligencia artificial.',
  },
};

const FEATURES = [
  {
    icon: ImageIcon,
    title: 'Análisis IA',
    description: 'Obtén etiquetas precisas de tus imágenes',
  },
  {
    icon: Zap,
    title: 'Rápido',
    description: 'Resultados en segundos',
  },
  {
    icon: Shield,
    title: 'Seguro',
    description: 'Tus datos están protegidos',
  },
] as const;

const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>('login');

  const copy = useMemo(() => AUTH_COPY[mode], [mode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative min-h-screen flex flex-col lg:flex-row">
        {/* Left side - Branding & Features (hidden on mobile, visible on lg+) */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 flex-col justify-center p-12 xl:p-16">
          <div className="max-w-lg">
            {/* Logo & Title */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                <Sparkles className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl xl:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Kush AI
                </h1>
                <p className="text-sm text-muted-foreground">Análisis Inteligente</p>
              </div>
            </div>

            {/* Description */}
            <h2 className="text-2xl xl:text-3xl font-semibold mb-4 leading-tight">
              Analiza tus imágenes con
              <span className="text-primary"> Inteligencia Artificial</span>
            </h2>
            <p className="text-muted-foreground mb-12 text-lg">
              Sube tus imágenes y obtén etiquetas descriptivas generadas por IA de última
              generación. Rápido, preciso y seguro.
            </p>

            {/* Features */}
            <div className="space-y-6">
              {FEATURES.map((feature) => (
                <div key={feature.title} className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Auth Form */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo (visible only on mobile) */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg mb-4">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                Analizador Inteligente de Imágenes
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Accede para analizar tus imágenes con IA
              </p>
            </div>

            {/* Auth Card */}
            <Card className="border-border/60 shadow-2xl backdrop-blur-sm bg-card/95">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl">{copy.title}</CardTitle>
                <CardDescription className="text-base">{copy.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {mode === 'login' ? (
                  <LoginForm onSwitchMode={() => setMode('register')} />
                ) : (
                  <RegisterForm onSwitchMode={() => setMode('login')} />
                )}
              </CardContent>
            </Card>

            {/* Footer */}
            <p className="text-center text-xs text-muted-foreground mt-6">
              Al continuar, aceptas nuestros términos de servicio y política de privacidad.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
