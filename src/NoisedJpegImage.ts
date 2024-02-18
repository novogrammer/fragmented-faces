import { arrayBufferToBase64DataUri,  flipBitInArrayBuffer } from "./buffer_utils";
import { JPEG_MIME_TYPE } from "./constants";
import { countEscapeData, findImageDataIndex } from "./jpeg_utils";

export default class NoisedJpegImage{
  imageBuffer:Uint8Array;
  imageEscapeDataCount:number;
  imageDataIndexBegin:number=-1;
  imageDataIndexEnd:number=-1;
  constructor(imageBuffer:Uint8Array){
    this.imageBuffer=imageBuffer;

    const {imageDataIndexBegin,imageDataIndexEnd}=findImageDataIndex(imageBuffer);
    this.imageDataIndexBegin=imageDataIndexBegin;
    this.imageDataIndexEnd=imageDataIndexEnd;
    
    if(this.imageDataIndexBegin===-1){
      throw new Error("SOS not found");
    }
    if(this.imageDataIndexEnd===-1){
      throw new Error("EOI not found");
    }
    const {escapeDataCount,escapeOtherCount}=countEscapeData(this.imageBuffer,this.imageDataIndexBegin,this.imageDataIndexEnd);
    if(0<escapeOtherCount){
      throw new Error("unknown escape");
    }

    this.imageEscapeDataCount=escapeDataCount;
    
  }
  async attemptAddNoiseAsync():Promise<boolean>{
    const flippedBuffer: Uint8Array = flipBitInArrayBuffer(this.imageBuffer,this.imageDataIndexBegin,this.imageDataIndexEnd);



    const isOk=await new Promise<boolean>((resolve)=>{

      const {escapeDataCount,escapeOtherCount}=countEscapeData(flippedBuffer,this.imageDataIndexBegin,this.imageDataIndexEnd);
      if(0<escapeOtherCount){
        console.log("escape other count changed");
        resolve(false);
        return;
      }
      if(this.imageEscapeDataCount!==escapeDataCount){
        console.log("escape data count changed");
        resolve(false);
        return;
      }
  
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