module.exports.AsciiToHex = function(item) {
  if (item === undefined || item.length === 0 || item.length > 2) {
    return null;
  }
  let convertedItem = Number(item.charCodeAt(0)).toString(16);
  if (convertedItem.length === 1) {
    convertedItem = "0x0" + convertedItem;
  } else {
    convertedItem = "0x" + convertedItem;
  }
  return convertedItem;
};

//randmo form [min,max]
module.exports.randomNumber = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
