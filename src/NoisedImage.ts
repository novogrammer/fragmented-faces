import { arrayBufferToBase64DataUri, flipBitInArrayBuffer } from "./buffer_utils";
import { IMAGE_MIME_TYPE } from "./constants";

export default class NoisedImage{
  imageBuffer:Uint8Array;
  constructor(imageBuffer:Uint8Array){
    this.imageBuffer=imageBuffer;
  }
  async attemptAddNoiseAsync():Promise<boolean>{
    const flippedBuffer: Uint8Array = flipBitInArrayBuffer(this.imageBuffer);

    const isOk=await new Promise<boolean>((resolve)=>{
      const image=new Image();
      const base64Image=arrayBufferToBase64DataUri(flippedBuffer,IMAGE_MIME_TYPE);
      image.addEventListener("load",()=>{
        console.log("image load");
        resolve(true);
      })
      image.addEventListener("error",()=>{
        console.log("image error");
        resolve(false);
      })

      image.src=base64Image;
    })
    if(isOk){
      this.imageBuffer=flippedBuffer;
    }
    return isOk;
  }

  getBase64Image():string{
    const base64Image=arrayBufferToBase64DataUri(this.imageBuffer,IMAGE_MIME_TYPE);
    return base64Image;

  }
}