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

/*
const colors: string[] = [
    'crimson',
    'darkblue',
    'darkgreen',
    'darkorange',
    'darkslateblue',
    'deeppink',
    'seagreen',
    'mediumvioletred',
    // Add all other CSS colors
];*/
const colors: string[] = [
    'var(--mauve-9)',
    'var(--sage-9)',
    'var(--olive-9)',
    'var(--sand-9)',
    'var(--tomato-9)',
    'var(--red-9)',
    'var(--ruby-9)',
    'var(--crimson-9)',
    'var(--pink-9)',
    'var(--plum-9)',
    'var(--purple-9)',
    'var(--violet-9)',
    'var(--iris-9)',
    'var(--indigo-9)',
    'var(--blue-9)',
    'var(--cyan-9)',
    'var(--teal-9)',
    'var(--jade-9)',
    'var(--green-9)',
    'var(--grass-9)',
    'var(--bronze-9)',
    'var(--gold-9)',
    'var(--brown-9)',
    'var(--orange-9)',
    'var(--amber-9)',
    'var(--yellow-9)',
    'var(--lime-9)',
    'var(--mint-9)',
    'var(--sky-9)',
];
/**
 * Returns a random color from the list of colors
 */
export function getRandomColor(): string {
    return colors[Math.floor(Math.random() * colors.length)];
}