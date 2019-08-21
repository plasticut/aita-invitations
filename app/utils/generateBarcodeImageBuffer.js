const bwipjs = require('bwip-js');

module.exports = generateBarcodeImageBuffer;

function generateBarcodeImageBuffer(text, options) {
  return new Promise((resolve, reject) => {
    options = {
      bcid: 'code128',
      scale: 1,
      height: 10,
      includetext: true,
      textxalign: 'center',
      ...options,
      text
    };

    bwipjs.toBuffer(options, function(err, image) {
      if (err) {
        return reject(err);
      }

      resolve(image);
    });
  });
}
