import cv2

MAX_SIDE = 1600

def post_process(img):
    # upscale only small images so memory stays bounded
    if max(img.shape[:2]) >= MAX_SIDE:
        return img
    upscale = cv2.resize(img, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
    # grayscale
    # gray = cv2.cvtColor(upscale, cv2.COLOR_BGR2GRAY)
    # # binarize
    # binary = cv2.adaptiveThreshold(src=gray,
    #                                     maxValue=255,
    #                                     adaptiveMethod=cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
    #                                     thresholdType=cv2.THRESH_BINARY,
    #                                     blockSize=11,
    #                                     C=2
    #                                     )
    # # denoise and blur
    # denoise = cv2.fastNlMeansDenoising(binary)
    # blur = cv2.medianBlur(denoise, 3)
    # # dilate and erode
    # kernel = (3, 3)
    # dilate = cv2.dilate(blur, kernel, iterations=1)
    # cv2.imshow("final process", binary)
    return upscale