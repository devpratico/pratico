/**
 * This function is used to debounce a function call. It means that the function
 * will only be called after a certain amount of time has passed since the last time it was called.
 * @param func  The function to debounce.
 * @param wait  The time to wait before calling the function (in milliseconds)
 * @returns The debounced function
 * @example
 * // Define the function outside of the loop that causes too many calls:
 * const debouncedFunction = debounce((a: string) => console.log(a), 1000);
 * // Inside the loop, call the debounced function:
 * debouncedFunction('Hello');
 */
export default function debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout;
    return function(...args: any[]) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func(...args);
        }, wait);
    }
}