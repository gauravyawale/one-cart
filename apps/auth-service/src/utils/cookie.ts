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
export const accessTokenOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Set to true in production
    sameSite: 'strict', // CSRF protection
    maxAge: 15 * 60 * 1000, // 15 mins
};

export const refreshTokenOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Set to true in production
    sameSite: 'strict', // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};