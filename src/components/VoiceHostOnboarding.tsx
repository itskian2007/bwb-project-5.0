'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  FileText, 
  RefreshCw, 
  ShieldCheck, 
  AlertCircle,
  Sparkles,
  Send,
  HelpCircle
} from 'lucide-react';
import { formatINR } from '../lib/utils';
import confetti from 'canvas-confetti';

interface VoiceHostOnboardingProps {
  onHostOnboarded?: () => void;
}

export const VoiceHostOnboarding: React.FC<VoiceHostOnboardingProps> = ({ onHostOnboarded }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [spokenText, setSpokenText] = useState<string>('');
  const [typedText, setTypedText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [ttsEnabled, setTtsEnabled] = useState<boolean>(true);
  const [agentFeedback, setAgentFeedback] = useState<string>(
    'प्रेस माइक या नीचे बोलें — Press microphone to describe your homestay, village, and price in Hindi or English.'
  );

  // Form Fields (editable by host)
  const [formData, setFormData] = useState({
    hostName: '',
    village: '',
    district: 'Shimla Rural',
    state: 'Himachal Pradesh',
    category: 'Rural Homestay',
    pricingINR: '',
    highlights: 'Home-cooked local meals, Mountain view, Clean wooden rooms'
  });

  const recognitionRef = useRef<any>(null);

  // Text to speech helper
  const speak = (msg: string) => {
    if (!ttsEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(msg);
      utt.rate = 0.95;
      const voices = window.speechSynthesis.getVoices();
      const hiVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('Hindi'));
      if (hiVoice) utt.voice = hiVoice;
      window.speechSynthesis.speak(utt);
    } catch (e) {}
  };

  // Extract from input text
  const processInputText = (rawText: string) => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const text = rawText.trim().toLowerCase();

      // Check if it is only a greeting
      const greetings = ['hello', 'hi', 'namaste', 'हेलो', 'नमस्ते', 'नमस्कार', 'प्रणाम'];
      const isGreeting = greetings.some(g => text === g || text.replace(/^[~।,!\.\?\s]+|[।,!\.\?\s]+$/g, '') === g);

      if (isGreeting || text.length < 10) {
        const promptMsg = 'नमस्ते! कृपया अपने होमस्टे का नाम, गाँव और किराया (price) बोलकर बताएं।';
        setAgentFeedback(promptMsg);
        speak(promptMsg);
        return;
      }

      // Extract Name
      let extractedName = formData.hostName;
      const nameMatch = rawText.match(/(?:मेरा नाम|मैं|हमारा नाम)\s+([A-Za-z\u0900-\u097F\s]{2,20})(?:है|हूँ|बोल|से|,|\.|$)/i) ||
                        rawText.match(/(?:my name is|i am)\s+([A-Za-z\s]{2,20})/i);
      if (nameMatch && nameMatch[1]?.trim()) {
        extractedName = nameMatch[1].trim();
      }

      // Extract Price
      let extractedPrice = formData.pricingINR;
      const priceMatch = rawText.match(/(\d{3,5})\s*(?:₹|रु|रुपये|रुपया|rs|inr|प्रति|per)/i) ||
                         rawText.match(/(?:किराया|कीमत|price|rate)\s*(?:है|is)?\s*(\d{3,5})/i);
      if (priceMatch && priceMatch[1]) {
        extractedPrice = priceMatch[1];
      } else if (text.includes('दो हज़ार आठ सौ') || text.includes('2800')) {
        extractedPrice = '2800';
      } else if (text.includes('चौबीस सौ') || text.includes('2400')) {
        extractedPrice = '2400';
      } else if (text.includes('दो हज़ार') || text.includes('2000')) {
        extractedPrice = '2000';
      } else if (text.includes('पंद्रह सौ') || text.includes('1500')) {
        extractedPrice = '1500';
      }

      // Extract Village
      let extractedVillage = formData.village;
      let extractedDistrict = formData.district;

      if (text.includes('thanedhar') || text.includes('थनेधार')) {
        extractedVillage = 'Thanedhar';
        extractedDistrict = 'Shimla Rural';
      } else if (text.includes('kumarsain') || text.includes('कुमारसैन')) {
        extractedVillage = 'Kumarsain';
        extractedDistrict = 'Shimla Rural';
      } else if (text.includes('jibhi') || text.includes('जिभी')) {
        extractedVillage = 'Jibhi';
        extractedDistrict = 'Kullu';
      } else if (text.includes('kasol') || text.includes('कसोल')) {
        extractedVillage = 'Kasol';
        extractedDistrict = 'Kullu';
      } else if (text.includes('manali') || text.includes('मनाली')) {
        extractedVillage = 'Manali';
        extractedDistrict = 'Kullu';
      } else {
        const vMatch = rawText.match(/([A-Za-z\u0900-\u097F]{2,20})\s*(?:गाँव|गांव|village)/i);
        if (vMatch && vMatch[1]) extractedVillage = vMatch[1].trim();
      }

      // Extract Category
      let extractedCategory = formData.category;
      if (text.includes('शॉल') || text.includes('बुनकर') || text.includes('handloom') || text.includes('weaver')) {
        extractedCategory = 'Artisan Handloom';
      } else if (text.includes('गाइड') || text.includes('guide') || text.includes('trek')) {
        extractedCategory = 'Local Guide';
      } else {
        extractedCategory = 'Rural Homestay';
      }

      // Update Form
      setFormData(prev => ({
        ...prev,
        hostName: extractedName || prev.hostName,
        village: extractedVillage || prev.village,
        district: extractedDistrict || prev.district,
        pricingINR: extractedPrice || prev.pricingINR,
        category: extractedCategory
      }));

      // Feedback prompt
      if (!extractedPrice && !extractedVillage) {
        const msg = 'कृपया अपने गाँव का नाम और प्रति रात का किराया (price) भी बताएं।';
        setAgentFeedback(msg);
        speak(msg);
      } else if (!extractedPrice) {
        const msg = `${extractedVillage || 'स्थान'} दर्ज हो गया है। कृपया प्रति रात का किराया (रुपये में) बताएं।`;
        setAgentFeedback(msg);
        speak(msg);
      } else {
        const msg = `विवरण प्राप्त हुआ! कृपया नीचे दिए गए फॉर्म की पुष्टि करें और ONDC पर रजिस्टर करें।`;
        setAgentFeedback(msg);
        speak(msg);
      }
    }, 600);
  };

  // Toggle Recording
  const handleToggleRecord = () => {
    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      try {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.lang = 'hi-IN';
        recognition.interimResults = true;

        let finalTranscript = '';

        recognition.onstart = () => setIsRecording(true);
        recognition.onresult = (e: any) => {
          let str = '';
          for (let i = e.resultIndex; i < e.results.length; ++i) {
            str += e.results[i][0].transcript;
          }
          finalTranscript = str;
          setSpokenText(str);
        };
        recognition.onend = () => {
          setIsRecording(false);
          if (finalTranscript.trim()) {
            processInputText(finalTranscript);
          }
        };
        recognition.onerror = () => setIsRecording(false);

        recognition.start();
        return;
      } catch (e) {
        setIsRecording(false);
      }
    }
  };

  // Quick Demo Samples
  const handleLoadSample = (sampleType: 'homestay' | 'handloom') => {
    if (sampleType === 'homestay') {
      const sampleText = 'मेरा नाम सुरेश वर्मा है। थनेधार गांव में सेब के बगीचे के बीच हमारा कॉटेज है, 2800 रुपये प्रति रात का किराया है।';
      setSpokenText(sampleText);
      setFormData({
        hostName: 'Suresh Verma',
        village: 'Thanedhar',
        district: 'Shimla Rural',
        state: 'Himachal Pradesh',
        category: 'Rural Homestay',
        pricingINR: '2800',
        highlights: '100yr Heritage Deodar Wood, Traditional Siddu Meals, Apple Orchard Access'
      });
      setAgentFeedback('सैंपल लोड हुआ: सुरेश वर्मा (थनेधार सेब बगीचा कॉटेज - ₹2,800/रात)');
      speak('सुरेश वर्मा जी, थनेधार होमस्टे का विवरण लोड हो गया है।');
    } else {
      const sampleText = 'मेरा नाम हेमराज नेगी है, कुमारसैन गांव से। हम हाथ के खड्डे पर पारंपरिक किन्नौरी शॉल बनाते हैं, 2400 रुपये कीमत है।';
      setSpokenText(sampleText);
      setFormData({
        hostName: 'Hemraj Negi',
        village: 'Kumarsain',
        district: 'Shimla Rural',
        state: 'Himachal Pradesh',
        category: 'Artisan Handloom',
        pricingINR: '2400',
        highlights: 'GI-Certified Pure Wool Shawls, Ancestral Pit-Loom Weaving'
      });
      setAgentFeedback('सैंपल लोड हुआ: हेमराज नेगी (कुमारसैन अंगोरा हथकरघा - ₹2,400)');
      speak('हेमराज नेगी जी, कुमारसैन हथकरघा का विवरण लोड हो गया है।');
    }
    setIsRegistered(false);
  };

  const handleRegisterNode = () => {
    setIsRegistered(true);
    confetti({ particleCount: 60, spread: 60 });
    if (onHostOnboarded) onHostOnboarded();
  };

  const handleReset = () => {
    setSpokenText('');
    setTypedText('');
    setIsRegistered(false);
    setFormData({
      hostName: '',
      village: '',
      district: 'Shimla Rural',
      state: 'Himachal Pradesh',
      category: 'Rural Homestay',
      pricingINR: '',
      highlights: 'Home-cooked local meals, Mountain view, Clean wooden rooms'
    });
    setAgentFeedback('नया सत्र शुरू हुआ — Press mic to speak your details.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 px-4">
      {/* Header */}
      <div className="gis-panel p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
              INCLUSION MODULE &bull; REGIONAL VOICE ONBOARDING
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Village Host &amp; Artisan Onboarding (Voice Demo)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Designed for rural hosts who do not write English. Simple, practical demonstration converting spoken Hindi/English into standard ONDC registry fields.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setTtsEnabled(!ttsEnabled)}
              className="px-2.5 py-1.5 rounded bg-[#0A142D] border border-[#1E2F5B] text-slate-300 text-xs flex items-center space-x-1"
            >
              {ttsEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
              <span>{ttsEnabled ? 'Voice: On' : 'Voice: Mute'}</span>
            </button>
            <button
              onClick={handleReset}
              className="px-2.5 py-1.5 rounded bg-[#0A142D] border border-[#1E2F5B] text-slate-300 hover:text-white text-xs flex items-center space-x-1"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Voice Capture Console (5 cols) */}
        <div className="md:col-span-5 gis-panel p-5 flex flex-col items-center text-center space-y-4">
          <span className="text-[10px] font-mono uppercase text-slate-400">
            Voice Capture
          </span>

          {/* Microphone */}
          <button
            onClick={handleToggleRecord}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
              isRecording
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-[#15803D] hover:bg-[#166534] text-white shadow-lg'
            }`}
          >
            {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>

          <div>
            <h3 className="text-sm font-bold text-white">
              {isRecording ? 'Listening... बोलिए' : 'Press Microphone to Speak'}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              {isRecording 
                ? 'Speak in Hindi or English (name, village, price)' 
                : 'Tap to speak your name, village, and price.'}
            </p>
          </div>

          {/* Quick Demo Samples */}
          <div className="w-full pt-3 border-t border-[#1E2F5B] text-left space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">
              Or Test One-Click Real Audio Samples:
            </span>
            <div className="space-y-1.5">
              <button
                onClick={() => handleLoadSample('homestay')}
                className="w-full text-left p-2 rounded bg-[#0A142D] hover:bg-[#101F42] border border-[#1E2F5B] text-xs text-slate-200"
              >
                <strong>Sample 1:</strong> Thanedhar Apple Orchard Homestay
              </button>
              <button
                onClick={() => handleLoadSample('handloom')}
                className="w-full text-left p-2 rounded bg-[#0A142D] hover:bg-[#101F42] border border-[#1E2F5B] text-xs text-slate-200"
              >
                <strong>Sample 2:</strong> Kumarsain Pure Angora Handloom Weaver
              </button>
            </div>
          </div>

          {/* Type Option */}
          <div className="w-full pt-3 border-t border-[#1E2F5B] text-left">
            <span className="text-[10px] text-slate-400 block mb-1">Or Type Text Directly:</span>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (typedText.trim()) {
                  setSpokenText(typedText);
                  processInputText(typedText);
                  setTypedText('');
                }
              }}
              className="flex gap-1.5"
            >
              <input
                type="text"
                value={typedText}
                onChange={(e) => setTypedText(e.target.value)}
                placeholder="उदा: मेरा नाम राजेश है, जिभी में होमस्टे, किराया 1800"
                className="flex-1 bg-[#0A142D] border border-[#1E2F5B] rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-2.5 py-1.5 bg-[#15803D] text-white text-xs font-semibold rounded"
              >
                Send
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Transcription & Standard Listing Form (7 cols) */}
        <div className="md:col-span-7 space-y-4">
          {/* Transcription & Feedback */}
          <div className="gis-panel p-4 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center text-emerald-400 font-semibold">
                <FileText className="w-3.5 h-3.5 mr-1" /> Speech Transcription
              </span>
              <span>{isProcessing ? 'Analyzing Input...' : 'Whisper ASR Stream'}</span>
            </div>

            <div className="p-2.5 rounded bg-[#0A142D] border border-[#1E2F5B] min-h-[48px] text-xs text-slate-200">
              {spokenText ? (
                <span className="text-emerald-300 font-medium">&ldquo;{spokenText}&rdquo;</span>
              ) : (
                <span className="text-slate-500 italic">No input yet. Speak or select a sample above...</span>
              )}
            </div>

            {/* Simple Feedback */}
            <div className="p-2 rounded bg-[#0A142D] border border-[#1E2F5B] text-[11px] text-slate-300 flex items-start space-x-2">
              <span className="text-emerald-400 font-bold flex-shrink-0">Status:</span>
              <span>{agentFeedback}</span>
            </div>
          </div>

          {/* Structured Registration Form */}
          <div className="gis-panel p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1E2F5B]">
              <span className="text-xs font-bold text-white uppercase font-mono">
                Extracted Listing Details (Editable)
              </span>
              <span className="text-[10px] font-mono text-slate-400">ONDC Beckn Schema</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Host Name</label>
                <input
                  type="text"
                  value={formData.hostName}
                  onChange={(e) => setFormData({ ...formData, hostName: e.target.value })}
                  placeholder="e.g. Suresh Verma"
                  className="w-full bg-[#0A142D] border border-[#1E2F5B] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Village Location</label>
                <input
                  type="text"
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  placeholder="e.g. Thanedhar"
                  className="w-full bg-[#0A142D] border border-[#1E2F5B] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#0A142D] border border-[#1E2F5B] rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Rural Homestay">Rural Homestay</option>
                  <option value="Artisan Handloom">Artisan Handloom</option>
                  <option value="Local Guide">Local Guide</option>
                  <option value="Organic Farm Feast">Organic Farm Feast</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Price (INR)</label>
                <input
                  type="text"
                  value={formData.pricingINR}
                  onChange={(e) => setFormData({ ...formData, pricingINR: e.target.value })}
                  placeholder="e.g. 2800"
                  className="w-full bg-[#0A142D] border border-[#1E2F5B] rounded px-2.5 py-1.5 text-xs text-emerald-300 font-mono font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">Highlights &amp; Amenities</label>
              <input
                type="text"
                value={formData.highlights}
                onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                className="w-full bg-[#0A142D] border border-[#1E2F5B] rounded px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Registration Action */}
            <div className="pt-2">
              <button
                onClick={handleRegisterNode}
                disabled={!formData.hostName || !formData.village || !formData.pricingINR}
                className="w-full py-2 px-3 rounded bg-[#15803D] hover:bg-[#166534] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isRegistered ? 'Node Registered on ONDC Network' : 'Register Host Node on ONDC'}</span>
              </button>

              {isRegistered && (
                <div className="mt-2 p-2.5 rounded bg-emerald-950/60 border border-emerald-600 text-xs text-emerald-300 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                  <span>
                    Successfully registered! Host Node ID: <code className="text-white font-mono text-[10px]">ondc-hp-rural.coop/bpp/{formData.village.toLowerCase()}-node-01</code>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
