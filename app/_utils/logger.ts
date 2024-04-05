const logCategories = {
    react: ['layout', 'page', 'component', 'hook'] as const,
    supabase: ['auth', 'database', 'storage', 'realtime'] as const,
    tldraw: ['tools', 'editor', 'collab'] as const,
    system: ['file', 'network', 'memory'] as const,
}

// TODO: style it also for when it prints in the server console.

const sharedStyles = 'padding: 1px 3px; border-radius: 3px; color: #fff;';

const styles: { [key in keyof typeof logCategories]: string } = {
    react:    'background-color: dodgerblue;'    + sharedStyles,
    supabase: 'background-color: forestgreen;'   + sharedStyles,
    tldraw:   'background-color: darkslategray;' + sharedStyles,
    system:   'background-color: darkorange;'    + sharedStyles,
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


    
    
    private print(category: ChildCategory, type: ConsoleType, message: string, ...optionalParams: any[]): void {
        
        const isCategoryDirectlyEnabled = this.options.categories.includes(category)
        const isParentCategoryEnabled   = this.options.categories.includes(category.split(':')[0] as LogCategory)
        const isCategoryEnabled = isCategoryDirectlyEnabled || isParentCategoryEnabled
        
        if (
            process.env.NODE_ENV === 'development' &&
            this.options.enable &&
            isCategoryEnabled
        ) {
            const style = styles[category.split(':')[0] as ParentCategory];
            consoleFunctions[type](`%c${category}%c ${message}`, style, '', ...optionalParams);
        }
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