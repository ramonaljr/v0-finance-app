/**
 * Modern Soft Design Tokens
 * 
 * A comprehensive design system optimized for finance apps with:
 * - Soft, rounded aesthetics
 * - Subtle shadows and elevation
 * - High contrast for accessibility
 * - Apple-leaning typography scale
 * - 8pt spacing grid
 */

// Theme Flag
export const THEME_FLAG = 'modern-soft'

// Color System - Soft Money App Palette
export const colors = {
  light: {
    // Background colors
    background: '#FAFAFC',        // Warm off-white
    surface: '#FFFFFF',           // Pure white for cards
    surfaceAlt: '#F6F7FB',        // Alternative surface
    
    // Brand colors
    brandPrimary: '#4C5BD4',      // Soft purple-blue
    brandSoft: '#E8EBFF',         // Very light brand tint
    
    // Semantic colors
    success: '#1FA463',           // Calm green
    successSoft: '#E6F7EF',       // Light success tint
    danger: '#E23D3D',            // Soft red
    dangerSoft: '#FDECEC',        // Light danger tint
    warning: '#F59E0B',           // Amber
    warningSoft: '#FEF3C7',       // Light warning tint
    
    // Text colors
    foreground: '#1F2937',        // Dark gray
    muted: '#8B8FA3',             // Medium gray
    mutedForeground: '#9CA3AF',   // Light gray
    
    // Border colors
    border: '#E5E7EB',            // Light gray border
    input: '#F3F4F6',             // Input background
    ring: '#4C5BD4',              // Focus ring
    
    // Chart colors
    chart: {
      primary: '#4C5BD4',
      secondary: '#1FA463',
      tertiary: '#F59E0B',
      quaternary: '#E23D3D',
      quinary: '#8B5CF6',
    }
  },
  dark: {
    // Background colors
    background: '#0F1419',        // Deep blue-gray
    surface: '#1A1F2E',           // Dark surface
    surfaceAlt: '#232937',        // Alternative dark surface
    
    // Brand colors
    brandPrimary: '#6366F1',      // Lighter brand for dark mode
    brandSoft: '#312E81',         // Dark brand tint
    
    // Semantic colors
    success: '#34D399',           // Brighter green for dark
    successSoft: '#064E3B',       // Dark success tint
    danger: '#F87171',            // Lighter red for dark
    dangerSoft: '#7F1D1D',        // Dark danger tint
    warning: '#FBBF24',           // Brighter amber
    warningSoft: '#78350F',       // Dark warning tint
    
    // Text colors
    foreground: '#F9FAFB',        // Near white
    muted: '#9CA3AF',             // Medium gray
    mutedForeground: '#6B7280',   // Darker gray
    
    // Border colors
    border: '#374151',            // Dark gray border
    input: '#1F2937',             // Dark input background
    ring: '#6366F1',              // Focus ring
    
    // Chart colors
    chart: {
      primary: '#6366F1',
      secondary: '#34D399',
      tertiary: '#FBBF24',
      quaternary: '#F87171',
      quinary: '#A78BFA',
    }
  }
} as const

// Typography Scale - Apple-leaning
export const typography = {
  fontFamily: {
    sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Inter', 'system-ui', 'sans-serif'],
    mono: ['SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'monospace'],
  },
  fontSize: {
    display: { size: '32px', lineHeight: '40px', letterSpacing: '-0.02em' },
    'display-sm': { size: '28px', lineHeight: '36px', letterSpacing: '-0.01em' },
    h1: { size: '28px', lineHeight: '36px', letterSpacing: '-0.01em' },
    h2: { size: '24px', lineHeight: '32px', letterSpacing: '0em' },
    h3: { size: '20px', lineHeight: '28px', letterSpacing: '0em' },
    body: { size: '16px', lineHeight: '24px', letterSpacing: '0em' },
    'body-sm': { size: '14px', lineHeight: '20px', letterSpacing: '0em' },
    caption: { size: '13px', lineHeight: '18px', letterSpacing: '0em' },
    'caption-sm': { size: '11px', lineHeight: '16px', letterSpacing: '0.01em' },
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  }
} as const

// Spacing - 8pt grid
export const spacing = {
  0: '0px',
  1: '8px',      // 0.5rem
  2: '16px',     // 1rem
  3: '24px',     // 1.5rem
  4: '32px',     // 2rem
  5: '40px',     // 2.5rem
  6: '48px',     // 3rem
  8: '64px',     // 4rem
  10: '80px',    // 5rem
  12: '96px',    // 6rem
} as const

// Border Radius - Soft, rounded corners
export const borderRadius = {
  xs: '8px',     // Small elements
  sm: '12px',    // Default
  md: '16px',    // Cards
  lg: '20px',    // Large cards
  xl: '24px',    // Containers
  full: '9999px', // Pills
} as const

// Shadows - Subtle elevation
export const shadows = {
  light: {
    xs: '0 1px 2px rgba(0, 0, 0, 0.03)',
    sm: '0 1px 2px rgba(0, 0, 0, 0.06), 0 6px 24px rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px rgba(0, 0, 0, 0.05), 0 8px 32px rgba(0, 0, 0, 0.08)',
    lg: '0 8px 16px rgba(0, 0, 0, 0.08), 0 16px 48px rgba(0, 0, 0, 0.12)',
  },
  dark: {
    xs: '0 1px 2px rgba(0, 0, 0, 0.15)',
    sm: '0 1px 2px rgba(0, 0, 0, 0.2), 0 6px 24px rgba(0, 0, 0, 0.15)',
    md: '0 4px 6px rgba(0, 0, 0, 0.2), 0 8px 32px rgba(0, 0, 0, 0.25)',
    lg: '0 8px 16px rgba(0, 0, 0, 0.25), 0 16px 48px rgba(0, 0, 0, 0.35)',
  }
} as const

// Motion - Standardized transitions
export const motion = {
  duration: {
    fast: '120ms',
    normal: '180ms',
    slow: '300ms',
  },
  easing: {
    easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  }
} as const

// Component-specific tokens
export const components = {
  card: {
    padding: spacing[3], // 24px
    borderRadius: borderRadius.md, // 16px
    shadow: shadows.light.sm,
  },
  button: {
    height: {
      sm: '36px',
      default: '44px',
      lg: '52px',
    },
    borderRadius: borderRadius.sm, // 12px
  },
  input: {
    height: '48px',
    borderRadius: borderRadius.full, // Pill shape
    padding: `${spacing[1]} ${spacing[3]}`, // 8px 24px
  },
  tabBar: {
    height: '64px',
    iconSize: '28px',
    fontSize: '10px',
    borderRadius: borderRadius.lg, // 20px
  },
  calendar: {
    daySize: '44px',
    borderRadius: borderRadius.md, // 16px
    selectedRadius: borderRadius.sm, // 12px
  }
} as const

// Accessibility tokens
export const accessibility = {
  hitTarget: '44px', // Minimum touch target
  contrast: {
    normal: 4.5, // WCAG AA
    large: 3.0,  // WCAG AA for large text
  }
} as const

// Export theme objects for CSS variables and component usage
export const createThemeTokens = (isDark = false) => {
  const colorScheme = isDark ? colors.dark : colors.light
  const shadowScheme = isDark ? shadows.dark : shadows.light
  
  return {
    colors: colorScheme,
    shadows: shadowScheme,
    typography,
    spacing,
    borderRadius,
    motion,
    components,
    accessibility,
  }
}

// Utility function to check if modern-soft theme is enabled
export const isModernSoftTheme = (): boolean => {
  if (typeof window === 'undefined') return false
  
  // Check localStorage for theme preference
  const themePreference = localStorage.getItem('app-theme-modern-soft')
  if (themePreference !== null) {
    return themePreference === 'true'
  }
  
  // Check for feature flag (could be from API, env, etc.)
  const featureFlag = process.env.NEXT_PUBLIC_MODERN_SOFT_THEME
  return featureFlag === 'true'
}

// Utility to toggle theme
export const toggleModernSoftTheme = (enabled: boolean): void => {
  if (typeof window === 'undefined') return
  
  localStorage.setItem('app-theme-modern-soft', enabled.toString())
  
  // Apply theme class to document
  if (enabled) {
    document.documentElement.classList.add('modern-soft')
  } else {
    document.documentElement.classList.remove('modern-soft')
  }
}
