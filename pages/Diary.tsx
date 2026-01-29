
import React, { useEffect } from 'react';
import { Header } from '../components/Header';
import { Icon } from '../components/Icon';
import { IMAGES } from '../constants';
import { Link } from 'react-router-dom';

const Diary: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const entries = [
        {
            id: 1,
            title: "Cómo combinar tus pulseras de macramé",
            category: "Tips de Estilo",
            date: "20 Ene 2025",
            excerpt: "El arte de las capas (layering) es tendencia. Aprende a mezclar colores y texturas para un look único.",
            image: IMAGES.hero
        },
        {
            id: 2,
            title: "La magia de los dijes personalizados",
            category: "Historias",
            date: "15 Ene 2025",
            excerpt: "Detrás de cada dije hay una intención. Descubre el significado de nuestros símbolos más populares.",
            image: IMAGES.couples
        },
        {
            id: 3,
            title: "Nueva Colección: Amor Aguacate",
            category: "Lanzamientos",
            date: "10 Ene 2025",
            excerpt: "Frescura y diversión en cada nudo. Conoce la serie que está enamorando a todos.",
            image: IMAGES.avocado
        }
    ];

    return (
        <div className="relative">
            <Header />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 bg-background-light dark:bg-background-dark">
                <div className="max-w-[1200px] mx-auto text-center border-b border-stone-100 dark:border-stone-800 pb-16">
                    <span className="text-primary font-bold tracking-[0.4em] uppercase text-[11px] mb-6 block">Inspiración y Estilo</span>
                    <h1 className="text-5xl md:text-7xl font-display-serif font-medium text-text-main dark:text-white mb-6 tracking-tighter italic">
                        Diario de accesorios18
                    </h1>
                    <p className="text-stone-500 dark:text-stone-400 font-serif text-lg italic">
                        Historias entretejidas, consejos de moda y el alma de nuestra artesanía.
                    </p>
                </div>
            </section>

            {/* Blog Feed */}
            <section className="py-20 px-6">
                <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {entries.map((entry) => (
                        <article key={entry.id} className="group cursor-pointer">
                            <div className="aspect-[4/5] overflow-hidden rounded-xl mb-8 relative">
                                <img
                                    src={entry.image}
                                    alt={entry.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-6 left-6">
                                    <span className="bg-white/90 backdrop-blur-md text-text-main px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                                        {entry.category}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="text-stone-400 text-[10px] font-bold uppercase tracking-widest">
                                    {entry.date}
                                </div>
                                <h3 className="text-2xl md:text-3xl font-display-serif text-text-main dark:text-white group-hover:text-primary transition-colors leading-tight">
                                    {entry.title}
                                </h3>
                                <p className="text-stone-500 dark:text-stone-400 font-light leading-relaxed">
                                    {entry.excerpt}
                                </p>
                                <Link to="#" className="inline-block text-[11px] font-black uppercase tracking-[0.2em] border-b border-stone-200 dark:border-stone-700 pb-1 hover:text-primary hover:border-primary transition-all">
                                    Leer Historia
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-32 bg-stone-50 dark:bg-stone-900 px-6 text-center">
                <div className="max-w-3xl mx-auto space-y-12">
                    <div className="space-y-4">
                        <h2 className="text-4xl md:text-6xl font-display-serif text-text-main dark:text-white">Únete al Círculo</h2>
                        <p className="text-stone-500 italic font-serif text-lg">Sé la primera en conocer lanzamientos exclusivos y consejos de estilo.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Tu mejor email"
                            className="flex-1 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 px-8 py-5 rounded-none focus:ring-1 focus:ring-primary outline-none text-sm transition-all"
                        />
                        <button className="bg-text-main dark:bg-primary text-white px-10 py-5 font-black uppercase tracking-widest text-[11px] hover:bg-stone-800 transition-colors">
                            Suscribirse
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer Placeholder */}
            <footer className="bg-stone-900 text-stone-400 py-12 px-8">
                <div className="max-w-[1600px] mx-auto text-center border-t border-white/5 pt-6">
                    <p className="text-[10px] uppercase tracking-[0.3em] font-black">accesorios18 &copy; 2025</p>
                </div>
            </footer>
        </div>
    );
};

export default Diary;
