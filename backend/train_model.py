import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model, load_model
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau
import os
import json
import argparse

# Setup argument parser
parser = argparse.ArgumentParser(description="Train a crop disease detection model")
parser.add_argument("--dataset", type=str, default="plantvillage dataset/color", help="Path to the directory containing dataset")
parser.add_argument("--epochs", type=int, default=20, help="Number of epochs to train")
parser.add_argument("--batch_size", type=int, default=32, help="Batch size")
parser.add_argument("--resume", action="store_true", help="Resume training from latest checkpoint")
args = parser.parse_args()

# Paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(SCRIPT_DIR, args.dataset)
IMG_SIZE = (224, 224)
BATCH_SIZE = args.batch_size
EPOCHS = args.epochs
MODELS_DIR = os.path.join(SCRIPT_DIR, "models")
MODEL_SAVE_PATH = os.path.join(MODELS_DIR, "plant_disease_model.h5")
CLASS_MAPPING_PATH = os.path.join(MODELS_DIR, "class_mapping.json")
HISTORY_PATH = os.path.join(MODELS_DIR, "training_history.json")

def load_history():
    if os.path.exists(HISTORY_PATH):
        with open(HISTORY_PATH, 'r') as f:
            return json.load(f)
    return {}

def save_history(new_history, initial_epoch):
    existing_history = load_history()
    
    # Initialize if empty or not resuming
    if initial_epoch == 0 or not existing_history:
        final_history = new_history
    else:
        # Append new history to existing
        final_history = existing_history
        for key in new_history:
            if key in final_history:
                final_history[key].extend(new_history[key])
            else:
                final_history[key] = new_history[key]
    
    with open(HISTORY_PATH, 'w') as f:
        json.dump(final_history, f, indent=2)
    print(f"\n✓ Training history updated at {HISTORY_PATH}")
    return final_history

def train():
    if not os.path.exists(DATA_DIR):
        print(f"Error: Dataset directory '{DATA_DIR}' not found.")
        print(f"Please ensure the dataset is located at: {DATA_DIR}")
        return

    print(f"Loading dataset from {DATA_DIR}...")
    print(f"Image size: {IMG_SIZE}, Batch size: {BATCH_SIZE}, Epochs: {EPOCHS}")
    
    # Enhanced Data Augmentation
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=30,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        fill_mode='nearest',
        validation_split=0.2
    )

    val_datagen = ImageDataGenerator(
        rescale=1./255,
        validation_split=0.2
    )

    train_generator = train_datagen.flow_from_directory(
        DATA_DIR,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='training',
        shuffle=True
    )

    validation_generator = val_datagen.flow_from_directory(
        DATA_DIR,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='validation',
        shuffle=False
    )

    num_classes = train_generator.num_classes
    print(f"\n{'='*60}")
    print(f"Found {num_classes} disease classes")
    print(f"Training samples: {train_generator.samples}")
    print(f"Validation samples: {validation_generator.samples}")
    print(f"{'='*60}\n")

    # Save class mapping
    class_indices = train_generator.class_indices
    index_to_class = {v: k for k, v in class_indices.items()}
    
    os.makedirs(MODELS_DIR, exist_ok=True)
    with open(CLASS_MAPPING_PATH, 'w') as f:
        json.dump(index_to_class, f, indent=2)
    
    # Determine start epoch
    initial_epoch = 0
    model = None

    if args.resume and os.path.exists(MODEL_SAVE_PATH):
        try:
            print(f"Resuming training from {MODEL_SAVE_PATH}...")
            model = load_model(MODEL_SAVE_PATH)
            
            # Calculate initial epoch from history
            history = load_history()
            if history and 'loss' in history:
                initial_epoch = len(history['loss'])
                print(f"Resuming from epoch {initial_epoch + 1}/{EPOCHS}")
            else:
                print("Warning: No history found. Resuming from epoch 1.")
            
            # Verify input shape matches
            if model.input_shape[1:] != IMG_SIZE + (3,):
                 print("Warning: Loaded model input shape mismatch. Rebuilding architecture.")
                 model = None
                 initial_epoch = 0
                 
        except Exception as e:
            print(f"Failed to resume model: {e}")
            print("Starting fresh training.")
            model = None
            initial_epoch = 0

    if model is None:
        print("\nBuilding model architecture...")
        base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=IMG_SIZE + (3,))
        base_model.trainable = False

        x = base_model.output
        x = GlobalAveragePooling2D()(x)
        x = Dropout(0.3)(x)
        x = Dense(512, activation='relu')(x)
        x = Dropout(0.3)(x)
        predictions = Dense(num_classes, activation='softmax')(x)

        model = Model(inputs=base_model.input, outputs=predictions)
        
        model.compile(
            optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
        print(f"✓ Model compiled with {model.count_params():,} parameters")

    # Callbacks
    checkpoint = ModelCheckpoint(
        MODEL_SAVE_PATH,
        monitor='val_accuracy',
        save_best_only=True,
        mode='max',
        verbose=1
    )

    early_stop = EarlyStopping(
        monitor='val_loss',
        patience=5,
        restore_best_weights=True,
        verbose=1
    )

    reduce_lr = ReduceLROnPlateau(
        monitor='val_loss',
        factor=0.5,
        patience=3,
        min_lr=1e-7,
        verbose=1
    )

    callbacks = [checkpoint, early_stop, reduce_lr]

    if initial_epoch >= EPOCHS:
        print(f"Training already completed for {EPOCHS} epochs.")
        return

    print("\n" + "="*60)
    print(f"Starting training from epoch {initial_epoch + 1}...")
    print("="*60 + "\n")

    history = model.fit(
        train_generator,
        initial_epoch=initial_epoch,
        epochs=EPOCHS,
        validation_data=validation_generator,
        callbacks=callbacks,
        verbose=1
    )

    # Save merged history
    new_history = {
        'loss': [float(x) for x in history.history['loss']],
        'accuracy': [float(x) for x in history.history['accuracy']],
        'val_loss': [float(x) for x in history.history['val_loss']],
        'val_accuracy': [float(x) for x in history.history['val_accuracy']]
    }
    
    final_history_dict = save_history(new_history, initial_epoch)
    
    # Final results
    print("\n" + "="*60)
    print("Training Complete!")
    print("="*60)
    if final_history_dict.get('accuracy'):
        print(f"Final Training Accuracy: {final_history_dict['accuracy'][-1]*100:.2f}%")
    if final_history_dict.get('val_accuracy'):
        print(f"Final Validation Accuracy: {final_history_dict['val_accuracy'][-1]*100:.2f}%")
        
    print(f"Model saved to: {MODEL_SAVE_PATH}")
    print("="*60 + "\n")

if __name__ == "__main__":
    train()
