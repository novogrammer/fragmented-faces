import type Camera from "./Camera";
import { arrayBufferToBase64, blobToArrayBufferAsync, flipBitInArrayBuffer } from "./buffer_utils";
import { INTERVAL_DURATION } from "./constants";

export default class Scheduler{
  timerId?:number;
  setupPromise:Promise<void>;
  camera:Camera|null=null;
  setBase64ImageList:React.Dispatch<React.SetStateAction<string[]>>;
  constructor(camera:Camera,setBase64ImageList:React.Dispatch<React.SetStateAction<string[]>>){
    this.camera=camera;
    this.setBase64ImageList=setBase64ImageList;
    this.setupPromise=this.setupAsync();
  }
  async setupAsync():Promise<void>{
    this.timerId=setInterval(()=>{
      this.onInterval();
    },INTERVAL_DURATION*1000);
  }
  async destroyAsync():Promise<void>{
    await this.setupPromise;
    clearInterval(this.timerId);

  }
  onInterval(){
    console.log("onInterval");
    this.captureAsync().catch((error)=>{
      console.error(error);
    })
  }

  async captureAsync(){
    if(this.camera===null){
      return;
    }
    const blob: Blob = await this.camera.captureImageAsBlobAsync();
    const arrayBuffer: ArrayBuffer = await blobToArrayBufferAsync(blob);

    const flippedBuffer: Uint8Array = flipBitInArrayBuffer(arrayBuffer);
  
    const base64String: string = arrayBufferToBase64(flippedBuffer);
    this.setBase64ImageList((base64ImageList)=>{
      const base64Image=`data:image/jpeg;base64,${base64String}`;
      return [base64Image,...base64ImageList];
    })
  

  }
}