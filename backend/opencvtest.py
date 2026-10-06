import cv2
import numpy as np
import pillow_heif
from backend.tools import post_process

heif_file = pillow_heif.open_heif("IMG_3064.heic", convert_hdr_to_8bit=True, bgr_mode=True)
img = np.asarray(heif_file)
cv2.imshow("og", img)
pp_img = post_process(img)
cv2.imshow("pp", pp_img)

cv2.waitKey(0)
cv2.destroyAllWindows()