/**
 * Motion utilities for consistent animations and transitions
 * Following the modern-soft design system
 */

// Standard motion durations
export const motionDurations = {
  fast: '120ms',
  normal: '180ms',
  slow: '300ms',
} as const

// Standard easing functions
export const motionEasing = {
  easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const

// Common transition presets
export const transitions = {
  // Standard smooth transition
  smooth: `all ${motionDurations.normal} ${motionEasing.easeOut}`,
  
  // Fast transition for micro-interactions
  fast: `all ${motionDurations.fast} ${motionEasing.easeOut}`,
  
  // Slow transition for major state changes
  slow: `all ${motionDurations.slow} ${motionEasing.easeOut}`,
  
  // Bouncy transition for calendar and playful elements
  bounce: `all ${motionDurations.slow} ${motionEasing.bounce}`,
  
  // Transform-only transitions for performance
  transform: `transform ${motionDurations.normal} ${motionEasing.easeOut}`,
  
  // Color transitions
  colors: `background-color ${motionDurations.fast} ${motionEasing.easeOut}, border-color ${motionDurations.fast} ${motionEasing.easeOut}, color ${motionDurations.fast} ${motionEasing.easeOut}`,
} as const

// Animation keyframes
export const animations = {
  // Fade in from bottom
  fadeInUp: {
    from: {
      opacity: 0,
      transform: 'translateY(8px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  
  // Fade in from top
  fadeInDown: {
    from: {
      opacity: 0,
      transform: 'translateY(-8px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  
  // Scale in
  scaleIn: {
    from: {
      opacity: 0,
      transform: 'scale(0.95)',
    },
    to: {
      opacity: 1,
      transform: 'scale(1)',
    },
  },
  
  // Slide in from right (for sheets/modals)
  slideInRight: {
    from: {
      transform: 'translateX(100%)',
    },
    to: {
      transform: 'translateX(0)',
    },
  },
  
  // Slide out to right (for sheets/modals)
  slideOutRight: {
    from: {
      transform: 'translateX(0)',
    },
    to: {
      transform: 'translateX(100%)',
    },
  },
  
  // Pulse animation for loading states
  pulse: {
    '0%, 100%': {
      opacity: 1,
    },
    '50%': {
      opacity: 0.5,
    },
  },
} as const

// Utility function to create CSS transition strings
export const createTransition = (
  properties: string | string[],
  duration: keyof typeof motionDurations = 'normal',
  easing: keyof typeof motionEasing = 'easeOut'
): string => {
  const props = Array.isArray(properties) ? properties.join(', ') : properties
  return `${props} ${motionDurations[duration]} ${motionEasing[easing]}`
}

// Utility function to create hover animations
export const createHoverAnimation = (scale = 1.02, translateY = -2) => ({
  transition: transitions.smooth,
  '&:hover': {
    transform: `translateY(${translateY}px) scale(${scale})`,
  },
})

// Utility function to create press animations
export const createPressAnimation = (scale = 0.98) => ({
  transition: transitions.fast,
  '&:active': {
    transform: `scale(${scale})`,
  },
})

// Spring animation configurations for Framer Motion
export const springConfig = {
  // Gentle spring for UI elements
  gentle: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
  },
  
  // Bouncy spring for calendar and playful elements
  bouncy: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 25,
  },
  
  // Quick spring for micro-interactions
  quick: {
    type: 'spring' as const,
    stiffness: 500,
    damping: 35,
  },
  
  // Smooth spring for major transitions
  smooth: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 35,
  },
} as const

// Animation variants for common components
export const componentAnimations = {
  // Card hover animation
  cardHover: {
    initial: { scale: 1, y: 0 },
    hover: { 
      scale: 1.02, 
      y: -2,
      transition: springConfig.gentle,
    },
    tap: { 
      scale: 0.98,
      transition: springConfig.quick,
    },
  },
  
  // Button press animation
  buttonPress: {
    initial: { scale: 1 },
    tap: { 
      scale: 0.98,
      transition: springConfig.quick,
    },
  },
  
  // Modal/sheet animations
  modal: {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: springConfig.gentle,
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 20,
      transition: springConfig.quick,
    },
  },
  
  // Sheet slide animations
  sheet: {
    initial: { x: '100%' },
    animate: { 
      x: 0,
      transition: springConfig.gentle,
    },
    exit: { 
      x: '100%',
      transition: springConfig.quick,
    },
  },
  
  // List item animations
  listItem: {
    initial: { opacity: 0, x: -20 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: springConfig.gentle,
    },
    exit: { 
      opacity: 0, 
      x: 20,
      transition: springConfig.quick,
    },
  },
  
  // Tab switch animation
  tabSwitch: {
    initial: { opacity: 0.7, scale: 0.95 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: springConfig.quick,
    },
  },
} as const
