import { Restaurant, Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Pizza',
    image: 'https://cdn-icons-png.flaticon.com/512/3595/3595455.png',
  },
  {
    id: '2',
    name: 'Burger',
    image: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png',
  },
  {
    id: '3',
    name: 'Sushi',
    image: 'https://cdn-icons-png.flaticon.com/512/3170/3170733.png',
  },
  {
    id: '4',
    name: 'Dessert',
    image: 'https://cdn-icons-png.flaticon.com/512/2513/2513887.png',
  },
];

export const RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: 'Pizza Palace',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
    rating: 4.5,
    deliveryTime: '25-30 min',
    description: 'Best wood-fired pizzas in town.',
    categories: ['1'],
    menu: [
      {
        id: 'm1',
        name: 'Margherita Pizza',
        description: 'Fresh basil, mozzarella, and tomato sauce.',
        price: 12.99,
        image:
          'https://images.unsplash.com/photo-1574071318508-1cdbad80ad50?w=500',
        category: '1',
      },
      {
        id: 'm2',
        name: 'Pepperoni Pizza',
        description: 'Classic pepperoni with mozzarella.',
        price: 14.99,
        image:
          'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500',
        category: '1',
      },
    ],
  },
  {
    id: '2',
    name: 'Burger Bun',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
    rating: 4.2,
    deliveryTime: '20-25 min',
    description: 'Juicy burgers with homemade patties.',
    categories: ['2'],
    menu: [
      {
        id: 'm3',
        name: 'Classic Burger',
        description: 'Beef patty, lettuce, tomato, and cheese.',
        price: 9.99,
        image:
          'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500',
        category: '2',
      },
      {
        id: 'm4',
        name: 'Cheese Burger',
        description: 'Beef patty with extra cheddar cheese.',
        price: 11.49,
        image:
          'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500',
        category: '2',
      },
    ],
  },
  {
    id: '3',
    name: 'Sushi Zen',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800',
    rating: 4.8,
    deliveryTime: '35-40 min',
    description: 'Authentic Japanese sushi experience.',
    categories: ['3'],
    menu: [
      {
        id: 'm5',
        name: 'California Roll',
        description: 'Crab, avocado, and cucumber.',
        price: 15.99,
        image:
          'https://images.unsplash.com/photo-1559466273-d95e72debaf8?w=500',
        category: '3',
      },
      {
        id: 'm6',
        name: 'Salmon Nigiri',
        description: 'Fresh salmon over rice.',
        price: 18.99,
        image:
          'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=500',
        category: '3',
      },
    ],
  },
];
