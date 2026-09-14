let text = "-\infty";
console.log(text === "-infty"); // TRUE!
let normalized = text.replace(/-infty/, "-\\\\infty");
console.log(normalized); // -\\infty (which means literal \ is printed)
