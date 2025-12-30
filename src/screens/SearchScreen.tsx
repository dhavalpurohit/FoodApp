import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { StackNavigationProp } from '@react-navigation/stack';
import { ChevronLeft, Search as SearchIcon, Star } from 'lucide-react-native';

// API & Types
import { restaurantApi } from '../api/restaurantApi';
import { Restaurant } from '../types';
import { RootStackParamList } from '../App';

// Theme
import { COLORS, SPACING, BORDER_RADIUS } from '../theme';

type SearchScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Search'
>;

interface Props {
  navigation: SearchScreenNavigationProp;
}

/**
 * SearchScreen Component
 *
 * Allows users to search for restaurants by name or description.
 * Filters results locally from the main restaurant list.
 */
const SearchScreen = ({ navigation }: Props) => {
  const [searchText, setSearchText] = useState('');

  // Reuse the restaurant cache or fetch if not available
  const { data: restaurants } = useQuery({
    queryKey: ['restaurants'],
    queryFn: restaurantApi.getRestaurants,
  });

  // Filter restaurants based on search text (case-insensitive)
  const filteredRestaurants = restaurants?.filter(
    item =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description.toLowerCase().includes(searchText.toLowerCase()),
  );

  const renderRestaurantItem = ({ item }: { item: Restaurant }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() =>
        navigation.navigate('Restaurant', { restaurantId: item.id })
      }
    >
      <Image source={{ uri: item.image }} style={styles.resultImage} />
      <View style={styles.resultInfo}>
        <Text style={styles.resultName}>{item.name}</Text>
        <Text style={styles.resultDescription} numberOfLines={1}>
          {item.description}
        </Text>
        <View style={styles.ratingContainer}>
          <Star size={12} color={COLORS.secondary} fill={COLORS.secondary} />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => {
    if (!searchText) {
      return (
        <View style={styles.center}>
          <Text style={styles.initialText}>Type to find delicious food!</Text>
        </View>
      );
    }
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>
          No results found for "{searchText}"
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <SearchIcon size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.input}
            placeholder="Search restaurants..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
            autoFocus
          />
        </View>
      </View>

      {/* Results List */}
      <FlatList
        data={searchText ? filteredRestaurants : []}
        keyExtractor={item => item.id}
        renderItem={renderRestaurantItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    marginRight: SPACING.sm,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: 16,
    color: COLORS.text,
    padding: 0,
  },
  listContent: {
    padding: SPACING.md,
  },
  resultItem: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    elevation: 1,
  },
  resultImage: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.border,
  },
  resultInfo: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'center',
  },
  resultName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  resultDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingText: {
    fontSize: 12,
    color: COLORS.text,
    marginLeft: 4,
    fontWeight: '600',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    marginTop: SPACING.xl * 2,
  },
  initialText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.text,
  },
});

export default SearchScreen;
