const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imageDir = './image';
const outputDir = './image-optimized';

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

fs.readdirSync(imageDir).forEach(file => {
  const ext = path.extname(file).toLowerCase();
  if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
    const inputPath = path.join(imageDir, file);
    const outputPath = path.join(outputDir, file);
    
    sharp(inputPath)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 60, mozjpeg: true })
      .toFile(outputPath);
  }
});
