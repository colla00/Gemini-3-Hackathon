import { useState, useMemo } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showStrength?: boolean;
  showRequirements?: boolean;
  required?: boolean;
  minLength?: number;
  className?: string;
}

interface PasswordRequirement {
  label: string;
  met: boolean;
}

export const PasswordInput = ({
  id,
  value,
  onChange,
  placeholder = '••••••••',
  showStrength = false,
  showRequirements = false,
  required = false,
  minLength = 6,
  className,
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const requirements: PasswordRequirement[] = useMemo(() => [
    { label: `At least ${minLength} characters`, met: value.length >= minLength },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(value) },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(value) },
    { label: 'Contains a number', met: /\d/.test(value) },
  ], [value, minLength]);

  const strength = useMemo(() => {
    const metCount = requirements.filter(r => r.met).length;
    if (value.length === 0) return { level: 0, label: '', color: '' };
    if (metCount <= 1) return { level: 1, label: 'Weak', color: 'bg-destructive' };
    if (metCount === 2) return { level: 2, label: 'Fair', color: 'bg-risk-medium' };
    if (metCount === 3) return { level: 3, label: 'Good', color: 'bg-risk-low' };
    return { level: 4, label: 'Strong', color: 'bg-primary' };
  }, [requirements, value.length]);

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          className={cn('pr-10', className)}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>

      {showStrength && value.length > 0 && (
        <div className="space-y-1">
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={cn(
                  'h-1 flex-1 rounded-full transition-colors',
                  level <= strength.level ? strength.color : 'bg-muted'
                )}
              />
            ))}
          </div>
          <p className={cn(
            'text-xs font-medium',
            strength.level <= 1 ? 'text-destructive' :
            strength.level === 2 ? 'text-risk-medium' :
            strength.level === 3 ? 'text-risk-low' : 'text-primary'
          )}>
            {strength.label}
          </p>
        </div>
      )}

      {showRequirements && value.length > 0 && (
        <ul className="space-y-1">
          {requirements.map((req, i) => (
            <li key={i} className="flex items-center gap-2 text-xs">
              {req.met ? (
                <Check className="w-3 h-3 text-risk-low" />
              ) : (
                <X className="w-3 h-3 text-muted-foreground" />
              )}
              <span className={req.met ? 'text-risk-low' : 'text-muted-foreground'}>
                {req.label}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
