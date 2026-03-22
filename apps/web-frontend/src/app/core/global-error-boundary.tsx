import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logErrorToFirebase } from './error-logger';
import { ErrorPage } from '@my-org/shared-ui';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logErrorToFirebase(error, 'react-error', { 
      componentStack: errorInfo.componentStack 
    });
  }

  public render() {
    if (this.state.hasError) {
      return <ErrorPage />;
    }

    return this.props.children;
  }
}
