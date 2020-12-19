
// Stolen from https://stackoverflow.com/a/44737041
export function download(blob: Blob, filename: string) {
  if (window.navigator.msSaveOrOpenBlob) { // IE10+
    window.navigator.msSaveOrOpenBlob(blob, filename);
  } else { // Others
    let a = document.createElement('a'),
        url = URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);  
    }, 0);
  }
}
