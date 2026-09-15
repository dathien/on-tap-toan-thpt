const n = 10;
const bossCount = n >= 15 ? 3 : (n >= 10 ? 2 : 1);
const rem = n - bossCount;
const base = Math.floor(rem / 4);
let extra = rem % 4;

const levels = [0,0,0,0,bossCount];
for (let i = 0; i < 4; i++) {
    levels[i] = base + (extra > 0 ? 1 : 0);
    if (extra > 0) extra--;
}
// reverse the extra logic so level 4 gets extra first
const levels2 = [0,0,0,0,bossCount];
extra = rem % 4;
for (let i = 3; i >= 0; i--) {
    levels2[i] = base + (extra > 0 ? 1 : 0);
    if (extra > 0) extra--;
}

console.log(levels2);
