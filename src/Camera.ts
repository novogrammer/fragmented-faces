import { IMAGE_MIME_TYPE } from "./constants";


export default class Camera{
  videoElement:HTMLVideoElement;
  setupPromise:Promise<void>;
  constructor(videoElement:HTMLVideoElement){
    this.videoElement=videoElement;
    this.setupPromise=this.setupAsync();
    
  }
  async setupAsync():Promise<void>{
    const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        width:256,
        height:256,
      },
      audio:false,
    });
    this.videoElement.srcObject = stream;
  
  }
  async destroyAsync():Promise<void>{
    await this.setupPromise;
    this.videoElement.srcObject=null;
    
  }
  async captureImageAsBlobAsync():Promise<Blob>{
    return await new Promise<Blob>((resolve, reject) => {
      
      const canvas: HTMLCanvasElement = document.createElement('canvas');
      canvas.width = this.videoElement.videoWidth;
      canvas.height = this.videoElement.videoHeight;
      const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(this.videoElement, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Canvas to Blob conversion failed'));
          }
        }, IMAGE_MIME_TYPE);
      } else {
        reject(new Error('Could not get canvas context'));
      }
    });
  
  }
}