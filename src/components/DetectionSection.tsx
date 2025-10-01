import React, { useState, useRef } from 'react';
import { Camera, Upload, Scan, CheckCircle, AlertTriangle, Lightbulb, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getRandomDisease } from '@/data/diseases';

interface DetectionSectionProps {
  translations: any;
  currentLanguage: string;
}

const DetectionSection: React.FC<DetectionSectionProps> = ({ translations, currentLanguage }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionResult, setDetectionResult] = useState<any>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setDetectionResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetection = async () => {
    if (!selectedImage) return;
    
    setIsDetecting(true);
    
    // Mock detection result using comprehensive disease database - in real app, this would call AI service
    setTimeout(() => {
      const randomDisease = getRandomDisease();
      setDetectionResult(randomDisease);
      setIsDetecting(false);
    }, 2000);
  };

  const openCamera = () => {
    // Mock camera functionality - in real app, this would open device camera
    alert("Camera functionality would open here. For demo, please use upload instead.");
  };

  const generateMultilingualText = (result: any): { en: string; hi: string; kn: string } => {
    const disease = {
      en: typeof result.disease === 'string' ? result.disease : result.disease.en,
      hi: typeof result.disease === 'string' ? result.disease : result.disease.hi,
      kn: typeof result.disease === 'string' ? result.disease : result.disease.kn,
    };
    const crop = {
      en: typeof result.crop === 'string' ? result.crop : result.crop.en,
      hi: typeof result.crop === 'string' ? result.crop : result.crop.hi,
      kn: typeof result.crop === 'string' ? result.crop : result.crop.kn,
    };
    const treatment = {
      en: typeof result.treatment === 'string' ? result.treatment : result.treatment.en,
      hi: typeof result.treatment === 'string' ? result.treatment : result.treatment.hi,
      kn: typeof result.treatment === 'string' ? result.treatment : result.treatment.kn,
    };
    const prevention = {
      en: typeof result.prevention === 'string' ? result.prevention : result.prevention.en,
      hi: typeof result.prevention === 'string' ? result.prevention : result.prevention.hi,
      kn: typeof result.prevention === 'string' ? result.prevention : result.prevention.kn,
    };

    return {
      en: `Problem: ${disease.en} in ${crop.en}. Treatment: ${treatment.en}. Prevention: ${prevention.en}`,
      hi: `समस्या: ${crop.hi} में ${disease.hi}. उपचार: ${treatment.hi}. रोकथाम: ${prevention.hi}`,
      kn: `ಸಮಸ್ಯೆ: ${crop.kn} ನಲ್ಲಿ ${disease.kn}. ಚಿಕಿತ್ಸೆ: ${treatment.kn}. ತಡೆಗಟ್ಟುವಿಕೆ: ${prevention.kn}`,
    };
  };

  const handleSpeak = () => {
    if (!detectionResult || isSpeaking) return;

    // Generate multilingual text object
    const multilingualText = generateMultilingualText(detectionResult);
    
    // Select text based on current language
    const textToSpeak = multilingualText[currentLanguage as keyof typeof multilingualText] || multilingualText.en;

    // Use browser's speech synthesis
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    const langCodes: { [key: string]: string } = {
      en: 'en-US',
      hi: 'hi-IN',
      kn: 'kn-IN'
    };
    utterance.lang = langCodes[currentLanguage] || 'en-US';
    utterance.rate = 0.85; // Slower for farmer-friendly clarity
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);

    // Log the multilingual JSON (can be sent to TTS API)
    console.log('Multilingual TTS Payload:', JSON.stringify(multilingualText, null, 2));
  };

  return (
    <section id="detect" className="py-20 bg-gradient-earth">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-foreground mb-4">
              {translations.detection.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {translations.detection.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scan className="h-5 w-5 text-primary" />
                  Upload Crop Image
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Image Preview */}
                {selectedImage ? (
                  <div className="relative">
                    <img
                      src={selectedImage}
                      alt="Selected crop"
                      className="w-full h-64 object-cover rounded-lg border-2 border-border"
                    />
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="absolute top-2 right-2 bg-error text-error-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-error/90 transition-fast"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
                    <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      No image selected. Choose an option below.
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button 
                    variant="farmer" 
                    size="lg" 
                    onClick={openCamera}
                    className="w-full"
                  >
                    <Camera className="h-5 w-5 mr-2" />
                    {translations.detection.buttons.camera}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    {translations.detection.buttons.upload}
                  </Button>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* Detect Button */}
                {selectedImage && (
                  <Button
                    variant="hero"
                    size="lg"
                    onClick={handleDetection}
                    disabled={isDetecting}
                    className="w-full"
                  >
                    {isDetecting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Scan className="h-5 w-5 mr-2" />
                        {translations.detection.buttons.detect}
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  {translations.detection.results.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {detectionResult ? (
                  <div className="space-y-6">
                     {/* Disease Info */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-foreground">
                          {typeof detectionResult.disease === 'string' ? detectionResult.disease : detectionResult.disease[translations.lang || 'en']}
                        </h3>
                        <Badge 
                          variant={detectionResult.confidence > 90 ? "default" : "secondary"}
                          className="text-sm"
                        >
                          {detectionResult.confidence}% {translations.detection.results.confidence}
                        </Badge>
                      </div>

                      {/* Listen Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSpeak}
                        disabled={isSpeaking}
                        className="w-full"
                      >
                        <Volume2 className={`h-4 w-4 mr-2 ${isSpeaking ? 'animate-pulse' : ''}`} />
                        {isSpeaking ? 'Speaking...' : 'Listen to Explanation'}
                      </Button>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Crop:</span>
                        <span className="font-medium">{typeof detectionResult.crop === 'string' ? detectionResult.crop : detectionResult.crop[translations.lang || 'en']}</span>
                        <span className="text-sm text-muted-foreground">Severity:</span>
                        <Badge variant={detectionResult.severity === 'High' ? 'destructive' : 'secondary'}>
                          {detectionResult.severity}
                        </Badge>
                      </div>
                    </div>

                    {/* Treatment */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-warning" />
                        {translations.detection.results.treatment}
                      </h4>
                      <div className="text-sm text-muted-foreground bg-warning/10 p-3 rounded-lg whitespace-pre-line">
                        {typeof detectionResult.treatment === 'string' ? detectionResult.treatment : detectionResult.treatment[translations.lang || 'en']}
                      </div>
                    </div>

                    {/* Prevention */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-accent" />
                        {translations.detection.results.prevention}
                      </h4>
                      <div className="text-sm text-muted-foreground bg-accent/10 p-3 rounded-lg whitespace-pre-line">
                        {typeof detectionResult.prevention === 'string' ? detectionResult.prevention : detectionResult.prevention[translations.lang || 'en']}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Scan className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">
                      Upload an image and click detect to see results here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetectionSection;