import cv2

def post_process(img):
    pass
    # grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    # binarize
    binary = cv2.adaptiveThreshold(src=gray,
                                        maxValue=255,
                                        adaptiveMethod=cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                        thresholdType=cv2.THRESH_BINARY,
                                        blockSize=11,
                                        C=2
                                        )
    # denoise and blur
    denoise = cv2.fastNlMeansDenoising(binary)
    blur = cv2.medianBlur(denoise, 3)
    # dilate and erode
    kernel = (3, 3)
    dilate = cv2.dilate(blur, kernel, iterations=1)
    # cv2.imshow("final process", binary)
    return dilate