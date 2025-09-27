import React, { useState } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';

interface FloatingMicButtonProps {
  translations: any;
  language?: string;
}

const FloatingMicButton: React.FC<FloatingMicButtonProps> = ({ 
  translations, 
  language = 'en-US' 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    isListening,
    isSpeaking,
    transcript,
    response,
    isSupported,
    startListening,
    stopListening,
    stopSpeaking,
    greet,
    assistantName
  } = useVoiceAssistant({ 
    assistantName: 'Scout',
    language,
    voiceRate: 0.9,
    voicePitch: 1.1
  });

  if (!isSupported) {
    return null; // Hide if voice not supported
  }

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSpeakerClick = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      greet();
    }
  };

  return (
    <>
      {/* Main Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          variant={isListening ? "danger" : "farmer"}
          size="icon-lg"
          className={`
            shadow-strong rounded-full transition-all duration-300 
            ${isListening ? 'animate-pulse bg-error hover:bg-error/90' : ''}
            ${isSpeaking ? 'ring-4 ring-accent/50' : ''}
          `}
          onClick={() => {
            setIsExpanded(!isExpanded);
            if (!isExpanded) greet();
          }}
        >
          {isListening ? (
            <MicOff className="h-6 w-6" />
          ) : (
            <Mic className="h-6 w-6" />
          )}
          
          {/* Animated waves when listening */}
          {isListening && (
            <div className="absolute inset-0 rounded-full">
              <div className="absolute inset-0 rounded-full bg-error/30 animate-ping" />
              <div className="absolute inset-2 rounded-full bg-error/20 animate-ping animation-delay-75" />
              <div className="absolute inset-4 rounded-full bg-error/10 animate-ping animation-delay-150" />
            </div>
          )}
        </Button>
      </div>

      {/* Expanded Chat Widget */}
      {isExpanded && (
        <div className="fixed bottom-24 right-6 z-40 w-80 max-w-[calc(100vw-3rem)]">
          <Card className="shadow-strong border-2 border-primary/20 bg-background/95 backdrop-blur-sm">
            <CardContent className="p-4 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                    <span className="text-white text-sm font-bold">S</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{assistantName}</h4>
                    <p className="text-xs text-muted-foreground">Farming Assistant</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setIsExpanded(false)}
                  className="h-6 w-6"
                >
                  ×
                </Button>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                {isListening && (
                  <Badge variant="secondary" className="text-xs">
                    🎤 Listening...
                  </Badge>
                )}
                {isSpeaking && (
                  <Badge variant="secondary" className="text-xs">
                    🗣️ Speaking...
                  </Badge>
                )}
                {!isListening && !isSpeaking && (
                  <Badge variant="outline" className="text-xs">
                    💤 Ready to help
                  </Badge>
                )}
              </div>

              {/* Transcript */}
              {transcript && (
                <div className="bg-accent/10 p-3 rounded-lg">
                  <p className="text-sm font-medium text-foreground">You said:</p>
                  <p className="text-sm text-muted-foreground italic">"{transcript}"</p>
                </div>
              )}

              {/* Response */}
              {response && (
                <div className="bg-primary/10 p-3 rounded-lg">
                  <p className="text-sm font-medium text-foreground">{assistantName}:</p>
                  <p className="text-sm text-muted-foreground">{response}</p>
                </div>
              )}

              {/* Controls */}
              <div className="flex gap-2">
                <Button
                  variant={isListening ? "danger" : "outline"}
                  size="sm"
                  onClick={handleMicClick}
                  className="flex-1"
                >
                  {isListening ? (
                    <>
                      <MicOff className="h-4 w-4 mr-1" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4 mr-1" />
                      Talk
                    </>
                  )}
                </Button>
                
                <Button
                  variant={isSpeaking ? "warning" : "outline"}
                  size="sm"
                  onClick={handleSpeakerClick}
                >
                  {isSpeaking ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Quick Tips */}
              <div className="text-xs text-muted-foreground space-y-1">
                <p className="font-medium">💡 Quick tips:</p>
                <p>• Say "I have a disease problem" to get help</p>
                <p>• Mention your crop type for better advice</p>
                <p>• Describe symptoms you're seeing</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default FloatingMicButton;