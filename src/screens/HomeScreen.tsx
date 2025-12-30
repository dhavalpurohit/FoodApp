import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Search,
  MapPin,
  Star,
  Clock,
  ShoppingBag,
  X,
} from 'lucide-react-native';

// API & Types
import { restaurantApi } from '../api/restaurantApi';
import { Restaurant } from '../types';
import { RootStackParamList } from '../App';

// Theme
import { COLORS, SPACING, BORDER_RADIUS } from '../theme';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

/**
 * HomeScreen Component
 *
 * Displays a list of restaurants and allows navigation to Search, Cart, or Restaurant Details.
 * Also handles basic Location setting via a Modal.
 */
const HomeScreen = ({ navigation }: Props) => {
  // --- State Management ---
  const [location, setLocation] = useState('New York City, NY');
  const [modalVisible, setModalVisible] = useState(false);
  const [tempLocation, setTempLocation] = useState(location);

  // --- Data Fetching ---
  const {
    data: restaurants,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['restaurants'],
    queryFn: restaurantApi.getRestaurants,
  });

  // --- Handlers ---
  const handleUpdateLocation = () => {
    if (tempLocation.trim()) {
      setLocation(tempLocation);
      setModalVisible(false);
    }
  };

  const handleOpenLocationModal = () => {
    setTempLocation(location); // Reset temp location to current location when opening
    setModalVisible(true);
  };

  const renderRestaurantCard = ({ item }: { item: Restaurant }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() =>
        navigation.navigate('Restaurant', { restaurantId: item.id })
      }
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        {/* Card Header: Name & Rating */}
        <View style={styles.cardHeader}>
          <Text style={styles.restaurantName}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <Star size={14} color={COLORS.secondary} fill={COLORS.secondary} />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description} numberOfLines={1}>
          {item.description}
        </Text>

        {/* Card Footer: Time & Delivery Promo */}
        <View style={styles.cardFooter}>
          <View style={styles.infoItem}>
            <Clock size={14} color={COLORS.textSecondary} />
            <Text style={styles.infoText}>{item.deliveryTime}</Text>
          </View>
          <Text style={styles.freeDelivery}>Free Delivery</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // --- Loading & Error States ---
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Oops! Something went wrong.</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.replace('Home')}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- Main Render ---
  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleOpenLocationModal}>
          <Text style={styles.locationTitle}>Deliver to</Text>
          <View style={styles.locationContainer}>
            <MapPin size={16} color={COLORS.primary} />
            <Text style={styles.locationText}>{location}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Search')}
          >
            <Search size={24} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Cart')}
          >
            <ShoppingBag size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Location Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Set Delivery Location</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.modalInput}
              value={tempLocation}
              onChangeText={setTempLocation}
              placeholder="Enter your location"
              autoFocus
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleUpdateLocation}
            >
              <Text style={styles.saveButtonText}>Save Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Main List */}
      <FlatList
        data={restaurants}
        keyExtractor={item => item.id}
        renderItem={renderRestaurantCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View style={styles.listHeader}>
            <Text style={styles.mainTitle}>
              What would you like to eat today?
            </Text>
            <View style={styles.categoriesContainer}>
              <Text style={styles.sectionTitle}>Popular Restaurants</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationTitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 4,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: SPACING.sm,
    marginLeft: SPACING.xs,
  },
  listHeader: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  listContent: {
    paddingBottom: SPACING.xl,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 180,
  },
  cardContent: {
    padding: SPACING.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 4,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  freeDelivery: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  retryText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  categoriesContainer: {
    marginBottom: SPACING.md,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: BORDER_RADIUS.lg,
    borderTopRightRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  saveButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HomeScreen;
