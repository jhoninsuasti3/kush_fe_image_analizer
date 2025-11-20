import { Check, X } from 'lucide-react';
import { useMemo } from 'react';

import { FORM_VALIDATION } from '@/constants';

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const REQUIREMENTS: PasswordRequirement[] = [
  {
    label: 'Al menos 8 caracteres',
    test: (pwd) => pwd.length >= FORM_VALIDATION.PASSWORD.MIN_LENGTH,
  },
  {
    label: 'Una letra mayúscula',
    test: (pwd) => /[A-Z]/.test(pwd),
  },
  {
    label: 'Una letra minúscula',
    test: (pwd) => /[a-z]/.test(pwd),
  },
  {
    label: 'Un número',
    test: (pwd) => /\d/.test(pwd),
  },
  {
    label: 'Un carácter especial (@$!%*?&-_.,;:#)',
    test: (pwd) => /[@$!%*?&\-_.,;:#]/.test(pwd),
  },
];

/**
 * Password Strength Indicator Component
 *
 * Shows visual feedback about password strength and requirements
 */
export const PasswordStrength = ({ password, className = '' }: PasswordStrengthProps) => {
  const results = useMemo(
    () => REQUIREMENTS.map((req) => ({ ...req, met: req.test(password) })),
    [password]
  );

  const metCount = useMemo(() => results.filter((r) => r.met).length, [results]);

  const strength = useMemo(() => {
    if (metCount === 0) return { label: 'Muy débil', color: 'bg-destructive' };
    if (metCount <= 2) return { label: 'Débil', color: 'bg-orange-500' };
    if (metCount <= 4) return { label: 'Media', color: 'bg-yellow-500' };
    return { label: 'Fuerte', color: 'bg-green-500' };
  }, [metCount]);

  if (!password) {
    return null;
  }

  return (
    <div className={className}>
      {/* Strength Bar */}
      <div className="space-y-2 mb-3">
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground">Fortaleza:</span>
          <span className="font-medium">{strength.label}</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${strength.color}`}
            style={{ width: `${(metCount / REQUIREMENTS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="space-y-1.5">
        {results.map((requirement) => (
          <div key={requirement.label} className="flex items-center gap-2 text-xs">
            {requirement.met ? (
              <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
            ) : (
              <X className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
            )}
            <span className={requirement.met ? 'text-foreground' : 'text-muted-foreground'}>
              {requirement.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
