export type ThemeType = 'light' | 'dark';

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  secondary: string;
  background: string;
  backgroundAlt: string;
  card: string;
  cardElevated: string;
  text: string;
  textSecondary: string;
  border: string;
  notification: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  accent1: string;
  accent2: string;
  accent3: string;
  surfaceOverlay: string;
}

export interface ThemeFonts {
  regular: {
    fontFamily: string;
    fontWeight: string;
  };
  medium: {
    fontFamily: string;
    fontWeight: string;
  };
  bold: {
    fontFamily: string;
    fontWeight: string;
  };
  heavy: {
    fontFamily: string;
    fontWeight: string;
  };
}

export interface ThemeAnimation {
  duration: {
    short: number;
    medium: number;
    long: number;
  };
  easing: {
    easeIn: string;
    easeOut: string;
    easeInOut: string;
  };
}

export interface Theme {
  dark: boolean;
  colors: ThemeColors;
  fonts: ThemeFonts;
  animation: ThemeAnimation;
  elevation: {
    small: number;
    medium: number;
    large: number;
  };
  spacing: {
    xs: number;
    s: number;
    m: number;
    l: number;
    xl: number;
    xxl: number;
  };
}

export interface ThemeContextType {
  theme: Theme;
  themeType: ThemeType;
  toggleTheme: () => void;
  setTheme: (themeType: ThemeType) => void;
}
