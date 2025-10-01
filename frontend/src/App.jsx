import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';
import theme from './theme/theme';
import { store } from './store';
import AppRoutes from './components/AppRoutes';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <AppRoutes />
          </Router>
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                padding: '16px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              },
              success: {
                style: {
                  background: '#f0f9f0',
                  color: '#2e7d32',
                  border: '1px solid #4caf50',
                },
                iconTheme: {
                  primary: '#4caf50',
                  secondary: '#f0f9f0',
                },
              },
              error: {
                style: {
                  background: '#fef7f7',
                  color: '#c62828',
                  border: '1px solid #f44336',
                },
                iconTheme: {
                  primary: '#f44336',
                  secondary: '#fef7f7',
                },
              },
              loading: {
                style: {
                  background: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #9ca3af',
                },
                iconTheme: {
                  primary: '#6b7280',
                  secondary: '#f3f4f6',
                },
              },
            }}
          />
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
