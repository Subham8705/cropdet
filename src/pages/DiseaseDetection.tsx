import { useState, useCallback } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Camera, Loader2, AlertTriangle, CheckCircle2, Info, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { saveDetection } from "@/lib/history";

interface DetectionResult {
  disease_name: string;
  confidence: number;
  description: string;
  treatment: string;
  prevention: string[];
  severity: "low" | "medium" | "high";
}

export default function DiseaseDetection() {
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    setResult(null);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const analyzeImage = async () => {
    if (!selectedFile || !imagePreview) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("http://localhost:8000/predict/disease", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();

      setResult(data as DetectionResult);
      // Save to localStorage for dashboard history
      saveDetection({
        disease_name: data.disease_name,
        confidence: data.confidence,
        severity: data.severity,
      });
      toast({
        title: "Analysis Complete",
        description: "Disease detection results are ready.",
      });
    } catch (error) {
      console.error("Detection error:", error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setImagePreview(null);
    setSelectedFile(null);
    setResult(null);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low": return "text-success bg-success/10";
      case "medium": return "text-warning bg-warning/10";
      case "high": return "text-destructive bg-destructive/10";
      default: return "text-muted-foreground bg-muted";
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-5rem)] py-12 bg-background">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Camera className="w-4 h-4" />
              <span className="text-sm font-medium">AI Disease Detection</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Crop Disease Detection
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload a photo of your crop and our AI will analyze it for diseases,
              providing diagnosis and treatment recommendations.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Upload Section */}
            <Card className="border-border/50 animate-fade-in">
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  Upload Crop Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!imagePreview ? (
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${dragActive
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                      }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Camera className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                      Drag & Drop or Click to Upload
                    </h3>
                    <p className="text-muted-foreground">
                      Supports JPG, PNG, WEBP (Max 10MB)
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative rounded-xl overflow-hidden bg-muted aspect-square">
                      <img
                        src={imagePreview}
                        alt="Uploaded crop"
                        className="w-full h-full object-cover"
                      />
                      {loading && (
                        <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
                          <div className="text-center text-primary-foreground">
                            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-2" />
                            <p className="font-medium">Analyzing image...</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={analyzeImage}
                        disabled={loading}
                        variant="hero"
                        className="flex-1"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Camera className="w-4 h-4" />
                            Analyze Image
                          </>
                        )}
                      </Button>
                      <Button onClick={resetAnalysis} variant="outline" disabled={loading}>
                        Reset
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card className={`border-border/50 animate-fade-in ${!result && "opacity-60"}`}>
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Detection Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!result ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <Info className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                      No Analysis Yet
                    </h3>
                    <p className="text-muted-foreground">
                      Upload and analyze an image to see results here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Disease Name & Confidence */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-2 ${getSeverityColor(result.severity)}`}>
                          <AlertTriangle className="w-4 h-4" />
                          {result.severity.toUpperCase()} SEVERITY
                        </div>
                        <h3 className="font-display text-2xl font-bold text-foreground">
                          {result.disease_name}
                        </h3>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Confidence</div>
                        <div className="font-display text-2xl font-bold text-primary">
                          {Math.round(result.confidence * 100)}%
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Description</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {result.description}
                      </p>
                    </div>

                    {/* Treatment */}
                    <div className="p-4 rounded-xl bg-success/10 border border-success/20">
                      <h4 className="font-semibold text-success mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Recommended Treatment
                      </h4>
                      <p className="text-foreground leading-relaxed">
                        {result.treatment}
                      </p>
                    </div>

                    {/* Prevention */}
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Prevention Tips</h4>
                      <ul className="space-y-2">
                        {result.prevention.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2 text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}