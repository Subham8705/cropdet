from pydantic import BaseModel
from typing import List, Dict, Optional
import random

class YieldInput(BaseModel):
    crop_type: str
    location: str
    soil_type: str
    temperature: float
    rainfall: float
    humidity: float

class YieldResult(BaseModel):
    predicted_yield: float
    min_yield: float
    max_yield: float
    unit: str
    risk_level: str  # "low", "medium", "high"
    confidence: float
    recommendations: Dict[str, str | List[str]]

class YieldEngine:
    def __init__(self):
        # Ideal conditions for different crops
        # This is a knowledge base that can be expanded
        self.crop_data = {
            "Wheat": {
                "ideal_temp": (15, 25),
                "ideal_rain": (250, 600),  # Seasonal rainfall (mm)
                "ideal_soil": ["Loamy", "Clay"],
                "base_yield": 4000, # kg/hectare
                "unit": "kg/ha"
            },
            "Rice": {
                "ideal_temp": (20, 35),
                "ideal_rain": (800, 1500), # High water requirement
                "ideal_soil": ["Clay", "Loamy", "Silt"],
                "base_yield": 5000,
                "unit": "kg/ha"
            },
            "Corn/Maize": {
                "ideal_temp": (18, 27),
                "ideal_rain": (400, 800),
                "ideal_soil": ["Loamy", "Silt"],
                "base_yield": 6000,
                "unit": "kg/ha"
            },
             "Soybean": {
                "ideal_temp": (20, 30),
                "ideal_rain": (400, 800),
                "ideal_soil": ["Loamy", "Sandy"],
                "base_yield": 3000,
                "unit": "kg/ha"
            },
            "Cotton": {
                "ideal_temp": (25, 35),
                "ideal_rain": (500, 1000),
                "ideal_soil": ["Loamy", "Black"], # Added Black soil support implicitly if mapped
                "base_yield": 2000,
                "unit": "kg/ha"
            },
             "Sugarcane": {
                "ideal_temp": (20, 35),
                "ideal_rain": (1000, 2000), # Long duration crop
                "ideal_soil": ["Loamy", "Clay"],
                "base_yield": 80000,
                "unit": "kg/ha"
            },
             "Potato": {
                "ideal_temp": (15, 20),
                "ideal_rain": (300, 600),
                "ideal_soil": ["Sandy", "Loamy"],
                "base_yield": 25000,
                "unit": "kg/ha"
            },
             "Tomato": {
                "ideal_temp": (20, 25),
                "ideal_rain": (400, 800),
                "ideal_soil": ["Loamy", "Sandy"],
                "base_yield": 40000,
                "unit": "kg/ha"
            },
             "Onion": {
                "ideal_temp": (15, 25),
                "ideal_rain": (300, 600),
                "ideal_soil": ["Loamy", "Sandy"],
                "base_yield": 20000,
                "unit": "kg/ha"
            },
             "Barley": {
                "ideal_temp": (12, 20),
                "ideal_rain": (200, 450),
                "ideal_soil": ["Loamy", "Clay"],
                "base_yield": 3500,
                "unit": "kg/ha"
            }
        }

    def predict(self, data: YieldInput) -> YieldResult:
        crop_info = self.crop_data.get(data.crop_type)
        
        if not crop_info:
            # Fallback for unknown crops
            return YieldResult(
                predicted_yield=0,
                min_yield=0,
                max_yield=0,
                unit="kg/ha",
                risk_level="high",
                confidence=0.0,
                recommendations={
                    "fertilizer": "Consult a local agronomist.",
                    "irrigation": "Consult a local agronomist.",
                    "general": ["Crop data not available for accurate prediction."]
                }
            )

        # 1. Calculate Score based on environmental factors
        score = 100.0
        details = []
        risk_factors = []

        # Temperature check
        min_temp, max_temp = crop_info["ideal_temp"]
        if data.temperature < min_temp:
            diff = min_temp - data.temperature
            penalty = diff * 5
            score -= penalty
            details.append(f"Temperature is too low ({data.temperature}°C). Optimal is {min_temp}-{max_temp}°C.")
            risk_factors.append("Cold stress")
        elif data.temperature > max_temp:
            diff = data.temperature - max_temp
            penalty = diff * 5
            score -= penalty
            details.append(f"Temperature is too high ({data.temperature}°C). Optimal is {min_temp}-{max_temp}°C.")
            risk_factors.append("Heat stress")

        # Rainfall check
        min_rain, max_rain = crop_info["ideal_rain"]
        if data.rainfall < min_rain:
            diff = min_rain - data.rainfall
            penalty = (diff / min_rain) * 30 
            score -= penalty
            details.append(f"Rainfall is low ({data.rainfall}mm). Optimal is {min_rain}-{max_rain}mm.")
            risk_factors.append("Drought stress")
        elif data.rainfall > max_rain:
            diff = data.rainfall - max_rain
            penalty = (diff / max_rain) * 20
            score -= penalty
            details.append(f"Rainfall is high ({data.rainfall}mm). Optimal is {min_rain}-{max_rain}mm.")
            risk_factors.append("Waterlogging risk")

        # Soil check
        if data.soil_type not in crop_info["ideal_soil"]:
            score -= 20
            details.append(f"Soil type '{data.soil_type}' is not optimal. preferred: {', '.join(crop_info['ideal_soil'])}.")
            risk_factors.append("Suboptimal soil")

        # Cap score
        score = max(10, min(100, score))

        # 2. Calculate Final Yield
        # Base yield * (Score / 100)
        # We calculate a deterministic base yield, then apply a fixed range
        estimated_yield = crop_info["base_yield"] * (score / 100)
        
        min_yield = estimated_yield * 0.90 # -10%
        max_yield = estimated_yield * 1.10 # +10%

        # 3. Determine Risk Level
        if score > 80:
            risk_level = "low"
        elif score > 50:
            risk_level = "medium"
        else:
            risk_level = "high"

        # 4. Generate Recommendations
        recommendations = self._generate_recommendations(data, crop_info, risk_factors, details)

        return YieldResult(
            predicted_yield=round(estimated_yield, 2),
            min_yield=round(min_yield, 2),
            max_yield=round(max_yield, 2),
            unit=crop_info["unit"],
            risk_level=risk_level,
            confidence=0.85, # Static high confidence for logic-based
            recommendations=recommendations
        )

    def _generate_recommendations(self, data: YieldInput, crop_info: dict, risk_factors: List[str], details: List[str]) -> Dict:
        recs = {
            "fertilizer": "Apply balanced NPK fertilizer.",
            "irrigation": "Maintain standard irrigation schedule.",
            "general": ["Monitor crop health regularly."]
        }

        # Specific Logic
        if "Cold stress" in risk_factors:
            recs["general"].append("Consider mulching to retain soil heat.")
        if "Heat stress" in risk_factors:
            recs["irrigation"] = "Increase irrigation frequency to cool the crop."
        if "Drought stress" in risk_factors:
            recs["irrigation"] = "Urgent: Apply supplemental irrigation immediately."
        if "Waterlogging risk" in risk_factors:
            recs["irrigation"] = "Reduce irrigation. Ensure proper drainage fields."
            recs["general"].append("Check for fungal diseases due to excess moisture.")
        
        if "Suboptimal soil" in risk_factors:
             recs["fertilizer"] = "Conduct soil test. May need organic amendments or specific micronutrients."

        # Add logic-based tips
        if details:
             recs["general"].extend(details)

        return recs

yield_engine = YieldEngine()
