import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, ProductConfig } from '../types';

interface CartContextType {
    items: CartItem[];
    isOpen: boolean;
    addToCart: (config: ProductConfig, price: number) => void;
    removeFromCart: (id: string) => void;
    toggleCart: () => void;
    clearCart: () => void;
    cartTotal: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    // Load from local storage
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse cart', e);
            }
        }
    }, []);

    // Save to local storage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (product: any, config?: ProductConfig) => {
        const newItem: CartItem = {
            id: window.crypto.randomUUID ? window.crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
            config: config || { color: { id: 'default', name: 'Original', hex: '#000' }, charms: [], message: '' },
            price: product.price,
            quantity: 1,
            timestamp: Date.now(),
            product_details: product
        };
        setItems(prev => [newItem, ...prev]);
        setIsOpen(true);
    };

    const removeFromCart = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const toggleCart = () => setIsOpen(prev => !prev);

    const clearCart = () => setItems([]);

    const cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cartCount = items.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            items,
            isOpen,
            addToCart,
            removeFromCart,
            toggleCart,
            clearCart,
            cartTotal,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};
