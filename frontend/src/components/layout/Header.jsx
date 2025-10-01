import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Receipt as ReceiptIcon,
  ExitToApp,
  Person,
  Settings,
  Notifications,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    handleClose();
    handleMobileMenuClose();
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/login', { replace: true });
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleMobileMenuClose();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        backgroundColor: 'white',
        borderBottom: '1px solid #f0f0f0',
        color: '#1a1a1a',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3 }, py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/logo.svg" alt="Logo" width={32} />
          </Box>
          <Typography 
            variant="h5" 
            component="div" 
            sx={{ 
              fontWeight: 700,
              color: '#1a1a1a',
              letterSpacing: '-0.5px'
            }}
          >
            Finance Tracker
          </Typography>
          </Box>
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, mr: 3 }}>
          <Button
            startIcon={<DashboardIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: 2,
              color: isActive('/dashboard') ? '#1976d2' : '#666',
              backgroundColor: isActive('/dashboard') ? '#e3f2fd' : 'transparent',
              '&:hover': {
                backgroundColor: isActive('/dashboard') ? '#e3f2fd' : '#f5f5f5',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            Dashboard
          </Button>
          <Button
            startIcon={<ReceiptIcon />}
            onClick={() => navigate('/dashboard/transactions')}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: 2,
              color: isActive('/dashboard/transactions') ? '#1976d2' : '#666',
              backgroundColor: isActive('/dashboard/transactions') ? '#e3f2fd' : 'transparent',
              '&:hover': {
                backgroundColor: isActive('/dashboard/transactions') ? '#e3f2fd' : '#f5f5f5',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            Transactions
          </Button>
        </Box>

        <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMobileMenuToggle}
            sx={{
              color: '#1a1a1a',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              }
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Typography variant="body2" color="#666" sx={{ fontWeight: 500 }}>
              Welcome back,
            </Typography>
            <Typography variant="body2" color="#1a1a1a" sx={{ fontWeight: 600, mt: -0.5 }}>
              {user?.firstName || user?.name || 'User'}
            </Typography>
          </Box>

          <IconButton
            size="medium"
            sx={{
              color: '#666',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              }
            }}
          >
            <Notifications />
          </IconButton>

          <IconButton
            size="medium"
            aria-label="account menu"
            aria-controls="user-menu"
            aria-haspopup="true"
            onClick={handleMenu}
            sx={{
              p: 0.5,
              border: '2px solid transparent',
              '&:hover': {
                border: '2px solid #e3f2fd',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <Avatar
              src={user?.profileImage || undefined}
              sx={{
                width: 36,
                height: 36,
                backgroundColor: '#1976d2',
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              {!user?.profileImage && (user?.firstName?.[0] || user?.name?.[0] || 'U').toUpperCase()}
            </Avatar>
          </IconButton>

          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{
              mt: 1,
              '& .MuiPaper-root': {
                borderRadius: 2,
                minWidth: 200,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                border: '1px solid #f0f0f0',
              }
            }}
          >
            <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
              <Typography variant="body2" fontWeight="600" color="#1a1a1a">
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="caption" color="#666">
                {user?.email}
              </Typography>
            </Box>

            <MenuItem onClick={() => { handleClose(); navigate('/profile'); }} sx={{ py: 1.5 }}>
              <Person sx={{ mr: 2, color: '#666' }} />
              <Typography variant="body2" fontWeight="500">Profile</Typography>
            </MenuItem>
            <MenuItem onClick={() => { handleClose(); navigate('/settings'); }} sx={{ py: 1.5 }}>
              <Settings sx={{ mr: 2, color: '#666' }} />
              <Typography variant="body2" fontWeight="500">Settings</Typography>
            </MenuItem>
            
            <Divider sx={{ my: 1 }} />
            
            <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: '#d32f2f' }}>
              <ExitToApp sx={{ mr: 2 }} />
              <Typography variant="body2" fontWeight="500">Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>

      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuClose}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
            backgroundColor: 'white',
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid #f0f0f0' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="600" color="#1a1a1a">
              Menu
            </Typography>
            <IconButton onClick={handleMobileMenuClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
            <Avatar
              src={user?.profileImage || undefined}
              sx={{
                width: 40,
                height: 40,
                backgroundColor: '#1976d2',
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              {!user?.profileImage && (user?.firstName?.[0] || user?.name?.[0] || 'U')}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight="600" color="#1a1a1a">
                {user?.firstName || user?.name || 'User'}
              </Typography>
              <Typography variant="caption" color="#666">
                {user?.email}
              </Typography>
            </Box>
          </Box>
        </Box>

        <List sx={{ px: 1, py: 2 }}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNavigation('/dashboard')}
              sx={{
                borderRadius: 2,
                mb: 1,
                backgroundColor: isActive('/dashboard') ? '#e3f2fd' : 'transparent',
                '&:hover': {
                  backgroundColor: isActive('/dashboard') ? '#e3f2fd' : '#f5f5f5',
                },
              }}
            >
              <ListItemIcon sx={{ color: isActive('/dashboard') ? '#1976d2' : '#666' }}>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText
                primary="Dashboard"
                primaryTypographyProps={{
                  fontWeight: isActive('/dashboard') ? 600 : 500,
                  color: isActive('/dashboard') ? '#1976d2' : '#1a1a1a',
                }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNavigation('/dashboard/transactions')}
              sx={{
                borderRadius: 2,
                mb: 1,
                backgroundColor: isActive('/dashboard/transactions') ? '#e3f2fd' : 'transparent',
                '&:hover': {
                  backgroundColor: isActive('/dashboard/transactions') ? '#e3f2fd' : '#f5f5f5',
                },
              }}
            >
              <ListItemIcon sx={{ color: isActive('/dashboard/transactions') ? '#1976d2' : '#666' }}>
                <ReceiptIcon />
              </ListItemIcon>
              <ListItemText
                primary="Transactions"
                primaryTypographyProps={{
                  fontWeight: isActive('/dashboard/transactions') ? 600 : 500,
                  color: isActive('/dashboard/transactions') ? '#1976d2' : '#1a1a1a',
                }}
              />
            </ListItemButton>
          </ListItem>

          <Divider sx={{ my: 2 }} />

          {/* User Actions */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNavigation('/profile')}
              sx={{
                borderRadius: 2,
                mb: 1,
                backgroundColor: isActive('/profile') ? '#e3f2fd' : 'transparent',
                '&:hover': {
                  backgroundColor: isActive('/profile') ? '#e3f2fd' : '#f5f5f5',
                },
              }}
            >
              <ListItemIcon sx={{ color: isActive('/profile') ? '#1976d2' : '#666' }}>
                <Person />
              </ListItemIcon>
              <ListItemText
                primary="Profile"
                primaryTypographyProps={{
                  fontWeight: isActive('/profile') ? 600 : 500,
                  color: isActive('/profile') ? '#1976d2' : '#1a1a1a',
                }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNavigation('/settings')}
              sx={{
                borderRadius: 2,
                mb: 1,
                backgroundColor: isActive('/settings') ? '#e3f2fd' : 'transparent',
                '&:hover': {
                  backgroundColor: isActive('/settings') ? '#e3f2fd' : '#f5f5f5',
                },
              }}
            >
              <ListItemIcon sx={{ color: isActive('/settings') ? '#1976d2' : '#666' }}>
                <Settings />
              </ListItemIcon>
              <ListItemText
                primary="Settings"
                primaryTypographyProps={{
                  fontWeight: isActive('/settings') ? 600 : 500,
                  color: isActive('/settings') ? '#1976d2' : '#1a1a1a',
                }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: '#ffebee',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#d32f2f' }}>
                <ExitToApp />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  fontWeight: 500,
                  color: '#d32f2f',
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Header;
