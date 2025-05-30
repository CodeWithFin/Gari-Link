import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  LayoutChangeEvent,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { DURATIONS, EASINGS } from '../utils/animations';

interface Segment {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface SegmentedControlProps {
  segments: Segment[];
  selectedValue: string;
  onChange: (value: string) => void;
  style?: ViewStyle;
  segmentStyle?: ViewStyle;
  selectedSegmentStyle?: ViewStyle;
  labelStyle?: TextStyle;
  selectedLabelStyle?: TextStyle;
  activeColor?: string;
  inactiveColor?: string;
  textActiveColor?: string;
  textInactiveColor?: string;
  animation?: 'slide' | 'fade' | 'both';
  borderRadius?: number;
  disabled?: boolean;
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({
  segments,
  selectedValue,
  onChange,
  style,
  segmentStyle,
  selectedSegmentStyle,
  labelStyle,
  selectedLabelStyle,
  activeColor,
  inactiveColor,
  textActiveColor,
  textInactiveColor,
  animation = 'slide',
  borderRadius = 8,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const [segmentWidths, setSegmentWidths] = useState<number[]>([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const selectedIndex = segments.findIndex(
    (segment) => segment.value === selectedValue
  );

  useEffect(() => {
    if (segmentWidths.length > 0 && selectedIndex !== -1) {
      const toValue = segmentWidths
        .slice(0, selectedIndex)
        .reduce((acc, width) => acc + width, 0);
      
      if (animation === 'fade' || animation === 'both') {
        // Fade out, move, fade in
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0,
            duration: DURATIONS.SHORT / 2,
            easing: EASINGS.EASE_IN,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: DURATIONS.SHORT / 2,
            easing: EASINGS.EASE_OUT,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        // Just slide
        Animated.timing(translateX, {
          toValue,
          duration: DURATIONS.MEDIUM,
          easing: EASINGS.EASE_OUT,
          useNativeDriver: true,
        }).start();
      }
    }
  }, [selectedIndex, segmentWidths, animation, translateX, opacity]);

  const handleContainerLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  const handleSegmentLayout = (index: number, event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setSegmentWidths((prev) => {
      const newWidths = [...prev];
      newWidths[index] = width;
      return newWidths;
    });
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: inactiveColor || theme.colors.card,
          borderRadius,
          ...Platform.select({
            ios: {
              shadowColor: theme.dark ? '#000' : theme.colors.primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
            },
            android: {
              elevation: theme.elevation.small,
            },
          }),
        },
        style,
      ]}
      onLayout={handleContainerLayout}
    >
      {segmentWidths.length === segments.length && (
        <Animated.View
          style={[
            styles.selectedSegment,
            {
              width: segmentWidths[selectedIndex],
              borderRadius: borderRadius - 4,
              backgroundColor: activeColor || theme.colors.primary,
              transform: [{ translateX }],
              opacity: animation === 'fade' || animation === 'both' ? opacity : 1,
            },
            selectedSegmentStyle,
          ]}
        />
      )}

      {segments.map((segment, index) => {
        const isSelected = segment.value === selectedValue;
        return (
          <TouchableOpacity
            key={segment.value}
            style={[
              styles.segment,
              { borderRadius: borderRadius - 4 },
              segmentStyle,
            ]}
            onPress={() => !disabled && onChange(segment.value)}
            onLayout={(event) => handleSegmentLayout(index, event)}
            disabled={disabled || isSelected}
            activeOpacity={0.7}
          >
            <View style={styles.segmentContent}>
              {segment.icon && (
                <View style={styles.iconContainer}>{segment.icon}</View>
              )}
              <Text
                style={[
                  styles.label,
                  {
                    color: isSelected
                      ? textActiveColor || '#FFFFFF'
                      : textInactiveColor || theme.colors.text,
                    fontFamily: isSelected
                      ? theme.fonts.medium.fontFamily
                      : theme.fonts.regular.fontFamily,
                    fontWeight: isSelected
                      ? theme.fonts.medium.fontWeight
                      : theme.fonts.regular.fontWeight,
                  },
                  labelStyle,
                  isSelected && selectedLabelStyle,
                ]}
              >
                {segment.label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    overflow: 'hidden',
    width: '100%',
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  selectedSegment: {
    position: 'absolute',
    top: 4,
    left: 4,
    bottom: 4,
    zIndex: 0,
  },
  segmentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 4,
  },
  label: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default SegmentedControl;
