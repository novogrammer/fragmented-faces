import { useEffect, useRef, useState } from "react"
import Camera from "./Camera";
import Scheduler from "./Scheduler";


function App() {
  const videoElementRef=useRef<HTMLVideoElement>(null);
  const [base64ImageList,setBase64ImageList]=useState<string[]>([]);

  useEffect(()=>{
    if(videoElementRef.current===null){
      throw new Error("videoElementRef.current is null");
    }

    const camera = new Camera(videoElementRef.current);
    const scheduler = new Scheduler(camera,setBase64ImageList);
    
    return ()=>{
      scheduler.destroyAsync().catch((error)=>{
        console.error(error);
      });
      camera.destroyAsync().catch((error)=>{
        console.error(error);
      });
    }
  },[]);


  return (
    <>
      <video ref={videoElementRef} autoPlay></video>
      {
        base64ImageList.reverse().map((base64Image,index)=>{
          return <img key={index} src={base64Image} />
        })
      }
    </>
  )
}

export default App
