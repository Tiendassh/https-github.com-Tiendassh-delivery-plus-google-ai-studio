import React, { useState } from 'react';
import { MapPin, Navigation, Map, CloudRain, Sun, Wind, Flame } from 'lucide-react';

interface ArgentinaMapProps {
  gpsSimulating: boolean;
  gpsProgress: number;
}

interface RegionNode {
  id: string;
  name: string;
  x: number;
  y: number;
  weather: 'sunny' | 'rainy' | 'windy' | 'hot';
  multiplier: number;
  activeOrders: number;
  provincias: string;
}

export const ArgentinaMap: React.FC<ArgentinaMapProps> = ({
  gpsSimulating,
  gpsProgress
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('amba');

  // Interactive cities across Argentina with their B2B status
  const regions: RegionNode[] = [
    { id: 'amba', name: 'AMBA & CABA', x: 67, y: 46, weather: 'rainy', multiplier: 1.5, activeOrders: 14, provincias: 'Buenos Aires' },
    { id: 'cordoba', name: 'Córdoba Capital', x: 52, y: 32, weather: 'sunny', multiplier: 1.0, activeOrders: 6, provincias: 'Córdoba' },
    { id: 'rosario', name: 'Rosario Nodo B2B', x: 62, y: 39, weather: 'windy', multiplier: 1.2, activeOrders: 5, provincias: 'Santa Fe' },
    { id: 'mendoza', name: 'Mendoza Logística', x: 42, y: 38, weather: 'hot', multiplier: 1.3, activeOrders: 4, provincias: 'Mendoza' },
    { id: 'patagonia', name: 'Neuquén-Bariloche', x: 44, y: 68, weather: 'windy', multiplier: 1.2, activeOrders: 2, provincias: 'Neuquén / Río Negro' }
  ];

  const activeNode = regions.find(r => r.id === selectedRegion) || regions[0];

  const getWeatherIcon = (type: string) => {
    switch (type) {
      case 'rainy': return <CloudRain className="w-4 h-4 text-blue-brand animate-bounce" />;
      case 'windy': return <Wind className="w-4 h-4 text-cyan-400" />;
      case 'hot': return <Flame className="w-4 h-4 text-red-success text-[#FF3B30] animate-pulse" />;
      case 'sunny':
      default:
        return <Sun className="w-4 h-4 text-green-success" />;
    }
  };

  const getMultiplierColor = (mul: number) => {
    if (mul >= 1.5) return 'text-[#FF3B30]';
    if (mul >= 1.2) return 'text-[#FFC107]';
    return 'text-green-success';
  };

  return (
    <div className="flex-1 flex flex-col justify-end relative bg-[#0C121D] shadow-inner rounded-3xl overflow-hidden border border-gray-brand min-h-[350px]">
      
      {/* 1. Header label indicating physical map location */}
      <div className="absolute top-3 left-3 right-3 z-10 bg-black/75 backdrop-blur-md rounded-xl p-2.5 border border-gray-800 flex items-center justify-between text-[11px] font-sans">
        <div className="flex items-center gap-1.5">
          <Map className="w-3.5 h-3.5 text-blue-brand" />
          <span className="font-bold text-white uppercase tracking-tight">Ecosistema Argentina</span>
        </div>
        <span className="text-[9px] bg-blue-brand/20 text-blue-brand px-1.5 py-0.5 rounded font-mono font-bold">
          GPS Activo
        </span>
      </div>

      {/* 2. SVG Vector Map of Argentina & Nodes */}
      <div className="absolute inset-x-0 top-0 bottom-24 z-0 flex items-center justify-center bg-radial-at-c from-[#141F32] via-[#0A0F1A] to-[#05080E] p-4 select-none">
        <svg 
          viewBox="10 -5 90 110" 
          className="w-full h-full stroke-gray-850 opacity-90 transition-all duration-500"
        >
          {/* Coordinates Grid mapping background coordinates */}
          <g className="opacity-20 stroke-gray-900 stroke-[0.25]" strokeDasharray="3 3">
            <line x1="20" y1="0" x2="20" y2="100" />
            <line x1="40" y1="0" x2="40" y2="100" />
            <line x1="60" y1="0" x2="60" y2="100" />
            <line x1="80" y1="0" x2="80" y2="100" />
            <line x1="0" y1="20" x2="100" y2="20" />
            <line x1="0" y1="40" x2="100" y2="40" />
            <line x1="0" y1="60" x2="100" y2="60" />
            <line x1="0" y1="80" x2="100" y2="80" />
          </g>

          {/* Styled visual silhouette of Argentina boundary */}
          <path
            d="M 52 4 
               C 56 4, 61 2, 65 4 
               C 67 4, 71 3, 72 6 
               C 74 10, 77 12, 79 17 
               C 81 22, 85 24, 82 28 
               C 79 32, 70 34, 68 36
               C 67 39, 69 41, 71 43
               C 74 46, 75 49, 73 52
               C 70 55, 66 53, 63 56
               C 60 59, 62 64, 60 67
               C 58 72, 54 75, 52 79
               C 49 84, 46 87, 44 91
               C 42 95, 41 97, 39 96
               C 38 95, 37 92, 36 88
               C 35 83, 38 78, 38 74
               C 38 69, 41 65, 40 60
               C 39 55, 36 50, 36 45
               C 36 40, 39 35, 39 30
               C 38 25, 40 21, 41 17
               C 41 12, 45 8, 48 6
               Z"
            className="fill-[#1A2536] stroke-blue-brand/35 stroke-[0.8] transition-all hover:fill-[#202E42]"
            style={{ filter: 'drop-shadow(0px 4px 12px rgba(0, 123, 255, 0.15))' }}
          />

          {/* Active path indicator path for deliveries inside Buenos Aires (AMBA) */}
          {gpsSimulating && (
            <g>
              {/* Route line within AMBA */}
              <path 
                d="M 64 43 L 67 46" 
                className="stroke-blue-brand stroke-[1.2] stroke-linecap-round fill-none opacity-85"
                strokeDasharray="1.5 1.5"
              />
              <path 
                d="M 67 46 L 70 49" 
                className="stroke-green-success stroke-[1.2] stroke-linecap-round fill-none opacity-80"
                strokeDasharray="1.5 1.5"
              />
              
              {/* Pulsing route target */}
              <circle cx="70" cy="49" r="2" className="fill-green-success animate-ping" />
              
              {/* Animated delivery driver dots */}
              <circle 
                cx={64 + (70 - 64) * (gpsProgress / 100)} 
                cy={43 + (49 - 43) * (gpsProgress / 100)} 
                r="1.8" 
                className="fill-white stroke-blue-brand stroke-[0.8]"
              />
            </g>
          )}

          {/* Interactive mapped cities */}
          {regions.map((region) => (
            <g 
              key={region.id} 
              className="cursor-pointer group"
              onClick={() => setSelectedRegion(region.id)}
            >
              {/* Outer pulsing ring warning style if multipliers are high */}
              <circle 
                cx={region.x} 
                cy={region.y} 
                r={region.id === selectedRegion ? 3.5 : 2.2} 
                className={`transition-all duration-300 fill-none stroke-[0.5] ${
                  region.id === selectedRegion 
                    ? 'stroke-blue-brand animate-pulse' 
                    : 'stroke-gray-400 opacity-60 group-hover:opacity-100'
                }`}
                style={{ strokeWidth: region.id === selectedRegion ? 1.5 : 0.6 }}
              />

              {/* Solid inner center indicator */}
              <circle 
                cx={region.x} 
                cy={region.y} 
                r="1.2" 
                className={`transition-all duration-300 ${
                  region.id === selectedRegion 
                    ? 'fill-blue-brand' 
                    : region.weather === 'rainy' ? 'fill-blue-400' : 'fill-green-success'
                }`}
              />

              {/* Mini tag labels inside the SVG */}
              <text 
                x={region.x + 3.5} 
                y={region.y + 1} 
                className={`font-sans font-bold select-none transition-all ${
                  region.id === selectedRegion
                    ? 'fill-white text-[3px]' 
                    : 'fill-gray-400 text-[2.5px] opacity-75'
                }`}
              >
                {region.name}
              </text>
            </g>
          ))}
        </svg>

        {/* Floating Mini Compass Rose */}
        <div className="absolute bottom-2 right-4 bg-black/60 border border-gray-800 p-1.5 rounded-lg flex items-center justify-center pointer-events-none">
          <Navigation className="w-3.5 h-3.5 text-blue-brand rotate-45 transform" />
        </div>
      </div>

      {/* 3. Detailed control HUD beneath Argentina Map */}
      <div className="z-10 bg-[#161D2A]/95 backdrop-blur-md rounded-2xl p-3 border border-gray-800 text-[10px] w-full space-y-2 shrink-0">
        <div className="flex items-center justify-between border-b border-gray-800/80 pb-1.5">
          <div>
            <span className="text-[9px] text-gray-400 block uppercase font-mono font-bold">ZONA SELECCIONADA</span>
            <span className="font-bold text-white text-[11px] font-display flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-brand" />
              {activeNode.name} ({activeNode.provincias})
            </span>
          </div>
          <div className="flex bg-black/35 px-2.5 py-1 rounded-lg items-center gap-1 font-mono">
            <span className="text-gray-400 text-[8px]">IA CLIMA:</span>
            {getWeatherIcon(activeNode.weather)}
            <span className="text-white font-bold uppercase text-[8px]">{activeNode.weather === 'rainy' ? 'Lluvia' : activeNode.weather === 'windy' ? 'Viento' : activeNode.weather === 'hot' ? 'Calor' : 'Normal'}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono leading-tight">
          <div className="bg-black/20 p-2 rounded-lg border border-gray-850">
            <span className="text-gray-400 block text-[8px]">MULTIPLICADOR IA</span>
            <strong className={`text-xs font-bold ${getMultiplierColor(activeNode.multiplier)}`}>
              {activeNode.multiplier}x Tarifa Neto
            </strong>
          </div>
          <div className="bg-black/20 p-2 rounded-lg border border-gray-850">
            <span className="text-gray-400 block text-[8px]">PEDIDOS EN RUTA</span>
            <strong className="text-xs text-white font-bold">
              {activeNode.activeOrders} B2B pedidos
            </strong>
          </div>
        </div>

        {gpsSimulating && (
          <div className="bg-blue-brand/10 p-2 rounded-lg border border-blue-brand/20 space-y-1">
            <div className="flex justify-between items-center text-[9px] font-mono">
              <span className="text-blue-brand font-bold animate-pulse">REPARTIDOR EN CURSO (ARGENTINA GPS)</span>
              <span className="text-white font-bold">{Math.round(gpsProgress)}%</span>
            </div>
            <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-brand h-full transition-all duration-300" style={{ width: `${gpsProgress}%` }} />
            </div>
            <span className="text-gray-400 text-[8px] block font-medium">Tracking: Hub Central ↔ Zona de Reparto Express</span>
          </div>
        )}
      </div>
    </div>
  );
};
