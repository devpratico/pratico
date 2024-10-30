/**
 * Logger utility
 * Use this utilisty instead of console.log, console.debug, console.warn, console.error
 * The first parameter is the category, the second should be the function name, and the third the message
 * To send an error to discord, add 'discord' as the last parameter (works only for errors)
 */

// Not ideal because it is a server action. It should be called only client-side. But it works when called server-side.
import { sendDiscordError } from "../(backend)/api/discord/discord.client";


const logCategories = {
    typescript: ['type', 'interface', 'function', 'variable'] as const,
    react: ['layout', 'page', 'component', 'hook'] as const,
    supabase: ['auth', 'database', 'storage', 'realtime'] as const,
    tldraw: ['tools', 'editor', 'collab'] as const,
    system: ['file', 'network', 'memory'] as const,
    next: ['middleware', 'api', 'page', 'layout'] as const,
}


const sharedStyles = 'padding: 1px 3px; border-radius: 3px; color: #fff;';

const browserConsoleStyles: { [key in keyof typeof logCategories]: string } = {
    typescript: 'background-color: royalblue;'      + sharedStyles,
    react:    'background-color: dodgerblue;'    + sharedStyles,
    supabase: 'background-color: forestgreen;'   + sharedStyles,
    tldraw:   'background-color: darkslategray;' + sharedStyles,
    system:   'background-color: darkorange;'    + sharedStyles,
    next:     'background-color: darkorchid;'    + sharedStyles,
};

const serverConsoleStyles: { [key in keyof typeof logCategories]: string } = {
        typescript: '\x1b[34m', // Blue
        react:    '\x1b[34m', // Blue
        supabase: '\x1b[32m', // Green
        tldraw:   '\x1b[36m', // Cyan
        system:   '\x1b[33m', // Yellow
        next:     '\x1b[35m', // Magenta
};



type ConsoleType = 'log' | 'debug' | 'warn' | 'error';
type ConsoleFunction = (message?: any, ...optionalParams: any[]) => void;
const consoleFunctions: { [key in ConsoleType]: ConsoleFunction } = {
    log:   console.log.bind(console),
    debug: console.debug.bind(console),
    warn:  console.warn.bind(console),
    error: console.error.bind(console),
};


type ParentCategory = keyof typeof logCategories;
type ChildCategory = {[P in ParentCategory]: `${P}:${typeof logCategories[P][number]}`}[ParentCategory];
type LogCategory = ParentCategory | ChildCategory;


interface LoggerOptions {
    enable: boolean;
    categories: LogCategory[];
}

class Logger {
    private static instance: Logger;
    private options: LoggerOptions;
    
    private constructor() {
        this.options = {
            enable: false, // Disabled by default
            categories: [], // No categories enabled by default
        };
    }
    
    public static getInstance(): Logger {
        if (!this.instance) {
            this.instance = new Logger();
        }
        return this.instance;
    }
    
    public configure(options: Partial<LoggerOptions>): void {
        this.options = { ...this.options, ...options };
    }

    private isBrowser(): boolean {
        return typeof window !== 'undefined' && typeof window.document !== 'undefined';
    }

    
    private print(category: ChildCategory, type: ConsoleType, message: string, ...optionalParams: any[]): void {
        
        const isCategoryDirectlyEnabled = this.options.categories.includes(category)
        const isParentCategoryEnabled   = this.options.categories.includes(category.split(':')[0] as LogCategory)
        const isCategoryEnabled = isCategoryDirectlyEnabled || isParentCategoryEnabled

        // First, check if the logger is enabled and the category is enabled. Otherwise, do nothing
        if (!this.options.enable || !isCategoryEnabled) {
            return;
        }

        // For errors, no matter the environment, if we opted-in discord, we send the message
        if (type === 'error' && [...optionalParams].pop() == 'discord') {
            optionalParams.pop(); // Effectively remove the last parameter
            sendDiscordError(`${category} ${message} ${optionalParams}`);
        }

        // Now, depending on the environment, we'll style the output differently

        // In local dev, client-side (browser console), we use colors
        if (process.env.NODE_ENV === 'development' && this.isBrowser()) {
            const browserStyle = browserConsoleStyles[category.split(':')[0] as ParentCategory];
            consoleFunctions[type](`%c${category}%c ${message}`, browserStyle, '', ...optionalParams);
            return;
        }

        // In local dev but server-side, we'll use colors in the terminal
        if (process.env.NODE_ENV === 'development' && !this.isBrowser()) {
            const serverStyle = serverConsoleStyles[category.split(':')[0] as ParentCategory];
            consoleFunctions[type](`${serverStyle}${category}\x1b[0m ${message}`, ...optionalParams);
            return;
        }

        // In Vercel previews, (browser console), we use colors
        if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' && this.isBrowser()) {
            const browserStyle = browserConsoleStyles[category.split(':')[0] as ParentCategory];
            consoleFunctions[type](`%c${category}%c ${message}`, browserStyle, '', ...optionalParams);
            return;
        }

        // In Vercel previews server-side, we'll print without colors
        if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' && !this.isBrowser()) {
            consoleFunctions[type](category, message, ...optionalParams);
            return;
        }

        // In Vercel prod, client-side (browser console), we only run error and warnlogs, without styling
        if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' && this.isBrowser()) {
            if ( type === 'error' || type === 'warn' ) {
                consoleFunctions[type](category, message, ...optionalParams);
            }
            return;
        }

        // In Vercel prod, server-side, we only run error and warn logs, without styling
        if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' && !this.isBrowser()) {
            if ( type === 'error' || type === 'warn' ) {
                consoleFunctions[type](category, message, ...optionalParams);
            }
            return;
        }
        
        // If not in the previous cases, do nothing.
    }

    public log(category: ChildCategory, message: string, ...optionalParams: any[]): void {
        this.print(category, 'log', message, ...optionalParams);
    }

    public debug(category: ChildCategory, message: string, ...optionalParams: any[]): void {
        this.print(category, 'debug', message, ...optionalParams);
    }

    public warn(category: ChildCategory, message: string, ...optionalParams: any[]): void {
        this.print(category, 'warn', message, ...optionalParams);
    }

    public error(category: ChildCategory, message: string, ...optionalParams: any[]): void {
        this.print(category, 'error', message, ...optionalParams);
    }
}
    
const logger = Logger.getInstance();
const allParentCategories: ParentCategory[] = Object.keys(logCategories) as ParentCategory[];
logger.configure({
    enable: true,
    categories: allParentCategories,
});

export default logger;