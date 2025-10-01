import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './Header';

/**
 * Main application layout component
 * Includes Header and renders child routes via Outlet
 */
const AppLayout = () => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Header />

      <Box component="main">
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppLayout;
