
export interface Product {
  id: number;
  name: string;
  amount: number;
  price: number;
  image: string;
  badge?: string;
}

export interface Review {
  id: number;
  user: string;
  rating: number;
  text: string;
  date: string;
}

export interface SupportMessage {
  id: number;
  contact: string;
  text: string;
  date: string;
  status: 'new' | 'replied';
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Theme {
  mode: 'dark' | 'light';
}

export type ThemeType = 'dark' | 'light';
