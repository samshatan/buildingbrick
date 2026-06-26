export const COLORS = {
  // Brand Colors (Brick & Masonry Theme)
  primary: '#8B4513', // SaddleBrown (Main Brand Color)
  primaryLight: '#D6C4B0',
  primaryDark: '#4A3B28',

  // Neutral Palette
  background: '#FAF9F6', // Off-white
  surface: '#FFFFFF',
  text: '#2D2926', // Off-black
  textLight: '#7C746B',
  border: '#E5E2DA',

  // UI Colors
  accent: '#7A3B0F',
  secondary: '#A0522D', // Sienna
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',

  // Specialized Colors
  zinc900: '#1A1715',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 32, // Large rounded corners as seen in brick-our-house
  full: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#4A3B28',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#4A3B28',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
};
