import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constants';
import { useAuth } from '@/features/auth';
import { PasswordStrength } from '@/features/auth/components/PasswordStrength';
import { useToast } from '@/hooks/use-toast';
import { validateEmail, validateName, validatePassword } from '@/utils';

interface RegisterFormProps {
  onSwitchMode: () => void;
}

interface RegisterFormState {
  name: string;
  email: string;
  password: string;
}

type RegisterFormErrors = Partial<Record<keyof RegisterFormState, string>>;

const INITIAL_STATE: RegisterFormState = {
  name: '',
  email: '',
  password: '',
};

export const RegisterForm = ({ onSwitchMode }: RegisterFormProps) => {
  const [formState, setFormState] = useState<RegisterFormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const { register, isLoading } = useAuth();
  const { toast } = useToast();

  const isSubmitDisabled = useMemo(
    () => isLoading || !formState.name || !formState.email || !formState.password,
    [formState, isLoading]
  );

  const handleChange = (field: keyof RegisterFormState) => (value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: RegisterFormErrors = {};

    if (!validateName(formState.name)) {
      newErrors.name = 'Ingresa un nombre entre 2 y 50 caracteres.';
    }

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
      await register(formState.name.trim(), formState.email, formState.password);
      toast({
        title: SUCCESS_MESSAGES.REGISTER_SUCCESS,
        description: 'Tu cuenta ha sido creada.',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.REGISTER_FAILED;
      toast({
        title: ERROR_MESSAGES.REGISTER_FAILED,
        description: message,
        variant: 'destructive',
      });
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="name">
            Nombre completo
          </label>
          <Input
            id="name"
            type="text"
            placeholder="Jane Doe"
            autoComplete="name"
            value={formState.name}
            onChange={(event) => handleChange('name')(event.target.value)}
            disabled={isLoading}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="email">
            Correo electrónico
          </label>
          <Input
            id="register-email"
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
          <label className="text-sm font-medium text-foreground" htmlFor="register-password">
            Contraseña
          </label>
          <Input
            id="register-password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            value={formState.password}
            onChange={(event) => handleChange('password')(event.target.value)}
            disabled={isLoading}
            aria-describedby="password-strength"
          />
          {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
          {formState.password && !errors.password && (
            <PasswordStrength
              password={formState.password}
              className="mt-3 p-3 bg-muted/50 rounded-lg"
            />
          )}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitDisabled}>
        {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
      </Button>

      <p className="text-sm text-center text-muted-foreground">
        ¿Ya tienes una cuenta?{' '}
        <button
          type="button"
          className="text-primary font-medium hover:underline"
          onClick={onSwitchMode}
          disabled={isLoading}
        >
          Inicia sesión
        </button>
      </p>
    </form>
  );
};
