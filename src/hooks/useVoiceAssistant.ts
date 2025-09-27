import { useState, useRef, useCallback } from 'react';

// Extend Window interface for Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface VoiceAssistantConfig {
  assistantName?: string;
  language?: string;
  voiceRate?: number;
  voicePitch?: number;
}

export const useVoiceAssistant = (config: VoiceAssistantConfig = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  const {
    assistantName = 'Scout',
    language = 'en-US',
    voiceRate = 0.9,
    voicePitch = 1.1
  } = config;

  // Initialize speech recognition
  const initializeRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
      return null;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      
      if (finalTranscript) {
        setTranscript(finalTranscript);
        handleVoiceInput(finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return recognition;
  }, [language]);

  // AI understanding and response generation
  const handleVoiceInput = useCallback((input: string) => {
    const lowerInput = input.toLowerCase();
    let aiResponse = '';

    // Rule-based AI responses for farming concerns
    if (lowerInput.includes('disease') || lowerInput.includes('sick') || lowerInput.includes('problem')) {
      aiResponse = `Hi there! I'm ${assistantName}, your farming assistant. I heard you mention a crop issue. Can you tell me what crop you're dealing with and describe what you're seeing? I'm here to help you identify and solve it!`;
    } else if (lowerInput.includes('pest') || lowerInput.includes('bug') || lowerInput.includes('insect')) {
      aiResponse = `Don't worry! Pests can be managed effectively. Tell me more about what you're seeing - are there holes in leaves, sticky substances, or visible insects? I'll help you identify the pest and suggest the best treatment.`;
    } else if (lowerInput.includes('leaf') || lowerInput.includes('leaves')) {
      aiResponse = `Leaf problems can tell us a lot about plant health! Are the leaves yellowing, browning, wilting, or showing spots? Upload a photo and I'll help you diagnose the issue quickly.`;
    } else if (lowerInput.includes('tomato') || lowerInput.includes('potato') || lowerInput.includes('crop')) {
      aiResponse = `Great! I love helping with crop health. What specific symptoms are you noticing? Take a clear photo of the affected plant parts and I'll analyze it for you with high accuracy.`;
    } else if (lowerInput.includes('help') || lowerInput.includes('how')) {
      aiResponse = `I'm here to help you succeed! Simply upload a photo of your crop concern, or describe what you're seeing. I can identify diseases, pests, and provide instant treatment recommendations. What would you like to know?`;
    } else {
      aiResponse = `Hello! I'm ${assistantName}, your AI farming companion. I can help identify crop diseases and pests from photos with up to 99% accuracy. What farming challenge can I help you with today?`;
    }

    setResponse(aiResponse);
    speakResponse(aiResponse);
  }, [assistantName]);

  // Text-to-speech functionality
  const speakResponse = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Text-to-speech not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = voiceRate;
    utterance.pitch = voicePitch;
    utterance.volume = 0.8;

    // Try to use a pleasant voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.lang.startsWith(language.split('-')[0]) && 
      (voice.name.includes('Female') || voice.name.includes('Google'))
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [voiceRate, voicePitch, language]);

  // Start listening
  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      recognitionRef.current = initializeRecognition();
    }
    
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    }
  }, [initializeRecognition, isListening]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Quick voice greeting
  const greet = useCallback(() => {
    const greeting = `Hi! I'm ${assistantName}, your smart farming assistant. Tap the mic and tell me about any crop concerns you have!`;
    speakResponse(greeting);
  }, [assistantName, speakResponse]);

  return {
    isListening,
    isSpeaking,
    transcript,
    response,
    isSupported,
    startListening,
    stopListening,
    stopSpeaking,
    speakResponse,
    greet,
    assistantName
  };
};