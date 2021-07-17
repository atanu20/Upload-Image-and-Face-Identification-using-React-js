import React ,{useState , useEffect , useRef} from 'react'
import * as tf from '@tensorflow/tfjs'
import * as facemesh from '@tensorflow-models/face-landmarks-detection';
import { useSpeechSynthesis } from 'react-speech-kit';
import './App.css'
import {drawMesh} from './Draw'
const App = () => {

const [load, setLoad] = useState(false);
const [model, setModel] = useState(null)
const [imageURL, setImageURL] = useState(null);
// const [results, setResults] = useState([])


  const { speak } = useSpeechSynthesis();

const fileInputRef = useRef(null)
const imageRef=useRef(null)
const textInputRef=useRef(null)
const canvaRef=useRef(null)

const loadModel=async ()=>{
  setLoad(true)
  try{
    const net = await facemesh.load(facemesh.SupportedPackages.mediapipeFacemesh);
    setModel(net)
    setLoad(false)

  }
  catch(error) {
    console.log(error)
    setLoad(false)
}
}


useEffect(() => {
  loadModel()
 
}, [])

// console.log(model)

  const fileUpload=(e)=>{
    const { files } = e.target
    if (files.length > 0) {
      const url=URL.createObjectURL(files[0])
        
        setImageURL(url)
    } else {
        setImageURL(null)
    }
  }

  const handleOnChange=(e)=>{
    setImageURL(e.target.value)
    

  }

  const identifyImage= async ()=>{
    fileInputRef.current.value=""
     textInputRef.current.value=""
    if (
      typeof imageRef.current !== "undefined" &&
      imageRef.current !== null 
    ) {
     

      const imageWidth = imageRef.current.clientWidth;
      const imageHeight = imageRef.current.clientHeight;

      // Set image width
      imageRef.current.width = imageWidth;
      imageRef.current.height =imageHeight;

    //   // Set canvas width
      canvaRef.current.width = imageWidth;
      canvaRef.current.height =imageHeight;
      
      // console.log( canvaRef.current.width )
      //  console.log(canvaRef.current.height )

      const face = await model.estimateFaces({input:imageRef.current});
     const ctx=canvaRef.current.getContext("2d")
    
     speak({ text: "Hello User ,I think There are around "+ face.length + " people" })
    drawMesh(face,ctx)
    

    }
   
    


  }

 



  return (
    <>
    <div className="">
      {
        load ? (
          <>
          <div className="loadding">
      <div className="spinner-grow text-info"></div>
      <br />
      <h5>Loading...</h5>
      </div>

          </>
        ) :
        (
          <>
        <div className="nav">
          <h2>Upload Image and Face Identification </h2>
        </div>
      <div className="container">
      <input type="file" accept='image/*' capture='camera' className="form-control inputtext1 " onChange={fileUpload} ref={fileInputRef}  />
      <br /> <br />

      <div className="form-group ">
  
  <input type="text" className="form-control inputtext2" id="usr" placeholder="Upload Image Url" ref={textInputRef} onChange={handleOnChange} />
</div>
       <br /><br />
        {
          imageURL && (
            <>
            <div className="row  bb">
           
           <img
            ref={imageRef} 
             style={{
              position:'absolute',
              margin:'auto',
          left:0,
          right:0,
               width:350,
               height:400,
               zIndex:9
             }} 
            src={imageURL} 
             alt="gg" 
              className="img-fluid box" 
              crossOrigin="anonymous"
               
               />
               <canvas 
               ref={canvaRef}
               
               style={{
                position:'absolute',
                margin:'auto',
                left:0,
                right:0,
                width:350,
                height:400,
                zIndex:9
              }} 
               />

               <br />
          
          
             
            
             
            
            
         </div>
        
         <div className="text-center">
         <button className="btn p-3  btn-dark" onClick={identifyImage}>
             Identify Image
             </button>
         </div>

            </>
          )
        }
         
      
      </div>

      
          </>
        )
      }
     



    </div>
      
    </>
  )
}

export default App
