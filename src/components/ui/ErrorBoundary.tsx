import React from 'react';
import { colors, fonts } from '@/styles/tokens';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div style={{
          padding: '40px 20px',
          textAlign: 'center',
          background: colors.dangerBg,
          border: `1px solid ${colors.dangerBorder}`,
          borderRadius: 12,
          margin: 20,
        }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
          <div style={{ fontWeight: 800, fontSize: 16, color: colors.danger, marginBottom: 8 }}>
            Something went wrong
          </div>
          <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 16, maxWidth: 400, margin: '0 auto 16px' }}>
            An error occurred while rendering this section. Try refreshing the page.
          </div>
          <div style={{
            background: colors.surface,
            border: `1px solid ${colors.dangerBorder}`,
            borderRadius: 8,
            padding: '10px 16px',
            fontSize: 11,
            fontFamily: fonts.mono,
            color: colors.danger,
            maxWidth: 500,
            margin: '0 auto 16px',
            wordBreak: 'break-word',
            textAlign: 'left',
          }}>
            {this.state.error?.message || 'Unknown error'}
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              background: colors.danger,
              color: colors.surface,
              border: 'none',
              borderRadius: 6,
              padding: '8px 20px',
              fontWeight: 700,
              fontSize: 12,
              fontFamily: fonts.mono,
              cursor: 'pointer',
              letterSpacing: 1,
            }}
          >
            TRY AGAIN
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
