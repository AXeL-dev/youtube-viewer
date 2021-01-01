// no need to import process Object since it will be defined by create-react-app

export const isDevEnv: boolean = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export class debug {

  static log(message: any, ...params: any) {
    isDevEnv && console.log(message, ...params);
  }
  
  static warn(message: any, ...params: any) {
    isDevEnv && console.warn(message, ...params);
  }

}
