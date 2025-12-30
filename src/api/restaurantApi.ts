import { RESTAURANTS, CATEGORIES } from './mockData';
import { Restaurant, Category } from '../types';

// Simulate API delay
const delay = (ms: number) =>
  new Promise<void>(resolve => setTimeout(() => resolve(), ms));

export const restaurantApi = {
  getRestaurants: async (): Promise<Restaurant[]> => {
    await delay(1000);
    return RESTAURANTS;
  },
  getRestaurantById: async (id: string): Promise<Restaurant | undefined> => {
    await delay(800);
    return RESTAURANTS.find(r => r.id === id);
  },
  getCategories: async (): Promise<Category[]> => {
    await delay(500);
    return CATEGORIES;
  },
};
