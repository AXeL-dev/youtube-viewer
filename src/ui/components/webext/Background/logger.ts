const { REACT_APP_DEBUG } = process.env;

export function log(message: any, ...params: any) {
  if (REACT_APP_DEBUG) {
    console.log(message, ...params);
  }
}
