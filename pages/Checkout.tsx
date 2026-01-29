import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Icon } from '../components/Icon';
import { supabase } from '../services/supabase';

const Checkout: React.FC = () => {
    const { items, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [step, setStep] = useState(1);

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        email: user?.email || '',
        address: '',
        city: '',
        zip: ''
    });

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return alert('Debes iniciar sesión para completar la compra');
        setIsProcessing(true);

        try {
            // 1. Create Order
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    user_id: user.id,
                    total_amount: cartTotal,
                    shipping_details: formData,
                    status: 'pending'
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // 2. Create Order Items
            const orderItems = items.map(item => ({
                order_id: order.id,
                product_id: item.product_details?.id || null,
                product_name: item.product_details?.name || 'Pulsera Personalizada',
                quantity: item.quantity,
                price_at_purchase: item.price,
                config: item.config
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            setStep(3); // Success Step
            clearCart();
        } catch (err: any) {
            console.error('Error processing order:', err);
            alert('Error al procesar el pedido: ' + err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    if (items.length === 0 && step !== 3) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-6">
                <Icon name="shopping_bag" className="text-6xl text-stone-300 mb-6" />
                <h1 className="text-3xl font-display-serif text-text-main dark:text-white mb-4">Tu bolsa está vacía</h1>
                <Link to="/" className="text-primary font-black uppercase tracking-widest text-xs border-b border-primary pb-1">Volver a la tienda</Link>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen">
            <Header />

            <main className="max-w-6xl mx-auto px-6 lg:px-12 pt-40 pb-24">
                {step === 3 ? (
                    <div className="max-w-xl mx-auto text-center animate-fade-in-up">
                        <div className="size-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 text-green-600">
                            <Icon name="check" className="text-4xl" />
                        </div>
                        <h1 className="text-5xl font-display-serif text-text-main dark:text-white mb-6">¡Gracias por tu compra!</h1>
                        <p className="text-xl text-stone-500 mb-12 font-serif italic">Tu pedido ha sido confirmado. Puedes ver el detalle en tu historial.</p>
                        <Link to="/" className="bg-primary text-white px-10 py-4 rounded-full font-black uppercase tracking-[0.2em] text-[10px] hover:bg-primary-dark transition-colors">
                            Volver al Inicio
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-12 gap-16">

                        {/* Form */}
                        <div className="lg:col-span-7 space-y-12">
                            <div className="pb-8 border-b border-stone-200 dark:border-white/10">
                                <h1 className="text-4xl font-display-serif text-text-main dark:text-white mb-2">Finalizar Compra</h1>
                                <p className="text-stone-400 text-sm uppercase tracking-widest font-bold">Resumen de Envío</p>
                            </div>

                            <form id="checkout-form" onSubmit={handlePayment} className="space-y-8">
                                <div className="space-y-6">
                                    <h3 className="text-lg font-bold uppercase tracking-widest text-text-main dark:text-white flex items-center gap-3">
                                        <Icon name="local_shipping" /> Información de Envío
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-wider text-stone-500">Nombre</label>
                                            <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-stone-50 dark:bg-white/5 border-none rounded-lg p-4 focus:ring-1 focus:ring-primary" placeholder="Tu Nombre" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-wider text-stone-500">Apellido</label>
                                            <input required type="text" value={formData.lastname} onChange={(e) => setFormData({ ...formData, lastname: e.target.value })} className="w-full bg-stone-50 dark:bg-white/5 border-none rounded-lg p-4 focus:ring-1 focus:ring-primary" placeholder="Tu Apellido" />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-wider text-stone-500">Email</label>
                                            <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-stone-50 dark:bg-white/5 border-none rounded-lg p-4 focus:ring-1 focus:ring-primary" placeholder="tu@email.com" />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-wider text-stone-500">Dirección</label>
                                            <input required type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full bg-stone-50 dark:bg-white/5 border-none rounded-lg p-4 focus:ring-1 focus:ring-primary" placeholder="Calle, Número, Colonia" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-wider text-stone-500">Ciudad</label>
                                            <input required type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full bg-stone-50 dark:bg-white/5 border-none rounded-lg p-4 focus:ring-1 focus:ring-primary" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-wider text-stone-500">C.P.</label>
                                            <input required type="text" value={formData.zip} onChange={(e) => setFormData({ ...formData, zip: e.target.value })} className="w-full bg-stone-50 dark:bg-white/5 border-none rounded-lg p-4 focus:ring-1 focus:ring-primary" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 pt-8 border-t border-stone-100 dark:border-white/5">
                                    <h3 className="text-lg font-bold uppercase tracking-widest text-text-main dark:text-white flex items-center gap-3">
                                        <Icon name="credit_card" /> Pago al Recibir / Transferencia
                                    </h3>
                                    <div className="p-6 bg-stone-50 dark:bg-white/5 rounded-xl border border-stone-200 dark:border-white/10 text-center text-stone-500">
                                        <p className="text-sm">Tu pedido será registrado y nos pondremos en contacto para el pago.</p>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Sidebar Summary */}
                        <div className="lg:col-span-5">
                            <div className="bg-stone-50 dark:bg-surface-dark p-8 md:p-12 rounded-[2rem] sticky top-32">
                                <h3 className="text-xl font-display-serif font-medium mb-8">Resumen del Pedido</h3>

                                <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                                    {items.map(item => (
                                        <div key={item.id} className="flex gap-4 items-center">
                                            <div className="size-16 rounded-lg bg-white shadow-sm flex-shrink-0 overflow-hidden">
                                                {item.product_details?.image_url ? (
                                                    <img src={item.product_details.image_url} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full" style={{ backgroundColor: `${item.config?.color?.hex}40` }}></div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between">
                                                    <span className="font-bold text-sm line-clamp-1">{item.quantity}x {item.product_details?.name || 'Pulsera'}</span>
                                                    <span className="font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                                                </div>
                                                <p className="text-[10px] text-stone-500 mt-1 uppercase tracking-widest">
                                                    {item.product_details?.collection_id || item.config?.color?.name}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3 pt-6 border-t border-stone-200 dark:border-stone-700">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-stone-500">Subtotal</span>
                                        <span className="font-bold">${cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-stone-500">Envío</span>
                                        <span className="font-bold text-green-600">Gratis</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-display-serif font-bold pt-4">
                                        <span>Total</span>
                                        <span>${cartTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    form="checkout-form"
                                    disabled={isProcessing}
                                    className="w-full mt-8 bg-text-main dark:bg-white text-white dark:text-text-main py-5 rounded-xl font-black uppercase tracking-[0.2em] text-xs hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                                >
                                    {isProcessing ? 'Procesando...' : 'Confirmar Pedido'}
                                    {!isProcessing && <Icon name="arrow_forward" />}
                                </button>
                            </div>
                        </div>

                    </div>
                )}
            </main>
        </div>
    );
};

export default Checkout;
