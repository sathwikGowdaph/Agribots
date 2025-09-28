import React, { useState, useRef } from 'react';
import { Camera, Upload, Scan, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DetectionSectionProps {
  translations: any;
}

const DetectionSection: React.FC<DetectionSectionProps> = ({ translations }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionResult, setDetectionResult] = useState<any>(null);
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
    
    // Mock detection result with multilingual responses - in real app, this would call AI service
    setTimeout(() => {
      setDetectionResult({
        disease: {
          en: "Late Blight",
          hi: "लेट ब्लाइट (पछेता अंगमारी)",
          kn: "ಲೇಟ್ ಬ್ಲೈಟ್ (ತಡವಾದ ಕುಗ್ಗುವಿಕೆ)"
        },
        confidence: 94,
        severity: "Moderate",
        crop: {
          en: "Tomato",
          hi: "टमाटर",
          kn: "ಟೊಮ್ಯಾಟೊ"
        },
        treatment: {
          en: "• Apply copper-based fungicide immediately\n• Remove infected leaves and destroy them\n• Improve air circulation around plants\n• Water at soil level, not on leaves\n• Apply treatment in early morning or evening",
          hi: "• तुरंत कॉपर आधारित फफूंदनाशी का छिड़काव करें\n• संक्रमित पत्तियों को हटाकर नष्ट कर दें\n• पौधों के चारों ओर हवा का संचार बेहतर बनाएं\n• पत्तियों पर नहीं, मिट्टी के स्तर पर पानी दें\n• सुबह जल्दी या शाम को उपचार करें",
          kn: "• ತಕ್ಷಣ ತಾಮ್ರ ಆಧಾರಿತ ಶಿಲಾರಸವನ್ನು ಸಿಂಪಡಿಸಿ\n• ಸೋಂಕಿತ ಎಲೆಗಳನ್ನು ತೆಗೆದು ನಾಶಮಾಡಿ\n• ಸಸ್ಯಗಳ ಸುತ್ತ ಗಾಳಿ ಪ್ರಸರಣವನ್ನು ಸುಧಾರಿಸಿ\n• ಎಲೆಗಳ ಮೇಲೆ ಅಲ್ಲ, ಮಣ್ಣಿನ ಮಟ್ಟದಲ್ಲಿ ನೀರು ಹಾಕಿ\n• ಬೆಳಿಗ್ಗೆ ಅಥವಾ ಸಂಜೆ ಚಿಕಿತ್ಸೆ ಮಾಡಿ"
        },
        prevention: {
          en: "• Plant disease-resistant tomato varieties\n• Maintain proper spacing between plants\n• Avoid overhead watering systems\n• Apply preventive fungicide spray monthly\n• Practice crop rotation with non-solanaceous crops",
          hi: "• रोग प्रतिरोधी टमाटर की किस्में लगाएं\n• पौधों के बीच उचित दूरी बनाए रखें\n• ऊपर से पानी देने की व्यवस्था से बचें\n• मासिक रूप से निवारक फफूंदनाशी का छिड़काव करें\n• सोलेनेसी परिवार की फसलों के अतिरिक्त अन्य फसलों के साथ फसल चक्र अपनाएं",
          kn: "• ರೋಗ ನಿರೋಧಕ ಟೊಮ್ಯಾಟೊ ಪ್ರಭೇದಗಳನ್ನು ನೆಡಿ\n• ಸಸ್ಯಗಳ ನಡುವೆ ಸರಿಯಾದ ಅಂತರವನ್ನು ಕಾಯ್ದುಕೊಳ್ಳಿ\n• ಮೇಲಿನಿಂದ ನೀರುಣಿಸುವ ವ್ಯವಸ್ಥೆಯನ್ನು ತಪ್ಪಿಸಿ\n• ಮಾಸಿಕ ತಡೆಗಟ್ಟುವ ಶಿಲಾರಸ ಸಿಂಪಡಣೆ ಮಾಡಿ\n• ಸೊಲೆನೇಸಿಯಸ್ ಅಲ್ಲದ ಬೆಳೆಗಳೊಂದಿಗೆ ಬೆಳೆ ಸರದಿ ಅಭ್ಯಾಸ ಮಾಡಿ"
        }
      });
      setIsDetecting(false);
    }, 2000);
  };

  const openCamera = () => {
    // Mock camera functionality - in real app, this would open device camera
    alert("Camera functionality would open here. For demo, please use upload instead.");
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