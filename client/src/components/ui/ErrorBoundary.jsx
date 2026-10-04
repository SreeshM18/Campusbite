import React, { Component } from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';
import { Button } from './Button';

/**
 * CampusBite Global React Error Boundary
 * Safe failover UI preventing white screens of death.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[CampusBite Error Boundary Caught]:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1.25rem'
          }}
        >
          <div
            className="card animate-fade-in"
            style={{
              maxWidth: '520px',
              width: '100%',
              padding: '2.5rem 2rem',
              textAlign: 'center',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-danger-bg)',
                color: 'var(--color-danger)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <AlertCircle size={32} />
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.5rem',
                fontWeight: 800,
                color: 'var(--color-text-primary)',
                marginBottom: '0.5rem'
              }}
            >
              Something went wrong
            </h2>

            <p
              style={{
                fontSize: '0.92rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.5,
                marginBottom: '2rem'
              }}
            >
              We encountered an unexpected display issue while preparing your canteen experience. Please try refreshing or return to the main menu.
            </p>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.85rem',
                justifyContent: 'center'
              }}
            >
              <Button
                variant="primary"
                onClick={this.handleReload}
                iconBefore={<RotateCcw size={16} />}
              >
                Reload Page
              </Button>
              <Button
                variant="tertiary"
                onClick={this.handleGoHome}
                iconBefore={<Home size={16} />}
              >
                Return to Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
