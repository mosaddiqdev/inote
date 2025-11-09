import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Editor from './pages/Editor';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/note/:id" element={<Editor />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 2500,
          style: {
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'clamp(0.75rem, 2.5vw, var(--font-size-sm))',
            padding: 'clamp(12px, 4vw, 16px)',
            fontWeight: '500',
            width: 'min(360px, calc(100vw - 32px))',
            maxWidth: 'min(360px, calc(100vw - 32px))',
            margin: '0 auto',
          },
          success: {
            iconTheme: {
              primary: 'var(--color-text)',
              secondary: 'var(--color-surface)',
            },
          },
        }}
      />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;