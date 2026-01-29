
import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';
import { Icon } from '../components/Icon';

const History: React.FC = () => {
    const { user, authLoading } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) fetchOrders();
    }, [user]);

    const fetchOrders = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (*)
            `)
            .eq('user_id', user?.id)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setOrders(data);
        }
        setLoading(false);
    };

    if (!user && !authLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <Icon name="history" className="text-6xl text-stone-200 mb-6" />
                <h1 className="text-2xl font-display-serif mb-4">Debes iniciar sesión</h1>
                <p className="text-stone-400">Para ver tu historial de pedidos necesitas estar autenticado.</p>
                <a href="/login" className="mt-8 bg-primary text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs">Entrar a mi cuenta</a>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-background-dark">
            <Header />

            <main className="max-w-4xl mx-auto pt-40 pb-24 px-6">
                <div className="mb-12">
                    <h1 className="text-5xl font-display-serif italic mb-4">Mis Pedidos</h1>
                    <p className="text-stone-500 font-light">Historial de tus compras en Accesorios18</p>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin size-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-stone-900 rounded-[2rem] border border-stone-100 dark:border-white/5">
                        <Icon name="shopping_basket" className="text-6xl text-stone-100 mb-6" />
                        <h2 className="text-xl font-display-serif opacity-40 italic">Aún no has realizado ninguna compra</h2>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white dark:bg-stone-900 rounded-[2rem] p-8 shadow-sm border border-stone-100 dark:border-white/5 animate-fade-in-up">
                                <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Pedido ID</p>
                                        <p className="font-mono text-xs">#{order.id.slice(0, 8).toUpperCase()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Fecha</p>
                                        <p className="text-sm font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Estado</p>
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${order.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                                                order.status === 'paid' ? 'bg-blue-100 text-blue-600' :
                                                    order.status === 'shipped' ? 'bg-purple-100 text-purple-600' :
                                                        order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                                                            'bg-red-100 text-red-600'
                                            }`}>
                                            {order.status === 'pending' ? 'Pendiente' :
                                                order.status === 'paid' ? 'Pagado' :
                                                    order.status === 'shipped' ? 'Enviado' :
                                                        order.status === 'delivered' ? 'Entregado' : 'Cancelado'}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Total</p>
                                        <p className="text-xl font-bold">${order.total_amount}</p>
                                    </div>
                                </div>

                                <div className="divide-y divide-stone-50 dark:divide-white/5 bg-stone-50 dark:bg-black/20 rounded-2xl overflow-hidden px-6">
                                    {order.order_items?.map((item: any) => (
                                        <div key={item.id} className="py-4 flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-sm">{item.quantity}x {item.product_name}</p>
                                                {item.config?.color && (
                                                    <p className="text-[10px] text-stone-400 uppercase tracking-widest">{item.config.color.name}</p>
                                                )}
                                            </div>
                                            <p className="font-medium">${item.price_at_purchase * item.quantity}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default History;
