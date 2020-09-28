import React, { useState, useEffect } from 'react'
import VideoAnnotation from './components/VideoAnnotation'


export default () => {
  const [tracks, setTracks] = useState([])
  const [labels, setLabels] = useState([])
  const [annotations, setAnnotations] = useState([])
  const [fps, setFps] = useState(0)

  useEffect(()=>{
    getTracks()
    getFps()
    pullImages()
  }, [])

  const getTracks = async () => {
    const req = await fetch('http://localhost:5000/getTracks')
    const data = await req.json()
    setTracks(data)
  }

  const getFps = async () => {
    const req = await fetch('http://localhost:5000/getFps')
    const data = await req.text()
    const fps = parseInt(data)
    setFps(fps)
  }


  const pullImages = async () => {
    const labelsReq = await fetch('http://localhost:5000/getLabels')
    const labels = await labelsReq.json()
    setLabels(labels)
    const req = await fetch('http://localhost:5000/getLost')
    const data = await req.json()
    setAnnotations(data)   
    
  }



  return(
    <div>
      <VideoAnnotation
        annotations={annotations}
        labels={labels}
        tracks={tracks}
        fps={fps}
      />
    </div>
  )
}