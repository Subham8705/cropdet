import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Brain, Database, Activity, Target, Layers, Cpu, 
  BarChart3, Zap, CheckCircle2, Code2 
} from "lucide-react";

const modelSpecs = {
  diseaseDetection: {
    name: "Plant Disease CNN",
    architecture: "MobileNetV2 (Transfer Learning from ImageNet)",
    accuracy: "~95%",
    trainingData: "PlantVillage Dataset (54,000+ images)",
    classes: "38 disease/healthy categories",
    inputSize: "224×224 RGB",
    features: [
      "Transfer learning from ImageNet pre-trained weights",
      "Data augmentation (rotation, shift, zoom, flip)",
      "GlobalAveragePooling2D + Dense layers with Dropout",
      "Softmax multi-class classification",
      "Early stopping & learning rate scheduler"
    ]
  },
  yieldPrediction: {
    name: "Yield Prediction Engine",
    architecture: "Rule-Based Scoring with Agronomic Knowledge Base",
    accuracy: "85% confidence (deterministic)",
    trainingData: "Built-in crop knowledge base for 10 crops",
    features: [
      "Environment-to-yield scoring algorithm",
      "Temperature, rainfall & soil suitability checks",
      "Risk level assessment (low / medium / high)",
      "Smart fertilizer & irrigation recommendations",
      "±10% yield range estimation"
    ],
    inputs: [
      "Crop type",
      "Location",
      "Soil type",
      "Temperature (°C)",
      "Seasonal Rainfall (mm)",
      "Humidity (%)"
    ]
  }
};

const techStack = [
  { name: "React + Vite", description: "Modern frontend framework", icon: Code2 },
  { name: "FastAPI (Python)", description: "Backend API server", icon: Zap },
  { name: "TensorFlow / Keras", description: "Deep learning framework", icon: Cpu },
  { name: "PlantVillage Dataset", description: "54,000+ labeled crop images", icon: Database },
];

const supportedCrops = [
  "Wheat", "Rice", "Corn/Maize", "Soybean", "Cotton",
  "Sugarcane", "Potato", "Tomato", "Onion", "Barley"
];

const detectedPlants = [
  "Apple", "Blueberry", "Cherry", "Corn", "Grape", "Orange",
  "Peach", "Pepper", "Potato", "Raspberry", "Soybean",
  "Squash", "Strawberry", "Tomato"
];

export default function About() {
  return (
    <Layout>
      <div className="min-h-[calc(100vh-5rem)] py-12 bg-background">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Brain className="w-4 h-4" />
              <span className="text-sm font-medium">How It Works</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              About CropWise AI
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Learn about the AI models and technology behind our crop disease detection 
              and yield prediction systems.
            </p>
          </div>

          {/* Disease Detection Model */}
          <Card className="border-border/50 mb-8 animate-fade-in">
            <CardHeader className="bg-primary/5 border-b border-border/50">
              <CardTitle className="font-display flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-2xl">{modelSpecs.diseaseDetection.name}</div>
                  <div className="text-sm font-normal text-muted-foreground">
                    Disease Detection Model
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Architecture Details</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Base Model</span>
                      <span className="font-medium text-foreground">{modelSpecs.diseaseDetection.architecture}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Accuracy</span>
                      <span className="font-bold text-primary text-lg">{modelSpecs.diseaseDetection.accuracy}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Training Data</span>
                      <span className="font-medium text-foreground">{modelSpecs.diseaseDetection.trainingData}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Output Classes</span>
                      <span className="font-medium text-foreground">{modelSpecs.diseaseDetection.classes}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">Input Size</span>
                      <span className="font-medium text-foreground">{modelSpecs.diseaseDetection.inputSize}</span>
                    </div>
                  </div>

                  <h3 className="font-semibold text-foreground mb-3 mt-8">Supported Plants</h3>
                  <div className="flex flex-wrap gap-2">
                    {detectedPlants.map((plant, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                      >
                        {plant}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Key Features</h3>
                  <ul className="space-y-3">
                    {modelSpecs.diseaseDetection.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Yield Prediction Model */}
          <Card className="border-border/50 mb-8 animate-fade-in">
            <CardHeader className="bg-accent/10 border-b border-border/50">
              <CardTitle className="font-display flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                  <Target className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <div className="text-2xl">{modelSpecs.yieldPrediction.name}</div>
                  <div className="text-sm font-normal text-muted-foreground">
                    Crop Yield Prediction
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Architecture Details</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Approach</span>
                      <span className="font-medium text-foreground">{modelSpecs.yieldPrediction.architecture}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Confidence</span>
                      <span className="font-bold text-primary text-lg">{modelSpecs.yieldPrediction.accuracy}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">Knowledge Base</span>
                      <span className="font-medium text-foreground">{modelSpecs.yieldPrediction.trainingData}</span>
                    </div>
                  </div>

                  <h3 className="font-semibold text-foreground mb-4 mt-8">Input Parameters</h3>
                  <div className="flex flex-wrap gap-2">
                    {modelSpecs.yieldPrediction.inputs.map((input, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                      >
                        {input}
                      </span>
                    ))}
                  </div>

                  <h3 className="font-semibold text-foreground mb-3 mt-8">Supported Crops</h3>
                  <div className="flex flex-wrap gap-2">
                    {supportedCrops.map((crop, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 rounded-full bg-accent/20 text-accent-foreground text-sm"
                      >
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Key Features</h3>
                  <ul className="space-y-3">
                    {modelSpecs.yieldPrediction.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tech Stack */}
          <div className="mb-8">
            <h2 className="font-display text-2xl font-bold text-foreground text-center mb-8">
              Technology Stack
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {techStack.map((item, index) => (
                <Card 
                  key={index} 
                  className="border-border/50 card-hover animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <Card className="border-border/50 animate-fade-in">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 rounded-xl bg-muted/50">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary-foreground font-bold text-lg">1</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Upload or Input</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload a crop leaf image for disease detection, or enter environmental data for yield prediction.
                  </p>
                </div>
                <div className="text-center p-6 rounded-xl bg-muted/50">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary-foreground font-bold text-lg">2</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">AI Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    The CNN model classifies the disease from the image, or the yield engine scores environmental conditions against crop-specific ideal ranges.
                  </p>
                </div>
                <div className="text-center p-6 rounded-xl bg-muted/50">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary-foreground font-bold text-lg">3</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Results & Recommendations</h3>
                  <p className="text-sm text-muted-foreground">
                    Get diagnosis with confidence scores and treatment plans, or yield estimates with risk levels and actionable farming tips.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}