'use strict';

function hexToUint8(hexString) {
  var result = [];
  for (var i = 0; i < hexString.length; i += 2) {
    result.push(parseInt(hexString.substr(i, 2), 16));
  }
  return Uint8Array.from(result);
}

function uint8toHex(byteArray) {
  return Array.prototype.map
    .call(byteArray, function (byte) {
      return ('0' + (byte & 0xff).toString(16)).slice(-2);
    })
    .join('');
}

module.exports = {
  hexToUint8,
  uint8toHex,
};
