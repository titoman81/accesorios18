
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

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface ProductConfig {
  color: ThreadColor;
  charms: string[];
  message: string;
}
