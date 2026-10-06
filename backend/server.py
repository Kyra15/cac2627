import base64
import binascii
import io
import logging
import os

import cohere
import cv2
import numpy as np
import pillow_heif
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from PIL import Image
from werkzeug.exceptions import HTTPException

from backend.tools import post_process

load_dotenv()
pillow_heif.register_heif_opener()
logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)

api_key = os.environ.get("API_KEY")
co = cohere.ClientV2(api_key) if api_key else None

PROMPT_OCR = (
    "Transcribe every piece of visible text in this image exactly as it "
    "appears, in reading order. Do not summarize, explain, or add commentary."
    "Output only the transcribed text."
)

PROMPT = (
    ""
)

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 25 * 1024 * 1024
CORS(app)


def fail(message, status):
    return jsonify({"error": message}), status


@app.errorhandler(HTTPException)
def handle_http_error(e):
    return fail(e.description, e.code)


@app.errorhandler(Exception)
def handle_unexpected_error(e):
    log.exception("unhandled error")
    return fail("internal server error", 500)


def decode_image(image_base64):
    if "," in image_base64:
        image_base64 = image_base64.split(",", 1)[1]

    image_bytes = base64.b64decode(image_base64)
    np_array = np.frombuffer(image_bytes, dtype=np.uint8)
    image = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

    if image is None:
        # opencv can't read heic, fall back to pillow
        pil_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        image = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)

    return image


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "cohere": co is not None})


@app.route("/analyze", methods=["POST"])
def analyze_photo():
    data = request.get_json(silent=True) or {}
    image_base64 = data.get("imageBase64")

    if not image_base64 or not isinstance(image_base64, str):
        return fail("imageBase64 is required", 400)

    if co is None:
        return fail("server is missing its api key", 500)

    try:
        image = decode_image(image_base64)
    except (binascii.Error, ValueError, OSError, cv2.error, Image.DecompressionBombError):
        return fail("could not read image", 400)

    image = post_process(image)

    success, encoded_img = cv2.imencode(".jpg", image)
    if not success:
        return fail("could not encode image", 422)

    base64_string = base64.b64encode(encoded_img).decode("utf-8")
    data_uri = f"data:image/jpeg;base64,{base64_string}"

    try:
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
                                # high is better on small dense text
                                "detail": "high",
                            },
                        },
                    ],
                }
            ],
            temperature=0.0,
        )
    except Exception:
        log.exception("ocr request failed")
        return fail("image ocr failed", 502)

    parts = response.message.content or []
    summary = parts[0].text.strip() if parts else ""

    if not summary:
        return fail("no text found in image", 422)

    return jsonify({"summary": summary})


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 4200)),
        debug=os.environ.get("FLASK_DEBUG") == "1",
    )
