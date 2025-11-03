export { };

declare global {
    interface Window {
        APP_ENV: {
            [key: string]: string;
        };
    }
}