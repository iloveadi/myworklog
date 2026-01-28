import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#fef2f2', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#991b1b', marginBottom: '1rem' }}>문제가 발생했습니다.</h1>
          <p style={{ color: '#b91c1c', marginBottom: '2rem' }}>애플리케이션을 로드할 수 없습니다.</p>
          <pre style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto', maxWidth: '80%', border: '1px solid #fee2e2', color: '#7f1d1d', textAlign: 'left' }}>
            {this.state.error && this.state.error.toString()}
          </pre>
          <p style={{ marginTop: '2rem', color: '#7f1d1d' }}>
            Vercel 배포 후라면, <strong>Redeploy</strong>를 시도해보세요.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
