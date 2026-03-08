import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, Camera, TrendingUp, Activity, 
  Calendar, ArrowUpRight, AlertTriangle, CheckCircle2, Trash2, Inbox
} from "lucide-react";
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from "recharts";
import { 
  getDetections, getPredictions, getStats,
  clearDetections, clearPredictions,
  type DetectionRecord, type PredictionRecord
} from "@/lib/history";

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "low": return "text-success bg-success/10";
    case "medium": return "text-warning bg-warning/10";
    case "high": return "text-destructive bg-destructive/10";
    default: return "text-muted-foreground bg-muted";
  }
};

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric"
  });
}

function formatDiseaseName(name: string) {
  // "Tomato___Early_blight" → "Tomato - Early blight"
  return name
    .replace(/___/g, " – ")
    .replace(/_/g, " ");
}

export default function Dashboard() {
  const [detections, setDetections] = useState<DetectionRecord[]>([]);
  const [predictions, setPredictions] = useState<PredictionRecord[]>([]);
  const [stats, setStats] = useState(getStats());

  const refresh = () => {
    setDetections(getDetections());
    setPredictions(getPredictions());
    setStats(getStats());
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleClearAll = () => {
    clearDetections();
    clearPredictions();
    refresh();
  };

  const hasData = detections.length > 0 || predictions.length > 0;

  // Build disease distribution for pie chart
  const diseaseCountMap: Record<string, number> = {};
  detections.forEach(d => {
    const name = formatDiseaseName(d.disease_name);
    diseaseCountMap[name] = (diseaseCountMap[name] || 0) + 1;
  });
  const diseaseChartData = Object.entries(diseaseCountMap)
    .map(([name, count], i) => ({
      name,
      count,
      color: CHART_COLORS[i % CHART_COLORS.length],
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6); // top 6

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
              <p className="text-sm text-muted-foreground mt-1">
                All data is stored locally on your device — no login required.
              </p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              {hasData && (
                <Button variant="outline" size="sm" onClick={handleClearAll} className="text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                  Clear History
                </Button>
              )}
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

          {!hasData ? (
            /* Empty State */
            <Card className="border-border/50 animate-fade-in">
              <CardContent className="py-16">
                <div className="text-center max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Inbox className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                    No Data Yet
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Start by detecting a crop disease or predicting yield. Your results will appear here automatically.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button asChild variant="outline">
                      <Link to="/detect">
                        <Camera className="w-4 h-4" />
                        Detect Disease
                      </Link>
                    </Button>
                    <Button asChild variant="hero">
                      <Link to="/predict">
                        <TrendingUp className="w-4 h-4" />
                        Predict Yield
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Total Detections", value: stats.totalDetections.toString(), icon: Camera, sub: "disease scans" },
                  { label: "Predictions Made", value: stats.totalPredictions.toString(), icon: TrendingUp, sub: "yield predictions" },
                  { label: "Healthy Crops", value: stats.totalDetections > 0 ? `${stats.healthyPercent}%` : "—", icon: CheckCircle2, sub: "of scanned crops" },
                  { label: "Avg Yield", value: stats.avgYield > 0 ? stats.avgYield.toLocaleString() : "—", icon: Activity, sub: stats.avgUnit },
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
                      <div className="text-xs text-muted-foreground mt-1">{stat.sub}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Charts Row */}
              {diseaseChartData.length > 0 && (
                <div className="mb-8">
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
                                data={diseaseChartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                dataKey="count"
                                paddingAngle={2}
                              >
                                {diseaseChartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="w-1/2 space-y-3">
                          {diseaseChartData.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full flex-shrink-0" 
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="text-sm text-muted-foreground truncate">{item.name}</span>
                              <span className="text-sm font-semibold text-foreground ml-auto">{item.count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

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
                      New scan <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </CardHeader>
                  <CardContent>
                    {detections.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">No detections yet</p>
                    ) : (
                      <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {detections.slice(0, 10).map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Camera className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium text-foreground text-sm">
                                  {formatDiseaseName(item.disease_name)}
                                </div>
                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(item.date)}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(item.severity)}`}>
                                {item.severity === "high" && <AlertTriangle className="w-3 h-3" />}
                                {item.severity}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {Math.round(item.confidence * 100)}%
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
                      New prediction <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </CardHeader>
                  <CardContent>
                    {predictions.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">No predictions yet</p>
                    ) : (
                      <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {predictions.slice(0, 10).map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium text-foreground">{item.crop_type}</div>
                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(item.date)} · {item.location}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-foreground text-sm">
                                {item.predicted_yield.toLocaleString()} {item.unit}
                              </div>
                              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(item.risk_level)}`}>
                                Risk: {item.risk_level}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}