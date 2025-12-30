import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Theme
import { COLORS } from './theme';

// Screens
import HomeScreen from './screens/HomeScreen';
import RestaurantScreen from './screens/RestaurantScreen';
import CartScreen from './screens/CartScreen';
// Lazy load SearchScreen if needed, currently direct import isn't set up so using require in route for now,
// or could standardize to import if circular deps aren't an issue.
// Keeping the require pattern for SearchScreen as previously implemented to avoid breaking changes.

const Stack = createStackNavigator();
const queryClient = new QueryClient();

/**
 * Type definitions for the Root Stack Navigator.
 * Defines the parameters expected by each screen.
 */
export type RootStackParamList = {
  Home: undefined;
  Restaurant: { restaurantId: string };
  Cart: undefined;
  Search: undefined;
};

/**
 * Main Application Component
 *
 * Sets up the providers hierarchy:
 * 1. GestureHandlerRootView (for gesture handling)
 * 2. SafeAreaProvider (for safe area insets)
 * 3. QueryClientProvider (for React Query state management)
 * 4. NavigationContainer (for routing)
 */
const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerStyle: {
                  backgroundColor: COLORS.background,
                  elevation: 0, // Remove shadow on Android
                  shadowOpacity: 0, // Remove shadow on iOS
                },
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
                headerTintColor: COLORS.text,
                cardStyle: { backgroundColor: COLORS.background },
              }}
            >
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Restaurant"
                component={RestaurantScreen}
                options={{ title: '' }}
              />
              <Stack.Screen
                name="Cart"
                component={CartScreen}
                options={{ title: 'My Cart' }}
              />
              <Stack.Screen
                name="Search"
                getComponent={() => require('./screens/SearchScreen').default}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
