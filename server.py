import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
import cohere
import base64
import numpy as np
import cv2
import pillow_heif
from PIL import Image
import io
from tools import post_process

load_dotenv()
pillow_heif.register_heif_opener()
co = cohere.ClientV2(str(os.environ["API_KEY"]))

PROMPT_OCR = (
    "Transcribe every piece of visible text in this image exactly as it "
    "appears, in reading order. Do not summarize, explain, or add commentary "
    "— output only the transcribed text."
)

PROMPT = (
    "This is a photo of a document. Extract all visible text carefully, "
    "including small or faint text, then output it"
    # "contains in 2-4 concise sentences. If it is a lab report or form, "
    # "call out the document type and any key values plainly rather than "
    # "guessing at unclear characters."
)

app = Flask(__name__)
CORS(app)


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

        # proccessed_img = post_process(image)

        success, encoded_img = cv2.imencode(".jpg", image)

        if success:

            base64_bytes = base64.b64encode(encoded_img)
            base64_string = base64_bytes.decode("utf-8")
            print("b64 success")
            
            data_uri = f"data:image/jpeg;base64,{base64_string}"

            response = co.chat(
                model="command-a-vision-07-2025",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": PROMPT_OCR},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": data_uri,
                                    # "high" trades latency/cost for better
                                    # accuracy on small/dense text — worth it
                                    # for documents like lab reports.
                                    "detail": "high",
                                },
                            },
                        ],
                    }
                ],
                temperature=0.0,
            )

            summary = response.message.content[0].text
            return jsonify({"summary": summary})

    except Exception as e:
        print(e)
        return jsonify({"error": "Image OCR"}), 502


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=4200, debug=True)
