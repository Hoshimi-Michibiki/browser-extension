const isDebug = import.meta.env.VITE_DEBUG === 'true'
const isLog = import.meta.env.VITE_LOG === 'true'

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const logPrefix = '[MichibikiExt]';

function log(level: LogLevel, ...args: any[]) {
    if (!isDebug && level === 'debug') return;
    if (!isLog) return;

    const colorMap: Record<LogLevel, string> = {
        debug: 'color: #999',
        info: 'color: #059de3',
        warn: 'color: orange',
        error: 'color: #ff4f55', 
    };

    const style = colorMap[level];
    console.log(`%c${logPrefix} [${level.toUpperCase()}]`, style, ...args);
}

export const logger = {
    debug: (...args: any[]) => log('debug', ...args),
    info: (...args: any[]) => log('info', ...args),
    warn: (...args: any[]) => log('warn', ...args),
    error: (...args: any[]) => log('error', ...args)
}