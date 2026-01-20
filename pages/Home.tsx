
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Icon } from '../components/Icon';
import { IMAGES } from '../constants';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative">
      <Header transparent />

      {/* Hero Section */}
      <section className="relative w-full h-screen min-h-[700px] overflow-hidden group">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-cover bg-center transition-transform duration-[30s] ease-linear group-hover:scale-105" 
               style={{ backgroundImage: `url('${IMAGES.hero}')` }}>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10 h-full flex items-end pb-32 lg:pb-40 max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="max-w-3xl text-white">
            <span className="inline-block py-1.5 px-5 border border-white/30 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-8 bg-white/10">
              Artesanía Mexicana de Lujo
            </span>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display-serif font-medium mb-10 leading-[0.9] tracking-tighter">
              Tejiendo Tu <br/>
              <span className="italic font-light">Propia Historia</span>
            </h1>
            <p className="text-xl md:text-2xl font-display-serif font-light text-white/90 mb-12 max-w-lg leading-relaxed italic">
              Joyería artesanal de macramé con dijes que significan algo. Montadas en tarjetas que hablan el lenguaje del corazón.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button 
                onClick={() => navigate('/product')} 
                className="bg-white text-text-main hover:bg-primary hover:text-white px-12 py-5 rounded-none transition-all duration-500 font-black tracking-widest uppercase text-[11px] shadow-2xl"
              >
                Ver Novedades
              </button>
              <button 
                onClick={() => navigate('/product')} 
                className="flex items-center gap-5 text-white px-8 py-5 transition-all duration-300 font-bold tracking-widest uppercase text-[11px] group/btn"
              >
                <span>Explorar Colección</span>
                <Icon name="arrow_forward" className="text-xl group-hover/btn:translate-x-3 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-40 px-6 bg-background-light dark:bg-background-dark">
        <div className="max-w-[1000px] mx-auto text-center">
          <span className="text-primary font-bold tracking-[0.4em] uppercase text-[11px] mb-10 block">Nuestra Filosofía</span>
          <h2 className="text-4xl md:text-7xl font-display-serif font-normal mb-14 text-text-main dark:text-white leading-tight">
            El Macramé como <span className="italic text-stone-500 dark:text-stone-400 font-serif">Arte Moderno</span>
          </h2>
          <div className="w-[1px] h-32 bg-stone-300 dark:bg-stone-700 mx-auto mb-14"></div>
          <p className="text-2xl md:text-4xl text-stone-600 dark:text-stone-300 font-display-serif leading-relaxed font-light italic">
            "Vive la conexión emocional del macramé de alta gama. Donde la personalización profunda se encuentra con la expresión artística."
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="pb-40 px-4 lg:px-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 px-6 gap-6">
            <h2 className="text-5xl md:text-6xl font-display-serif font-medium text-text-main dark:text-white tracking-tighter">Momentos de Vida</h2>
            <Link to="/product" className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.2em] hover:text-primary transition-all group">
              Explorar Categorías
              <Icon name="arrow_forward" className="text-xl group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 auto-rows-[350px]">
            <div className="lg:col-span-8 lg:row-span-2 relative group overflow-hidden rounded-xl cursor-pointer min-h-[600px] shadow-xl">
              <div className="absolute inset-0 bg-stone-200">
                <div className="w-full h-full bg-cover bg-center hover-zoom-img" style={{ backgroundImage: `url('${IMAGES.couples}')` }}></div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute bottom-0 left-0 p-12 md:p-20 w-full">
                <span className="text-white/80 font-serif italic text-3xl mb-6 block">Para ustedes dos</span>
                <h3 className="text-6xl md:text-8xl font-display-serif text-white mb-8 tracking-tighter">Colección Parejas</h3>
                <p className="text-white/90 font-body text-xl mb-10 max-w-lg hidden md:block opacity-0 group-hover:opacity-100 transform translate-y-6 group-hover:translate-y-0 transition-all duration-1000">
                  Corazones conectados. Dijes magnéticos que se unen sobre hilos personalizados.
                </p>
                <Link to="/product" className="inline-block border-b-2 border-white text-white pb-3 text-[11px] font-black uppercase tracking-[0.3em] hover:text-primary hover:border-primary transition-all">Comprar Parejas</Link>
              </div>
            </div>
            
            <div className="lg:col-span-4 lg:row-span-1 relative group overflow-hidden rounded-xl cursor-pointer shadow-lg">
              <div className="absolute inset-0 bg-stone-200">
                <div className="w-full h-full bg-cover bg-center hover-zoom-img" style={{ backgroundImage: `url('${IMAGES.graduations}')` }}></div>
              </div>
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-500"></div>
              <div className="absolute bottom-0 left-0 p-12 w-full">
                <h3 className="text-4xl font-display-serif text-white mb-3">Graduaciones</h3>
                <Link to="/product" className="text-white/80 text-[10px] font-bold uppercase tracking-widest group-hover:text-white transition-colors">Ver selección</Link>
              </div>
            </div>

            <div className="lg:col-span-4 lg:row-span-1 relative group overflow-hidden rounded-xl cursor-pointer shadow-lg">
              <div className="absolute inset-0 bg-stone-200">
                <div className="w-full h-full bg-cover bg-center hover-zoom-img" style={{ backgroundImage: `url('${IMAGES.hobbies}')` }}></div>
              </div>
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-500"></div>
              <div className="absolute bottom-0 left-0 p-12 w-full">
                <h3 className="text-4xl font-display-serif text-white mb-3">Hobbies y Deporte</h3>
                <Link to="/product" className="text-white/80 text-[10px] font-bold uppercase tracking-widest group-hover:text-white transition-colors">Ver selección</Link>
              </div>
            </div>

            <div className="lg:col-span-12 lg:row-span-1 relative bg-[#E8F0E9] dark:bg-surface-dark rounded-xl overflow-hidden flex flex-col md:flex-row items-center border border-stone-100 dark:border-stone-800 shadow-xl">
              <div className="w-full md:w-1/2 p-16 md:p-32 flex flex-col justify-center items-start">
                <span className="text-primary font-bold tracking-[0.4em] uppercase text-[11px] mb-8">Novedad Exclusiva</span>
                <h3 className="text-5xl md:text-7xl font-display-serif text-text-main dark:text-white mb-10 tracking-tighter">Serie 'Amor Aguacate'</h3>
                <p className="text-stone-600 dark:text-stone-300 font-body mb-12 text-2xl max-w-lg leading-relaxed">
                  Divertida, fresca y llena de personalidad. Pulseras tejidas a mano con adorables aguacates en tarjetas vibrantes.
                </p>
                <Link to="/product" className="border-b-2 border-text-main dark:border-white text-text-main dark:text-white pb-3 hover:text-primary hover:border-primary transition-all text-[11px] font-black uppercase tracking-[0.3em]">
                  Ver Colección
                </Link>
              </div>
              <div className="w-full md:w-1/2 h-96 md:h-full relative overflow-hidden">
                <div className="w-full h-full bg-cover bg-center hover-zoom-img" style={{ backgroundImage: `url('${IMAGES.avocado}')` }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-40 px-12">
        <div className="max-w-[1600px] mx-auto grid md:grid-cols-4 gap-20">
          <div className="col-span-1 md:col-span-2">
             <div className="flex items-center gap-4 text-white mb-10">
              <Icon name="all_inclusive" className="text-4xl font-light text-primary" />
              <span className="text-4xl font-display-serif font-bold tracking-tighter">accesorios18</span>
            </div>
            <p className="text-2xl font-serif italic mb-10 max-w-md leading-relaxed">
              Anudando emociones en historias vestibles, un hilo a la vez. Hecho con amor en México.
            </p>
          </div>
          <div className="col-span-1 space-y-6">
            <h4 className="text-white uppercase tracking-[0.3em] text-[11px] font-black mb-10">Explorar</h4>
            <ul className="space-y-6 text-[11px] uppercase tracking-widest font-bold">
              <li><Link to="/" className="hover:text-white transition-colors">Inicio</Link></li>
              <li><Link to="/product" className="hover:text-white transition-colors">Tienda</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Historia</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h4 className="text-white uppercase tracking-[0.3em] text-[11px] font-black mb-10">Boletín</h4>
            <div className="relative border-b border-stone-700 py-6">
              <input type="email" placeholder="tu@email.com" className="bg-transparent border-none w-full text-white placeholder:text-stone-700 focus:ring-0 px-0 text-sm" />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors">Unirme</button>
            </div>
          </div>
        </div>
        <div className="max-w-[1600px] mx-auto mt-40 pt-10 border-t border-white/5 text-[10px] uppercase tracking-widest font-bold flex flex-col md:flex-row justify-between gap-6">
          <span>&copy; 2024 accesorios18. Todos los derechos reservados.</span>
          <div className="flex gap-10">
            <a href="#" className="hover:text-white">Privacidad</a>
            <a href="#" className="hover:text-white">Términos</a>
            <a href="#" className="hover:text-white">Envíos</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
