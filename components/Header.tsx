
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from './Icon';

interface HeaderProps {
  transparent?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ transparent = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { label: 'Inicio', path: '/' },
    { label: 'Colecciones', path: '#' },
    { label: 'Nuestro Oficio', path: '#' },
    { label: 'Personalizar', path: '/product' },
    { label: 'Diario', path: '#' }
  ];

  // Cerrar el menú cuando cambia la ruta
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Bloquear el scroll cuando el menú está abierto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  return (
    <>
      <nav className={`fixed top-0 z-50 w-full transition-all duration-700 ${
        transparent && !isMenuOpen
          ? "bg-transparent text-white border-transparent" 
          : "bg-white/70 dark:bg-background-dark/70 backdrop-blur-xl border-b border-stone-200/50 dark:border-white/5 text-text-main dark:text-white"
      }`}>
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 h-20 md:h-24 flex items-center justify-between">
          {/* Botón Hamburguesa */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-all active:scale-90 relative z-[70]"
            aria-label="Abrir menú"
          >
            <Icon name={isMenuOpen ? "close" : "menu"} className={`text-2xl transition-transform duration-500 ${isMenuOpen ? 'rotate-90' : 'rotate-0'}`} />
          </button>
          
          {/* Logo */}
          <div className="flex items-center gap-4 absolute left-1/2 -translate-x-1/2 lg:static lg:transform-none lg:flex-1">
            <Icon name="all_inclusive" className={`text-3xl text-primary ${isMenuOpen ? 'animate-none' : 'animate-pulse'}`} />
            <Link to="/" className="text-2xl md:text-3xl font-display-serif font-bold tracking-tighter hover:opacity-80 transition-opacity">
              accesorios18
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-12">
            {menuItems.slice(1).map((item) => (
              <Link 
                key={item.label} 
                to={item.path} 
                className="relative text-[11px] font-black hover:text-primary transition-colors uppercase tracking-[0.25em] group"
              >
                {item.label}
                <span className={`absolute -bottom-2 left-0 h-[2px] bg-primary transition-all duration-300 ${location.pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
            ))}
          </div>

          {/* Iconos de Acción */}
          <div className="flex flex-1 justify-end items-center gap-1 md:gap-4 relative z-[70]">
            <button className="p-2.5 hover:text-primary transition-all hover:scale-110">
              <Icon name="search" className="font-light text-2xl" />
            </button>
            <button className="p-2.5 hover:text-primary transition-all hover:scale-110 hidden sm:block">
              <Icon name="favorite" className="font-light text-2xl" />
            </button>
            <Link to="/product" className="p-2.5 hover:text-primary transition-all hover:scale-110 relative group">
              <Icon name="shopping_bag" className="font-light text-2xl" />
              <span className="absolute top-2.5 right-2.5 size-2 bg-primary rounded-full ring-2 ring-white dark:ring-stone-900 group-hover:scale-125 transition-transform"></span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Menú Móvil Overlay */}
      <div className={`fixed inset-0 z-[60] lg:hidden transition-all duration-700 ease-in-out ${
        isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        {/* Fondo con desenfoque */}
        <div className="absolute inset-0 bg-white/95 dark:bg-background-dark/95 backdrop-blur-2xl"></div>
        
        {/* Contenido del Menú */}
        <div className="relative h-full flex flex-col items-center justify-center p-8 space-y-12">
          {menuItems.map((item, index) => (
            <Link
              key={item.label}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className={`text-4xl md:text-5xl font-display-serif font-medium text-text-main dark:text-white hover:text-primary transition-all transform ${
                isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {item.label}
              {location.pathname === item.path && (
                <span className="block mx-auto mt-4 size-1.5 bg-primary rounded-full"></span>
              )}
            </Link>
          ))}
          
          {/* Social / Info en el menú móvil */}
          <div className={`pt-12 border-t border-stone-200 dark:border-white/10 w-full max-w-xs text-center space-y-6 transform transition-all duration-1000 delay-500 ${
            isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}>
            <p className="text-[10px] uppercase tracking-[0.3em] font-black text-stone-400">Hecho a mano en México</p>
            <div className="flex justify-center gap-8">
              <button className="size-12 rounded-full border border-stone-200 dark:border-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Icon name="share" className="text-xl" />
              </button>
              <button className="size-12 rounded-full border border-stone-200 dark:border-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Icon name="mail" className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
