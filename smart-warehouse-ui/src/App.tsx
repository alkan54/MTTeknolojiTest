import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory2';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import theme from './theme';

import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Transactions from './pages/Transactions';

const drawerWidth = 220;

function Layout() {
  const location = useLocation();

  const menuItems = [
    { text: 'Gösterge Paneli', icon: <DashboardIcon fontSize="small" />, path: '/' },
    { text: 'Ürünler', icon: <InventoryIcon fontSize="small" />, path: '/products' },
    { text: 'Stok Hareketleri', icon: <SwapHorizIcon fontSize="small" />, path: '/transactions' },
  ];

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />

      {/* Top Bar - WordPress style dark */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: '#1d2327',
          borderBottom: 'none',
        }}
      >
        <Toolbar variant="dense" sx={{ minHeight: 46 }}>
          <WarehouseIcon sx={{ mr: 1, fontSize: 20, color: '#72aee6' }} />
          <Typography variant="body1" noWrap sx={{ fontWeight: 600, color: '#fff', fontSize: '0.875rem' }}>
            Akıllı Depo Yönetimi
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar - WordPress style */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#2c3338',
            color: '#f0f0f1',
            borderRight: 'none',
          },
        }}
      >
        <Toolbar variant="dense" sx={{ minHeight: 46 }} />
        <List disablePadding sx={{ pt: 0.5 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  sx={{
                    py: 0.8,
                    px: 2,
                    bgcolor: isActive ? '#1d2327' : 'transparent',
                    borderLeft: isActive ? '4px solid #72aee6' : '4px solid transparent',
                    '&:hover': {
                      bgcolor: '#1d2327',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? '#72aee6' : '#a7aaad', minWidth: 32 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    disableTypography
                    primary={
                      <Typography
                        sx={{
                          fontSize: '0.8125rem',
                          fontWeight: isActive ? 600 : 400,
                          color: isActive ? '#fff' : '#c3c4c7',
                        }}
                      >
                        {item.text}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <Divider sx={{ borderColor: '#3c4349', mt: 1 }} />
        <Box sx={{ p: 2, mt: 'auto' }}>
          <Typography variant="caption" sx={{ color: '#646970', fontSize: '0.6875rem' }}>
            v1.0.0 — MT Teknoloji
          </Typography>
        </Box>
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#f0f0f1',
          overflow: 'auto',
          pt: '46px',
        }}
      >
        <Box sx={{ p: 2.5, maxWidth: 1200 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/transactions" element={<Transactions />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Layout />
      </Router>
    </ThemeProvider>
  );
}

export default App;
