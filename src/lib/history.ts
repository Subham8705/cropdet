// localStorage-based history for disease detections and yield predictions
// No login needed - data stays on the farmer's device

export interface DetectionRecord {
  id: string;
  date: string;
  disease_name: string;
  confidence: number;
  severity: string;
}

export interface PredictionRecord {
  id: string;
  date: string;
  crop_type: string;
  location: string;
  predicted_yield: number;
  min_yield: number;
  max_yield: number;
  unit: string;
  risk_level: string;
  confidence: number;
}

const DETECTIONS_KEY = "cropwise_detections";
const PREDICTIONS_KEY = "cropwise_predictions";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// --- Detections ---

export function saveDetection(data: Omit<DetectionRecord, "id" | "date">): DetectionRecord {
  const record: DetectionRecord = {
    ...data,
    id: generateId(),
    date: new Date().toISOString(),
  };
  const existing = getDetections();
  existing.unshift(record); // newest first
  // Keep max 50 records
  if (existing.length > 50) existing.pop();
  localStorage.setItem(DETECTIONS_KEY, JSON.stringify(existing));
  return record;
}

export function getDetections(): DetectionRecord[] {
  try {
    const raw = localStorage.getItem(DETECTIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearDetections(): void {
  localStorage.removeItem(DETECTIONS_KEY);
}

// --- Predictions ---

export function savePrediction(data: Omit<PredictionRecord, "id" | "date">): PredictionRecord {
  const record: PredictionRecord = {
    ...data,
    id: generateId(),
    date: new Date().toISOString(),
  };
  const existing = getPredictions();
  existing.unshift(record);
  if (existing.length > 50) existing.pop();
  localStorage.setItem(PREDICTIONS_KEY, JSON.stringify(existing));
  return record;
}

export function getPredictions(): PredictionRecord[] {
  try {
    const raw = localStorage.getItem(PREDICTIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearPredictions(): void {
  localStorage.removeItem(PREDICTIONS_KEY);
}

// --- Stats helpers ---

export function getStats() {
  const detections = getDetections();
  const predictions = getPredictions();

  const totalDetections = detections.length;
  const totalPredictions = predictions.length;

  const healthyCount = detections.filter(d =>
    d.disease_name.toLowerCase().includes("healthy")
  ).length;
  const healthyPercent = totalDetections > 0
    ? Math.round((healthyCount / totalDetections) * 100)
    : 0;

  const avgYield = predictions.length > 0
    ? Math.round(predictions.reduce((sum, p) => sum + p.predicted_yield, 0) / predictions.length)
    : 0;

  const avgUnit = predictions.length > 0 ? predictions[0].unit : "kg/ha";

  return {
    totalDetections,
    totalPredictions,
    healthyPercent,
    avgYield,
    avgUnit,
  };
}
