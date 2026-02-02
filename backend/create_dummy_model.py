import tensorflow as tf
import numpy as np
import os

# Define model save path
MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
MODEL_PATH = os.path.join(MODEL_DIR, "plant_disease_model.h5")

# Create directory if not exists
if not os.path.exists(MODEL_DIR):
    os.makedirs(MODEL_DIR)

# Basic MobileNetV2 transfer learning setup (Input: 224x224x3, Classes: 38)
def create_dummy_model():
    base_model = tf.keras.applications.MobileNetV2(
        input_shape=(224, 224, 3),
        include_top=False,
        weights='imagenet'
    )
    base_model.trainable = False
    
    model = tf.keras.Sequential([
        base_model,
        tf.keras.layers.GlobalAveragePooling2D(),
        tf.keras.layers.Dense(38, activation='softmax') # 38 Classes in PlantVillage
    ])
    
    model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
    
    print("Saving dummy model...")
    model.save(MODEL_PATH)
    print(f"Model saved to {MODEL_PATH}")

if __name__ == "__main__":
    create_dummy_model()
