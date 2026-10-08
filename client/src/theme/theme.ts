import { createTheme, responsiveFontSizes } from '@mui/material/styles';

export const getCycleMateTheme = (mode: 'light' | 'dark') => {
  const isDark = mode === 'dark';

  const baseTheme = createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? '#10B981' : '#059669',
        light: '#34D399',
        dark: '#047857',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: isDark ? '#94A3B8' : '#1E293B',
        light: '#CBD5E1',
        dark: '#0F172A',
        contrastText: '#FFFFFF',
      },
      success: {
        main: '#10B981',
        light: '#6EE7B7',
        dark: '#047857',
      },
      warning: {
        main: '#F59E0B',
        light: '#FCD34D',
        dark: '#D97706',
      },
      error: {
        main: '#EF4444',
        light: '#F87171',
        dark: '#DC2626',
      },
      info: {
        main: '#0EA5E9',
        light: '#38BDF8',
        dark: '#0284C7',
      },
      background: {
        default: isDark ? '#0B0F17' : '#F8FAFC',
        paper: isDark ? '#131B2A' : '#FFFFFF',
      },
      text: {
        primary: isDark ? '#F1F5F9' : '#0F172A',
        secondary: isDark ? '#94A3B8' : '#64748B',
      },
      divider: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.07)',
    },
    typography: {
      fontFamily: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'].join(','),
      h1: {
        fontFamily: ['Outfit', 'Inter', 'sans-serif'].join(','),
        fontWeight: 800,
        letterSpacing: '-0.025em',
      },
      h2: {
        fontFamily: ['Outfit', 'Inter', 'sans-serif'].join(','),
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      h3: {
        fontFamily: ['Outfit', 'Inter', 'sans-serif'].join(','),
        fontWeight: 700,
        letterSpacing: '-0.015em',
      },
      h4: {
        fontFamily: ['Outfit', 'Inter', 'sans-serif'].join(','),
        fontWeight: 700,
        letterSpacing: '-0.01em',
      },
      h5: {
        fontFamily: ['Outfit', 'Inter', 'sans-serif'].join(','),
        fontWeight: 600,
      },
      h6: {
        fontFamily: ['Outfit', 'Inter', 'sans-serif'].join(','),
        fontWeight: 600,
      },
      subtitle1: {
        fontWeight: 500,
      },
      subtitle2: {
        fontWeight: 600,
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
        fontSize: '0.75rem',
      },
      button: {
        fontWeight: 600,
        textTransform: 'none',
        letterSpacing: '0.01em',
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: '8px 18px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: isDark
                ? '0 4px 14px rgba(16, 185, 129, 0.25)'
                : '0 4px 14px rgba(5, 150, 105, 0.2)',
            },
          },
          containedPrimary: {
            background: isDark
              ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
              : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
          },
          sizeLarge: {
            padding: '12px 24px',
            fontSize: '1rem',
            borderRadius: 12,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            borderRadius: 14,
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.9)'}`,
            boxShadow: isDark
              ? '0 4px 20px -2px rgba(0, 0, 0, 0.5)'
              : '0 2px 12px -2px rgba(15, 23, 42, 0.06)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
            '&:hover': {
              borderColor: isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(5, 150, 105, 0.25)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600,
            borderRadius: 8,
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            height: 8,
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0',
          },
          bar: {
            borderRadius: 8,
            background: 'linear-gradient(90deg, #10B981 0%, #84CC16 100%)',
          },
        },
      },
    },
  });

  return responsiveFontSizes(baseTheme);
};
