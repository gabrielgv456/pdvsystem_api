const fs = require('fs');
const path = require('path');

module.exports = async function saveFilefs(imageData, imageName) {

  const imagePath = path.join(process.cwd(), 'files', imageName);

  // Convert base64 data to buffer
  const buffer = Buffer.from(imageData, 'base64');

  // Write the image to the file system
  fs.writeFile(imagePath, buffer, (error) => {
    if (error) {
      console.error('Error uploading image:', error);
      throw new Error('Erro ao salvar arquivo! ' + error)
    } else {
      console.log('Image uploaded successfully:', imageName);
      return imagePath
      // Here you can save the image name to the database if needed
    }
  })
}
