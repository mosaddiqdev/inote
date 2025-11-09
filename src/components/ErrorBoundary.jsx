import { Component } from 'react';
import { Home } from 'lucide-react';
import styles from './ErrorBoundary.module.css';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorBoundary}>
          <div className={styles.container}>
            <div className={styles.content}>
              <h1 className={styles.title}>Something went wrong</h1>
              <p className={styles.message}>
                We encountered an unexpected error. Please try refreshing the page.
              </p>
              
              <div className={styles.actions}>
                <button 
                  className={styles.primaryBtn}
                  onClick={() => window.location.href = '/'}
                >
                  <Home size={18} />
                  <span>Go Home</span>
                </button>
                <button 
                  className={styles.secondaryBtn}
                  onClick={() => window.location.reload()}
                >
                  <span>Refresh Page</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
