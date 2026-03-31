import { Jimp, intToRGBA } from "jimp";

async function makeTransparent(input, output) {
  try {
    const image = await Jimp.read(input);
    
    // Assume the top-left pixel is the background color
    const targetColor = image.getPixelColor(0, 0);
    const { r: tr, g: tg, b: tb } = intToRGBA(targetColor);
    
    // We will scan the image and replace colors that are close to targetColor with transparent
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const color = image.getPixelColor(x, y);
      const { r, g, b, a } = intToRGBA(color);
      
      // Calculate color distance
      const distance = Math.sqrt(
        Math.pow(r - tr, 2) + 
        Math.pow(g - tg, 2) + 
        Math.pow(b - tb, 2)
      );
      
      // If it's close to the background color, make it transparent
      if (distance < 40) {
        this.bitmap.data[idx + 3] = 0; // Set alpha to 0
      }
    });
    
    await image.write(output);
    console.log("Success:", output);
  } catch (err) {
    console.error("Error:", err);
  }
}

makeTransparent('public/food-images/apple.png', 'test-transparent-apple.png');
