import requests
import sys

def test_predict():
    url = "http://localhost:8000/predict/disease"
    image_path = "test_leaf.jpg" # You'll need a dummy image here or I can generate one
    
    # Create a dummy image if not exists
    from PIL import Image
    import numpy as np
    img = Image.fromarray(np.random.randint(0, 255, (224, 224, 3), dtype=np.uint8))
    img.save(image_path)
    
    try:
        files = {"file": open(image_path, "rb")}
        response = requests.post(url, files=files)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_predict()
