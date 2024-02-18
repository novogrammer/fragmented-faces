import { useEffect } from "react"
async function setupCameraAsync(): Promise<void> {
  const video: HTMLVideoElement = document.getElementById('video') as HTMLVideoElement;
  const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
    video: {
      width:256,
      height:256,
    },
    audio:false,
  });
  video.srcObject = stream;
}

function captureImageAsBlobAsync(): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const video: HTMLVideoElement = document.getElementById('video') as HTMLVideoElement;
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas to Blob conversion failed'));
        }
      }, 'image/jpeg');
    } else {
      reject(new Error('Could not get canvas context'));
    }
  });
}
function blobToArrayBufferAsync(blob: Blob): Promise<ArrayBuffer> {
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

function flipBitInArrayBuffer(arrayBuffer: ArrayBuffer): Uint8Array {
  const view: Uint8Array = new Uint8Array(arrayBuffer);
  const byteIndex: number = Math.floor(Math.random() * view.length);
  const bitPosition: number = Math.floor(Math.random() * 8);
  view[byteIndex] ^= 1 << bitPosition;
  return view;
}

function arrayBufferToBase64(buffer: Uint8Array): string {
  let binary: string = '';
  const bytes: Uint8Array = new Uint8Array(buffer);
  const len: number = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

async function displayImageWithFlippedBitAsync(): Promise<void> {
  const blob: Blob = await captureImageAsBlobAsync();
  const arrayBuffer: ArrayBuffer = await blobToArrayBufferAsync(blob);
  const flippedBuffer: Uint8Array = flipBitInArrayBuffer(arrayBuffer);
  const base64String: string = arrayBufferToBase64(flippedBuffer);
  (document.getElementById('outputImage') as HTMLImageElement).src = `data:image/jpeg;base64,${base64String}`;
}



async function mainAsync():Promise<void>{
  await setupCameraAsync();
  setTimeout(()=>{
    displayImageWithFlippedBitAsync().catch((error)=>{
      console.error(error);

    })
    
  },1000)
}


function App() {

  useEffect(()=>{
    mainAsync().catch((error)=>{
      console.error(error);
    });
  },[]);


  return (
    <>
      <video id="video" autoPlay></video>
      <img id="outputImage" src="" />
    </>
  )
}

export default App
