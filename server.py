# gna switch this fron anthropic to smth easier like groq or cohere
import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
# from paddleocr import PaddleOCR
import easyocr
import base64
import numpy as np
import cv2
import pillow_heif
from PIL import Image
import io
from cac2627.tools import post_process

load_dotenv()
pillow_heif.register_heif_opener()

app = Flask(__name__)
CORS(app)

# client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])


@app.route("/analyze", methods=["POST"])
def analyze_photo():
    data = request.get_json(silent=True) or {}
    image_base64 = data.get("imageBase64")

    if not image_base64:
        return jsonify({"error": "imageBase64 is required"}), 400

    if "," in image_base64:
        image_base64 = image_base64.split(",")[1]

    try:
        image_bytes = base64.b64decode(image_base64)
        np_array = np.frombuffer(image_bytes, dtype=np.uint8)

        image = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

        if image is None:
            image_io = io.BytesIO(image_bytes)
            pil_img = Image.open(image_io).convert("RGB")
            image = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)

        proccessed_img = post_process(image)
        reader = easyocr.Reader(['en'])
        results = reader.readtext(proccessed_img)
        for i in results:
             print(i[1])

    #     summary = "".join(
    #         block.text for block in message.content if block.type == "text"
    #     )
    #     return jsonify({"summary": summary})

    except Exception as e:
        print(e)
        return jsonify({"error": "Image OCR"}), 502
    return jsonify({"summary": "hello world"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=4200, debug=True)
