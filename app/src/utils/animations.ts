import { Animated, Easing } from 'react-native';

/**
 * A collection of reusable animations for consistent UX throughout the app
 */

interface AnimationOptions {
  value: Animated.Value;
  toValue: number;
  duration?: number;
  easing?: any;
  useNativeDriver?: boolean;
  delay?: number;
}

// Default durations
export const DURATIONS = {
  SHORT: 150,
  MEDIUM: 300, 
  LONG: 450,
};

// Default easing functions
export const EASINGS = {
  EASE_IN: Easing.bezier(0.4, 0, 1, 1),
  EASE_OUT: Easing.bezier(0, 0, 0.2, 1),
  EASE_IN_OUT: Easing.bezier(0.4, 0, 0.2, 1),
  BOUNCE: Easing.bounce,
};

/**
 * Fade animation
 */
export const fadeAnimation = ({
  value,
  toValue,
  duration = DURATIONS.MEDIUM,
  easing = EASINGS.EASE_OUT,
  useNativeDriver = true,
  delay = 0,
}: AnimationOptions) => {
  return Animated.timing(value, {
    toValue,
    duration,
    easing,
    useNativeDriver,
    delay,
  });
};

/**
 * Scale animation
 */
export const scaleAnimation = ({
  value,
  toValue,
  duration = DURATIONS.MEDIUM,
  easing = EASINGS.EASE_OUT,
  useNativeDriver = true,
  delay = 0,
}: AnimationOptions) => {
  return Animated.timing(value, {
    toValue,
    duration,
    easing,
    useNativeDriver,
    delay,
  });
};

/**
 * Slide animation for vertical movement
 */
export const slideVerticalAnimation = ({
  value,
  toValue,
  duration = DURATIONS.MEDIUM,
  easing = EASINGS.EASE_OUT,
  useNativeDriver = true,
  delay = 0,
}: AnimationOptions) => {
  return Animated.timing(value, {
    toValue,
    duration,
    easing,
    useNativeDriver,
    delay,
  });
};

/**
 * Slide animation for horizontal movement
 */
export const slideHorizontalAnimation = ({
  value,
  toValue,
  duration = DURATIONS.MEDIUM,
  easing = EASINGS.EASE_OUT,
  useNativeDriver = true,
  delay = 0,
}: AnimationOptions) => {
  return Animated.timing(value, {
    toValue,
    duration,
    easing,
    useNativeDriver,
    delay,
  });
};

/**
 * Button press animation - slightly scales down when pressed
 */
export const buttonPressAnimation = (
  scaleValue: Animated.Value,
  pressed: boolean
) => {
  Animated.timing(scaleValue, {
    toValue: pressed ? 0.96 : 1,
    duration: DURATIONS.SHORT,
    easing: pressed ? EASINGS.EASE_IN : EASINGS.EASE_OUT,
    useNativeDriver: true,
  }).start();
};

/**
 * Staggered animation for list items
 */
export const staggeredListAnimation = (
  items: Animated.Value[],
  staggerDelay = 50,
  duration = DURATIONS.MEDIUM
) => {
  const animations = items.map((item, i) => {
    return Animated.timing(item, {
      toValue: 1,
      duration,
      delay: i * staggerDelay,
      useNativeDriver: true,
      easing: EASINGS.EASE_OUT,
    });
  });

  return Animated.stagger(staggerDelay, animations);
};

/**
 * Pulse animation
 */
export const pulseAnimation = (
  value: Animated.Value,
  loops = 3,
  minValue = 0.97,
  maxValue = 1.05,
  duration = DURATIONS.MEDIUM
) => {
  const pulse = Animated.sequence([
    Animated.timing(value, {
      toValue: maxValue,
      duration: duration / 2,
      easing: EASINGS.EASE_IN_OUT,
      useNativeDriver: true,
    }),
    Animated.timing(value, {
      toValue: minValue,
      duration: duration / 2,
      easing: EASINGS.EASE_IN_OUT,
      useNativeDriver: true,
    }),
  ]);

  return Animated.loop(pulse, { iterations: loops });
};

/**
 * Shake animation
 */
export const shakeAnimation = (
  value: Animated.Value,
  distance = 10,
  duration = DURATIONS.MEDIUM,
  loops = 2
) => {
  const shake = Animated.sequence([
    Animated.timing(value, {
      toValue: distance,
      duration: duration / 5,
      useNativeDriver: true,
      easing: EASINGS.EASE_OUT,
    }),
    Animated.timing(value, {
      toValue: -distance,
      duration: duration / 5,
      useNativeDriver: true,
      easing: EASINGS.EASE_OUT,
    }),
    Animated.timing(value, {
      toValue: distance / 2,
      duration: duration / 5,
      useNativeDriver: true,
      easing: EASINGS.EASE_OUT,
    }),
    Animated.timing(value, {
      toValue: -distance / 2,
      duration: duration / 5,
      useNativeDriver: true,
      easing: EASINGS.EASE_OUT,
    }),
    Animated.timing(value, {
      toValue: 0,
      duration: duration / 5,
      useNativeDriver: true,
      easing: EASINGS.EASE_OUT,
    }),
  ]);

  return Animated.loop(shake, { iterations: loops });
};

/**
 * Success checkmark animation
 */
export const successAnimation = (
  scaleValue: Animated.Value,
  opacityValue: Animated.Value,
  duration = DURATIONS.LONG
) => {
  return Animated.parallel([
    Animated.timing(scaleValue, {
      toValue: 1,
      duration,
      useNativeDriver: true,
      easing: EASINGS.BOUNCE,
    }),
    Animated.timing(opacityValue, {
      toValue: 1,
      duration: duration * 0.75,
      useNativeDriver: true,
      easing: EASINGS.EASE_OUT,
    }),
  ]);
};

/**
 * Loading spinner animation
 */
export const spinAnimation = (
  spinValue: Animated.Value,
  duration = 1000,
  loops = -1
) => {
  const spin = Animated.timing(spinValue, {
    toValue: 1,
    duration,
    easing: Easing.linear,
    useNativeDriver: true,
  });

  return Animated.loop(spin, { iterations: loops });
};
