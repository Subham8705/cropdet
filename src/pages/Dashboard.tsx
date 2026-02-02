import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, Camera, TrendingUp, Activity, 
  Calendar, ArrowUpRight, AlertTriangle, CheckCircle2 
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from "recharts";

// Demo data for charts
const yieldTrendData = [
  { month: "Jan", yield: 2400, predicted: 2200 },
  { month: "Feb", yield: 1398, predicted: 1500 },
  { month: "Mar", yield: 3800, predicted: 3600 },
  { month: "Apr", yield: 3908, predicted: 4000 },
  { month: "May", yield: 4800, predicted: 4700 },
  { month: "Jun", yield: 3800, predicted: 3900 },
];

const diseaseData = [
  { name: "Leaf Blight", count: 12, color: "hsl(var(--chart-1))" },
  { name: "Powdery Mildew", count: 8, color: "hsl(var(--chart-2))" },
  { name: "Root Rot", count: 5, color: "hsl(var(--chart-3))" },
  { name: "Healthy", count: 25, color: "hsl(var(--chart-4))" },
];

const recentDetections = [
  { id: 1, date: "2026-02-01", crop: "Wheat", disease: "Leaf Blight", severity: "medium" },
  { id: 2, date: "2026-01-30", crop: "Rice", disease: "Healthy", severity: "low" },
  { id: 3, date: "2026-01-28", crop: "Corn", disease: "Rust", severity: "high" },
  { id: 4, date: "2026-01-25", crop: "Tomato", disease: "Early Blight", severity: "medium" },
];

const recentPredictions = [
  { id: 1, date: "2026-02-01", crop: "Wheat", yield: "4,200 kg/acre", risk: "low" },
  { id: 2, date: "2026-01-29", crop: "Rice", yield: "3,800 kg/acre", risk: "medium" },
  { id: 3, date: "2026-01-26", crop: "Corn", yield: "5,100 kg/acre", risk: "low" },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "low": return "text-success bg-success/10";
    case "medium": return "text-warning bg-warning/10";
    case "high": return "text-destructive bg-destructive/10";
    default: return "text-muted-foreground bg-muted";
  }
};

export default function Dashboard() {
  return (
    <Layout>
      <div className="min-h-[calc(100vh-5rem)] py-12 bg-background">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 animate-fade-in">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
                <LayoutDashboard className="w-4 h-4" />
                <span className="text-sm font-medium">Analytics Dashboard</span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Your Farm Dashboard
              </h1>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <Button asChild variant="outline">
                <Link to="/detect">
                  <Camera className="w-4 h-4" />
                  New Detection
                </Link>
              </Button>
              <Button asChild variant="hero">
                <Link to="/predict">
                  <TrendingUp className="w-4 h-4" />
                  New Prediction
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Detections", value: "50", icon: Camera, change: "+12 this week" },
              { label: "Predictions Made", value: "24", icon: TrendingUp, change: "+5 this week" },
              { label: "Healthy Crops", value: "82%", icon: CheckCircle2, change: "+3% vs last month" },
              { label: "Avg Yield", value: "4.2K", icon: Activity, change: "kg/acre" },
            ].map((stat, index) => (
              <Card key={index} className="border-border/50 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="font-display text-2xl lg:text-3xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.change}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Yield Trend Chart */}
            <Card className="border-border/50 animate-fade-in">
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Yield Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={yieldTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="yield" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={3}
                        dot={{ fill: "hsl(var(--primary))" }}
                        name="Actual Yield"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="predicted" 
                        stroke="hsl(var(--chart-2))" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Predicted"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Disease Distribution */}
            <Card className="border-border/50 animate-fade-in">
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Disease Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center">
                  <div className="w-1/2">
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={diseaseData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          dataKey="count"
                          paddingAngle={2}
                        >
                          {diseaseData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-1/2 space-y-3">
                    {diseaseData.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-muted-foreground">{item.name}</span>
                        <span className="text-sm font-semibold text-foreground ml-auto">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* History Tables */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Detections */}
            <Card className="border-border/50 animate-fade-in">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-display flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary" />
                  Recent Detections
                </CardTitle>
                <Link to="/detect" className="text-sm text-primary hover:underline flex items-center gap-1">
                  View all <ArrowUpRight className="w-3 h-3" />
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentDetections.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Camera className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{item.crop}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            {item.date}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(item.severity)}`}>
                          {item.severity === "high" && <AlertTriangle className="w-3 h-3" />}
                          {item.disease}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Predictions */}
            <Card className="border-border/50 animate-fade-in">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-display flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Recent Predictions
                </CardTitle>
                <Link to="/predict" className="text-sm text-primary hover:underline flex items-center gap-1">
                  View all <ArrowUpRight className="w-3 h-3" />
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentPredictions.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{item.crop}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            {item.date}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-foreground">{item.yield}</div>
                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(item.risk)}`}>
                          Risk: {item.risk}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}