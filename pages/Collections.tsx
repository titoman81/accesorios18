
import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Icon } from '../components/Icon';
import { IMAGES } from '../constants';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Collections: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { addToCart } = useCart();
    const [favorites, setFavorites] = useState<string[]>([]);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchProducts();
        if (user) fetchFavorites();

        // Check if coming from Favorites link
        if (location.state?.showFavorites) {
            setShowFavoritesOnly(true);
        }

        // Smart scroll if coming from Home with state
        if (location.state?.scrollTo) {
            setTimeout(() => {
                const el = document.getElementById(location.state.scrollTo);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }
    }, [user, location]);

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setProducts(data);
        }
        setLoading(false);
    };

    const fetchFavorites = async () => {
        const { data } = await supabase
            .from('favorites')
            .select('product_id')
            .eq('user_id', user?.id);

        if (data) setFavorites(data.map(f => f.product_id));
    };

    const toggleFavorite = async (productId: string) => {
        if (!user) return alert('Debes iniciar sesión para guardar favoritos');

        const isFav = favorites.includes(productId);
        if (isFav) {
            await supabase.from('favorites').delete().eq('user_id', user.id).eq('product_id', productId);
            setFavorites(prev => prev.filter(id => id !== productId));
        } else {
            await supabase.from('favorites').insert({ user_id: user.id, product_id: productId });
            setFavorites(prev => [...prev, productId]);
        }
    };

    const collections = [
        { id: 'parejas', name: 'Parejas', description: 'Corazones que se atraen.', image: '/couples_bracelets.jpg', icon: 'favorite' },
        { id: 'deporte', name: 'Deporte', description: 'Pasión en cada movimiento.', image: IMAGES.hobbies, icon: 'sports_soccer' },
        { id: 'graduacion', name: 'Graduación', description: 'Un éxito digno de lucir.', image: IMAGES.graduations, icon: 'school' },
        { id: 'amistad', name: 'Amistad', description: 'Lazos inseparables.', image: IMAGES.hero, icon: 'group' },
        { id: 'mascotas', name: 'Mascotas', description: 'Huellas eternas.', image: IMAGES.productMain, icon: 'pets' },
        { id: 'musica', name: 'Música', description: 'El ritmo de tu esencia.', image: IMAGES.avocado, icon: 'music_note' },
        { id: 'amuletos', name: 'Amuletos', description: 'Protección con estilo.', image: IMAGES.hero, icon: 'auto_awesome' },
        { id: 'nacimientos', name: 'Nacimientos', description: 'Bienvenida al mundo.', image: IMAGES.productMain, icon: 'child_care' },
        { id: 'minimalista', name: 'Minimalista', description: 'Belleza en la sencillez.', image: IMAGES.hero, icon: 'filter_vintage' }
    ];

    return (
        <div className="relative">
            <Header />

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 px-6 bg-stone-50 dark:bg-stone-900 overflow-hidden">
                <div className="max-w-[1200px] mx-auto text-center relative z-10">
                    <span className="text-stone-400 font-bold tracking-[0.4em] uppercase text-[11px] mb-8 block animate-fade-in">Descubre Nuestra Variedad</span>
                    <h1 className="text-6xl md:text-8xl font-display-serif font-medium text-text-main dark:text-white mb-10 tracking-tighter leading-tight italic">
                        Encuentra tu Momento
                    </h1>
                    <div className="w-[1px] h-24 bg-stone-200 dark:bg-stone-800 mx-auto mb-10"></div>

                    {user && (
                        <button
                            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                            className={`inline-flex items-center gap-3 px-8 py-3 rounded-full transition-all border ${showFavoritesOnly
                                    ? 'bg-red-500 border-red-500 text-white shadow-lg'
                                    : 'bg-transparent border-stone-200 dark:border-white/10 text-stone-500 hover:border-red-500 hover:text-red-500'
                                }`}
                        >
                            <Icon name={showFavoritesOnly ? "favorite" : "favorite_border"} className="text-lg" />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                                {showFavoritesOnly ? 'Viendo mis Favoritos' : 'Ver solo mis Favoritos'}
                            </span>
                        </button>
                    )}
                </div>
            </section>

            {/* Collections Grid - Restored original aesthetic */}
            <section className="py-24 px-6 md:px-12 bg-white dark:bg-background-dark">
                <div className="max-w-[1600px] mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {collections.map((col) => {
                            const collectionProducts = products.filter(p => p.collection_id === col.id);

                            return (
                                <div key={col.id} className="group relative overflow-hidden rounded-2xl aspect-[3/4] cursor-pointer shadow-xl">
                                    {/* Background Image */}
                                    <img
                                        src={col.image}
                                        alt={col.name}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity"></div>

                                    {/* Content */}
                                    <div className="absolute inset-x-0 bottom-0 p-10 transform transition-transform duration-500 group-hover:-translate-y-4">
                                        <div className="flex items-center gap-4 mb-4 text-primary">
                                            <Icon name={col.icon} className="text-3xl" />
                                            <div className="h-[1px] w-12 bg-primary/50"></div>
                                            {collectionProducts.length > 0 && (
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
                                                    {collectionProducts.length} {collectionProducts.length === 1 ? 'Pieza' : 'Piezas'}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-4xl font-display-serif text-white mb-3">
                                            {col.name}
                                        </h3>
                                        <p className="text-white/70 font-light text-lg mb-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {col.description}
                                        </p>
                                        <button
                                            onClick={() => {
                                                const el = document.getElementById(col.id);
                                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                                            }}
                                            className="inline-block border-b border-white px-0.5 pb-1 text-[11px] font-black uppercase tracking-widest text-white hover:text-primary hover:border-primary transition-all text-left"
                                        >
                                            Ver productos
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Detailed Product Sections */}
            <div className="space-y-0">
                {collections.map((col) => {
                    let collectionProducts = products.filter(p => p.collection_id === col.id);

                    // Filter by favorites if active
                    if (showFavoritesOnly) {
                        collectionProducts = collectionProducts.filter(p => favorites.includes(p.id));
                    }

                    if (collectionProducts.length === 0) return null;

                    return (
                        <section key={col.id} id={col.id} className="py-32 px-6 md:px-12 bg-background-light dark:bg-background-dark border-t border-stone-100 dark:border-white/5 scroll-mt-20">
                            <div className="max-w-[1600px] mx-auto">
                                <div className="flex items-center gap-6 mb-16">
                                    <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                                        <Icon name={col.icon} className="text-4xl" />
                                    </div>
                                    <div>
                                        <h2 className="text-5xl font-display-serif italic">{col.name}</h2>
                                        <p className="text-stone-400 font-light mt-2 max-w-xl">{col.description}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                                    {collectionProducts.map((product) => (
                                        <div key={product.id} className="group cursor-pointer">
                                            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl mb-6 shadow-2xl bg-stone-100 dark:bg-stone-900">
                                                <img
                                                    src={product.image_url || col.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/80 to-transparent">
                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={() => addToCart(product)}
                                                            className="flex-1 bg-primary text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-primary transition-all shadow-xl"
                                                        >
                                                            Añadir Bolsa
                                                        </button>
                                                        <button
                                                            onClick={() => toggleFavorite(product.id)}
                                                            className={`size-12 rounded-2xl flex items-center justify-center transition-all ${favorites.includes(product.id) ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white hover:text-red-500 whitespace-nowrap'
                                                                }`}
                                                        >
                                                            <Icon name={favorites.includes(product.id) ? "favorite" : "favorite_border"} className="text-2xl" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <h3 className="text-2xl font-display-serif mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                                            <div className="flex justify-between items-center">
                                                <p className="font-bold text-xl">${product.price}</p>
                                                <span className="text-[10px] font-black uppercase tracking-widest opacity-30">{col.name}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    );
                })}
            </div>

            {loading && products.length === 0 && (
                <div className="py-40 text-center">
                    <div className="animate-spin size-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-stone-400 font-light">Actualizando piezas...</p>
                </div>
            )}

            {/* Custom Service Section */}
            <section className="py-32 bg-stone-900 text-white text-center px-6">
                <div className="max-w-4xl mx-auto space-y-12">
                    <h2 className="text-4xl md:text-6xl font-display-serif italic">¿Buscas algo aún más único?</h2>
                    <p className="text-stone-400 font-light text-xl leading-relaxed">
                        Todas nuestras colecciones son puntos de partida. Puedes personalizar colores y dijes para crear una pieza que sea 100% tú.
                    </p>
                    <Link
                        to="/product"
                        className="inline-block bg-primary text-white px-12 py-5 font-black uppercase tracking-widest text-[11px] hover:bg-white hover:text-text-main transition-all shadow-2xl"
                    >
                        Personalizar Ahora
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-stone-900 text-stone-400 py-12 px-8">
                <div className="max-w-[1600px] mx-auto text-center border-t border-white/5 pt-6">
                    <p className="text-[10px] uppercase tracking-[0.3em] font-black">accesorios18 &copy; 2025</p>
                </div>
            </footer>
        </div>
    );
};

export default Collections;
