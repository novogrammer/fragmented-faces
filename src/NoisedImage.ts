import { arrayBufferToBase64, flipBitInArrayBuffer } from "./buffer_utils";
import { IMAGE_MIME_TYPE } from "./constants";

export default class NoisedImage{
  imageBuffer:Uint8Array;
  constructor(imageBuffer:Uint8Array){
    this.imageBuffer=imageBuffer;
  }
  async attemptAddNoiseAsync():Promise<boolean>{
    const flippedBuffer: Uint8Array = flipBitInArrayBuffer(this.imageBuffer);

    // TODO: 検証
    this.imageBuffer=flippedBuffer;
    return true;
  }

  getBase64Image():string{
    const base64String: string = arrayBufferToBase64(this.imageBuffer);

    const base64Image=`data:${IMAGE_MIME_TYPE};base64,${base64String}`;
    return base64Image;

  }
}