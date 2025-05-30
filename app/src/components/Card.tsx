import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Platform,
  Animated,
  Pressable
} from 'react-native';
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
  onPress?: () => void;
  elevated?: boolean;
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
  onPress,
  elevated = false,
}) => {
  const { theme } = useTheme();
  const scale = new Animated.Value(1);

  // Animation for press interaction if card is pressable
  const handlePressIn = () => {
    if (!onPress) return;

    Animated.timing(scale, {
      toValue: 0.98,
      duration: theme.animation.duration.short,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (!onPress) return;

    Animated.timing(scale, {
      toValue: 1,
      duration: theme.animation.duration.short,
      useNativeDriver: true,
    }).start();
  };

  const cardStyles = [
    styles.container,
    {
      backgroundColor: elevated ? theme.colors.cardElevated : theme.colors.card,
      borderColor: theme.colors.border,
      ...Platform.select({
        ios: {
          shadowColor: theme.dark ? theme.colors.primary : '#000000',
          shadowOffset: { width: 0, height: elevated ? 4 : 2 },
          shadowOpacity: theme.dark ? 0.3 : 0.1,
          shadowRadius: elevated ? 8 : 4,
        },
        android: {
          elevation: elevated ? theme.elevation.medium : theme.elevation.small,
        },
      }),
    },
    style,
  ];

  const renderCardContent = () => (
    <>
      {(title || headerRight) && (
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          {title && (
            <Text
              style={[
                styles.title,
                {
                  color: theme.colors.text,
                  fontFamily: theme.fonts.medium.fontFamily,
                  fontWeight: theme.fonts.medium.fontWeight,
                },
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
            <Text style={[
              styles.loadingText,
              {
                color: theme.colors.textSecondary,
                fontFamily: theme.fonts.regular.fontFamily,
              }
            ]}>
              Loading...
            </Text>
          </View>
        ) : (
          children
        )}
      </View>

      {footer && (
        <View style={[
          styles.footer,
          { borderTopColor: theme.colors.border },
          footerStyle
        ]}>
          {footer}
        </View>
      )}
    </>
  );

  if (onPress) {
    return (
      <Animated.View
        style={{ transform: [{ scale }] }}
        accessibilityLabel={accessibilityLabel}
        testID={testID}
      >
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={cardStyles}
          android_ripple={{ color: theme.colors.border, borderless: false }}
        >
          {renderCardContent()}
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <View
      style={cardStyles}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    >
      {renderCardContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 0,
    overflow: 'hidden',
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 18,
    flex: 1,
  },
  content: {
    padding: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
});

export default Card;
