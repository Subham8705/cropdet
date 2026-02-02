import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Brain, Database, Activity, Target, Layers, Cpu, 
  BarChart3, Zap, CheckCircle2, Code2 
} from "lucide-react";

const modelSpecs = {
  diseaseDetection: {
    name: "CropDiseaseNet CNN",
    architecture: "ResNet-50 based Convolutional Neural Network",
    accuracy: "95.2%",
    trainingData: "50,000+ labeled crop images",
    classes: "50+ disease categories",
    inputSize: "224x224 RGB",
    features: [
      "Transfer learning from ImageNet weights",
      "Data augmentation for robustness",
      "Multi-class classification with softmax",
      "Confidence score calibration",
      "Real-time inference optimization"
    ]
  },
  yieldPrediction: {
    name: "YieldPredictor ML",
    architecture: "Gradient Boosting Ensemble (XGBoost)",
    accuracy: "R² Score: 0.89",
    trainingData: "Historical yield data from 10+ regions",
    features: [
      "Feature engineering for weather patterns",
      "Soil quality integration",
      "Seasonal trend analysis",
      "Uncertainty quantification",
      "Regional calibration"
    ],
    inputs: [
      "Crop type and variety",
      "Geographic location",
      "Soil composition",
      "Temperature & rainfall",
      "Humidity levels"
    ]
  }
};

const dataSources = [
  { name: "PlantVillage Dataset", description: "54,000+ crop disease images", icon: Database },
  { name: "FAO Crop Statistics", description: "Global yield data 1990-2025", icon: BarChart3 },
  { name: "Weather APIs", description: "Real-time environmental data", icon: Activity },
  { name: "Soil Databases", description: "Regional soil composition data", icon: Layers },
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
              <span className="text-sm font-medium">AI Model Information</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              How Our AI Works
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Learn about the machine learning models powering our crop disease detection 
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
                      <span className="text-muted-foreground">Model Type</span>
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
                      <span className="text-muted-foreground">Classes</span>
                      <span className="font-medium text-foreground">{modelSpecs.diseaseDetection.classes}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">Input Size</span>
                      <span className="font-medium text-foreground">{modelSpecs.diseaseDetection.inputSize}</span>
                    </div>
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
                    Yield Prediction Model
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
                      <span className="text-muted-foreground">Model Type</span>
                      <span className="font-medium text-foreground">{modelSpecs.yieldPrediction.architecture}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Accuracy</span>
                      <span className="font-bold text-primary text-lg">{modelSpecs.yieldPrediction.accuracy}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">Training Data</span>
                      <span className="font-medium text-foreground">{modelSpecs.yieldPrediction.trainingData}</span>
                    </div>
                  </div>

                  <h3 className="font-semibold text-foreground mb-4 mt-8">Input Features</h3>
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

          {/* Data Sources */}
          <div className="mb-8">
            <h2 className="font-display text-2xl font-bold text-foreground text-center mb-8">
              Data Sources
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {dataSources.map((source, index) => (
                <Card 
                  key={index} 
                  className="border-border/50 card-hover animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <source.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{source.name}</h3>
                    <p className="text-sm text-muted-foreground">{source.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Training Process */}
          <Card className="border-border/50 animate-fade-in">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Training & Deployment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 rounded-xl bg-muted/50">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary-foreground font-bold text-lg">1</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Data Collection</h3>
                  <p className="text-sm text-muted-foreground">
                    Curated datasets from agricultural research institutions and real-world farm data.
                  </p>
                </div>
                <div className="text-center p-6 rounded-xl bg-muted/50">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary-foreground font-bold text-lg">2</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Model Training</h3>
                  <p className="text-sm text-muted-foreground">
                    Trained on GPU clusters with cross-validation and hyperparameter optimization.
                  </p>
                </div>
                <div className="text-center p-6 rounded-xl bg-muted/50">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary-foreground font-bold text-lg">3</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Real-time Inference</h3>
                  <p className="text-sm text-muted-foreground">
                    Deployed as serverless functions for scalable, low-latency predictions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Documentation Teaser */}
          <div className="mt-12 text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-primary-foreground">
              <Code2 className="w-5 h-5" />
              <span className="font-medium">API Endpoints: /detect-disease, /predict-yield, /history</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}