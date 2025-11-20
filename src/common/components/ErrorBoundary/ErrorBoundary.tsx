import { CircleAlert, RefreshCcw } from 'lucide-react';
import { Component, ErrorInfo, ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component to catch React errors
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Call optional error handler
    this.props.onError?.(error, errorInfo);

    // Here you can send error to monitoring service (e.g., Sentry)
    // Sentry.captureException(error, { extra: errorInfo });

    this.setState({ errorInfo });
  }

  private handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
          <Card className="max-w-md w-full shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3 text-destructive">
                <div className="p-2 rounded-full bg-destructive/10">
                  <CircleAlert className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">Algo salió mal</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                La aplicación encontró un error inesperado. Por favor, intenta nuevamente o contacta
                a soporte si el problema persiste.
              </p>

              {/* Show error details in development */}
              {this.state.error && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Detalles del error (solo en desarrollo):
                  </p>
                  <pre className="text-xs bg-muted p-3 rounded-lg overflow-auto max-h-40 font-mono">
                    <code>{this.state.error.message}</code>
                  </pre>
                  {this.state.errorInfo && (
                    <pre className="text-xs bg-muted p-3 rounded-lg overflow-auto max-h-40 font-mono">
                      <code>{this.state.errorInfo.componentStack}</code>
                    </pre>
                  )}
                </div>
              )}
            </CardContent>

            <CardFooter>
              <Button onClick={this.handleReset} className="w-full gap-2">
                <RefreshCcw className="w-4 h-4" />
                Reintentar
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
