import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Mic, 
  MicOff, 
  Play, 
  Volume2, 
  VolumeX,
  CheckCircle2, 
  Command,
  MessageSquare,
  Activity,
  Sliders,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

interface Turno {
  id: number;
  comercio_nombre: string;
  direccion: string;
  fecha: string;
  horario: string;
  monto_total: number;
  monto_repartidor: number;
  monto_plataforma: number;
  estado: 'disponible' | 'confirmado' | 'en_progreso' | 'completado';
}

interface EntregaUnica {
  id: number;
  emprendedor_nombre: string;
  direccion_origen: string;
  direccion_destino: string;
  tamano: 'pequeño' | 'mediano' | 'grande';
  monto_total: number;
  monto_repartidor: number;
  monto_plataforma: number;
  estado: 'disponible' | 'asignado' | 'recolectado' | 'en_camino' | 'entregado';
}

interface AIChatAssistantProps {
  turnos: Turno[];
  setTurnos: React.Dispatch<React.SetStateAction<Turno[]>>;
  entregas: EntregaUnica[];
  setEntregas: React.Dispatch<React.SetStateAction<EntregaUnica[]>>;
  logEvent: (msg: string, type?: 'info' | 'success' | 'warn' | 'error') => void;
  triggerNotification: (title: string, desc: string, icon: string) => void;
  weatherCondition: string;
  multiplier: number;
}

interface ChatMessage {
  id: number;
  sender: 'usuario' | 'ia';
  tipo: 'texto' | 'audio';
  contenido: string;
  transcription?: string;
  audioDuration?: string;
  entidadCreada?: { type: 'turno' | 'entrega'; id: number; nombre: string };
  timestamp: string;
}

export const AIChatAssistant: React.FC<AIChatAssistantProps> = ({
  turnos,
  setTurnos,
  entregas,
  setEntregas,
  logEvent,
  triggerNotification,
  weatherCondition,
  multiplier
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'ia',
      tipo: 'texto',
      contenido: '¡Hola! Bienvenido al **Despachador Inteligente** al estilo **Uber B2B**. 🤖✈️ Estoy lista para automatizar turnos y envíos de forma instantánea. Conversa conmigo de manera natural por **mensajes de texto** o utiliza la simulación de **notas de voz para activar el motor de voz clonada** para pruebas del vendedor IA.',
      timestamp: 'Ahora'
    }
  ]);
  
  const [textInput, setTextInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [userRole, setUserRole] = useState<'comercio' | 'emprendedor'>('comercio');

  // Cloned Voice Custom State Options
  const [voiceProfile, setVoiceProfile] = useState<'carlos' | 'agustina' | 'vendedor_bot'>('carlos');
  const [voicePitch, setVoicePitch] = useState<number>(0.85); // Deeper premium operator sound
  const [voiceRate, setVoiceRate] = useState<number>(0.95);  // Professional speed pace
  const [isPlayingVoice, setIsPlayingVoice] = useState<boolean>(false);
  const [activeSpeechText, setActiveSpeechText] = useState<string>('');
  const [isFetchingVoice, setIsFetchingVoice] = useState<boolean>(false);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);

  // Dynamic ElevenLabs Override Credentials
  const [customApiKey, setCustomApiKey] = useState<string>(() => {
    const saved = localStorage.getItem('elevenlabs_custom_key') || '';
    if (saved === '75154e94ecb5c3507dcfd60e416e9b5cbdc03ef9a2d636a0ed39493fe2058434') {
      return '7b55c915bb8d4340967067f22da1d64c3735e244df78448274519ae7a112afef';
    }
    return saved;
  });
  const [customVoiceId, setCustomVoiceId] = useState<string>(() => {
    const saved = localStorage.getItem('elevenlabs_custom_voice_id');
    if (!saved || saved === 'p7AwDmKvTdoHTBuueGvP') {
      return '4wDRKlxcHNOFO5kBvE81';
    }
    return saved;
  });
  const [apiError, setApiError] = useState<string | null>(null);
  const [showConfigCollapse, setShowConfigCollapse] = useState<boolean>(false);

  // Auto-sync custom ElevenLabs config
  useEffect(() => {
    localStorage.setItem('elevenlabs_custom_key', customApiKey);
  }, [customApiKey]);

  useEffect(() => {
    localStorage.setItem('elevenlabs_custom_voice_id', customVoiceId);
  }, [customVoiceId]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const audioIntervalRef = useRef<any>(null);
  const [waves, setWaves] = useState<number[]>([15, 30, 10, 45, 20, 12, 35, 8]);

  // Handle Autoscroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  // Audio recording simulation timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingSeconds(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  // Animated sound waves visualizer loop
  useEffect(() => {
    if (isRecording || isPlayingVoice || isThinking) {
      audioIntervalRef.current = setInterval(() => {
        setWaves(Array.from({ length: 12 }, () => Math.floor(Math.random() * 40) + 5));
      }, 110);
    } else {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      setWaves([12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12]);
    }
    return () => {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    };
  }, [isRecording, isPlayingVoice, isThinking]);

  // Cloned voice speech synthesizer engine utilizing ElevenLabs and native fallback
  const speakClonedVoice = async (textToVocalize: string) => {
    if (typeof window === 'undefined') return;

    // First stop any former speech and clear any previous errors
    stopSpeakingClonedVoice();
    setApiError(null);

    // Clean markdown, symbols or headers before vocalization
    const cleanText = textToVocalize
      .replace(/\s\*/g, '')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/#\d+/g, 'número')
      .replace(/[\*\#\@\_]/g, '')
      .trim();

    if (!cleanText) return;

    setIsFetchingVoice(true);
    logEvent(`Iniciando síntesis de voz clonada de ElevenLabs: "${cleanText.substring(0, 45)}..."`, 'info');

    try {
      // 1. Try ElevenLabs API endpoint on our fullstack proxy server
      const response = await fetch('/api/elevenlabs/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: cleanText,
          apiKey: customApiKey,
          voiceId: customVoiceId,
          voiceProfile: voiceProfile
        }),
      });

      if (!response.ok) {
        let errMessage = `HTTP ${response.status} - ${response.statusText}`;
        try {
          const errData = await response.json();
          if (errData && errData.details) {
            errMessage = errData.details;
          }
        } catch (_) {}
        throw new Error(errMessage);
      }

      // Check if server applied an automatic free voice fallback
      const fallbackHeaderVal = response.headers.get('x-applied-fallback-voice');
      const fallbackVoiceIdVal = response.headers.get('x-fallback-used-id');
      const isFallbackUsed = fallbackHeaderVal === 'true';

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      activeAudioRef.current = audio;

      audio.onplay = () => {
        setIsPlayingVoice(true);
        setIsFetchingVoice(false);
        setActiveSpeechText(cleanText);
        if (isFallbackUsed) {
          const fallbackName = fallbackVoiceIdVal === '21m00Tcm4TlvDq8ikWAM' ? 'Rachel' : 'Antoni';
          logEvent(`Redirección de Voz: Se utilizó una voz gratuita oficial (${fallbackName}) debido a las políticas del plan Free de ElevenLabs para voces de biblioteca`, 'warn');
        } else {
          logEvent(`Venta en curso con Voz Clonada de ElevenLabs (Clon #${customVoiceId.substring(0, 8)} - ${voiceProfile.toUpperCase()})`, "success");
        }
      };

      audio.onended = () => {
        setIsPlayingVoice(false);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = (e) => {
        console.error("Audio playback error", e);
        setIsPlayingVoice(false);
        fallbackToWebSpeech(cleanText);
      };

      await audio.play();

    } catch (err: any) {
      console.warn("ElevenLabs proxy failed, falling back to clean browser WebSpeech synthesis...", err.message);
      setIsFetchingVoice(false);

      // Parse specific raw ElevenLabs errors to help with custom diagnostics
      const rawErrorText = err.message || "";
      let parsedMessage = rawErrorText;
      
      if (rawErrorText.includes("missing_permissions") || rawErrorText.includes("permission")) {
        parsedMessage = "La API Key de ElevenLabs provista no tiene permisos de 'text_to_speech' (Voz Clonada). Por favor habilita los permisos de generación/escritura de API Key en ElevenLabs o verifica con tu administrador.";
      } else if (rawErrorText.includes("paid_plan_required") || rawErrorText.includes("payment_required") || rawErrorText.includes("library voices")) {
        parsedMessage = "¡Restricción de Plan de ElevenLabs! Las cuentas gratuitas no pueden usar voces de la biblioteca pública (Library Voices) por API. Para solucionarlo, puedes seleccionar una voz gratuita oficial en el panel o hacer clic abajo en 'Cambiar a Voz Gratuita'.";
      } else if (rawErrorText.includes("quota") || rawErrorText.includes("character_limit") || rawErrorText.includes("insufficient_funds")) {
        parsedMessage = "Cuota mensual excedida o bulto de caracteres consumido en tu cuenta de ElevenLabs. Realizando fallback de voz local.";
      } else if (rawErrorText.includes("invalid-api-key") || rawErrorText.includes("invalid_api_key") || rawErrorText.includes("Unauthorized")) {
        parsedMessage = "La API Key de ElevenLabs es inválida o expiró. Por favor comprueba si posee typos en el panel de configuración.";
      } else if (rawErrorText.includes("not_found") || rawErrorText.includes("voice_not_found")) {
        parsedMessage = `La Voz con ID "${customVoiceId}" no se encuentra en esta cuenta o fue borrada.`;
      }

      setApiError(parsedMessage);
      logEvent(`Diagnóstico ElevenLabs: ${parsedMessage.substring(0, 100)}`, 'error');

      fallbackToWebSpeech(cleanText);
    }
  };

  // Resilient fallback speech engine using built-in high tracking TTS
  const fallbackToWebSpeech = (text: string) => {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = voicePitch;
      utterance.rate = voiceRate;

      const availableVoices = window.speechSynthesis.getVoices();
      let selectedVoice = availableVoices.find(v => v.lang.startsWith('es') && v.name.toLowerCase().includes('argentina'));
      if (!selectedVoice) {
        selectedVoice = availableVoices.find(v => v.lang.startsWith('es-AR')) || 
                        availableVoices.find(v => v.lang.startsWith('es')) || 
                        availableVoices[0];
      }
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onstart = () => {
        setIsPlayingVoice(true);
        setActiveSpeechText(text);
        logEvent(`Límite / Modo Offline: Fallback de voz activo (${voiceProfile.toUpperCase()})`, 'warn');
      };

      utterance.onend = () => {
        setIsPlayingVoice(false);
      };

      utterance.onerror = () => {
        setIsPlayingVoice(false);
        fallbackSoundBeep();
      };

      window.speechSynthesis.speak(utterance);
    } catch (_) {
      setIsPlayingVoice(false);
      fallbackSoundBeep();
    }
  };

  const stopSpeakingClonedVoice = () => {
    // 1. Stop HTMLAudio playing
    if (activeAudioRef.current) {
      try {
        activeAudioRef.current.pause();
        activeAudioRef.current = null;
      } catch (_) {}
    }
    // 2. Stop WebSpeech synthesis
    try {
      window.speechSynthesis.cancel();
    } catch (_) {}
    
    setIsPlayingVoice(false);
    setIsFetchingVoice(false);
    logEvent('Síntesis de voz clonada detenida.', 'info');
  };

  // Beep sound indicator
  const fallbackSoundBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(520, audioCtx.currentTime); 
      gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      // Ignored
    }
  };

  // Preset operations
  const presets = {
    comercio: [
      {
        label: '🔑 Burger House Noche ($15.000)',
        text: 'Pedir turno de 4 horas para Burger House el bloque de 20:00 a 00:00. Pago $15000',
        audioTrans: 'Hola! Soy Juan de Burger House. Publico un nuevo turno de noche de ocho a doce por quince mil pesos. Repartidor Carlos, ¿te sirve?',
        ttsTarget: 'Hola! He publicado un nuevo turno fijo de asistencia para Burger House de ocho de la noche a doce. Presupuesto aprobado quince mil pesos.'
      },
      {
        label: '🍣 Sushi Club Almuerzo ($18.000)',
        text: 'Hola, necesito un bloque para local Sushi Club de 12:00 a 16:00, abonando $18000',
        audioTrans: 'Hola, habla Sushi Club. Necesitamos cobertura de mediodía de doce a dieciséis horas por un pago de dieciocho mil.',
        ttsTarget: 'Sushi Club Palermo confirma bloque de almuerzo disponible de doce a dieciséis horas. Tarifa garantizada de dieciocho mil pesos en el pool.'
      }
    ],
    emprendedor: [
      {
        label: '📦 Enviar Pastas de la Nona ($4.500)',
        text: 'Despachar un pedido mediano desde Pastas de la Nona de Urquiza 230 hacia Serrano 1100. Valor $4500',
        audioTrans: 'Buenas tardes, hablo de Pastas de la Nona. Necesito despachar un pedido mediano hacia Serrano mil cien. Tarifa cuatro mil quinientos.',
        ttsTarget: 'Despacho registrado para Pastas de la Nona hacia Serrano mil cien. El bulto posee tamaño mediano con tarifa asignada.'
      },
      {
        label: '🌿 Enviar Yerba Orgánica ($3.200)',
        text: 'Enviar paquete pequeño de Yerba Orgánica a Av Santa Fe 4000. Tarifa $3200',
        audioTrans: 'Hola, tengo una entrega rápida de Yerba Orgánica para retirar en Cabrera 3400 y llevar a Santa Fe cuatro mil por tres mil doscientos pesos.',
        ttsTarget: 'Yerba Orgánica despacha paquete pequeño hacia Avenida Santa Fe cuatro mil. Se ha programado alerta GPS para el pool de repartos.'
      }
    ]
  };

  const executeCommandProcessing = (commandText: string, labelType: 'texto' | 'audio', voiceTextToSpeech?: string) => {
    setIsThinking(true);
    fallbackSoundBeep();
    
    setTimeout(() => {
      const phrase = commandText.toLowerCase();
      let responseText = '';
      let targetEntity: { type: 'turno' | 'entrega'; id: number; nombre: string } | undefined = undefined;
      let vocalicMonto = 0;
      
      const currentTimeString = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

      if (phrase.includes('turno') || phrase.includes('bloque') || userRole === 'comercio') {
        const commerce = phrase.includes('sushi') ? 'Sushi Club' : 'Burger House';
        const hours = phrase.includes('12') ? '12:00 - 16:00' : '20:00 - 00:00';
        const rawMonto = phrase.includes('18000') ? 18000 : 15000;
        
        const finalMonto = Math.round(rawMonto * multiplier);
        vocalicMonto = finalMonto;
        const driverShare = Math.round(finalMonto * 0.8);
        const platformShare = Math.round(finalMonto * 0.2);
        const newId = turnos.length + 101;

        const nuevoTurno: Turno = {
          id: newId,
          comercio_nombre: commerce,
          direccion: commerce === 'Sushi Club' ? 'Av. Cerviño 4400, Palermo' : 'Honduras 5600, Palermo',
          fecha: 'Hoy',
          horario: hours,
          monto_total: finalMonto,
          monto_repartidor: driverShare,
          monto_plataforma: platformShare,
          estado: 'disponible'
        };

        setTurnos(prev => [nuevoTurno, ...prev]);
        logEvent(`Turno B2B creado con IA: ${commerce} (${hours})`, 'success');
        triggerNotification(
          `IA ⚡ Turno Publicado`,
          `Nuevo bloque para ${commerce} de ${hours} publicado automáticamente en el ecosistema.`,
          'success'
        );

        responseText = `**VENTA DE TURNO AUTOMÁTICA EN DB**

Excelente. He analizado el requerimiento cognitivo por ${labelType === 'audio' ? 'nota de voz clonada 🎙️' : 'texto minimalista 💬'} y registré el turno fijo:

*   **Comercio**: ${commerce} 🏢
*   **Horarios**: ${hours} (4 horas de guardia)
*   **Tarifa Ajustada (${multiplier}x clima)**: **$${finalMonto} ARS**
*   **Repartidor Neto**: $${driverShare} (80%) 
*   **Comisión SaaS**: $${platformShare} (20%)

El operador autómata ya publicó la oferta GPS en el pool nacional y envió la alerta al repartidor Carlos.`;

        targetEntity = { type: 'turno', id: newId, nombre: commerce };

      } else {
        const emprendimiento = phrase.includes('pastas') ? 'Pastas de la Nona' : 'Yerba Orgánica';
        const origen = phrase.includes('pastas') ? 'Urquiza 230, Almagro' : 'Cabrera 3400, Palermo';
        const destino = phrase.includes('serrano') ? 'Serrano 1100, Palermo' : 'Av. Santa Fe 4000, Palermo';
        const size = phrase.includes('pequeño') ? 'pequeño' : 'mediano';
        const rawMonto = phrase.includes('3200') ? 3200 : 4500;
        
        const finalMonto = Math.round(rawMonto * multiplier);
        vocalicMonto = finalMonto;
        const driverShare = Math.round(finalMonto * 0.8);
        const platformShare = Math.round(finalMonto * 0.2);
        const newId = entregas.length + 201;

        const nuevaEntrega: EntregaUnica = {
          id: newId,
          emprendedor_nombre: emprendimiento,
          direccion_origen: origen,
          direccion_destino: destino,
          tamano: size,
          monto_total: finalMonto,
          monto_repartidor: driverShare,
          monto_plataforma: platformShare,
          estado: 'disponible'
        };

        setEntregas(prev => [nuevaEntrega, ...prev]);
        logEvent(`Entrega On-Demand creada con IA: ${emprendimiento} → ${size}`, 'success');
        triggerNotification(
          `IA ⚡ Pedido Publicado`,
          `Entrega rápida de ${emprendimiento} despachada automáticamente con IA.`,
          'success'
        );

        responseText = `**ENVÍO ON-DEMAND PUBLICADO CON IA**

He procesado la solicitud e ingresé la encomienda exprés de inmediato:

*   **Emprendimiento**: ${emprendimiento} 📦
*   **Trayecto**: ${origen} ➔ ${destino}
*   **Tamaño**: Paquete ${size.toUpperCase()}
*   **Valor Consolidado**: **$${finalMonto} ARS** (Monto neto de reparto: $${driverShare})

¡La geolocalización satelital ya activó la ruta sobre el mapa de Argentina!`;

        targetEntity = { type: 'entrega', id: newId, nombre: emprendimiento };
      }

      const aiResponse: ChatMessage = {
        id: messages.length + 2,
        sender: 'ia',
        tipo: 'texto',
        contenido: responseText,
        entidadCreada: targetEntity,
        timestamp: currentTimeString
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsThinking(false);

      // Trigger automatic Speech (Venda de Turno con voz clonada)
      const speakText = voiceTextToSpeech || `Operación completada de forma exitosa. Se ha publicado el elemento de ${targetEntity?.nombre} por un valor de ${vocalicMonto} pesos.`;
      speakClonedVoice(speakText);
    }, 1500);
  };

  const handleSendMessage = () => {
    if (!textInput.trim()) return;
    
    const userMsg: ChatMessage = {
      id: messages.length + 1,
      sender: 'usuario',
      tipo: 'texto',
      contenido: textInput,
      timestamp: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const memoText = textInput;
    setTextInput('');
    executeCommandProcessing(memoText, 'texto');
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      const seconds = recordingSeconds || 5;
      const index = Math.floor(Math.random() * presets[userRole].length);
      const chosenPreset = presets[userRole][index];
      
      const audioMsg: ChatMessage = {
        id: messages.length + 1,
        sender: 'usuario',
        tipo: 'audio',
        contenido: `Venta de Turno simulada por voz (${seconds}s)`,
        transcription: chosenPreset.audioTrans,
        audioDuration: `0:${seconds < 10 ? '0' + seconds : seconds}`,
        timestamp: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, audioMsg]);
      executeCommandProcessing(chosenPreset.text, 'audio', chosenPreset.ttsTarget);
    } else {
      setIsRecording(true);
    }
  };

  const handlePresetClick = (preset: { text: string; audioTrans: string; label: string; ttsTarget?: string }, type: 'texto' | 'audio') => {
    const timeStr = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    
    if (type === 'audio') {
      const audioMsg: ChatMessage = {
        id: messages.length + 1,
        sender: 'usuario',
        tipo: 'audio',
        contenido: `Venta de Turno por nota de voz (${preset.label})`,
        transcription: preset.audioTrans,
        audioDuration: '0:07',
        timestamp: timeStr
      };
      setMessages(prev => [...prev, audioMsg]);
      executeCommandProcessing(preset.text, 'audio', preset.ttsTarget);
    } else {
      const userMsg: ChatMessage = {
        id: messages.length + 1,
        sender: 'usuario',
        tipo: 'texto',
        contenido: preset.text,
        timestamp: timeStr
      };
      setMessages(prev => [...prev, userMsg]);
      executeCommandProcessing(preset.text, 'texto', preset.ttsTarget);
    }
  };

  return (
    <div className="bg-[#000000] border border-gray-brand rounded-2xl flex flex-col h-[580px] shadow-2xl relative overflow-hidden text-left text-white selection:bg-blue-brand/30">
      
      {/* Visual Header inspired by Uber Design System - Solid black background with high tracking font */}
      <div className="bg-black border-b border-gray-brand px-5 py-4 shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-blue-brand rounded-md p-2 text-white flex items-center justify-center animate-pulse">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs tracking-widest uppercase font-display leading-none text-white-brand">
              UBER B2B IA ENGINE
            </h4>
            <span className="text-[10px] text-gray-500 font-mono">CONVERSATIONAL VOICE PROCESSOR • DEEP CLONE</span>
          </div>
        </div>

        {/* Selected Role Slider & Custom Config Panel */}
        <div className="flex bg-[#111111] p-1 rounded-lg text-[9px] font-mono border border-gray-brand self-start sm:self-auto gap-1">
          <button 
            onClick={() => {
              setShowConfigCollapse(!showConfigCollapse);
              fallbackSoundBeep();
            }}
            className={`px-2.5 py-1 rounded transition-all cursor-pointer font-bold uppercase tracking-wider ${showConfigCollapse ? 'bg-blue-brand text-white' : 'text-gray-400 hover:text-white'}`}
            title="Configure ElevenLabs Custom API Key or Voice ID"
          >
            ⚙️ ElevenLabs Setup
          </button>
          
          <div className="h-3 w-[1px] bg-gray-brand self-center" />

          <button 
            onClick={() => setUserRole('comercio')}
            className={`px-3 py-1 rounded transition-all cursor-pointer font-bold uppercase tracking-wider ${userRole === 'comercio' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
          >
            🏢 Comercio
          </button>
          <button 
            onClick={() => setUserRole('emprendedor')}
            className={`px-3 py-1 rounded transition-all cursor-pointer font-bold uppercase tracking-wider ${userRole === 'emprendedor' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
          >
            📦 Emprendedor
          </button>
        </div>
      </div>

      {/* CLONED VOICE BIOMETRIC CONTROL PANEL (Uber minimalist parameters) */}
      <div className="bg-[#0A0A0A] border-b border-gray-brand px-5 py-3.5 z-10 grid grid-cols-1 md:grid-cols-3 gap-4 items-center text-[10px]">
        
        {/* Profile Selector */}
        <div className="space-y-1">
          <span className="text-gray-500 font-bold uppercase tracking-widest block font-mono text-[8px]">Biometría de Voz Clonada</span>
          <select 
            value={voiceProfile}
            onChange={(e: any) => {
              setVoiceProfile(e.target.value);
              logEvent(`Perfil de voz cambiado a: ${e.target.value.toUpperCase()}`, 'info');
              fallbackSoundBeep();
            }}
            className="w-full bg-[#161616] text-white border border-gray-brand p-1.5 rounded font-mono font-bold focus:outline-none focus:border-blue-brand text-[9px]"
          >
            <option value="carlos">Carlos - Repartidor Autómata (Grave)</option>
            <option value="agustina">Agustina - Coordinadora B2B (Natural)</option>
            <option value="vendedor_bot">Vendedor Autómata (Sintético)</option>
          </select>
        </div>

        {/* Pitch Control */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[8px] font-mono text-gray-500">
            <span className="font-bold uppercase tracking-widest">Tono Biométrico (Pitch):</span>
            <span className="text-white-brand font-bold">{voicePitch}x</span>
          </div>
          <input 
            type="range"
            min="0.5" 
            max="1.5" 
            step="0.05"
            value={voicePitch}
            onChange={(e) => setVoicePitch(parseFloat(e.target.value))}
            className="w-full h-1 bg-gray-brand rounded-lg appearance-none cursor-pointer accent-blue-brand"
          />
        </div>

        {/* Rate Control */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[8px] font-mono text-gray-500">
            <span className="font-bold uppercase tracking-widest">Velocidad de Habla (Rate):</span>
            <span className="text-white-brand font-bold">{voiceRate}x</span>
          </div>
          <input 
            type="range"
            min="0.6" 
            max="1.5" 
            step="0.05"
            value={voiceRate}
            onChange={(e) => setVoiceRate(parseFloat(e.target.value))}
            className="w-full h-1 bg-gray-brand rounded-lg appearance-none cursor-pointer accent-blue-brand"
          />
        </div>

      </div>

      {/* ELEVENLABS CUSTOM CREDENTIALS EXPANDER */}
      {showConfigCollapse && (
        <div className="bg-[#0b0b0b] border-b border-gray-brand p-4 space-y-3.5 z-10 text-[10px] font-mono shadow-inner select-none animate-fadeIn">
          <div className="flex justify-between items-center pb-2 border-b border-gray-800">
            <span className="font-extrabold uppercase text-[10px] text-blue-brand tracking-widest flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 animate-pulse" />
              ⚙️ Configuración Credenciales ElevenLabs
            </span>
            <span className="text-[8px] text-gray-500">Guardado automático en navegador</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-gray-400 text-[8px] uppercase tracking-wider font-extrabold block">ElevenLabs API Key:</label>
              <input 
                type="password"
                value={customApiKey}
                onChange={(e) => {
                  setCustomApiKey(e.target.value);
                  setApiError(null);
                }}
                placeholder="Ej. 75154e94ecb5c350... (vacío utiliza de sistema)"
                className="w-full bg-[#161616] text-white border border-gray-brand p-2 rounded focus:outline-none focus:border-blue-brand text-xs font-mono"
              />
              <span className="text-[7.5px] text-gray-500 block leading-normal">
                Si usas tu API Key, asegúrate de que tenga permisos <strong>text_to_speech</strong> en ElevenLabs ➔ Settings ➔ API Keys.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-400 text-[8px] uppercase tracking-wider font-extrabold block">Voz Clonada ID (Voice ID):</label>
              <input 
                type="text"
                value={customVoiceId}
                onChange={(e) => {
                  setCustomVoiceId(e.target.value);
                  setApiError(null);
                }}
                placeholder="Ej. 4wDRKlxcHNOFO5kBvE81"
                className="w-full bg-[#161616] text-white border border-gray-brand p-2 rounded focus:outline-none focus:border-blue-brand text-xs font-mono font-bold"
              />
              <span className="text-[7.5px] text-gray-500 block leading-normal">
                Identificador de voz clonada configurado. Defecto: <strong>4wDRKlxcHNOFO5kBvE81</strong> (Voz de Biblioteca).
              </span>
              <div className="pt-1 flex gap-1.5 flex-wrap">
                <span className="text-[7.5px] text-gray-400 self-center">Voces Gratis en Plan Free:</span>
                <button
                  type="button"
                  onClick={() => {
                    setCustomVoiceId('21m00Tcm4TlvDq8ikWAM');
                    setApiError(null);
                  }}
                  className={`text-[8px] px-2 py-1 rounded border font-bold pointer-events-auto cursor-pointer transition-all ${customVoiceId === '21m00Tcm4TlvDq8ikWAM' ? 'bg-blue-brand text-white border-blue-brand' : 'bg-gray-900 text-gray-300 border-gray-800 hover:text-white'}`}
                >
                  👩 Rachel (Gratis)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCustomVoiceId('ErXwobaYWBteAsidvWS9');
                    setApiError(null);
                  }}
                  className={`text-[8px] px-2 py-1 rounded border font-bold pointer-events-auto cursor-pointer transition-all ${customVoiceId === 'ErXwobaYWBteAsidvWS9' ? 'bg-blue-brand text-white border-blue-brand' : 'bg-gray-900 text-gray-300 border-gray-800 hover:text-white'}`}
                >
                  👨 Antoni (Gratis)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCustomVoiceId('4wDRKlxcHNOFO5kBvE81');
                    setApiError(null);
                  }}
                  className={`text-[8px] px-2 py-1 rounded border font-bold pointer-events-auto cursor-pointer transition-all ${customVoiceId === '4wDRKlxcHNOFO5kBvE81' ? 'bg-blue-brand text-white border-blue-brand' : 'bg-gray-900 text-gray-300 border-gray-800 hover:text-white'}`}
                >
                  🎙️ Tu Clon (Library Voice)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DIAGNÓSTICO DE ERROR DE PERMISOS ELEVENLABS */}
      {apiError && (
        <div className="bg-[#1A0B0D] border-b border-red-950/40 p-4 z-10 flex gap-3 items-start text-xs select-none">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1.5 min-w-0 text-left">
            <div className="flex justify-between items-center">
              <span className="font-extrabold text-[8.5px] text-red-400 tracking-widest font-mono flex items-center gap-1 uppercase">
                ⚠️ DIAGNÓSTICO: ElevenLabs Límite / Permiso Faltante
              </span>
              <button 
                onClick={() => setApiError(null)}
                className="text-red-400 hover:text-white font-mono text-[9px] uppercase tracking-wider cursor-pointer font-bold px-1.5 py-0.5"
              >
                Ignorar [X]
              </button>
            </div>
            
            <p className="text-gray-300 font-mono text-[10.5px] leading-relaxed break-words">{apiError}</p>
            
            <div className="pt-1.5 flex flex-wrap gap-2.5">
              {(apiError.toLowerCase().includes("plan") || apiError.toLowerCase().includes("gratuita") || apiError.toLowerCase().includes("library") || apiError.toLowerCase().includes("payment")) && (
                <>
                  <button
                    onClick={() => {
                      setCustomVoiceId('21m00Tcm4TlvDq8ikWAM'); // Rachel
                      setApiError(null);
                      logEvent("Cambio de voz instantáneo: se activó Rachel (Voz oficial gratuita)", "info");
                    }}
                    className="text-[8.5px] bg-green-950/80 hover:bg-green-900 text-green-200 border border-green-800/60 font-bold font-mono uppercase tracking-widest px-2.5 py-1 rounded transition-all cursor-pointer animate-pulse"
                  >
                    👩 Cambiar a Rachel (Gratis)
                  </button>
                  <button
                    onClick={() => {
                      setCustomVoiceId('ErXwobaYWBteAsidvWS9'); // Antoni
                      setApiError(null);
                      logEvent("Cambio de voz instantáneo: se activó Antoni (Voz oficial gratuita)", "info");
                    }}
                    className="text-[8.5px] bg-green-950/80 hover:bg-green-900 text-green-200 border border-green-800/60 font-bold font-mono uppercase tracking-widest px-2.5 py-1 rounded transition-all cursor-pointer animate-pulse"
                  >
                    👨 Cambiar a Antoni (Gratis)
                  </button>
                </>
              )}
              <button
                onClick={() => setShowConfigCollapse(true)}
                className="text-[8.5px] bg-red-950/50 hover:bg-red-900/50 text-red-200 border border-red-900/40 font-bold font-mono uppercase tracking-widest px-2.5 py-1 rounded transition-all cursor-pointer"
              >
                Ingresar API Key / Voz Alternativa
              </button>
              <a 
                href="https://elevenlabs.io/app/settings/api-keys"
                target="_blank"
                rel="noreferrer"
                className="text-[8.5px] hover:text-white text-red-400 font-mono uppercase tracking-widest underline py-1 flex items-center gap-0.5 font-bold"
              >
                Configurar permisos API Key en ElevenLabs ➔
              </a>
            </div>
          </div>
        </div>
      )}

      {/* SYSTEM AUDIO STATUS INDICATOR (Minimalist wave bar) */}
      {isFetchingVoice && (
        <div className="bg-[#0D0D0D] border-b border-blue-brand/20 px-5 py-2.5 z-10 flex items-center justify-between gap-3 text-[10px] text-blue-brand select-none animate-pulse">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-brand animate-spin" />
            <span className="font-bold font-mono uppercase tracking-widest text-[9px]">ElevenLabs B2B: Clonando voz y sintetizando audio (#p7Aw)...</span>
          </div>
          <span className="text-[8px] font-mono bg-blue-brand/10 border border-blue-brand/20 px-2 py-0.5 rounded text-blue-brand">STREAMING BUFFER</span>
        </div>
      )}

      {isPlayingVoice && (
        <div className="bg-[#111111] border-b border-blue-brand/20 px-5 py-2 z-10 flex items-center justify-between gap-3 text-[10px] text-blue-brand select-none animate-pulse">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-blue-brand animate-bounce" />
            <span className="font-bold font-mono uppercase tracking-widest text-[9px]">Vendedor de IA hablando con Voz Clonada</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button 
              onClick={stopSpeakingClonedVoice}
              className="bg-blue-brand/15 hover:bg-blue-brand/35 text-blue-brand text-[8px] font-bold px-2 py-0.5 rounded font-mono cursor-pointer border border-blue-brand/35 shrink-0"
            >
              Silenciar [X]
            </button>
            <div className="flex items-end gap-0.5 h-3">
              {waves.map((h, i) => (
                <span 
                  key={i} 
                  className="w-[1.5px] bg-blue-brand rounded-full transition-all duration-100" 
                  style={{ height: `${Math.min(h, 15)}px` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs no-scrollbar bg-[#050505] relative z-0" ref={scrollRef}>
        
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col max-w-[85%] ${
              msg.sender === 'usuario' ? 'ml-auto items-end' : 'mr-auto items-start'
            }`}
          >
            {/* Sender and time tag */}
            <span className="text-[9px] text-gray-500 font-mono mb-1 uppercase tracking-widest">
              {msg.sender === 'ia' ? '🤖 DeliveryPlus IA' : `OPERADOR B2B`} • {msg.timestamp}
            </span>

            {/* Bubble Contents */}
            <div 
              className={`rounded-xl p-3.5 shadow-md border leading-relaxed text-xs transition-all ${
                msg.sender === 'usuario' 
                  ? 'bg-white text-black border-white rounded-tr-none font-medium' 
                  : 'bg-[#121212] border-gray-brand text-gray-200 rounded-tl-none'
              }`}
            >
              {msg.tipo === 'audio' ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => {
                        fallbackSoundBeep();
                        speakClonedVoice(msg.transcription || "Voz de prueba");
                      }}
                      className="w-8 h-8 rounded-full bg-white text-black hover:bg-gray-200 transition-colors flex items-center justify-center cursor-pointer shrink-0"
                      title="Probar reproducción voice cloning"
                    >
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </button>
                    
                    {/* Minimalist Audio representation */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-end gap-0.5 h-5 px-1.5 bg-black/40 rounded border border-gray-brand py-1">
                        {waves.slice(0, 8).map((h, i) => (
                          <span 
                            key={i} 
                            className="flex-1 bg-white rounded transition-all duration-100" 
                            style={{ height: `${Math.min(h, 18)}px` }}
                          />
                        ))}
                      </div>
                    </div>

                    <span className="font-mono text-[9px] text-gray-500">{msg.audioDuration || '0:07'}</span>
                  </div>

                  {msg.transcription && (
                    <div className="border-t border-gray-800 pt-2.5 text-[10.5px] italic text-gray-400 leading-normal">
                      &ldquo;{msg.transcription}&rdquo;
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => speakClonedVoice(msg.transcription || "")}
                      className="text-[9px] bg-[#1a1a1a] border border-gray-800 text-white hover:bg-[#2a2a2a] px-2 py-1 rounded font-mono uppercase tracking-widest cursor-pointer flex items-center gap-1.5"
                    >
                      <Volume2 className="w-3 h-3 text-blue-brand" />
                      Hacer que IA Clone hable esta frase
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  className="space-y-2 break-words"
                  dangerouslySetInnerHTML={{ 
                    __html: msg.contenido
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\n/g, '<br />')
                      .replace(/\*(.*?)\*/g, '<span class="text-blue-brand font-semibold">$1</span>')
                  }}
                />
              )}

              {/* Created entity badge */}
              {msg.entidadCreada && (
                <div className="mt-3.5 bg-black border border-gray-brand rounded-lg p-2.5 flex items-center justify-between text-[9px] font-mono shrink-0">
                  <div className="flex items-center gap-1.5 text-green-success font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-success" />
                    <span className="uppercase tracking-widest text-[8px]">Base de Datos (MariaDB): ONLINE</span>
                  </div>
                  <span className="text-gray-500">
                    {msg.entidadCreada.type === 'turno' ? '📌 Turno Fijo' : '📦 Encomienda'} #{msg.entidadCreada.id}
                  </span>
                </div>
              )}
            </div>

            {/* Speach utterance helper for text responses */}
            {msg.sender === 'ia' && msg.tipo === 'texto' && (
              <button 
                onClick={() => speakClonedVoice(msg.contenido)}
                className="mt-1 text-[8px] font-mono text-gray-500 hover:text-white uppercase tracking-wider flex items-center gap-1 transition-colors pl-2 self-start"
                title="Sintetizar respuesta con voz clonada configurada"
              >
                <Volume2 className="w-2.5 h-2.5 text-blue-brand" /> Escuchar con Voz Clonada ({voiceProfile})
              </button>
            )}

          </div>
        ))}

        {/* AI Typing Thinking visualizer */}
        {isThinking && (
          <div className="flex flex-col items-start mr-auto max-w-[85%]">
            <span className="text-[9px] text-gray-500 font-mono mb-1 uppercase tracking-widest">procesando biometría de voz...</span>
            <div className="rounded-xl p-3 bg-[#121212] border border-gray-brand text-gray-400 rounded-tl-none flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* PRESETS WORKSHOP PANEL / COMANDOS RÁPIDOS MOCK IA */}
      <div className="px-5 py-3 bg-[#090909] border-t border-gray-brand z-10 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Command className="w-3 h-3 text-blue-brand" />
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest font-mono">Simulador Ventas B2B (Probar Voz)</span>
          </div>
          <span className="text-[8px] text-gray-500 italic block">Haz clic para enviar audio simulado y disparar venta automática</span>
        </div>
        
        <div className="flex flex-wrap gap-2 max-h-[62px] overflow-y-auto no-scrollbar">
          {presets[userRole].map((preset, idx) => (
            <div key={idx} className="flex bg-[#121212] hover:bg-[#1A1A1A] border border-gray-brand hover:border-white rounded p-1 transition-all items-center gap-2">
              <button 
                onClick={() => handlePresetClick(preset, 'texto')}
                className="text-[9px] font-bold text-gray-200 hover:text-white px-2 py-0.5 rounded transition-colors text-left"
              >
                {preset.label}
              </button>
              
              <div className="h-4 w-[1px] bg-gray-brand" />

              <button 
                onClick={() => handlePresetClick(preset, 'audio')}
                className="p-1 text-gray-500 hover:text-white rounded hover:bg-black/40 flex items-center gap-1 font-mono text-[8px] uppercase tracking-wider font-bold"
                title="Enviar por nota de voz simulated"
              >
                <Mic className="w-3 h-3 text-blue-brand animate-pulse" />
                Voz
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* INPUT PANEL FOOTER */}
      <div className="bg-black p-4 border-t border-gray-brand flex items-center gap-3.5 z-10 shrink-0">
        {isRecording ? (
          <div className="flex-1 flex items-center justify-between bg-white text-black rounded-lg px-4 py-3 transition-colors">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
              <span className="font-mono text-[10px] font-extrabold uppercase tracking-widest text-red-600">GRABANDO AUDIO OPERADOR...</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs font-black">
                0:{recordingSeconds < 10 ? '0' + recordingSeconds : recordingSeconds}
              </span>
              <button 
                onClick={handleToggleRecording}
                className="bg-black hover:bg-gray-900 text-white p-2.5 rounded-full select-none shadow-lg animate-pulse transition-all cursor-pointer flex items-center justify-center text-[9px] font-mono uppercase tracking-widest font-bold"
                title="Detener y Procesar"
              >
                <MicOff className="w-3.5 h-3.5 text-white mr-1 inline" /> Detener
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Minimalist Micro Button */}
            <button 
              onClick={handleToggleRecording}
              className="p-3 bg-[#111111] hover:bg-white text-gray-400 hover:text-black border border-gray-brand rounded-lg transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-md"
              title="Presiona para Simular Nota de Voz de B2B"
            >
              <Mic className="w-4 h-4 text-blue-brand" />
            </button>

            {/* Standard texts inputs */}
            <input 
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={
                userRole === 'comercio' 
                  ? "Pide un turno ej: 'Crea turno de Burger House, pago $15000'..."
                  : "Despacha pedido ej: 'Enviar de Pastas de la Nona Serrano 1100'..."
              }
              className="flex-1 bg-[#111111] border border-gray-brand rounded-lg px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-white transition-all shadow-inner font-mono font-semibold"
            />

            {/* Send text button */}
            <button 
              onClick={handleSendMessage}
              disabled={!textInput.trim()}
              className="p-3 bg-white hover:bg-gray-200 text-black border border-white rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shrink-0 flex items-center justify-center font-bold"
            >
              <Send className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

    </div>
  );
};
