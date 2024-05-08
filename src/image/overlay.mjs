import Jimp from 'jimp';

export async function labelFrame(filename, text) {
  const font = await Jimp.loadFont(Jimp.FONT_SANS_8_WHITE);
  let image = await Jimp.read("frames/" + filename)
  image.print(font, 5, 5, text);
  image.write("frames/" + filename);
}