import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Icon } from './Icon';
import { CHARMS } from '../constants';

export const CartSidebar: React.FC = () => {
    const { items, isOpen, toggleCart, removeFromCart, cartTotal } = useCart();
    const navigate = useNavigate();

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={toggleCart}
            ></div>

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 right-0 z-[70] w-full max-w-md bg-white dark:bg-surface-dark shadow-2xl transform transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-8 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
                        <h2 className="text-2xl font-display-serif font-medium text-text-main dark:text-white">Tu Bolsa</h2>
                        <button onClick={toggleCart} className="p-2 hover:bg-stone-100 dark:hover:bg-white/5 rounded-full transition-colors">
                            <Icon name="close" className="text-xl" />
                        </button>
                    </div>

                    {/* Items */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-8">
                        {items.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                <Icon name="shopping_bag" className="text-6xl mb-6" />
                                <p className="text-xl font-serif italic">Tu bolsa está vacía</p>
                            </div>
                        ) : (
                            items.map((item) => (
                                <div key={item.id} className="flex gap-6 animate-fade-in-up">
                                    {/* Thumbnail */}
                                    <div className="size-24 rounded-2xl flex-shrink-0 relative overflow-hidden shadow-inner flex items-center justify-center bg-stone-100 dark:bg-white/5">
                                        {item.product_details?.image_url ? (
                                            <img src={item.product_details.image_url} alt={item.product_details.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <>
                                                <div className="size-16 rounded-full shadow-xl" style={{ backgroundColor: item.config?.color?.hex || '#000' }}></div>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="flex -space-x-2">
                                                        {item.config?.charms?.slice(0, 3).map((cid, i) => (
                                                            <div key={i} className="size-6 bg-white rounded-full flex items-center justify-center shadow-md">
                                                                <Icon name={CHARMS.find(c => c.id === cid)?.icon || 'star'} className="text-[10px]" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 space-y-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-display-serif font-medium text-lg leading-tight">
                                                {item.product_details?.name || 'Pulsera Personalizada'}
                                            </h3>
                                            <button onClick={() => removeFromCart(item.id)} className="text-stone-400 hover:text-red-500 transition-colors">
                                                <Icon name="delete" className="text-lg" />
                                            </button>
                                        </div>
                                        {item.product_details ? (
                                            <p className="text-[10px] text-stone-500 uppercase tracking-wider">{item.product_details.collection_id}</p>
                                        ) : (
                                            <>
                                                <p className="text-[10px] text-stone-500 uppercase tracking-wider">{item.config?.color?.name}</p>
                                                {item.config?.message && <p className="text-[10px] text-stone-400 italic line-clamp-1">"{item.config.message}"</p>}
                                            </>
                                        )}
                                        <div className="flex justify-between items-center pt-2">
                                            <span className="text-[10px] font-black uppercase tracking-wider border border-stone-200 px-2 py-1 rounded">Cant: {item.quantity}</span>
                                            <span className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                        <div className="p-8 border-t border-stone-100 dark:border-stone-800 space-y-6 bg-stone-50 dark:bg-black/20">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Total Estimado</span>
                                <span className="text-3xl font-bold font-display-serif">${cartTotal.toFixed(2)}</span>
                            </div>
                            <button
                                onClick={() => {
                                    toggleCart();
                                    navigate('/checkout');
                                }}
                                className="w-full py-5 bg-primary text-white font-black uppercase tracking-[0.3em] text-[11px] shadow-xl hover:bg-primary-dark transition-colors flex items-center justify-center gap-4"
                            >
                                Checkout Seguro
                                <Icon name="lock" className="text-base" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
