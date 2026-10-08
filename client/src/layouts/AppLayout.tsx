import React, { useState } from 'react';
import { Box, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/navigation/Sidebar';
import { Navbar } from '../components/navigation/Navbar';
import { MobileNavigation } from '../components/navigation/MobileNavigation';

export const AppLayout: React.FC = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0, // Prevent flex item blowout
        }}
      >
        <Navbar onOpenMobileMenu={() => setMobileDrawerOpen(true)} />

        <Container
          maxWidth="xl"
          sx={{
            flexGrow: 1,
            py: { xs: 2.5, sm: 3.5 },
            px: { xs: 2, sm: 3, md: 4 },
            pb: { xs: 10, md: 4 }, // Padding for bottom mobile navigation
          }}
        >
          <Outlet />
        </Container>

        {/* Mobile Navigation */}
        <MobileNavigation
          drawerOpen={mobileDrawerOpen}
          onCloseDrawer={() => setMobileDrawerOpen(false)}
        />
      </Box>
    </Box>
  );
};
