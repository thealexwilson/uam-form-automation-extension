const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const iconSizes = [16, 48, 128];
const iconsDir = path.join(__dirname, '..', 'icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

function createPNG(size) {
  const png = new PNG({
    width: size,
    height: size,
    colorType: 2,
    inputColorType: 2,
    bitDepth: 8,
  });

  const color = { r: 0, g: 102, b: 204 };

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (size * y + x) << 2;
      png.data[idx] = color.r;
      png.data[idx + 1] = color.g;
      png.data[idx + 2] = color.b;
      png.data[idx + 3] = 255;
    }
  }

  return png;
}

iconSizes.forEach((size) => {
  try {
    const png = createPNG(size);
    const filePath = path.join(iconsDir, `icon${size}.png`);
    
    png.pack().pipe(fs.createWriteStream(filePath)).on('finish', () => {
      console.log(`Created icon${size}.png`);
    });
  } catch (error) {
    console.error(`Failed to create icon${size}.png:`, error.message);
  }
});

console.log('\nIcons created successfully!');
