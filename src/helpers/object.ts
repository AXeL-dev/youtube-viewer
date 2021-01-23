
// stolen from: https://stackoverflow.com/a/24221895
export function resolve(obj: any, path: string) {
  const keys = path.split('.');
  let current = obj;
  while (keys.length) {
    if (typeof current !== 'object') return undefined;
    current = current[keys.shift() as any];
  }
  return current as any;
}
