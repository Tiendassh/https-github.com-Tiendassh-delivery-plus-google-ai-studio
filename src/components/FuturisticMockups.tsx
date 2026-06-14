import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Bike, 
  Users, 
  Calendar, 
  Sparkles, 
  QrCode, 
  ChevronRight, 
  Smartphone,
  Eye,
  MessageSquare,
  Gift,
  Plus,
  Compass,
  ArrowRight,
  Bookmark,
  Layers,
  Award,
  Clock,
  Shield,
  Briefcase
} from 'lucide-react';

// --- GUSTAVO BETTIOL EMBEDDED WATERMARK LOGO ---
const GustavoBettiolLogo: React.FC = () => {
  return (
    <div className="flex items-center gap-1.5 bg-[#030712]/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-purple-500/30 text-white select-none pointer-events-auto shadow-[0_2px_12px_rgba(162,0,255,0.25)] shrink-0 transition-all hover:scale-105">
      <div className="flex flex-col text-right leading-none">
        <span className="text-[5.5px] text-gray-400 uppercase tracking-widest font-black block mb-0.5">Peluquería Canina</span>
        <span className="text-[8.5px] font-black text-white tracking-tight font-sans block">
          Gustavo Bettiol
        </span>
      </div>
      <div className="w-5.5 h-5.5 rounded-full bg-gradient-to-tr from-cyan-400 via-indigo-600 to-purple-600 flex items-center justify-center p-0.5 border border-cyan-400/40">
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5c-1.5 0-3 1.2-3 3v2c0 .8-.5 1.5-1.2 1.8C7 12 6.5 12.5 6.5 13.5c0 1.5 2 2.5 5.5 2.5s5.5-1 5.5-2.5c0-1-.5-1.5-1.3-1.7-.7-.3-1.2-1-1.2-1.8V8c0-1.8-1.5-3-3-3z"/>
          <circle cx="12" cy="11.5" r="1" fill="currentColor"/>
        </svg>
      </div>
    </div>
  );
};

// --- MODAL DETALLE DE ROL ---
interface RoleModalProps {
  role: string;
  onClose: () => void;
}

const RoleDetailModal: React.FC<RoleModalProps> = ({ role, onClose }) => {
  const getRoleDetails = () => {
    switch (role.toLowerCase()) {
      case 'usuario':
        return {
          title: 'Rol: Usuario Persona',
          desc: 'Solicita envíos express, transporta elementos personales de forma segura y rastrea repartidores en tiempo real con geolocalización satelital protegida por IA.',
          color: 'from-blue-500 to-cyan-500',
          bulletColor: 'text-blue-400',
          perks: ['Entregas en menos de 30 minutos', 'Tarifas calculadas con optimización de IA', 'Soporte 24/7 integrado']
        };
      case 'negocio':
        return {
          title: 'Rol: Establecimiento Comercial',
          desc: 'Herramientas potentes para despachar mercaderías B2B en masa. Crea bloques turnos programados fijos de 4 horas para tener fleteros garantizados dedicados.',
          color: 'from-purple-500 to-pink-500',
          bulletColor: 'text-purple-400',
          perks: ['Reducción del 35% en costos logísticos', 'Facturación simplificada de manera digital', 'Seguimiento multi-order en vivo']
        };
      case 'repartidor':
        return {
          title: 'Rol: Repartidor B2B',
          desc: 'Conduce y gana con la mayor tasa de retorno del mercado. Liquidaciones inmediatas con el motor Split Inteligente 80/20 (80% para ti, 20% plataforma).',
          color: 'from-indigo-500 to-violet-500',
          bulletColor: 'text-indigo-400',
          perks: ['Soporte para múltiples vehículos (Moto, Bici)', 'Tarifas dinámicas por clima extremo', 'Liquidaciones B2B en menos de 24 hs']
        };
      case 'emprendedor':
      default:
        return {
          title: 'Rol: Emprendedor',
          desc: 'Diseñado para pequeñas tiendas y marcas independientes. Envía tus productos con tarifas de entrega preferenciales adaptadas a volúmenes bajos y medianos.',
          color: 'from-rose-500 to-purple-600',
          bulletColor: 'text-pink-400',
          perks: ['Integración rápida sin abonos mensuales', 'Embalaje protegido ante el clima', 'Acceso a Comunidad de Emprendedores']
        };
    }
  };

  const details = getRoleDetails();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: 30 }}
      className="absolute inset-x-2 bottom-2 bg-slate-950/95 border border-purple-500/40 rounded-3xl p-4.5 z-40 shadow-[0_-10px_35px_rgba(162,0,255,0.25)] text-left"
    >
      <div className="flex justify-between items-center mb-2.5">
        <span className={`text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r ${details.color} text-transparent bg-clip-text`}>
          Detalle del Ecosistema
        </span>
        <button onClick={onClose} className="text-gray-400 hover:text-white text-[11px] font-mono select-none px-2 py-0.5 rounded-lg bg-white/5 font-extrabold cursor-pointer">
          Cerrar
        </button>
      </div>

      <h4 className="text-sm font-black text-white tracking-tight mb-1">{details.title}</h4>
      <p className="text-[10px] text-gray-300 leading-relaxed mb-3.5">{details.desc}</p>
      
      <div className="space-y-1.5 mb-2.5">
        {details.perks.map((perk, idx) => (
          <div key={idx} className="flex items-center gap-1.5 text-[9px] font-semibold text-gray-200">
            <Sparkles className={`w-3 h-3 ${details.bulletColor} shrink-0`} />
            <span>{perk}</span>
          </div>
        ))}
      </div>
      
      <div className="flex justify-end pt-1">
        <button 
          onClick={onClose}
          className={`text-[9.5px] px-3.5 py-1.5 rounded-full font-bold text-white bg-gradient-to-r ${details.color} shadow-md flex items-center gap-1 tracking-wider uppercase cursor-pointer hover:opacity-90`}
        >
          <span>Seleccionar Rol</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};

// --- MAIN PORTAL VIEW COMPONENT ---
export const FuturisticMockups: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inicio' | 'comunidad' | 'roles' | 'tutorial'>('inicio');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [communityCategory, setCommunityCategory] = useState<'foros' | 'eventos' | 'consejos'>('foros');
  const [copiedText, setCopiedText] = useState(false);
  const [simulationState, setSimulationState] = useState<'idle' | 'routing' | 'complete'>('idle');

  const startRouteSimulation = () => {
    if (simulationState === 'routing') return;
    setSimulationState('routing');
    setTimeout(() => {
      setSimulationState('complete');
    }, 4500);
  };

  const handleCopyQR = () => {
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="w-full bg-[#030712] rounded-3xl p-6 lg:p-8 border border-indigo-500/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-left relative overflow-hidden">
      {/* Background neon glows */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Decorative cybernetic grid background icon lines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.3)_1px,transparent_1px)] bg-[size:24px_24px] opacity-10 pointer-events-none" />

      {/* Header section of the mockup gallery */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-indigo-500/10 pb-6 relative z-10">
        <div>
          <span className="text-xs font-bold text-cyan-405 text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-3 py-1 rounded-full uppercase tracking-widest font-mono">
            Rediseño UI Premium Nocturno
          </span>
          <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight mt-2.5 font-sans">
            Delivery Plus <span className="bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">Nocturnal Showcase</span>
          </h2>
          <p className="text-sm text-gray-400 mt-1 max-w-xl">
            Maquetas móviles con diseño visual futurista inspirado en interfaces de alta densidad. Fondos oscuros profundos, acentos de de neón y consistencia del branding Gustavo Bettiol.
          </p>
        </div>
        
        {/* Navigation buttons inside the viewport selector */}
        <div className="flex bg-slate-900/60 p-1 rounded-xl border border-gray-800 self-end">
          <button 
            onClick={() => { setActiveTab('inicio'); setSelectedRole(null); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'inicio' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
          >
            1. Inicio
          </button>
          <button 
            onClick={() => { setActiveTab('comunidad'); setSelectedRole(null); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'comunidad' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
          >
            2. Comunidad B2B
          </button>
          <button 
            onClick={() => { setActiveTab('roles'); setSelectedRole(null); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'roles' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
          >
            3. Roles
          </button>
          <button 
            onClick={() => { setActiveTab('tutorial'); setSelectedRole(null); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'tutorial' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
          >
            4. Tutorial final
          </button>
        </div>
      </div>

      {/* --- MOCKUP PANORAMA SHOWCASE (4 DEVICES SIDE-BY-SIDE ON DESKTOP, CAROUSEL RESPONSIVE) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 relative z-10">

        {/* ================= DEVICE 1: EXPERIENCIA BIENVENIDA / INICIO ================= */}
        <div className={`relative transition-all duration-500 ${activeTab === 'inicio' ? 'scale-102 ring-2 ring-cyan-400/50' : 'opacity-85 hover:opacity-100'}`}>
          <div className="absolute -top-3 left-4 bg-cyan-950/90 border border-cyan-800/60 font-mono text-[9px] text-cyan-400 font-extrabold px-2.5 py-0.5 rounded-full z-20 shadow-md">
            PANTALLA INICIO
          </div>
          
          {/* Smartphone outer body casing */}
          <div className="w-full max-w-[285px] mx-auto aspect-[9/18.5] bg-black rounded-[36px] p-2 border-[4.5px] border-slate-800 shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden relative group">
            {/* Camera notch cutout */}
            <div className="absolute top-1 inset-x-0 h-4 bg-black z-30 flex items-center justify-center pointer-events-none">
              <div className="w-16 h-2.5 bg-black rounded-b-lg flex items-center justify-around px-1">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
                <div className="w-6 h-0.5 rounded-full bg-slate-800"></div>
              </div>
            </div>

            {/* Viewport screen */}
            <div className="flex-1 bg-gradient-to-b from-[#050914] via-[#090b11] to-[#010103] flex flex-col justify-between pt-6 pb-2.5 px-3 relative overflow-hidden select-none">
              
              {/* Internal Status bar */}
              <div className="flex justify-between items-center text-[8px] font-semibold text-gray-500 px-1 hover:text-gray-400 shrink-0 select-none">
                <span>04:02 LTE</span>
                <div className="flex items-center gap-1">
                  <span className="text-[7.5px]">GPS active</span>
                  <div className="w-3.5 h-2 border border-gray-600 rounded-sm p-0.5 flex items-center">
                    <div className="h-full w-full bg-cyan-405 bg-cyan-400 rounded-2xs"></div>
                  </div>
                </div>
              </div>

              {/* Home App Header */}
              <div className="mt-2.5 text-left shrink-0">
                <span className="text-[9px] bg-cyan-950/30 text-cyan-400 font-bold tracking-widest uppercase border border-cyan-500/20 px-2 py-0.5 rounded-full">
                  Nocturnal Engine
                </span>
                <h3 className="text-base font-black text-white mt-1 uppercase tracking-tight flex items-center gap-1 font-sans">
                  <span>Delivery Plus</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
                </h3>
              </div>

              {/* Dynamic Futuristic Map simulation container */}
              <div className="w-full h-[180px] bg-slate-950/80 rounded-2xl border border-indigo-500/20 my-3 relative overflow-hidden flex flex-col justify-between p-2.5 shadow-inner">
                {/* Visual stylized futuristic grid system representation */}
                <div className="absolute inset-0 bg-[#090b14] bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-40" />
                
                {/* Map vector streets glowing in neon lines */}
                <svg className="absolute inset-0 w-full h-full opacity-60 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Streets */}
                  <path d="M 0 20 L 100 20 M 0 65 L 100 65 M 35 0 L 35 100 M 75 0 L 75 100" stroke="#101b2f" strokeWidth="2" />
                  <path d="M 10 50 L 90 50 M 50 10 L 50 90" stroke="#101b2f" strokeWidth="2.5" />
                  {/* Transit Route glowing blue/violet path */}
                  <path 
                    d="M 35 20 L 50 20 L 50 65 L 75 65" 
                    stroke="url(#routeGradient)" 
                    strokeWidth="3.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="shadow-[0_0_12px_rgba(34,111,255,0.7)]"
                    strokeDasharray={simulationState === 'routing' ? '6 3' : 'none'}
                    style={{ strokeDashoffset: simulationState === 'routing' ? -20 : 0 }}
                  />
                  <defs>
                    <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00f0ff" />
                      <stop offset="100%" stopColor="#a200ff" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Map Floating HUD Info Card */}
                <div className="relative z-10 shrink-0 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-cyan-500/20 shadow-lg text-[9px]">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-[7.5px] text-gray-400 font-sans">ORIGEN DETECTADO</span>
                    <span className="text-[7.5px] text-cyan-400 font-extrabold font-mono tracking-wider">LIVE ROUTE</span>
                  </div>
                  <strong className="text-white block font-sans truncate">Tu Ubicación (Buenos Aires, AR)</strong>
                </div>

                {/* Simulated markers inside the map */}
                <div className="absolute top-[13%] left-[30%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#00f0ff] animate-ping absolute" />
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 border border-white z-10 shadow-md" />
                </div>

                <div className="absolute top-[65%] left-[71%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                  <MapPin className="w-4 h-4 text-purple-500 drop-shadow-[0_0_6px_#a200ff] animate-bounce" />
                  <span className="text-[6.5px] bg-purple-950/92 border border-purple-800 text-purple-200 px-1 py-0.5 rounded font-bold uppercase mt-0.5">Destino</span>
                </div>

                {/* Bottom interactive GPS action */}
                <button 
                  onClick={startRouteSimulation}
                  className="relative z-10 w-full bg-slate-900/80 hover:bg-slate-900 text-white p-1 rounded-lg border border-purple-500/20 flex items-center justify-between pointer-events-auto cursor-pointer"
                >
                  <span className="text-[8px] text-gray-300 font-extrabold pl-1 select-none">
                    {simulationState === 'idle' && 'Simular ruta con GPS IA'}
                    {simulationState === 'routing' && 'Simulando trayecto...'}
                    {simulationState === 'complete' && 'Entrega Finalizada ✅'}
                  </span>
                  <div className="bg-purple-600/30 text-purple-300 p-0.5 rounded">
                    <Bike className={`w-3 h-3 ${simulationState === 'routing' ? 'animate-bounce' : ''}`} />
                  </div>
                </button>
              </div>

              {/* Beautiful rounded dashboard actions key interactive slots */}
              <div className="space-y-1.5 shrink-0">
                <button 
                  onClick={() => setActiveTab('comunidad')}
                  className="w-full bg-[#0b101c] hover:bg-[#11192b] border border-cyan-500/20 text-white rounded-xl py-2 px-3 text-[10px] font-black uppercase tracking-wider flex items-center justify-between transition-all shadow-[0_2px_10px_rgba(0,0,0,0.4)] pointer-events-auto cursor-pointer group"
                >
                  <span className="flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-cyan-400" />
                    Pedir Envío
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-400 transition-transform group-hover:translate-x-1" />
                </button>

                <div className="grid grid-cols-2 gap-1.5">
                  <button 
                    onClick={() => { setActiveTab('comunidad'); }}
                    className="bg-[#0b101c]/80 hover:bg-[#11192b] border border-purple-500/20 hover:border-purple-500/40 text-gray-200 rounded-xl py-1.5 px-2 text-[8.5px] font-bold uppercase tracking-wider transition-all pointer-events-auto cursor-pointer"
                  >
                    Órdenes
                  </button>
                  <button 
                    onClick={() => setActiveTab('comunidad')}
                    className="bg-[#0b101c]/80 hover:bg-[#11192b] border border-purple-500/20 hover:border-purple-500/40 text-gray-200 rounded-xl py-1.5 px-2 text-[8.5px] font-bold uppercase tracking-wider transition-all pointer-events-auto cursor-pointer"
                  >
                    Promociones
                  </button>
                </div>

                <div className="border-t border-slate-900 pt-2 pb-1">
                  <button 
                    onClick={startRouteSimulation}
                    className="w-full bg-gradient-to-r from-cyan-500 to-indigo-600 text-white rounded-xl py-2 px-1 text-[9.5px] font-black uppercase tracking-wider transition-all shadow-md mt-0.5 cursor-pointer select-none text-center block"
                  >
                    Nuevo Pedido B2B
                  </button>
                </div>
              </div>

              {/* --- STICKY LOGO AT EXTREME BOTTOM RIGHT --- */}
              <div className="flex justify-end pt-1 grow">
                <GustavoBettiolLogo />
              </div>

            </div>
          </div>
        </div>

        {/* ================= DEVICE 2: PORTAL DE COMUNIDAD B2B ================= */}
        <div className={`relative transition-all duration-500 ${activeTab === 'comunidad' ? 'scale-102 ring-2 ring-cyan-400/50' : 'opacity-85 hover:opacity-100'}`}>
          <div className="absolute -top-3 left-4 bg-cyan-950/90 border border-cyan-800/60 font-mono text-[9px] text-cyan-400 font-extrabold px-2.5 py-0.5 rounded-full z-20 shadow-md">
            PANTALLA COMUNIDAD
          </div>
          
          <div className="w-full max-w-[285px] mx-auto aspect-[9/18.5] bg-black rounded-[36px] p-2 border-[4.5px] border-slate-800 shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden relative group">
            {/* Viewport screen */}
            <div className="flex-1 bg-gradient-to-b from-[#050914] via-[#090b11] to-[#010103] flex flex-col justify-between pt-6 pb-2.5 px-3 relative overflow-hidden select-none">
              
              {/* Internal Status bar */}
              <div className="flex justify-between items-center text-[8px] font-semibold text-gray-500 px-1 hover:text-gray-400 shrink-0 select-none">
                <span>04:02 LTE</span>
                <span className="text-[7.5px] text-cyan-400">Comunidad Activa</span>
              </div>

              <div className="mt-2 text-left shrink-0">
                <h3 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-1.5 font-sans">
                  <span>Comunidad</span>
                  <Users className="w-4 h-4 text-cyan-455 text-cyan-400" />
                </h3>
                <p className="text-[8px] text-gray-400 leading-normal mt-0.5">Estadísticas, networking, consejos y foros compartidos.</p>
              </div>

              {/* Categorías selectors bar inside screen */}
              <div className="grid grid-cols-3 gap-1 my-2.5 shrink-0">
                <button 
                  onClick={() => setCommunityCategory('foros')}
                  className={`py-1 text-[8px] font-black uppercase rounded-lg border tracking-wider transition-all cursor-pointer pointer-events-auto ${communityCategory === 'foros' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm' : 'bg-[#0b101c]/60 border-transparent text-gray-400'}`}
                >
                  📣 Foros
                </button>
                <button 
                  onClick={() => setCommunityCategory('eventos')}
                  className={`py-1 text-[8px] font-black uppercase rounded-lg border tracking-wider transition-all cursor-pointer pointer-events-auto ${communityCategory === 'eventos' ? 'bg-purple-650/20 bg-purple-900/20 border-purple-500 text-purple-300 shadow-sm' : 'bg-[#0b101c]/60 border-transparent text-gray-400'}`}
                >
                  📅 Eventos
                </button>
                <button 
                  onClick={() => setCommunityCategory('consejos')}
                  className={`py-1 text-[8px] font-black uppercase rounded-lg border tracking-wider transition-all cursor-pointer pointer-events-auto ${communityCategory === 'consejos' ? 'bg-cyan-600/20 border-cyan-500 text-cyan-300 shadow-sm' : 'bg-[#0b101c]/60 border-transparent text-gray-400'}`}
                >
                  💡 Consejos
                </button>
              </div>

              {/* Cards block (List of interactive events / consejos) */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-0.5 font-sans my-1 text-left select-none max-h-[190px] scrollbar-none">
                
                {communityCategory === 'foros' && (
                  <>
                    {/* Card 1 */}
                    <div className="bg-[#0b101c]/80 hover:bg-[#11192b] border border-gray-800/80 rounded-xl p-2.5 transition-all text-left">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[7px] text-indigo-400 font-extrabold uppercase tracking-wide">Foro de Choferes</span>
                        <div className="flex items-center gap-1 text-[7px] text-gray-500 font-mono">
                          <Clock className="w-2.5 h-2.5" />
                          <span>Hace 10m</span>
                        </div>
                      </div>
                      <h4 className="text-[10px] font-black text-white leading-normal">Optimización de autonomía en motos</h4>
                      <p className="text-[8.5px] text-gray-400 leading-normal mt-0.5">Carlos G: "El bono climático de lluvia rinde muchísimo más..."</p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-[#0b101c]/85 hover:bg-[#11192b] border border-gray-800/80 rounded-xl p-2.5 transition-all text-left">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[7px] text-cyan-400 font-extrabold uppercase tracking-wide">General</span>
                        <span className="text-[7px] text-gray-500 font-mono">Hace 2h</span>
                      </div>
                      <h4 className="text-[10px] font-black text-white leading-normal">Lanzamiento oficial en Gran Buenos Aires</h4>
                      <p className="text-[8.5px] text-gray-400 leading-normal mt-0.5">Soporte Delivery Plus: "Habilitamos las transferencias automatizadas..."</p>
                    </div>
                  </>
                )}

                {communityCategory === 'eventos' && (
                  <>
                    <div className="bg-[#0b101c]/80 hover:bg-[#11192b] border border-gray-800/85 rounded-xl p-2.5 text-left relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-12 h-12 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[7.5px] text-purple-400 font-extrabold uppercase tracking-wide">Reunión</span>
                        <span className="text-[7px] bg-red-500/10 text-red-400 border border-red-500/20 px-1 py-0.5 rounded font-bold font-mono">HOY 19h</span>
                      </div>
                      <h4 className="text-[10.5px] font-black text-white leading-tight">Reunión General de Emprendedores</h4>
                      <p className="text-[8.5px] text-gray-400 leading-relaxed mt-0.5">Coordinación de envíos seguros de platos térmicos y control de embalaje.</p>
                      <div className="flex items-center gap-1 mt-2 font-mono text-[7.5px] text-purple-300 font-extrabold">
                        <Calendar className="w-2.5 h-2.5" />
                        <span>Link de Zoom disponible abajo</span>
                      </div>
                    </div>

                    <div className="bg-[#0b101c]/80 hover:bg-[#11192b] border border-gray-800/85 rounded-xl p-2.5 text-left">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[7.5px] text-purple-400 font-extrabold uppercase tracking-wide">Webinar</span>
                        <span className="text-[7px] text-gray-400 font-mono">Mañana 15:30</span>
                      </div>
                      <h4 className="text-[10.5px] font-black text-white leading-tight">Finanzas de Ecosistema con Split 80/20</h4>
                      <p className="text-[8.5px] text-gray-400 leading-normal mt-0.5">Estrategías de amortización y fiscalidad para choferes independientes.</p>
                    </div>
                  </>
                )}

                {communityCategory === 'consejos' && (
                  <>
                    <div className="bg-[#0b101c]/80 hover:bg-[#11192b] border border-gray-800/85 rounded-xl p-2.5 text-left">
                      <div className="flex items-center gap-1 mb-1 text-[7.5px] text-emerald-400 font-black uppercase">
                        <Shield className="w-2.5 h-2.5" />
                        <span>Tips de Seguridad</span>
                      </div>
                      <h4 className="text-[10.5px] font-black text-white leading-normal">Tips para Envíos Climas Lluvia</h4>
                      <p className="text-[8.5px] text-gray-400 leading-normal mt-0.5">Usa embalaje de triple burbuja. El sellado al vacío preserva la temperatura de los platos.</p>
                    </div>

                    <div className="bg-[#0b101c]/80 hover:bg-[#11192b] border border-gray-800/85 rounded-xl p-2.5 text-left">
                      <div className="flex items-center gap-1 mb-1 text-[7.5px] text-cyan-400 font-black uppercase">
                        <Award className="w-2.5 h-2.5" />
                        <span>Logística</span>
                      </div>
                      <h4 className="text-[10.5px] font-black text-white leading-normal">Optimizar tiempos de carga</h4>
                      <p className="text-[8.5px] text-gray-400 leading-normal mt-0.5">Al llegar al establecimiento comercial del negocio, revisa el remito digital en tu celular.</p>
                    </div>
                  </>
                )}

              </div>

              {/* Botón ver más en neón */}
              <div className="pt-2 border-t border-slate-900 shrink-0">
                <button 
                  onClick={() => alert(`Sincronización de Comunidad: cargando más hilos foro de la tabla local...`)}
                  className="w-full bg-[#0b101c] hover:bg-[#11192b] border border-purple-500/25 hover:border-purple-500/40 text-purple-300 font-mono text-[9px] py-1.5 rounded-lg transition-all text-center block cursor-pointer select-none font-extrabold uppercase mt-0.5"
                >
                  Ver Más Hilos
                </button>
              </div>

              {/* --- STICKY LOGO AT EXTREME BOTTOM RIGHT --- */}
              <div className="flex justify-end pt-1 grow">
                <GustavoBettiolLogo />
              </div>

            </div>
          </div>
        </div>

        {/* ================= DEVICE 3: PORTAL DE ROLES DEL ECOSISTEMA ================= */}
        <div className={`relative transition-all duration-500 ${activeTab === 'roles' ? 'scale-102 ring-2 ring-cyan-400/50' : 'opacity-85 hover:opacity-100'}`}>
          <div className="absolute -top-3 left-4 bg-cyan-950/90 border border-cyan-800/60 font-mono text-[9px] text-cyan-400 font-extrabold px-2.5 py-0.5 rounded-full z-20 shadow-md">
            SELECCIONADOR ROLES
          </div>

          <div className="w-full max-w-[285px] mx-auto aspect-[9/18.5] bg-black rounded-[36px] p-2 border-[4.5px] border-slate-800 shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden relative group">
            {/* Viewport screen */}
            <div className="flex-1 bg-gradient-to-b from-[#050914] via-[#090b11] to-[#010103] flex flex-col justify-between pt-6 pb-2.5 px-3 relative overflow-hidden select-none">
              
              {/* Internal Status bar */}
              <div className="flex justify-between items-center text-[8px] font-semibold text-gray-500 px-1 hover:text-gray-400 shrink-0 select-none">
                <span>04:02 LTE</span>
                <span className="text-[7.5px] text-purple-400">Roles de Red</span>
              </div>

              <div className="mt-2 text-left shrink-0">
                <h3 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-1.5 font-sans">
                  <span>Roles B2B</span>
                  <Layers className="w-4 h-4 text-purple-455 text-purple-400" />
                </h3>
                <p className="text-[8px] text-gray-400 leading-normal mt-0.5">Elige un perfil para ver su lógica financiera y operar.</p>
              </div>

              {/* Bento cells column for roles with glowing hover styles */}
              <div className="flex-1 flex flex-col gap-1.5 my-3 relative overflow-hidden text-left max-h-[220px]">
                
                {/* 1. Usuario */}
                <button 
                  onClick={() => setSelectedRole('usuario')}
                  className={`flex items-center gap-3 bg-[#0b101c]/80 border rounded-xl p-2 text-left transition-all pointer-events-auto cursor-pointer ${selectedRole === 'usuario' ? 'border-blue-400 bg-blue-950/20 shadow-[0_0_12px_rgba(34,111,255,0.35)]' : 'border-gray-800 hover:border-blue-500/40 hover:bg-[#0e1628]'}`}
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-550 border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[10.5px] font-black text-white leading-none">Usuario Persona</h4>
                    <span className="text-[7.5px] text-blue-400 font-mono tracking-wide">CLIENTE EXPRESS</span>
                  </div>
                </button>

                {/* 2. Negocio */}
                <button 
                  onClick={() => setSelectedRole('negocio')}
                  className={`flex items-center gap-3 bg-[#0b101c]/80 border rounded-xl p-2 text-left transition-all pointer-events-auto cursor-pointer ${selectedRole === 'negocio' ? 'border-purple-400 bg-purple-950/20 shadow-[0_0_12px_rgba(162,0,255,0.35)]' : 'border-gray-800 hover:border-purple-500/40 hover:bg-[#121324]'}`}
                >
                  <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[10.5px] font-black text-white leading-none">Negocio Contratado</h4>
                    <span className="text-[7.5px] text-purple-400 font-mono tracking-wide">ESTABLECIMIENTOS B2B</span>
                  </div>
                </button>

                {/* 3. Repartidor */}
                <button 
                  onClick={() => setSelectedRole('repartidor')}
                  className={`flex items-center gap-3 bg-[#0b101c]/80 border rounded-xl p-2 text-left transition-all pointer-events-auto cursor-pointer ${selectedRole === 'repartidor' ? 'border-indigo-400 bg-indigo-950/20 shadow-[0_0_12px_rgba(99,102,241,0.35)]' : 'border-gray-800 hover:border-indigo-500/40 hover:bg-[#10142a]'}`}
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-455 text-indigo-400 shrink-0">
                    <Bike className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[10.5px] font-black text-white leading-none">Repartidor (Chofer)</h4>
                    <span className="text-[7.5px] text-indigo-400 font-mono tracking-wide">RIDER AUTÓNOMO B2B</span>
                  </div>
                </button>

                {/* 4. Emprendedor */}
                <button 
                  onClick={() => setSelectedRole('emprendedor')}
                  className={`flex items-center gap-3 bg-[#0b101c]/80 border rounded-xl p-2 text-left transition-all pointer-events-auto cursor-pointer ${selectedRole === 'emprendedor' ? 'border-pink-400 bg-pink-950/20 shadow-[0_0_12px_rgba(244,63,94,0.35)]' : 'border-gray-800 hover:border-pink-500/40 hover:bg-[#191124]'}`}
                >
                  <div className="w-7 h-7 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[10.5px] font-black text-white leading-none">Emprendedor Libre</h4>
                    <span className="text-[7.5px] text-pink-400 font-mono tracking-wide">MICRO-LOGÍSTICA</span>
                  </div>
                </button>

                {/* Animate Role Slide Detail Overlays inside screen */}
                <AnimatePresence>
                  {selectedRole && (
                    <RoleDetailModal role={selectedRole} onClose={() => setSelectedRole(null)} />
                  )}
                </AnimatePresence>

              </div>

              {/* --- STICKY LOGO AT EXTREME BOTTOM RIGHT --- */}
              <div className="flex justify-end pt-1 grow">
                <GustavoBettiolLogo />
              </div>

            </div>
          </div>
        </div>

        {/* ================= DEVICE 4: TUTORIAL FINAL / COMUNIDAD FINAL CON QR ================= */}
        <div className={`relative transition-all duration-500 ${activeTab === 'tutorial' ? 'scale-102 ring-2 ring-cyan-400/50' : 'opacity-85 hover:opacity-100'}`}>
          <div className="absolute -top-3 left-4 bg-cyan-950/90 border border-cyan-800/60 font-mono text-[9px] text-cyan-400 font-extrabold px-2.5 py-0.5 rounded-full z-20 shadow-md">
            PANTALLA TUTORIAL Y QR
          </div>

          <div className="w-full max-w-[285px] mx-auto aspect-[9/18.5] bg-black rounded-[36px] p-2 border-[4.5px] border-slate-800 shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden relative group">
            {/* Viewport screen */}
            <div className="flex-1 bg-gradient-to-b from-[#050914] via-[#090b11] to-[#010103] flex flex-col justify-between pt-6 pb-2.5 px-3 relative overflow-hidden select-none">
              
              {/* Internal Status bar */}
              <div className="flex justify-between items-center text-[8px] font-semibold text-gray-500 px-1 hover:text-gray-400 shrink-0 select-none">
                <span>04:02 LTE</span>
                <span className="text-[7.5px] text-emerald-455 text-emerald-400">Instalación Completa</span>
              </div>

              <div className="mt-2 text-left shrink-0">
                <h3 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-1 font-sans">
                  <span>Tutorial Final</span>
                  <Award className="w-4 h-4 text-cyan-400" />
                </h3>
                <p className="text-[8px] text-gray-400 mt-0.5">La app se instaló de forma correcta. Únete al servidor local B2B:</p>
              </div>

              {/* Central Box for QR Code & scanning line */}
              <div className="my-3 flex-1 flex flex-col items-center justify-center bg-slate-950/80 border border-purple-500/25 p-4 rounded-2xl relative overflow-hidden shadow-inner max-h-[160px]">
                <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-[bounce_3s_infinite]" />
                
                {/* Simulated QR block code inside cell wrapper */}
                <div 
                  onClick={handleCopyQR}
                  title="Copiar Link de Conexión"
                  className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:border-cyan-500/30 transition-colors pointer-events-auto cursor-pointer relative shadow-md group flex items-center justify-center scale-95"
                >
                  <QrCode className="w-20 h-20 text-cyan-405 text-cyan-400 transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition-opacity">
                    <span className="text-[8.5px] font-black text-cyan-300 font-mono text-center tracking-wide px-1">
                      {copiedText ? '¡COPIADO! ✅' : 'COPIAR HOST'}
                    </span>
                  </div>
                </div>

                <span className="text-[7.5px] text-gray-500 font-mono tracking-wider text-center mt-2 font-black uppercase">
                  ESCANEAR EN SU DISPOSITIVO
                </span>
                <span className="text-[6.5px] text-gray-600 block font-mono">
                  host:192.168.1.100:3000
                </span>
              </div>

              {/* Call to action "Comenzar" button with shine gradient */}
              <div className="shrink-0 space-y-1.5 text-center mt-1">
                <p className="text-[8px] text-gray-350 text-gray-400 leading-normal max-w-[220px] mx-auto">
                  Escanea el código QR con tu celular en la misma red o ingresa desde tu navegador.
                </p>

                <button 
                  onClick={() => alert('¡Ecosistema iniciado! Puedes publicar ordenes desde los portales web para verlas sonar.')}
                  className="relative overflow-hidden w-full bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white rounded-xl py-2 px-1 text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(162,0,255,0.4)] cursor-pointer block text-center"
                >
                  {/* Subtle shine glint overlay */}
                  <span className="absolute inset-0 w-1/3 bg-white/20 -skew-x-12 translate-x-[-150%] animate-[shimmer_4s_infinite]" />
                  Comenzar
                </button>
              </div>

              {/* --- STICKY LOGO AT EXTREME BOTTOM RIGHT --- */}
              <div className="flex justify-end pt-1 grow">
                <GustavoBettiolLogo />
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Stylized custom shimmer animation for the comenzar button */}
      <style>{`
        @keyframes shimmer {
          0% { transform: skewX(-12deg) translateX(-150%); }
          50% { transform: skewX(-12deg) translateX(300%); }
          100% { transform: skewX(-12deg) translateX(300%); }
        }
      `}</style>

    </div>
  );
};
