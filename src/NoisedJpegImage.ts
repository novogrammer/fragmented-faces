import { arrayBufferToBase64DataUri, flipBitInArrayBuffer } from "./buffer_utils";
import { JPEG_MARKER_EOI, JPEG_MARKER_SOS, JPEG_MIME_TYPE } from "./constants";

export default class NoisedJpegImage{
  imageBuffer:Uint8Array;
  imageDataIndexBegin:number=-1;
  imageDataIndexEnd:number=-1;
  constructor(imageBuffer:Uint8Array){
    this.imageBuffer=imageBuffer;
    for(let i=0;i<imageBuffer.length-1;i++){
      if(imageBuffer[i]===0xff){
        const marker=imageBuffer[i+1];
        switch(marker){
          case JPEG_MARKER_SOS:
            this.imageDataIndexBegin=i+2;
            break;
          case JPEG_MARKER_EOI:
            this.imageDataIndexEnd=i;
            break;
          default:
            // DO NOTHING
            break;
        }
        // console.log("marker: " + marker.toString(16));
      }
    }
    if(this.imageDataIndexBegin===-1){
      throw new Error("SOS not found");
    }
    if(this.imageDataIndexEnd===-1){
      throw new Error("EOI not found");
    }
    
  }
  async attemptAddNoiseAsync():Promise<boolean>{
    const flippedBuffer: Uint8Array = flipBitInArrayBuffer(this.imageBuffer,this.imageDataIndexBegin,this.imageDataIndexEnd);

    const isOk=await new Promise<boolean>((resolve)=>{
      const image=new Image();
      const base64Image=arrayBufferToBase64DataUri(flippedBuffer,JPEG_MIME_TYPE);
      image.addEventListener("load",()=>{
        // console.log("image load");
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
    const base64Image=arrayBufferToBase64DataUri(this.imageBuffer,JPEG_MIME_TYPE);
    return base64Image;

  }
}