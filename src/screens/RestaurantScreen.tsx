import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ChevronLeft, Star, Plus, Minus } from 'lucide-react-native';

// API & State
import { restaurantApi } from '../api/restaurantApi';
import { useCartStore } from '../store/useCartStore';

// Theme & Types
import { COLORS, SPACING, BORDER_RADIUS } from '../theme';
import { MenuItem } from '../types';
import { RootStackParamList } from '../App';

type RestaurantScreenRouteProp = RouteProp<RootStackParamList, 'Restaurant'>;
type RestaurantScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Restaurant'
>;

interface Props {
  route: RestaurantScreenRouteProp;
  navigation: RestaurantScreenNavigationProp;
}

/**
 * RestaurantScreen Component
 *
 * Displays details of a specific restaurant and its menu.
 * Allows adding items to the cart and managing quantities.
 */
const RestaurantScreen = ({ route, navigation }: Props) => {
  const { restaurantId } = route.params;
  const { addItem, items: cartItems, updateQuantity } = useCartStore();

  // Fetch restaurant details
  const { data: restaurant, isLoading } = useQuery({
    queryKey: ['restaurant', restaurantId],
    queryFn: () => restaurantApi.getRestaurantById(restaurantId),
  });

  const getItemQuantity = (id: string) => {
    return cartItems.find(item => item.id === id)?.quantity || 0;
  };

  /**
   * Renders a single menu item with price and add/remove controls.
   */
  const renderMenuItem = ({ item }: { item: MenuItem }) => {
    const quantity = getItemQuantity(item.id);

    return (
      <View style={styles.menuItem}>
        <View style={styles.menuItemContent}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
        </View>
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.itemImage} />

          {/* Quantity Controls */}
          <View style={styles.quantityControls}>
            {quantity > 0 ? (
              <View style={styles.activeControls}>
                <TouchableOpacity
                  onPress={() => updateQuantity(item.id, quantity - 1)}
                  style={styles.controlButton}
                >
                  <Minus size={16} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity
                  onPress={() => addItem(item)}
                  style={styles.controlButton}
                >
                  <Plus size={16} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => addItem(item)}
                style={styles.addButton}
              >
                <Plus size={18} color={COLORS.primary} />
                <Text style={styles.addText}>ADD</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View style={styles.center}>
        <Text>Restaurant not found</Text>
      </View>
    );
  }

  const cartTotal = cartItems.reduce(
    (acc, curr) => acc + curr.price * curr.quantity,
    0,
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Absolute Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft color={COLORS.text} size={24} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={restaurant.menu}
        keyExtractor={item => item.id}
        renderItem={renderMenuItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={() => (
          <View style={styles.restaurantInfo}>
            <Image
              source={{ uri: restaurant.image }}
              style={styles.bannerImage}
            />
            <View style={styles.infoContent}>
              <Text style={styles.name}>{restaurant.name}</Text>

              {/* Meta Info Row */}
              <View style={styles.metaRow}>
                <View
                  style={[
                    styles.ratingContainer,
                    { backgroundColor: '#FFF9E5' },
                  ]}
                >
                  <Star
                    size={14}
                    color={COLORS.secondary}
                    fill={COLORS.secondary}
                  />
                  <Text style={styles.metaText}>{restaurant.rating}</Text>
                </View>
                <View style={styles.dot} />
                <Text style={styles.metaText}>{restaurant.deliveryTime}</Text>
              </View>

              <Text style={styles.description}>{restaurant.description}</Text>
            </View>

            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Menu</Text>
            </View>
          </View>
        )}
      />

      {/* Floating Cart Button */}
      {cartItems.length > 0 && (
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={styles.viewCartButton}
            onPress={() => navigation.navigate('Cart')}
          >
            <Text style={styles.viewCartText}>
              View Cart ({cartItems.length} items)
            </Text>
            <Text style={styles.viewCartPrice}>${cartTotal.toFixed(2)}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 50, // Adjusted for typical safe area
    left: SPACING.md,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bannerImage: {
    width: '100%',
    height: 250,
  },
  restaurantInfo: {
    backgroundColor: COLORS.white,
  },
  infoContent: {
    padding: SPACING.md,
    marginTop: -30,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  metaText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.gray,
    marginHorizontal: 10,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  menuHeader: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  listContent: {
    paddingBottom: 100,
  },
  menuItem: {
    flexDirection: 'row',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    justifyContent: 'space-between',
  },
  menuItemContent: {
    flex: 1,
    marginRight: SPACING.md,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  imageContainer: {
    alignItems: 'center',
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: BORDER_RADIUS.md,
  },
  quantityControls: {
    marginTop: -20,
    width: 90,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingVertical: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  addText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 4,
  },
  activeControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  controlButton: {
    padding: 2,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.md,
  },
  viewCartButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  viewCartText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewCartPrice: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RestaurantScreen;
