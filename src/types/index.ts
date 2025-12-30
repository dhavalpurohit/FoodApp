export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  description: string;
  categories: string[];
  menu: MenuItem[];
}

export interface CartItem extends MenuItem {
  quantity: number;
}
