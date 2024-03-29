export function blobToUint8ArrayAsync(blob: Blob): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader: FileReader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        const uint8array=new Uint8Array(reader.result as ArrayBuffer);
        resolve(uint8array);
      } else {
        reject(new Error('FileReader did not load the file as expected.'));
      }
    };
    reader.readAsArrayBuffer(blob);
  });
}

export function flipBitInArrayBuffer(arrayBuffer: Uint8Array,beginIndex:number,endIndex:number): Uint8Array {
  if(arrayBuffer.length<endIndex){
    throw new Error("out of range");
  }
  if(endIndex<=beginIndex){
    throw new Error("invalid index");
  }
  const view: Uint8Array = new Uint8Array(arrayBuffer);
  const byteIndex: number = beginIndex + Math.floor(Math.random() * (endIndex - beginIndex));
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


export function arrayBufferToBase64DataUri(buffer:Uint8Array,mymeType:string){
  const base64String: string = arrayBufferToBase64(buffer);

  const base64DataUri=`data:${mymeType};base64,${base64String}`;
  return base64DataUri;


}
