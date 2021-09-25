const { REACT_APP_DEBUG } = process.env;

function time() {
  const now = new Date();
  return `[${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}]`;
}

export function log(message: any, ...params: any) {
  if (REACT_APP_DEBUG) {
    console.log(time(), message, ...params);
  }
}
