import numpy as np
from PIL import Image
import tensorflow as tf
import io
import os
import json

MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "plant_disease_model.h5")
CLASS_MAPPING_PATH = os.path.join(os.path.dirname(__file__), "models", "class_mapping.json")

class DiseaseDetector:
    def __init__(self):
        self.model = None
        self.class_names = []
        self.load_class_mapping()
        self.load_model()

    def load_class_mapping(self):
        """Load class names from the JSON file generated during training"""
        if os.path.exists(CLASS_MAPPING_PATH):
            try:
                with open(CLASS_MAPPING_PATH, 'r') as f:
                    class_mapping = json.load(f)
                # Convert string keys to integers and sort by index
                self.class_names = [class_mapping[str(i)] for i in range(len(class_mapping))]
                print(f"✓ Loaded {len(self.class_names)} class names from {CLASS_MAPPING_PATH}")
            except Exception as e:
                print(f"Failed to load class mapping: {e}")
                self.class_names = self._get_default_class_names()
        else:
            print(f"Class mapping file not found at {CLASS_MAPPING_PATH}. Using default class names.")
            self.class_names = self._get_default_class_names()

    def _get_default_class_names(self):
        """Fallback class names (PlantVillage dataset)"""
        return [
            'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
            'Blueberry___healthy', 'Cherry_(including_sour)___Powdery_mildew', 'Cherry_(including_sour)___healthy',
            'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot', 'Corn_(maize)___Common_rust_',
            'Corn_(maize)___Northern_Leaf_Blight', 'Corn_(maize)___healthy', 'Grape___Black_rot',
            'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 'Grape___healthy',
            'Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot', 'Peach___healthy',
            'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy', 'Potato___Early_blight',
            'Potato___Late_blight', 'Potato___healthy', 'Raspberry___healthy', 'Soybean___healthy',
            'Squash___Powdery_mildew', 'Strawberry___Leaf_scorch', 'Strawberry___healthy',
            'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight', 'Tomato___Leaf_Mold',
            'Tomato___Septoria_leaf_spot', 'Tomato___Spider_mites Two-spotted_spider_mite',
            'Tomato___Target_Spot', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus',
            'Tomato___healthy'
        ]

    def load_model(self):
        if os.path.exists(MODEL_PATH):
            try:
                self.model = tf.keras.models.load_model(MODEL_PATH)
                print(f"✓ Model loaded from {MODEL_PATH}")
                print(f"  Model expects {len(self.class_names)} classes")
            except Exception as e:
                print(f"✗ Failed to load model: {e}")
                self.model = None
        else:
            print(f"⚠ Model file not found at {MODEL_PATH}. Using mock predictions.")
            print(f"  Run 'python train_model.py' to train the model.")
            self.model = None


    def preprocess_image(self, image_bytes):
        image = Image.open(io.BytesIO(image_bytes))
        image = image.resize((224, 224))
        img_array = np.array(image)
        # Normalize if needed, usually / 255.0
        img_array = img_array / 255.0
        img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
        return img_array

    def predict(self, image_bytes):
        if self.model:
            processed_image = self.preprocess_image(image_bytes)
            predictions = self.model.predict(processed_image)
            confidence = np.max(predictions[0])
            predicted_class = self.class_names[np.argmax(predictions[0])]
        else:
            # Mock prediction for testing without model
            import random
            predicted_class = random.choice(self.class_names) if self.class_names else "Unknown"
            confidence = random.uniform(0.85, 0.99)
        
        return {
            "disease_name": predicted_class,
            "confidence": float(confidence),
            "description": self.get_disease_info(predicted_class, "description"),
            "treatment": self.get_disease_info(predicted_class, "treatment"),
            "prevention": self.get_disease_info(predicted_class, "prevention"),
            "severity": self.get_disease_info(predicted_class, "severity")
        }

    def get_disease_info(self, disease_name, info_type):
        # Placeholder for disease database
        # In a real app, this would query a DB or a large JSON mapping
        descriptions = {
            "Apple___Black_rot": "Black rot is a fungus that infects apple trees. It causes leaf spots, fruit rot, and cankers on limbs.",
            "Tomato___Early_blight": "Early blight is a common tomato disease caused by the fungus Alternaria solani. It targets leaves, stems, and fruit.",
            "default": f"Detailed information about {disease_name.replace('___', ' ')}."
        }
        
        treatments = {
            "Apple___Black_rot": "Remove infected plant parts. Apply fungicides like Captan or Sulfur.",
            "Tomato___Early_blight": "Prune bottom leaves to improve airflow. Apply copper-based fungicides.",
            "default": "Consult a local agricultural extension for specific chemical or organic treatments."
        }

        preventions = {
             "Apple___Black_rot": ["Sanitation is key", "Remove dead wood", "Remove mummified fruit"],
             "Tomato___Early_blight": ["Rotate crops", "Mulch soil", "Prevent spores from splashing onto leaves"],
             "default": ["Practice crop rotation", "Keep the field clean of debris"]
        }

        severities = {
            "Apple___Black_rot": "medium",
            "Apple___Cedar_apple_rust": "low",
            "Potato___Late_blight": "high",
            "Tomato___Late_blight": "high",
            "default": "low"
        }

        if info_type == "description":
            return descriptions.get(disease_name, descriptions["default"])
        elif info_type == "treatment":
            return treatments.get(disease_name, treatments["default"])
        elif info_type == "prevention":
            # Ensure it returns a list
            val = preventions.get(disease_name, preventions["default"])
            return val if isinstance(val, list) else [val]
        elif info_type == "severity":
             return severities.get(disease_name, severities["default"])
        return ""

detector = DiseaseDetector()
