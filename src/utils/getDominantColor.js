import ColorThief from 'color-thief-browser';

export const getDominantColor = (imageUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;

    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const dominantColor = colorThief.getColor(img);
        if (dominantColor) {
          resolve(dominantColor);
        } else {
          reject(new Error('Failed to get color from image'));
        }
      } catch (error) {
        reject(new Error(`Error extracting color: ${error.message}`));
      }
    };

    img.onerror = (error) => {
      reject(new Error(`Error loading image: ${error.message}`));
    };
  });
};