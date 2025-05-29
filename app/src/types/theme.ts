export type ThemeType = 'light' | 'dark';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
  border: string;
  notification: string;
  error: string;
  success: string;
  warning: string;
  info: string;
}

export interface Theme {
  dark: boolean;
  colors: ThemeColors;
}

export interface ThemeContextType {
  theme: Theme;
  themeType: ThemeType;
  toggleTheme: () => void;
}
