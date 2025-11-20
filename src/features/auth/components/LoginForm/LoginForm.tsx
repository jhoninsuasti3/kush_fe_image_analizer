import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constants';
import { useAuth } from '@/features/auth';
import { useToast } from '@/hooks/use-toast';
import { validateEmail, validatePassword } from '@/utils';

interface LoginFormProps {
  onSwitchMode: () => void;
}

interface LoginFormState {
  email: string;
  password: string;
}

type LoginFormErrors = Partial<Record<keyof LoginFormState, string>>;

const INITIAL_STATE: LoginFormState = {
  email: '',
  password: '',
};

export const LoginForm = ({ onSwitchMode }: LoginFormProps) => {
  const [formState, setFormState] = useState<LoginFormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const { login, isLoading } = useAuth();
  const { toast } = useToast();

  const isSubmitDisabled = useMemo(
    () => isLoading || !formState.email || !formState.password,
    [formState.email, formState.password, isLoading]
  );

  const handleChange = (field: keyof LoginFormState) => (value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};

    if (!validateEmail(formState.email)) {
      newErrors.email = 'Ingresa un correo válido.';
    }

    if (!validatePassword(formState.password)) {
      newErrors.password =
        'La contraseña debe incluir mayúsculas, minúsculas, número y caracter especial.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await login(formState.email, formState.password);
      toast({
        title: SUCCESS_MESSAGES.LOGIN_SUCCESS,
        description: 'Bienvenido de nuevo.',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.LOGIN_FAILED;
      toast({
        title: ERROR_MESSAGES.LOGIN_FAILED,
        description: message,
        variant: 'destructive',
      });
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="email">
            Correo electrónico
          </label>
          <Input
            id="email"
            type="email"
            placeholder="nombre@empresa.com"
            autoComplete="email"
            value={formState.email}
            onChange={(event) => handleChange('email')(event.target.value)}
            disabled={isLoading}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="password">
            Contraseña
          </label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={formState.password}
            onChange={(event) => handleChange('password')(event.target.value)}
            disabled={isLoading}
          />
          {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitDisabled}>
        {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </Button>

      <p className="text-sm text-center text-muted-foreground">
        ¿Aún no tienes una cuenta?{' '}
        <button
          type="button"
          className="text-primary font-medium hover:underline"
          onClick={onSwitchMode}
          disabled={isLoading}
        >
          Crear cuenta
        </button>
      </p>
    </form>
  );
};
