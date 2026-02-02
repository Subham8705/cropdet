import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simulated disease database
const diseases = [
  {
    name: "Bacterial Leaf Blight",
    description: "A bacterial disease that causes water-soaked lesions on leaves, which later turn brown and dry. Common in rice and wheat crops during humid conditions.",
    treatment: "Apply copper-based bactericides such as copper oxychloride at 2.5g/L. Remove and destroy infected plant parts. Ensure proper drainage to reduce humidity.",
    prevention: [
      "Use disease-resistant crop varieties",
      "Maintain proper plant spacing for air circulation",
      "Avoid overhead irrigation",
      "Practice crop rotation every 2-3 seasons",
      "Apply balanced fertilizers to strengthen plant immunity"
    ],
    severity: "high",
    confidenceRange: [0.85, 0.95]
  },
  {
    name: "Powdery Mildew",
    description: "A fungal disease characterized by white powdery spots on leaves and stems. Thrives in dry conditions with high humidity. Reduces photosynthesis and plant vigor.",
    treatment: "Apply sulfur-based fungicides or potassium bicarbonate. Neem oil sprays can be effective for organic treatment. Prune affected areas immediately.",
    prevention: [
      "Plant in areas with good air circulation",
      "Avoid excessive nitrogen fertilization",
      "Water plants at the base, not on foliage",
      "Remove plant debris after harvest",
      "Use resistant varieties when available"
    ],
    severity: "medium",
    confidenceRange: [0.80, 0.92]
  },
  {
    name: "Early Blight",
    description: "A fungal disease causing dark concentric rings on leaves, resembling a target. Common in tomatoes and potatoes. Starts from lower leaves and progresses upward.",
    treatment: "Apply chlorothalonil or mancozeb fungicides every 7-10 days. Remove infected leaves promptly. Mulch around plants to prevent soil splash.",
    prevention: [
      "Practice 3-year crop rotation",
      "Stake plants to improve air circulation",
      "Water early in the day",
      "Remove all plant debris after season",
      "Use certified disease-free seeds"
    ],
    severity: "medium",
    confidenceRange: [0.82, 0.94]
  },
  {
    name: "Healthy Crop",
    description: "No disease detected. The crop appears to be in good health with normal leaf coloration and structure. Continue regular monitoring and maintenance.",
    treatment: "No treatment required. Maintain current agricultural practices and continue regular monitoring for any changes.",
    prevention: [
      "Continue regular crop monitoring",
      "Maintain proper irrigation schedule",
      "Apply preventive organic treatments monthly",
      "Keep records of crop health over time",
      "Scout for pests regularly"
    ],
    severity: "low",
    confidenceRange: [0.90, 0.99]
  },
  {
    name: "Rust Disease",
    description: "A fungal infection showing orange-brown pustules on leaf surfaces. Spreads rapidly through wind-borne spores. Severely affects yield if untreated.",
    treatment: "Apply propiconazole or tebuconazole fungicides immediately upon detection. Remove severely infected plants. Increase monitoring frequency.",
    prevention: [
      "Plant rust-resistant varieties",
      "Avoid planting in low-lying wet areas",
      "Remove volunteer plants that harbor disease",
      "Monitor weather conditions for rust-favorable days",
      "Apply preventive fungicides in high-risk periods"
    ],
    severity: "high",
    confidenceRange: [0.87, 0.96]
  }
];

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image } = await req.json();
    
    if (!image) {
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Received image for disease detection, processing...");

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Randomly select a disease for simulation
    const disease = diseases[Math.floor(Math.random() * diseases.length)];
    
    // Generate confidence within the disease's range
    const [minConf, maxConf] = disease.confidenceRange;
    const confidence = minConf + Math.random() * (maxConf - minConf);

    const result = {
      disease_name: disease.name,
      confidence: confidence,
      description: disease.description,
      treatment: disease.treatment,
      prevention: disease.prevention,
      severity: disease.severity as "low" | "medium" | "high"
    };

    console.log(`Detection complete: ${result.disease_name} (${(result.confidence * 100).toFixed(1)}% confidence)`);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process image" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});