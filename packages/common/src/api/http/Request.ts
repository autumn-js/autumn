import {HttpMethod} from "./HttpProvider";

export interface Request {
    method: HttpMethod,
    uri: string
}