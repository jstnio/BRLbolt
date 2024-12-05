import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
          <div className="max-w-max mx-auto">
            <main className="sm:flex">
              <div className="sm:ml-6">
                <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                  <div className="flex items-center">
                    <AlertTriangle className="h-12 w-12 text-red-500" />
                    <h1 className="ml-3 text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl">
                      Something went wrong
                    </h1>
                  </div>
                  <div className="mt-4">
                    <div className="mt-4 flex space-x-3">
                      <Button
                        onClick={() => window.location.reload()}
                        variant="default"
                      >
                        Refresh page
                      </Button>
                      <Button
                        onClick={() => window.location.href = '/'}
                        variant="outline"
                      >
                        Go back home
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}