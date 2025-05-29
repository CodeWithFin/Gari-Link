import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  footerStyle?: StyleProp<ViewStyle>;
  isLoading?: boolean;
  headerRight?: React.ReactNode;
  accessibilityLabel?: string;
  testID?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  children,
  footer,
  style,
  titleStyle,
  contentStyle,
  footerStyle,
  isLoading = false,
  headerRight,
  accessibilityLabel,
  testID,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        },
        style,
      ]}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    >
      {(title || headerRight) && (
        <View style={styles.header}>
          {title && (
            <Text
              style={[
                styles.title,
                { color: theme.colors.text },
                titleStyle,
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
          )}
          {headerRight && <View>{headerRight}</View>}
        </View>
      )}

      <View style={[styles.content, contentStyle]}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.text }]}>
              Loading...
            </Text>
          </View>
        ) : (
          children
        )}
      </View>

      {footer && <View style={[styles.footer, footerStyle]}>{footer}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  content: {
    padding: 16,
  },
  footer: {
    padding: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
  },
});

export default Card;
