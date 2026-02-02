import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Loader2, Droplets, Thermometer, Wind, BarChart3, AlertCircle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PredictionResult {
  predicted_yield: number;
  unit: string;
  risk_level: "low" | "medium" | "high";
  confidence: number;
  recommendations: {
    fertilizer: string;
    irrigation: string;
    general: string[];
  };
}

const cropTypes = [
  "Wheat", "Rice", "Corn/Maize", "Soybean", "Cotton", 
  "Sugarcane", "Potato", "Tomato", "Onion", "Barley"
];

const soilTypes = [
  "Clay", "Sandy", "Loamy", "Silt", "Peat", "Chalky", "Saline"
];

export default function YieldPrediction() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    cropType: "",
    location: "",
    soilType: "",
    temperature: "",
    rainfall: "",
    humidity: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = Object.values(formData).every((value) => value.trim() !== "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await supabase.functions.invoke("predict-yield", {
        body: {
          crop_type: formData.cropType,
          location: formData.location,
          soil_type: formData.soilType,
          temperature: parseFloat(formData.temperature),
          rainfall: parseFloat(formData.rainfall),
          humidity: parseFloat(formData.humidity),
        },
      });

      if (response.error) throw response.error;

      setResult(response.data as PredictionResult);
      toast({
        title: "Prediction Complete",
        description: "Your yield prediction is ready.",
      });
    } catch (error) {
      console.error("Prediction error:", error);
      toast({
        title: "Prediction Failed",
        description: "Could not generate prediction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "text-success bg-success/10 border-success/20";
      case "medium": return "text-warning bg-warning/10 border-warning/20";
      case "high": return "text-destructive bg-destructive/10 border-destructive/20";
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
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">ML Yield Prediction</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Crop Yield Prediction
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enter environmental and crop data to get AI-powered yield predictions 
              with recommendations for optimal harvest.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Form Section */}
            <Card className="border-border/50 animate-fade-in">
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Enter Crop Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Crop Type */}
                  <div className="space-y-2">
                    <Label htmlFor="cropType">Crop Type</Label>
                    <Select
                      value={formData.cropType}
                      onValueChange={(value) => handleInputChange("cropType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select crop type" />
                      </SelectTrigger>
                      <SelectContent>
                        {cropTypes.map((crop) => (
                          <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location">Location / Region</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Punjab, India"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                    />
                  </div>

                  {/* Soil Type */}
                  <div className="space-y-2">
                    <Label htmlFor="soilType">Soil Type</Label>
                    <Select
                      value={formData.soilType}
                      onValueChange={(value) => handleInputChange("soilType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select soil type" />
                      </SelectTrigger>
                      <SelectContent>
                        {soilTypes.map((soil) => (
                          <SelectItem key={soil} value={soil}>{soil}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Environmental Data */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="temperature" className="flex items-center gap-1">
                        <Thermometer className="w-4 h-4 text-destructive" />
                        Temp (°C)
                      </Label>
                      <Input
                        id="temperature"
                        type="number"
                        placeholder="28"
                        value={formData.temperature}
                        onChange={(e) => handleInputChange("temperature", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rainfall" className="flex items-center gap-1">
                        <Droplets className="w-4 h-4 text-primary" />
                        Rain (mm)
                      </Label>
                      <Input
                        id="rainfall"
                        type="number"
                        placeholder="120"
                        value={formData.rainfall}
                        onChange={(e) => handleInputChange("rainfall", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="humidity" className="flex items-center gap-1">
                        <Wind className="w-4 h-4 text-muted-foreground" />
                        Humidity %
                      </Label>
                      <Input
                        id="humidity"
                        type="number"
                        placeholder="65"
                        value={formData.humidity}
                        onChange={(e) => handleInputChange("humidity", e.target.value)}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full"
                    disabled={loading || !isFormValid}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Predicting...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-4 h-4" />
                        Predict Yield
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card className={`border-border/50 animate-fade-in ${!result && "opacity-60"}`}>
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Prediction Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!result ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                      No Prediction Yet
                    </h3>
                    <p className="text-muted-foreground">
                      Fill in the form and submit to see yield predictions.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Yield Prediction */}
                    <div className="text-center p-6 rounded-xl bg-primary/5 border border-primary/10">
                      <div className="text-sm text-muted-foreground mb-1">Predicted Yield</div>
                      <div className="font-display text-5xl font-bold text-primary mb-1">
                        {result.predicted_yield.toLocaleString()}
                      </div>
                      <div className="text-lg text-muted-foreground">{result.unit}</div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        Confidence: {Math.round(result.confidence * 100)}%
                      </div>
                    </div>

                    {/* Risk Level */}
                    <div className={`p-4 rounded-xl border ${getRiskColor(result.risk_level)}`}>
                      <div className="flex items-center gap-2 font-semibold">
                        <AlertCircle className="w-5 h-5" />
                        Risk Level: {result.risk_level.toUpperCase()}
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-foreground">Recommendations</h4>
                      
                      <div className="p-4 rounded-xl bg-success/10 border border-success/20">
                        <h5 className="font-semibold text-success mb-1 flex items-center gap-2">
                          <Droplets className="w-4 h-4" />
                          Irrigation
                        </h5>
                        <p className="text-foreground text-sm">{result.recommendations.irrigation}</p>
                      </div>

                      <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
                        <h5 className="font-semibold text-warning mb-1 flex items-center gap-2">
                          <BarChart3 className="w-4 h-4" />
                          Fertilizer
                        </h5>
                        <p className="text-foreground text-sm">{result.recommendations.fertilizer}</p>
                      </div>

                      <div>
                        <h5 className="font-semibold text-foreground mb-2">General Tips</h5>
                        <ul className="space-y-2">
                          {result.recommendations.general.map((tip, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
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