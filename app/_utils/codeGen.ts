export function generateRandomCode(): string {
    const min = 1;
    const max = 9999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    const randomCode = randomNumber.toString().padStart(4, '0'); // Ensure 4 digits with leading zeros
    return randomCode;
}


/**
 * Encodes a string for use in a URL (removes spaces and special characters)
 */
export function encodeStringForURL(str: string): string {
    return encodeURIComponent(str.replace(/ /g, '')).replace(/[!'()*]/g, function(c) {
        return '%' + c.charCodeAt(0).toString(16);
    });
}


const colors: string[] = [
    'AliceBlue', 'AntiqueWhite', 'Aqua', 'Aquamarine', 'Azure',
    'Beige', 'Bisque', 'Black', 'BlanchedAlmond', 'Blue',
    'BlueViolet', 'Brown', 'BurlyWood', 'CadetBlue', 'Chartreuse',
    'Chocolate', 'Coral', 'CornflowerBlue', 'Cornsilk', 'Crimson',
    'Cyan', 'DarkBlue', 'DarkCyan', 'DarkGoldenRod', 'DarkGray',
    'DarkGrey', 'DarkGreen', 'DarkKhaki', 'DarkMagenta', 'DarkOliveGreen',
    'Darkorange', 'DarkOrchid', 'DarkRed', 'DarkSalmon', 'DarkSeaGreen',
    'DarkSlateBlue', 'DarkSlateGray', 'DarkSlateGrey', 'DarkTurquoise', 'DarkViolet',
    'DeepPink', 'DeepSkyBlue', 'DimGray', 'DimGrey', 'DodgerBlue',
    'FireBrick', 'FloralWhite', 'ForestGreen', 'Fuchsia', 'Gainsboro',
    'GhostWhite', 'Gold', 'GoldenRod', 'Gray', 'Grey',
    'Green', 'GreenYellow', 'HoneyDew', 'HotPink', 'IndianRed',
    // Add all other CSS colors
];

/**
 * Returns a random color from the list of colors
 */
export function getRandomColor(): string {
    return colors[Math.floor(Math.random() * colors.length)];
}