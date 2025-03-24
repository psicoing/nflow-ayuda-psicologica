import sharp from 'sharp';

// Create a square canvas with white text on black background
async function generateIcon(size) {
  const padding = size * 0.2; // 20% padding
  const textSize = size - (padding * 2);
  
  // Create a black square with rounded corners
  const background = Buffer.from(
    `<svg width="${size}" height="${size}">
      <rect width="${size}" height="${size}" rx="${size * 0.25}" fill="black"/>
      <text 
        x="50%" 
        y="50%" 
        font-family="Arial" 
        font-size="${textSize * 0.5}px" 
        fill="white" 
        text-anchor="middle" 
        dominant-baseline="middle"
      >NF</text>
    </svg>`
  );

  await sharp(background)
    .resize(size, size)
    .toFile(`client/public/logo${size}.png`);
}

// Generate icons for different sizes
Promise.all([
  generateIcon(192),
  generateIcon(512)
]).then(() => {
  console.log('✅ Icons generated successfully');
}).catch(err => {
  console.error('❌ Error generating icons:', err);
});
