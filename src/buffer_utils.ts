export function blobToArrayBufferAsync(blob: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader: FileReader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        resolve(reader.result as ArrayBuffer);
      } else {
        reject(new Error('FileReader did not load the file as expected.'));
      }
    };
    reader.readAsArrayBuffer(blob);
  });
}

export function flipBitInArrayBuffer(arrayBuffer: ArrayBuffer): Uint8Array {
  const view: Uint8Array = new Uint8Array(arrayBuffer);
  const byteIndex: number = Math.floor(Math.random() * view.length);
  const bitPosition: number = Math.floor(Math.random() * 8);
  view[byteIndex] ^= 1 << bitPosition;
  return view;
}

export function arrayBufferToBase64(buffer: Uint8Array): string {
  let binary: string = '';
  const bytes: Uint8Array = new Uint8Array(buffer);
  const len: number = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

