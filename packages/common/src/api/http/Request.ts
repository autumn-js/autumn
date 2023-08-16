import {HttpMethod} from "./HttpProvider";
import * as http from "http";

export interface ParamsDictionary {
    [key: string]: string;
}


export interface QueryParams {
    [key: string]: string | string[] | undefined
}

export interface Request extends http.IncomingMessage {
    method: HttpMethod;
    url: string;
    protocol: string;
    secure: boolean;
    ip: string;
    path: string;
    hostname: string;
    body?: any;
    params: ParamsDictionary;
    queryParams: QueryParams;
    header(name: 'set-cookie'): string[] | undefined;
    header(name: string): string | undefined;
    accepts(type: string): string | false;
    accepts(type: string[]): string | false;
    acceptsCharsets(charset: string): string | false;
    acceptsCharsets(charset: string[]): string | false;
    acceptsEncodings(encoding: string): string | false;
    acceptsEncodings(encoding: string[]): string | false;
    acceptsLanguages(lang: string): string | false;
    acceptsLanguages(lang: string[]): string | false;
    is(type: string | string[]): string | false | null;
}