import process from "process";

export const isDevEnv: boolean = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export function debug(message: string, ...params: any) {
  isDevEnv && console.log(message, ...params);
}
