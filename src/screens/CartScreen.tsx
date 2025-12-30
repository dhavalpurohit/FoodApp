import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {
  ChevronLeft,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
} from 'lucide-react-native';
import { useCartStore } from '../store/useCartStore';
import { COLORS, SPACING, BORDER_RADIUS } from '../theme';
import { CartItem } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';

type CartScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Cart'>;

interface Props {
  navigation: CartScreenNavigationProp;
}

const CartScreen = ({ navigation }: Props) => {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } =
    useCartStore();

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemName}>{item.name}</Text>
          <TouchableOpacity onPress={() => removeItem(item.id)}>
            <Trash2 size={18} color={COLORS.error} />
          </TouchableOpacity>
        </View>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
            style={styles.quantityButton}
          >
            <Minus size={16} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
            style={styles.quantityButton}
          >
            <Plus size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <ShoppingBag size={80} color={COLORS.gray} />
      <Text style={styles.emptyTitle}>Your cart is empty</Text>
      <Text style={styles.emptySubtitle}>
        Looks like you haven't added anything to your cart yet.
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.browseButtonText}>Browse Restaurants</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review Order</Text>
        <TouchableOpacity onPress={clearCart}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        renderItem={renderCartItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyCart}
      />

      {items.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              ${getTotalPrice().toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>$0.00</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${getTotalPrice().toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutButton}>
            <Text style={styles.checkoutButtonText}>Place Order</Text>
          </TouchableOpacity>
        </View>
      )}
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
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  clearText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  listContent: {
    padding: SPACING.md,
    flexGrow: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.sm,
  },
  itemInfo: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'space-between',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FDEEEB',
    borderRadius: 6,
    padding: 2,
  },
  quantityButton: {
    padding: 4,
  },
  quantityText: {
    paddingHorizontal: 12,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  footer: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  summaryLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  summaryValue: {
    color: COLORS.text,
    fontWeight: '600',
    fontSize: 14,
  },
  totalRow: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.md,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  checkoutButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.xl,
  },
  browseButton: {
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
  },
  browseButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default CartScreen;
