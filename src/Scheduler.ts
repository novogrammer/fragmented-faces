import type Camera from "./Camera";
import NoisedJpegImage from "./NoisedJpegImage";
import { blobToUint8ArrayAsync } from "./buffer_utils";
import { ADD_NOISE_INTERVAL, CAPTURE_INTERVAL } from "./constants";

export default class Scheduler{
  captureTimerId?:number;
  addNoiseTimerId?:number;
  setupPromise:Promise<void>;
  camera:Camera|null=null;
  setBase64ImageList:React.Dispatch<React.SetStateAction<string[]>>;
  noisedJpegImageList:NoisedJpegImage[]=[];
  constructor(camera:Camera,setBase64ImageList:React.Dispatch<React.SetStateAction<string[]>>){
    this.camera=camera;
    this.setBase64ImageList=setBase64ImageList;
    this.setupPromise=this.setupAsync();
  }
  async setupAsync():Promise<void>{
    this.captureTimerId=setInterval(()=>{
      this.onIntervalCaptureAsync().catch((error)=>{
        console.error(error);
      });
    },CAPTURE_INTERVAL*1000);
    this.addNoiseTimerId=setInterval(()=>{
      this.onIntervalAddNoiseAsync().catch((error)=>{
        console.error(error);
      });
    },ADD_NOISE_INTERVAL*1000);


  }
  async destroyAsync():Promise<void>{
    await this.setupPromise;
    clearInterval(this.captureTimerId);
    clearInterval(this.addNoiseTimerId);

  }
  async onIntervalCaptureAsync():Promise<void>{
    console.log("onIntervalCaptureAsync");
    await this.captureAsync();
  }
  async onIntervalAddNoiseAsync():Promise<void>{
    console.log("onIntervalAddNoiseAsync");
    await this.attemptAddNoiseAsync();
  }

  updateBase64ImageList(){

    this.setBase64ImageList(()=>{
      return this.noisedJpegImageList.map((noisedJpegImage)=>{
        return noisedJpegImage.getBase64Image();
      })
    })

  }

  async captureAsync():Promise<void>{
    if(this.camera===null){
      return;
    }
    const blob: Blob = await this.camera.captureImageAsBlobAsync();
    const buffer: Uint8Array = await blobToUint8ArrayAsync(blob);

    const noisedJpegImage=new NoisedJpegImage(buffer);
    this.noisedJpegImageList.push(noisedJpegImage);
    this.updateBase64ImageList();
  }

  async attemptAddNoiseAsync():Promise<void>{
    for(const noisedJpegImage of this.noisedJpegImageList){
      await noisedJpegImage.attemptAddNoiseAsync();
    }

    this.updateBase64ImageList();
  }

}