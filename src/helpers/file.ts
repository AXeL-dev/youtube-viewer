export function downloadFile(blob: Blob, filename: string) {
  if ((window.navigator as any).msSaveOrOpenBlob) {
    // IE10+
    (window.navigator as any).msSaveOrOpenBlob(blob, filename);
  } else {
    // Others
    const a = document.createElement('a'),
      url = URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}

export function readFile(file: Blob) {
  return new Promise(function (resolve, reject) {
    const fileReader = new FileReader();
    fileReader.readAsText(file, 'UTF-8');
    fileReader.onload = function () {
      resolve(fileReader.result);
    };
    fileReader.onerror = function (error) {
      reject(error);
    };
  });
}
