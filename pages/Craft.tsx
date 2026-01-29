
import React, { useEffect } from 'react';
import { Header } from '../components/Header';
import { Icon } from '../components/Icon';
import { IMAGES } from '../constants';

const Craft: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="relative">
            <Header />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 bg-stone-50 dark:bg-stone-900 overflow-hidden">
                <div className="max-w-[1200px] mx-auto text-center relative z-10">
                    <span className="text-primary font-bold tracking-[0.4em] uppercase text-[11px] mb-8 block animate-fade-in">El Arte Detrás de Cada Nudo</span>
                    <h1 className="text-5xl md:text-8xl font-display-serif font-medium text-text-main dark:text-white mb-10 tracking-tighter leading-tight italic">
                        Nuestro Oficio
                    </h1>
                    <div className="w-[1px] h-24 bg-primary/30 mx-auto mb-10"></div>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-stone-600 dark:text-stone-300 font-serif italic leading-relaxed">
                        "No solo tejemos hilos; anudamos sentimientos, recuerdos y promesas en objetos que cuentan historias."
                    </p>
                </div>

                {/* Subtle Background Elements */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 transform translate-x-1/2"></div>
            </section>

            {/* Section 1: The Soul of Macramé */}
            <section className="py-32 px-6">
                <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl">
                        <img
                            src={IMAGES.productMain}
                            alt="Artisan at work"
                            className="w-full h-full object-cover transition-transform duration-[10s] hover:scale-110"
                        />
                        <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl"></div>
                    </div>
                    <div className="space-y-10">
                        <h2 className="text-4xl md:text-6xl font-display-serif text-text-main dark:text-white leading-tight">
                            El Alma del <span className="italic font-serif text-stone-500">Hilo</span>
                        </h2>
                        <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed font-light">
                            Nuestro viaje comienza con la elección del material perfecto. Utilizamos hilos de alta resistencia seleccionados por su suavidad y durabilidad, permitiendo que cada pieza resista el paso del tiempo y las vivencias de quien las porta.
                        </p>
                        <div className="grid grid-cols-2 gap-8 pt-6">
                            <div className="border-l-2 border-primary/20 pl-6">
                                <h4 className="font-bold uppercase tracking-widest text-xs mb-3 text-text-main dark:text-white">Paciencia</h4>
                                <p className="text-sm text-stone-500">Cada pulsera toma tiempo, enfoque y serenidad.</p>
                            </div>
                            <div className="border-l-2 border-primary/20 pl-6">
                                <h4 className="font-bold uppercase tracking-widest text-xs mb-3 text-text-main dark:text-white">Precisión</h4>
                                <p className="text-sm text-stone-500">Nudos exactos para una armonía visual perfecta.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2: Steps in the shadows (Process) */}
            <section className="py-32 bg-stone-900 text-white overflow-hidden">
                <div className="max-w-[1200px] mx-auto px-6">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-6xl font-display-serif mb-8">Un Viaje paso a paso</h2>
                        <div className="w-20 h-1 bg-primary mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                        <div className="space-y-6 group">
                            <div className="text-6xl font-display-serif text-white/10 group-hover:text-primary/20 transition-colors">01</div>
                            <h3 className="text-2xl font-display-serif italic">Conceptualización</h3>
                            <p className="text-stone-400 leading-relaxed font-light">
                                Todo nace de una emoción. Elegimos el color y el dije que mejor represente ese sentimiento que deseamos inmortalizar.
                            </p>
                        </div>
                        <div className="space-y-6 group">
                            <div className="text-6xl font-display-serif text-white/10 group-hover:text-primary/20 transition-colors">02</div>
                            <h3 className="text-2xl font-display-serif italic">El Tejido Manual</h3>
                            <p className="text-stone-400 leading-relaxed font-light">
                                Utilizando técnicas ancestrales de macramé, transformamos hilos sueltos en estructuras complejas y hermosas, nudo tras nudo.
                            </p>
                        </div>
                        <div className="space-y-6 group">
                            <div className="text-6xl font-display-serif text-white/10 group-hover:text-primary/20 transition-colors">03</div>
                            <h3 className="text-2xl font-display-serif italic">El Mensaje Final</h3>
                            <p className="text-stone-400 leading-relaxed font-light">
                                Montamos cada pieza en tarjetas diseñadas para ser el eco de la joya, completando una experiencia que emociona al recibir.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 3: Connection */}
            <section className="py-40 bg-white dark:bg-background-dark text-center px-6">
                <div className="max-w-[1000px] mx-auto">
                    <Icon name="favorite" className="text-5xl text-primary mb-12 animate-pulse" />
                    <h2 className="text-5xl md:text-7xl font-display-serif font-light mb-12 text-text-main dark:text-white leading-tight">
                        Hecho a Mano con <br /> Orgullo <span className="italic text-stone-500">Venezolano</span>
                    </h2>
                    <p className="text-xl md:text-3xl text-stone-500 font-serif italic mb-16 leading-relaxed">
                        Cada pieza de accesorios18 lleva consigo la calidez de nuestras manos y el alma de nuestra tierra. Un lujo artesanal que conecta corazones.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <div className="px-10 py-5 border border-stone-200 dark:border-stone-800 rounded-full flex items-center gap-4 group hover:border-primary transition-all">
                            <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-primary transition-colors">Tradiciones</span>
                        </div>
                        <div className="px-10 py-5 border border-stone-200 dark:border-stone-800 rounded-full flex items-center gap-4 group hover:border-primary transition-all">
                            <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-primary transition-colors">Dedicación</span>
                        </div>
                        <div className="px-10 py-5 border border-stone-200 dark:border-stone-800 rounded-full flex items-center gap-4 group hover:border-primary transition-all">
                            <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-primary transition-colors">Amor</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Placeholder (Matching Home) */}
            <footer className="bg-stone-900 text-stone-400 py-12 px-8">
                <div className="max-w-[1600px] mx-auto text-center border-t border-white/5 pt-6">
                    <p className="text-[10px] uppercase tracking-[0.3em] font-black">accesorios18 &copy; 2025</p>
                </div>
            </footer>
        </div>
    );
};

export default Craft;
