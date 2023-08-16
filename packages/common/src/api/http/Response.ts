import * as http from "http";

export interface CookieOptions {
    maxAge?: number;
    signed?: boolean;
    expires?: Date;
    httpOnly?: boolean;
    path?: string;
    domain?: string;
    secure?: boolean;
    encode?: ((val: string) => string);
    sameSite?: boolean | 'lax' | 'strict' | 'none';
}

export interface Response extends http.ServerResponse {
    status(code: number): this;
    send(body?: any): this;
    json(body?: any): this;
    contentType(type: string): this;
    header(field: any): this;
    header(field: string, value?: string | string[]): this;
    clearCookie(name: string): this;
    cookie(name: string, val: any, options: CookieOptions): this;
    cookie(name: string, val: any): this;
    redirect(url: string): void;
    redirect(status: number, url: string): void;
}