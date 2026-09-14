let v = "$-\\infty$"; // 9 chars
console.log(Array.from(v));
v = v.replace(/\binfty\b/g, "\\infty"); 
console.log(Array.from(v));
