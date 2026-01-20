
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Icon } from '../components/Icon';
import { COLORS, CHARMS, IMAGES } from '../constants';
import { ThreadColor } from '../types';

const Product: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState<ThreadColor>(COLORS[0]);
  const [selectedCharms, setSelectedCharms] = useState<string[]>(['heart', 'star']);
  const [message, setMessage] = useState("Conectados para siempre por este hilo. Te amo siempre.");

  const toggleCharm = (id: string) => {
    if (selectedCharms.includes(id)) {
      setSelectedCharms(prev => prev.filter(c => c !== id));
    } else {
      if (selectedCharms.length < 5) {
        setSelectedCharms(prev => [...prev, id]);
      }
    }
  };

  const removeCharm = (id: string) => {
    setSelectedCharms(prev => prev.filter(c => c !== id));
  };

  const currentPrice = 18 + (selectedCharms.length * 3);

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
      <Header />
      
      <main className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-32 pb-24">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.25em] text-stone-400 mb-16">
          <Link to="/" className="hover:text-primary transition-colors">Inicio</Link>
          <Icon name="chevron_right" className="text-xs" />
          <span className="text-text-main dark:text-white">El Hilo Conectado</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-28">
          
          {/* Gallery Side */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div className="relative bg-stone-100 dark:bg-surface-dark rounded-[2rem] overflow-hidden shadow-2xl aspect-square">
              <img 
                alt="Visualizador de producto" 
                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105" 
                src={IMAGES.productMain} 
              />
              
              {/* Floating Message Preview */}
              <div className="absolute top-10 right-10 animate-fade-in-up">
                <div className="bg-white/95 dark:bg-surface-dark/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl max-w-[280px] border border-stone-100/50 dark:border-white/5">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 mb-4 font-black">Tarjeta de Dedicatoria</p>
                  <p className="text-xl font-display-serif italic text-text-main dark:text-white leading-relaxed">
                    "{message || 'Escribe desde el corazón...'}"
                  </p>
                </div>
              </div>

              {/* Status Tags */}
              <div className="absolute bottom-10 left-10 flex gap-4">
                <div className="bg-black/70 backdrop-blur-xl text-white text-[10px] font-black uppercase tracking-[0.2em] py-3 px-6 rounded-full flex items-center gap-3 shadow-xl">
                  <Icon name="verified" className="text-lg text-primary" />
                  Artesanía Anudada a Mano
                </div>
              </div>
            </div>

            {/* Thumbs */}
            <div className="grid grid-cols-4 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-square bg-stone-100 dark:bg-surface-dark rounded-2xl overflow-hidden border-2 border-transparent hover:border-primary transition-all cursor-pointer shadow-md">
                  <img src={`https://picsum.photos/600/600?sig=${i+20}`} className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="aspect-square bg-primary/5 rounded-2xl flex flex-col items-center justify-center text-primary cursor-pointer border-2 border-dashed border-primary/30 group hover:bg-primary/10 transition-colors">
                <Icon name="videocam" className="text-3xl mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[8px] font-black uppercase tracking-widest">Video</span>
              </div>
            </div>
          </div>

          {/* Configuration Side */}
          <div className="lg:col-span-5 flex flex-col h-full">
            <div className="sticky top-32 space-y-12">
              {/* Product Info */}
              <div className="space-y-6 border-b border-stone-100 dark:border-stone-800 pb-12">
                <div className="flex items-center gap-4 text-accent-gold">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => <Icon key={i} name="star" className="text-lg" fill />)}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">(48 Reseñas)</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-display-serif font-medium tracking-tighter text-text-main dark:text-white leading-none">
                  El Hilo Conectado
                </h1>
                <div className="flex items-baseline gap-6">
                  <span className="text-4xl font-bold text-text-main dark:text-white tracking-tighter">${currentPrice.toFixed(2)} <span className="text-lg font-normal opacity-50">USD</span></span>
                  <span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Base $18 + $3/dije</span>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-16">
                {/* Step 1: Color */}
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-black text-text-main dark:text-white uppercase tracking-[0.3em]">1. Elige el Color del Hilo</label>
                    <span className="text-[11px] text-stone-400 font-bold uppercase tracking-widest">{selectedColor.name}</span>
                  </div>
                  <div className="flex flex-wrap gap-5">
                    {COLORS.map(color => (
                      <button 
                        key={color.id}
                        onClick={() => setSelectedColor(color)}
                        className={`size-14 rounded-full relative transition-all duration-500 hover:scale-110 flex items-center justify-center shadow-lg ${
                          selectedColor.id === color.id ? 'ring-2 ring-primary ring-offset-4 dark:ring-offset-background-dark scale-110' : 'hover:ring-2 hover:ring-stone-200'
                        } ${color.border ? 'border border-stone-200' : ''}`}
                        style={{ backgroundColor: color.hex }}
                      >
                        {selectedColor.id === color.id && (
                          <Icon name="check" className={`text-2xl ${['black', 'red', 'teal', 'orange'].includes(color.id) ? 'text-white' : 'text-stone-900'}`} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Charms */}
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-black text-text-main dark:text-white uppercase tracking-[0.3em]">2. Dijes con Significado</label>
                    <span className="text-[11px] text-primary font-black uppercase tracking-widest">{selectedCharms.length}/5 añadidos</span>
                  </div>
                  
                  {/* Selected Bar */}
                  <div className="relative h-28 bg-stone-50 dark:bg-surface-dark rounded-[2rem] border border-dashed border-stone-200 dark:border-stone-800 flex items-center justify-center px-10 overflow-hidden shadow-inner">
                    <div className="absolute inset-x-0 h-1.5 z-0" style={{ backgroundColor: selectedColor.hex }}></div>
                    <div className="relative z-10 flex gap-4 md:gap-8 w-full justify-center">
                      {selectedCharms.map(cid => {
                        const charm = CHARMS.find(c => c.id === cid);
                        return (
                          <div key={cid} className="group relative">
                            <div className="size-14 rounded-full bg-white dark:bg-stone-800 shadow-2xl flex items-center justify-center transform transition-all group-hover:-translate-y-3 border border-stone-100 dark:border-stone-700">
                              <Icon name={charm?.icon || 'help'} className="text-2xl" />
                            </div>
                            <button onClick={() => removeCharm(cid)} className="absolute -top-3 -right-3 size-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:bg-red-600 scale-0 group-hover:scale-100">
                              <Icon name="close" className="text-[14px]" />
                            </button>
                          </div>
                        );
                      })}
                      {Array.from({ length: 5 - selectedCharms.length }).map((_, i) => (
                        <div key={i} className="size-14 rounded-full border-2 border-dashed border-stone-200 dark:border-stone-800 flex items-center justify-center opacity-20">
                          <Icon name="add" className="text-sm" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Charm Grid */}
                  <div className="grid grid-cols-5 gap-4">
                    {CHARMS.map(charm => {
                      const active = selectedCharms.includes(charm.id);
                      return (
                        <button 
                          key={charm.id}
                          onClick={() => toggleCharm(charm.id)}
                          className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center gap-3 p-3 transition-all duration-500 group shadow-sm ${
                            active 
                              ? 'border-primary bg-primary/5 scale-95' 
                              : 'border-stone-100 dark:border-stone-800 hover:border-primary/50 hover:bg-stone-50 dark:hover:bg-stone-800 hover:-translate-y-1'
                          }`}
                        >
                          <Icon name={charm.icon} className={`text-3xl transition-all group-hover:scale-110 ${active ? 'text-primary' : 'text-stone-400'}`} fill={active} />
                          <span className={`text-[9px] font-black uppercase tracking-[0.1em] ${active ? 'text-primary' : 'text-stone-400'}`}>
                            {charm.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 3: Message */}
                <div className="space-y-8">
                  <label className="text-[11px] font-black text-text-main dark:text-white uppercase tracking-[0.3em]">3. La Dedicatoria</label>
                  <textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full h-40 rounded-[2rem] bg-stone-50 dark:bg-surface-dark border-transparent focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-stone-900 transition-all p-8 text-lg font-display-serif italic shadow-inner"
                    placeholder="Escribe un mensaje para el destinatario..."
                  />
                  <p className="text-[10px] text-stone-400 font-black uppercase tracking-[0.3em] text-center">
                    Cada pulsera llega montada en esta tarjeta impresa.
                  </p>
                </div>

                {/* CTA */}
                <div className="pt-12 border-t border-stone-100 dark:border-stone-800 space-y-6">
                  <button className="w-full h-20 bg-primary hover:bg-primary-dark text-white rounded-full font-black uppercase tracking-[0.3em] text-[11px] transition-all shadow-2xl shadow-primary/30 flex items-center justify-between px-12 group active:scale-95">
                    <span>Añadir al Carrito</span>
                    <div className="flex items-center gap-6">
                      <span className="opacity-30 font-normal">|</span>
                      <span className="text-base tracking-tighter">${currentPrice.toFixed(2)}</span>
                      <Icon name="arrow_forward" className="group-hover:translate-x-2 transition-transform text-xl" />
                    </div>
                  </button>
                  <div className="flex flex-wrap items-center justify-center gap-10 text-[10px] text-stone-400 font-black uppercase tracking-[0.2em]">
                    <div className="flex items-center gap-3"><Icon name="local_shipping" className="text-lg" /> Envío Gratis</div>
                    <div className="flex items-center gap-3"><Icon name="lock" className="text-lg" /> Pago Seguro</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Product;
