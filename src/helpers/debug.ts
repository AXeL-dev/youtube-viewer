// no need to import process Object since it will be defined by create-react-app

export const isDevEnv: boolean = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export function debug(message: string, ...params: any) {
  isDevEnv && console.log(message, ...params);
}

export function warn(message: string, ...params: any) {
  isDevEnv && console.warn(message, ...params);
}
