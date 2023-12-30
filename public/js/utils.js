
function url2b64Image(url) {    
  return new Promise(async function(resolve, reject) {
      const response = await fetch(url);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = function() {
          resolve(reader.result);
      }
      reader.readAsDataURL(blob);
  });
}

function file2b64Image(file) {
  return new Promise(async function(resolve, reject) {
      const reader = new FileReader();
      reader.onloadend = function() {
          resolve(reader.result);
      };
      reader.readAsDataURL(file);
  });
}

function b64Raw2ImageURL(b64RawString) {
  return 'data:image/png;base64,' + b64RawString;
}