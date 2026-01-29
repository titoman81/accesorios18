
export interface Charm {
  id: string;
  name: string;
  icon: string;
}

export interface ThreadColor {
  id: string;
  name: string;
  hex: string;
  border?: boolean;
}



export interface ProductConfig {
  color: ThreadColor;
  charms: string[];
  message: string;
}

export interface CartItem {
  id: string;
  config: ProductConfig;
  price: number;
  quantity: number;
  timestamp: number;
  product_details?: any;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  collection_id: string;
  created_at: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  shipping: {
    name: string;
    email: string;
    address: string;
    city: string;
    zip: string;
  };
  date: string;
}
