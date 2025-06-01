interface CookieOptions {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    maxAge?: number;
    domain?: string;
    path?: string;
    expires?: Date;
    signed?: boolean;
    overwrite?: boolean;
    encode?: (val: string) => string;
    decode?: (val: string) => string;
    [key: string]: any; // Allow any other properties
}
export const getMaxAgeInMinutes = (minutes: number) => minutes * 60 * 1000; // 15 minutes
export const getMaxAgeInDays = (days: number) => days * 24 * 60 * 60 * 1000; // 7 days
export const accessTokenOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Set to true in production
    sameSite: 'strict', // CSRF protection
    maxAge: getMaxAgeInDays(15), // 15 mins
};

export const refreshTokenOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Set to true in production
    sameSite: 'strict', // CSRF protection
    maxAge: getMaxAgeInDays(7), // 7 days
};