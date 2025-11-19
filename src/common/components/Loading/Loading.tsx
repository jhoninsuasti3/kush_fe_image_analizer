import { Loader } from 'lucide-react';

interface LoadingProps {
  text?: string;
  className?: string;
}

/**
 * Loading component with spinner
 *
 * @param text - Optional loading text
 * @param className - Additional CSS classes
 */
export const Loading = ({ text = 'Cargando...', className = '' }: LoadingProps) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader className="w-8 h-8 animate-spin text-primary" />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
};
