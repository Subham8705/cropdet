import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, TrendingUp, Shield, Zap, BarChart3, Sprout } from "lucide-react";
import heroImage from "@/assets/hero-farm.jpg";

const features = [
  {
    icon: Camera,
    title: "Disease Detection",
    description: "Upload crop images and get instant AI-powered disease diagnosis with treatment recommendations.",
  },
  {
    icon: TrendingUp,
    title: "Yield Prediction",
    description: "Predict your harvest using environmental data and machine learning models.",
  },
  {
    icon: Shield,
    title: "Early Prevention",
    description: "Catch diseases before they spread with proactive monitoring and alerts.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track your crop health history and yield trends over time.",
  },
];

const stats = [
  { value: "95%", label: "Detection Accuracy" },
  { value: "50+", label: "Crop Diseases" },
  { value: "10K+", label: "Farmers Helped" },
  { value: "24/7", label: "AI Available" },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Agricultural landscape with technology"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary-foreground mb-6">
              <Sprout className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Agriculture</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
              AI-Driven Crop Disease Detection & Yield Prediction
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 leading-relaxed">
              Detect crop diseases early and predict your harvest using artificial intelligence. 
              Empowering farmers with technology for sustainable agriculture.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild variant="hero" size="xl">
                <Link to="/detect">
                  <Camera className="w-5 h-5" />
                  Upload Crop Image
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <Link to="/predict">
                  <TrendingUp className="w-5 h-5" />
                  Predict Yield
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-primary-foreground/70 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Powerful Features for Smart Farming
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI models are trained on thousands of crop images and environmental datasets 
              to provide accurate insights for your farm.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="card-hover border-border/50 bg-card animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Zap className="w-12 h-12 text-accent mx-auto mb-6" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Transform Your Farming?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Start using AI-powered crop analysis today. No installation required - 
              just upload your images and get instant insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="hero" size="lg">
                <Link to="/detect">Get Started Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/about">Learn How It Works</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}