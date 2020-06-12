
export function isNumber(value: string) {
  return !isNaN(+value) && /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/.test(value);
}
