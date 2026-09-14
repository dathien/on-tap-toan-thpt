const regex = /^(\*?)\s*([A-D])[\.\:\)]\s*(.*)/;
console.log(regex.exec("*A. content"));
console.log(regex.exec("B: content"));
