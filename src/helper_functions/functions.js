module.exports.AsciiToHex = function(item) {
  if (item.length === 0 || item.length > 2 || typeof item !== "string") {
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
  if (min < 0 || max < 0) {
    return null;
  }
  if (min >= max) {
    return null;
  }
  if (typeof min !== "number" || typeof max !== "number") {
    return null;
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
