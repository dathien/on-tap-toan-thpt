export const getGridClass = (options: any[]) => {
    if (!options || !Array.isArray(options)) return "grid grid-cols-1 sm:grid-cols-2 gap-4";
    
    let isLong = false;
    for (const o of options) {
        if (!o.content) continue;
        
        // Character count threshold
        if (o.content.length >= 35) {
            isLong = true;
            break;
        }
        
        // Match fractions, long integrals, big math blocks
        if (o.content.includes('\\frac') && o.content.length > 25) {
            isLong = true; break;
        }
        if (o.content.includes('\\int') || o.content.includes('\\sum') || o.content.includes('\\lim')) {
            isLong = true; break;
        }
        
        // Match Oxyz coordinates like (x-a)^2 + (y-b)^2 + (z-c)^2 = R^2
        if (o.content.includes('(x') && o.content.includes('(y') && o.content.includes('(z')) {
            isLong = true; break;
        }
    }
    
    return isLong ? "grid grid-cols-1 gap-4" : "grid grid-cols-1 sm:grid-cols-2 gap-4";
}
