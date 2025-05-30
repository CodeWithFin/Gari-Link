import React, { useRef, useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ListRenderItemInfo,
  TouchableOpacity,
  Animated,
  RefreshControl,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Dimensions,
  Platform,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface ListViewProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
  onRefresh?: () => Promise<void>;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  ListHeaderComponent?: React.ReactNode;
  ListFooterComponent?: React.ReactNode;
  ListEmptyComponent?: React.ReactNode;
  isLoading?: boolean;
  isRefreshing?: boolean;
  isLoadingMore?: boolean;
  numColumns?: number;
  horizontal?: boolean;
  itemSeparator?: boolean;
  showsVerticalScrollIndicator?: boolean;
  showsHorizontalScrollIndicator?: boolean;
  contentContainerStyle?: ViewStyle;
  style?: ViewStyle;
  emptyText?: string;
  initialNumToRender?: number;
  maxToRenderPerBatch?: number;
  windowSize?: number;
  testID?: string;
  animationType?: 'fade' | 'slide' | 'scale' | 'none';
  cardLayout?: boolean;
  staggered?: boolean;
}

function ListView<T>({
  data,
  renderItem,
  keyExtractor,
  onRefresh,
  onEndReached,
  onEndReachedThreshold = 0.5,
  ListHeaderComponent,
  ListFooterComponent,
  ListEmptyComponent,
  isLoading = false,
  isRefreshing = false,
  isLoadingMore = false,
  numColumns = 1,
  horizontal = false,
  itemSeparator = true,
  showsVerticalScrollIndicator = false,
  showsHorizontalScrollIndicator = false,
  contentContainerStyle,
  style,
  emptyText = 'No data available',
  initialNumToRender = 10,
  maxToRenderPerBatch = 10,
  windowSize = 21,
  testID,
  animationType = 'fade',
  cardLayout = false,
  staggered = false,
}: ListViewProps<T>) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const { width: screenWidth } = Dimensions.get('window');

  // Animation references
  const itemAnimations = useRef<{ [key: string]: Animated.Value }>({}).current;

  useEffect(() => {
    // Set mounted state after a short delay to allow for animation entry
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Setup item animations when data changes
  useEffect(() => {
    if (data && data.length > 0) {
      // Clear old animations for items no longer in the list
      Object.keys(itemAnimations).forEach((key) => {
        if (!data.some((item, index) => keyExtractor(item, index) === key)) {
          delete itemAnimations[key];
        }
      });

      // Create new animations for new items
      data.forEach((item, index) => {
        const key = keyExtractor(item, index);
        if (!itemAnimations[key]) {
          itemAnimations[key] = new Animated.Value(0);

          // Animate item in with staggered timing if needed
          if (mounted) {
            Animated.timing(itemAnimations[key], {
              toValue: 1,
              duration: theme.animation.duration.medium,
              delay: staggered ? index * 50 : 0,
              useNativeDriver: true,
            }).start();
          } else {
            // If not mounted yet, set the value directly
            itemAnimations[key].setValue(1);
          }
        }
      });
    }
  }, [data, itemAnimations, keyExtractor, mounted, staggered, theme.animation.duration.medium]);

  // Handle item animation based on animation type
  const getItemAnimation = (key: string) => {
    const animation = itemAnimations[key] || new Animated.Value(1);

    switch (animationType) {
      case 'fade':
        return {
          opacity: animation,
        };
      case 'slide':
        return {
          opacity: animation,
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        };
      case 'scale':
        return {
          opacity: animation,
          transform: [
            {
              scale: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            },
          ],
        };
      default:
        return {};
    }
  };

  // Handle refreshing
  const handleRefresh = async () => {
    if (onRefresh) {
      await onRefresh();
    }
  };

  // Memoize the render item function
  const renderItemMemoized = useMemo(() => {
    return ({ item, index }: ListRenderItemInfo<T>) => {
      const key = keyExtractor(item, index);
      const animatedStyle = animationType !== 'none' ? getItemAnimation(key) : {};

      // If using card layout, wrap in card-like container
      if (cardLayout) {
        return (
          <Animated.View
            style={[
              styles.cardItem,
              {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
                marginHorizontal: horizontal ? theme.spacing.s : 0,
                marginVertical: !horizontal ? theme.spacing.s : 0,
                width:
                  numColumns > 1
                    ? (screenWidth - theme.spacing.m * (numColumns + 1)) / numColumns
                    : undefined,
                ...Platform.select({
                  ios: {
                    shadowColor: theme.dark ? theme.colors.primary : '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: theme.dark ? 0.3 : 0.1,
                    shadowRadius: 3,
                  },
                  android: {
                    elevation: theme.elevation.small,
                  },
                }),
              },
              animatedStyle,
            ]}
          >
            {renderItem(item, index)}
          </Animated.View>
        );
      }

      return (
        <Animated.View style={animatedStyle}>
          {renderItem(item, index)}
          {itemSeparator && index < data.length - 1 && !horizontal && numColumns === 1 && (
            <View
              style={[styles.separator, { backgroundColor: theme.colors.border }]}
            />
          )}
        </Animated.View>
      );
    };
  }, [
    renderItem,
    keyExtractor,
    animationType,
    getItemAnimation,
    cardLayout,
    theme,
    horizontal,
    numColumns,
    itemSeparator,
    data.length,
    screenWidth,
  ]);

  // Custom footer that shows loading indicator when loading more
  const renderFooter = () => {
    if (isLoadingMore) {
      return (
        <View style={styles.loadingMore}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <Text style={[styles.loadingMoreText, { color: theme.colors.textSecondary }]}>
            Loading more...
          </Text>
        </View>
      );
    }

    return ListFooterComponent || null;
  };

  // Empty state component
  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      );
    }

    if (ListEmptyComponent) {
      return ListEmptyComponent;
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
          {emptyText}
        </Text>
      </View>
    );
  };

  return (
    <Animated.FlatList
      data={data}
      renderItem={renderItemMemoized}
      keyExtractor={keyExtractor}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
            progressBackgroundColor={theme.colors.card}
          />
        ) : undefined
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={renderFooter()}
      ListEmptyComponent={renderEmpty()}
      numColumns={numColumns}
      horizontal={horizontal}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      contentContainerStyle={[
        styles.contentContainer,
        !data.length && styles.emptyContentContainer,
        contentContainerStyle,
      ]}
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
        style,
      ]}
      initialNumToRender={initialNumToRender}
      maxToRenderPerBatch={maxToRenderPerBatch}
      windowSize={windowSize}
      testID={testID}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false }
      )}
      scrollEventThrottle={16}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    padding: 16,
  },
  emptyContentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  separator: {
    height: 1,
    marginVertical: 8,
  },
  loadingMore: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingMoreText: {
    marginLeft: 8,
    fontSize: 14,
  },
  cardItem: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 0,
  },
});

export default ListView;
