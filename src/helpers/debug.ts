import process from "process";

const development: boolean = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export default function isDev(): boolean
{
  return development;
}

export function debug(message: string, ...params: any) {
  isDev() && console.log(message, ...params);
}
