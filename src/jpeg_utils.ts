import { JPEG_ESCAPE, JPEG_MARKER_EOI, JPEG_MARKER_ESCAPE_DATA, JPEG_MARKER_SOS } from "./constants";

export function findImageDataIndex(buffer:Uint8Array){
  let imageDataIndexBegin=-1;
  let imageDataIndexEnd=-1;
  for(let i=0;i<buffer.length-1;i++){
    if(buffer[i]===JPEG_ESCAPE){
      const marker=buffer[i+1];
      switch(marker){
        case JPEG_MARKER_SOS:
          imageDataIndexBegin=i+2;
          break;
        case JPEG_MARKER_EOI:
          imageDataIndexEnd=i;
          break;
        default:
          // DO NOTHING
          break;
      }
      console.log("marker: " + marker.toString(16));
    }
  }
  return {
    imageDataIndexBegin,
    imageDataIndexEnd,
  }

}

export function countEscapeData(buffer:Uint8Array,beginIndex:number,endIndex:number){
  let escapeOtherCount=0;
  let escapeDataCount=0;
  for(let i=beginIndex;i<endIndex;i++){
    if(buffer[i]===JPEG_ESCAPE){
      const marker=buffer[i+1];
      switch(marker){
        case JPEG_MARKER_ESCAPE_DATA:
          escapeDataCount+=1;
          break;
        default:
          escapeOtherCount+=1;
          // DO NOTHING
          break;
      }
    }
  }
  return {
    escapeDataCount,
    escapeOtherCount,
  };

}


export function countValueInArrayBuffer(buffer:Uint8Array,value:number):number{
  return buffer.reduce((acc,byte)=>acc+((byte===value)?1:0),0);
}
