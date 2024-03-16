//@ts-check

import { writeFile } from 'fs';
import { join } from 'path';

export default async function saveFilefs(imageData, imageName) {

  const imagePath = join(d.process.cwd(), 'files', imageName);

  const buffer = Buffer.from(imageData, 'base64');

  writeFile(imagePath, buffer, (error) => {
    if (error) {
      throw new Error('Erro ao salvar arquivo! ' + error)
    } else {
      return imagePath
    }
  })
}
