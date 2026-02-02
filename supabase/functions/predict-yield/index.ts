import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Base yield data by crop type (kg/acre)
const cropBaseYields: Record<string, { base: number; variance: number }> = {
  "Wheat": { base: 3500, variance: 1200 },
  "Rice": { base: 4200, variance: 1500 },
  "Corn/Maize": { base: 5800, variance: 2000 },
  "Soybean": { base: 2800, variance: 900 },
  "Cotton": { base: 1800, variance: 600 },
  "Sugarcane": { base: 65000, variance: 15000 },
  "Potato": { base: 22000, variance: 8000 },
  "Tomato": { base: 28000, variance: 10000 },
  "Onion": { base: 18000, variance: 6000 },
  "Barley": { base: 3200, variance: 1000 },
};

// Soil type multipliers
const soilMultipliers: Record<string, number> = {
  "Clay": 0.85,
  "Sandy": 0.75,
  "Loamy": 1.15,
  "Silt": 1.05,
  "Peat": 0.90,
  "Chalky": 0.80,
  "Saline": 0.60,
};

// Fertilizer recommendations by crop
const fertilizerRecommendations: Record<string, string> = {
  "Wheat": "Apply NPK 120:60:40 kg/ha. Use urea as top dressing at tillering stage.",
  "Rice": "Apply NPK 100:50:50 kg/ha with zinc sulfate. Split nitrogen application.",
  "Corn/Maize": "Apply NPK 150:60:40 kg/ha. Consider foliar micronutrient spray at tasseling.",
  "Soybean": "Apply 20:60:40 kg/ha NPK with rhizobium inoculation for nitrogen fixation.",
  "Cotton": "Apply NPK 120:60:60 kg/ha. Potassium is crucial for fiber quality.",
  "Sugarcane": "Apply NPK 250:80:80 kg/ha in splits. Include sulfur for better sugar content.",
  "Potato": "Apply NPK 180:80:100 kg/ha. Potassium improves tuber quality.",
  "Tomato": "Apply NPK 150:80:80 kg/ha with calcium to prevent blossom end rot.",
  "Onion": "Apply NPK 100:50:50 kg/ha. Avoid excess nitrogen near harvest.",
  "Barley": "Apply NPK 80:40:40 kg/ha. Lower nitrogen than wheat for malting quality.",
};

// Irrigation recommendations based on conditions
function getIrrigationRecommendation(rainfall: number, humidity: number, temperature: number): string {
  if (rainfall > 200) {
    return "Adequate rainfall. Ensure proper drainage to prevent waterlogging. Monitor for excess moisture issues.";
  } else if (rainfall > 100) {
    return "Moderate rainfall. Supplement with light irrigation during dry spells. Use drip irrigation for efficiency.";
  } else if (humidity < 40 && temperature > 30) {
    return "High evapotranspiration conditions. Increase irrigation frequency by 25%. Apply mulch to conserve moisture.";
  } else {
    return "Low rainfall detected. Implement regular irrigation schedule every 5-7 days. Consider installing drip or sprinkler systems.";
  }
}

// General recommendations generator
function getGeneralRecommendations(cropType: string, soilType: string, temperature: number, rainfall: number): string[] {
  const tips: string[] = [];
  
  tips.push(`Monitor ${cropType} growth stages and adjust practices accordingly.`);
  
  if (temperature > 35) {
    tips.push("High temperatures detected. Consider shade nets or increased irrigation during peak hours.");
  } else if (temperature < 15) {
    tips.push("Cool temperatures. Watch for frost damage and consider protective measures.");
  }
  
  if (soilType === "Sandy" || soilType === "Chalky") {
    tips.push("Improve soil water retention by adding organic matter and compost.");
  }
  
  if (rainfall < 80) {
    tips.push("Implement water conservation techniques like mulching and deficit irrigation.");
  }
  
  tips.push("Scout regularly for pests and diseases. Early detection prevents yield losses.");
  tips.push("Maintain field hygiene and remove weeds that compete for nutrients.");
  
  return tips.slice(0, 4);
}

// Calculate risk level
function calculateRisk(temperature: number, rainfall: number, humidity: number, soilType: string): "low" | "medium" | "high" {
  let riskScore = 0;
  
  if (temperature > 38 || temperature < 10) riskScore += 2;
  else if (temperature > 35 || temperature < 15) riskScore += 1;
  
  if (rainfall < 50) riskScore += 2;
  else if (rainfall < 100) riskScore += 1;
  
  if (humidity > 90 || humidity < 30) riskScore += 1;
  
  if (soilType === "Saline" || soilType === "Sandy") riskScore += 1;
  
  if (riskScore >= 4) return "high";
  if (riskScore >= 2) return "medium";
  return "low";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { crop_type, location, soil_type, temperature, rainfall, humidity } = await req.json();

    // Validate inputs
    if (!crop_type || !location || !soil_type || temperature === undefined || rainfall === undefined || humidity === undefined) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Yield prediction requested for ${crop_type} in ${location}`);

    // Simulate ML processing
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Calculate yield
    const cropData = cropBaseYields[crop_type] || { base: 3000, variance: 1000 };
    const soilMult = soilMultipliers[soil_type] || 1.0;
    
    // Environmental factors
    let envMult = 1.0;
    if (temperature >= 20 && temperature <= 32) envMult += 0.1;
    if (rainfall >= 100 && rainfall <= 250) envMult += 0.1;
    if (humidity >= 50 && humidity <= 75) envMult += 0.05;
    
    const randomFactor = 0.9 + Math.random() * 0.2;
    const predictedYield = Math.round(cropData.base * soilMult * envMult * randomFactor);
    
    const riskLevel = calculateRisk(temperature, rainfall, humidity, soil_type);
    const confidence = 0.82 + Math.random() * 0.10;

    const result = {
      predicted_yield: predictedYield,
      unit: crop_type === "Sugarcane" || crop_type === "Potato" || crop_type === "Tomato" || crop_type === "Onion" 
        ? "kg/acre" 
        : "kg/acre",
      risk_level: riskLevel,
      confidence: confidence,
      recommendations: {
        fertilizer: fertilizerRecommendations[crop_type] || "Apply balanced NPK fertilizer based on soil test results.",
        irrigation: getIrrigationRecommendation(rainfall, humidity, temperature),
        general: getGeneralRecommendations(crop_type, soil_type, temperature, rainfall),
      }
    };

    console.log(`Prediction complete: ${result.predicted_yield} ${result.unit} (${riskLevel} risk)`);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Prediction error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate prediction" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});