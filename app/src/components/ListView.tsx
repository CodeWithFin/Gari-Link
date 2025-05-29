import React, { useRef, useState, useEffect } from 'react';
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
  maxToRenderPerBatch = 5,
  windowSize = 21,
  testID,
}: ListViewProps<T>): React.ReactElement {
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isLoading ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isLoading, fadeAnim]);

  const handleRefresh = async () => {
    if (onRefresh) {
      setRefreshing(true);
      await onRefresh();
      setRefreshing(false);
    }
  };

  const renderItemWrapper = ({ item, index }: ListRenderItemInfo<T>) => {
    return <View style={styles.itemWrapper}>{renderItem(item, index)}</View>;
  };

  const renderSeparator = () => {
    if (!itemSeparator) return null;
    return (
      <View
        style={[
          styles.separator,
          { backgroundColor: theme.colors.border },
          horizontal ? styles.horizontalSeparator : styles.verticalSeparator,
        ]}
      />
    );
  };

  const renderFooter = () => {
    if (!isLoadingMore) return ListFooterComponent || null;
    return (
      <View style={styles.loadingMoreContainer}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
        <Text style={[styles.loadingMoreText, { color: theme.colors.text }]}>
          Loading more...
        </Text>
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading) return null;
    if (ListEmptyComponent) return ListEmptyComponent;
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: theme.colors.text }]}>
          {emptyText}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, style]} testID={testID}>
      {isLoading && !isRefreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Loading...
          </Text>
        </View>
      ) : (
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <FlatList
            ref={flatListRef}
            data={data}
            renderItem={renderItemWrapper}
            keyExtractor={keyExtractor}
            ListHeaderComponent={ListHeaderComponent}
            ListFooterComponent={renderFooter()}
            ListEmptyComponent={renderEmpty()}
            ItemSeparatorComponent={renderSeparator}
            onEndReached={onEndReached}
            onEndReachedThreshold={onEndReachedThreshold}
            refreshControl={
              onRefresh ? (
                <RefreshControl
                  refreshing={refreshing || isRefreshing}
                  onRefresh={handleRefresh}
                  colors={[theme.colors.primary]}
                  tintColor={theme.colors.primary}
                />
              ) : undefined
            }
            numColumns={horizontal ? 1 : numColumns}
            horizontal={horizontal}
            showsVerticalScrollIndicator={showsVerticalScrollIndicator}
            showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
            contentContainerStyle={[
              styles.listContent,
              contentContainerStyle,
              data.length === 0 && styles.emptyListContent,
            ]}
            initialNumToRender={initialNumToRender}
            maxToRenderPerBatch={maxToRenderPerBatch}
            windowSize={windowSize}
            removeClippedSubviews={true}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  itemWrapper: {
    overflow: 'hidden',
  },
  separator: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
  },
  verticalSeparator: {
    marginVertical: 8,
  },
  horizontalSeparator: {
    width: StyleSheet.hairlineWidth,
    height: '100%',
    marginHorizontal: 8,
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
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
  loadingMoreContainer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  loadingMoreText: {
    marginLeft: 8,
    fontSize: 14,
  },
});

export default ListView;
