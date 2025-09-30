/**
 * Haptic feedback utilities for mobile devices
 * Provides consistent tactile feedback for user interactions
 */

// Haptic feedback types
export type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error'

// Haptic feedback patterns
const hapticPatterns: Record<HapticType, number[]> = {
  light: [10],           // Light tap
  medium: [20],          // Medium tap
  heavy: [30],           // Heavy tap
  success: [10, 20, 10], // Success pattern: light-medium-light
  warning: [20, 10],     // Warning pattern: medium-light
  error: [30, 20, 30],   // Error pattern: heavy-medium-heavy
}

/**
 * Check if haptic feedback is supported on the current device
 */
export const isHapticSupported = (): boolean => {
  if (typeof window === 'undefined') return false
  
  // Check for Vibration API support
  if ('vibrate' in navigator) return true
  
  // Check for iOS Haptic Feedback API (experimental)
  if ('ontouchstart' in window && (navigator as any).vibrate) return true
  
  return false
}

/**
 * Trigger haptic feedback
 * @param type - The type of haptic feedback to trigger
 * @param intensity - Custom intensity (0-100, overrides type default)
 */
export const triggerHaptic = (type: HapticType = 'light', intensity?: number): void => {
  if (!isHapticSupported()) return
  
  try {
    const pattern = hapticPatterns[type]
    
    // Apply custom intensity if provided
    const vibrationPattern = intensity 
      ? pattern.map(duration => Math.round((duration * intensity) / 100))
      : pattern
    
    // Trigger vibration
    navigator.vibrate(vibrationPattern)
  } catch (error) {
    // Silently fail if vibration is not supported or blocked
    console.debug('Haptic feedback not available:', error)
  }
}

/**
 * Trigger haptic feedback for button press
 */
export const hapticPress = (): void => {
  triggerHaptic('light')
}

/**
 * Trigger haptic feedback for button long press
 */
export const hapticLongPress = (): void => {
  triggerHaptic('medium')
}

/**
 * Trigger haptic feedback for success actions
 */
export const hapticSuccess = (): void => {
  triggerHaptic('success')
}

/**
 * Trigger haptic feedback for warning actions
 */
export const hapticWarning = (): void => {
  triggerHaptic('warning')
}

/**
 * Trigger haptic feedback for error actions
 */
export const hapticError = (): void => {
  triggerHaptic('error')
}

/**
 * Trigger haptic feedback for tab switches
 */
export const hapticTabSwitch = (): void => {
  triggerHaptic('light')
}

/**
 * Trigger haptic feedback for modal/sheet open
 */
export const hapticModalOpen = (): void => {
  triggerHaptic('medium')
}

/**
 * Trigger haptic feedback for modal/sheet close
 */
export const hapticModalClose = (): void => {
  triggerHaptic('light')
}

/**
 * Trigger haptic feedback for card selection
 */
export const hapticCardSelect = (): void => {
  triggerHaptic('light')
}

/**
 * Trigger haptic feedback for form validation errors
 */
export const hapticValidationError = (): void => {
  triggerHaptic('warning')
}

/**
 * Trigger haptic feedback for form validation success
 */
export const hapticValidationSuccess = (): void => {
  triggerHaptic('success')
}

/**
 * Custom haptic pattern generator
 * @param pattern - Array of vibration durations in milliseconds
 */
export const customHaptic = (pattern: number[]): void => {
  if (!isHapticSupported()) return
  
  try {
    navigator.vibrate(pattern)
  } catch (error) {
    console.debug('Custom haptic feedback not available:', error)
  }
}

/**
 * Disable haptic feedback (useful for accessibility preferences)
 */
export const disableHaptics = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('haptics-disabled', 'true')
  }
}

/**
 * Enable haptic feedback
 */
export const enableHaptics = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('haptics-disabled')
  }
}

/**
 * Check if haptic feedback is disabled
 */
export const isHapticsDisabled = (): boolean => {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('haptics-disabled') === 'true'
}

/**
 * Safe haptic trigger that respects user preferences
 */
export const safeHaptic = (type: HapticType = 'light'): void => {
  if (isHapticsDisabled()) return
  triggerHaptic(type)
}

/**
 * React hook for haptic feedback
 */
export const useHaptics = () => {
  return {
    trigger: safeHaptic,
    press: hapticPress,
    longPress: hapticLongPress,
    success: hapticSuccess,
    warning: hapticWarning,
    error: hapticError,
    tabSwitch: hapticTabSwitch,
    modalOpen: hapticModalOpen,
    modalClose: hapticModalClose,
    cardSelect: hapticCardSelect,
    validationError: hapticValidationError,
    validationSuccess: hapticValidationSuccess,
    custom: customHaptic,
    isSupported: isHapticSupported(),
    isDisabled: isHapticsDisabled(),
    disable: disableHaptics,
    enable: enableHaptics,
  }
}
