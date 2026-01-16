const fs = require('fs');
const path = require('path');

const iconSizes = [16, 48, 128];
const iconsDir = path.join(__dirname, '..', 'icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

function createSimplePNG(size) {
  const width = size;
  const height = size;
  const color = [0, 102, 204];
  
  const data = Buffer.alloc(width * height * 4);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      data[idx] = color[0];
      data[idx + 1] = color[1];
      data[idx + 2] = color[2];
      data[idx + 3] = 255;
    }
  }
  
  const pngHeader = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A
  ]);
  
  const ihdr = createIHDRChunk(width, height);
  const idat = createIDATChunk(data, width, height);
  const iend = Buffer.from([
    0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
  ]);
  
  return Buffer.concat([pngHeader, ihdr, idat, iend]);
}

function createIHDRChunk(width, height) {
  const data = Buffer.alloc(13);
  data.writeUInt32BE(width, 0);
  data.writeUInt32BE(height, 4);
  data[8] = 8;
  data[9] = 2;
  data[10] = 0;
  data[11] = 0;
  data[12] = 0;
  return createChunk('IHDR', data);
}

function createIDATChunk(imageData, width, height) {
  const scanlineLength = width * 4 + 1;
  const compressed = Buffer.alloc(scanlineLength * height);
  
  for (let y = 0; y < height; y++) {
    const offset = y * scanlineLength;
    compressed[offset] = 0;
    const rowStart = y * width * 4;
    imageData.copy(compressed, offset + 1, rowStart, rowStart + width * 4);
  }
  
  return createChunk('IDAT', compressed);
}

function createChunk(type, data) {
  const typeBuffer = Buffer.from(type, 'ascii');
  const crc = calculateCRC(typeBuffer, data);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc, 0);
  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

function calculateCRC(type, data) {
  const crcTable = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[i] = c;
  }
  
  let crc = 0xFFFFFFFF;
  const buffer = Buffer.concat([type, data]);
  for (let i = 0; i < buffer.length; i++) {
    crc = crcTable[(crc ^ buffer[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

iconSizes.forEach((size) => {
  try {
    const pngData = createSimplePNG(size);
    fs.writeFileSync(
      path.join(iconsDir, `icon${size}.png`),
      pngData
    );
    console.log(`Created icon${size}.png`);
  } catch (error) {
    console.error(`Failed to create icon${size}.png:`, error.message);
    console.log('Creating SVG fallback instead...');
    const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#0066cc"/>
  <text x="50%" y="50%" font-family="Arial" font-size="${size * 0.4}" fill="white" text-anchor="middle" dominant-baseline="middle">U</text>
</svg>`;
    fs.writeFileSync(
      path.join(iconsDir, `icon${size}.svg`),
      svg
    );
    console.log(`Created icon${size}.svg (please convert to PNG manually)`);
  }
});

console.log('\nIcons created successfully!');
