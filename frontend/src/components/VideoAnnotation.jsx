import React, { useState, useEffect, useRef } from 'react'
import { useInterval, useSet, createReducerContext } from 'react-use'
import { Container, Row, Col, Button } from 'reactstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useMeasure, useWindowSize } from 'react-use'
import TopBar from './TopBar'
import TopTopBar from './TopTopBar'
import LeftBar from './LeftBar'
import Center from './Center'
import BottomBar from './BottomBar'
import 'react-rangeslider/lib/index.css'
import RightBar from './RightBar'
import {transformFromLost, transformToLost} from './lostTransformer'

function App(props) {
  const containerRef = useRef(null)
  const lastFrameIndex = useRef(0)
  const size = useWindowSize()
  const imageRef = useRef(null)

  const [allFrames, setAllFrames] = useState([])
  const [allAnnotations, setAllAnnotations] = useState([])
  const [isBoxSelected, setIsBoxSelected] = useState(false)
  const [isPolygonSelected, setIsPolygonSelected] = useState(false)
  const [isPointSelected, setIsPointSelected] = useState(false)
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0)
  const [isPlay, setIsPlay] = useState(false)
  const [intervalId, setIntervalId] = useState()
  const [offsetTop, setOffsetTop] = useState(0)
  const [imageWidth, setImageWidth] = useState()
  const [tracks, setTracks] = useState([])
  const [imageHeight, setImageHeight] = useState()
  const [isLabelsSelected, setIsLabelsSelected] = useState(true)

  // Convert Annotations from LOST Format to absolute Pixel Values
  // In LOST a point in the middle of screen has x and y value 0.5
  const setAnnos = async () =>{
    const imageSize = await getImageSize(props.annotations[0].image.url)
    const h = (size.height - offsetTop) * 0.7
    const w = h / imageSize.scale
    setImageHeight(h)
    setImageWidth(w)
    const allImages = []
    const annos = []
    props.annotations.forEach((image, i) => {
      allImages.push(image.image)
      annos.push(transformFromLost(h, w, image.annotations, i, props.labels))
    })
    setAllFrames(allImages)
    setAllAnnotations(annos)
  }

  useEffect(()=>{
    setTracks(props.tracks)
  }, [props.tracks])

  useEffect(()=>{
    if(props.annotations.length){
      setAnnos()
    }

  }, [props.annotations])



  // Called after every Frameswitch to save annotations
  const saveAnnotations = ({ rects, polygons, points }) => {
    const copiedAnnotations = [...allAnnotations]
    copiedAnnotations[lastFrameIndex.current] = {
      rects,
      polygons,
      points,
      index: lastFrameIndex.current,
    }
    setAllAnnotations(copiedAnnotations)
    lastFrameIndex.current = currentFrameIndex
  }


  const updateTracks = (updatedTracks) => {
    setTracks(updatedTracks)
  }

  // Calculate the offset to the top of the screen.
  // With offsetTop the height of the components can be calulated
  useEffect(() => {
    setOffsetTop(containerRef.current.offsetTop)
  }, [])

  // called every time play button isPressed
  useEffect(() => {
    if (props.fps && allFrames && isPlay) {
      const intervald = setInterval(next, 1000 / props.fps)
      setIntervalId(intervald)
    } else {
      clearInterval(intervalId)
    }
    return () => clearInterval(intervalId)
  }, [isPlay])

  const next = () => {
    if (lastFrameIndex.current < allFrames.length - 1) {
      setCurrentFrameIndex((i) => i + 1)
    } else {
      setIsPlay(false)
    }
  }
  const prev = () => {
    if (currentFrameIndex > 0) {
      setCurrentFrameIndex(currentFrameIndex - 1)
    }
  }



  const exportAnnos = () => {
    const lostObj = allAnnotations.map((anno, i) => ({
      image: allFrames[i],
      annotations: transformToLost(imageHeight, imageWidth, anno, i),
    }))
    console.log('lostObj')
    console.log(lostObj)
  }

 
  // Get the image width, height and scale
  const getImageSize = (url) => {
    const img = new Image()
    img.src = url
    return new Promise(function(resolve, reject) {
      img.onload = function() {
        resolve({
          height: this.height,
          width: this.width,
          scale: this.height / this.width,
        })
      }
    })
  }



  // Select Annotationtools
  const polygonOnClick = () => {
    setIsPolygonSelected(!isPolygonSelected)
    setIsBoxSelected(false)
    setIsPointSelected(false)
  }
  const boxOnClick = () => {
    setIsBoxSelected(!isBoxSelected)
    setIsPolygonSelected(false)
    setIsPointSelected(false)
  }
  const pointOnClick = () => {
    setIsBoxSelected(false)
    setIsPointSelected(!isPointSelected)
    setIsPolygonSelected(false)
  }

  // Unselect all Annotationtools
  const unSelectAll = () => {
    setIsBoxSelected(false)
    setIsPolygonSelected(false)
    setIsPointSelected(false)
  }

  // Change current Frame with Slider
  const handleSliderChange = (index) => {
    setCurrentFrameIndex(index)
  }

  return (
    <div ref={containerRef}>
      <Container fluid={true}>
        <TopTopBar />
        <TopBar
          isPlay={isPlay}
          next={next}
          prev={prev}
          offsetTop={offsetTop}
          setIsPlay={setIsPlay}
          size={size}
        />
        <Row>
          <LeftBar
            boxOnClick={boxOnClick}
            isBoxSelected={isBoxSelected}
            polygonOnClick={polygonOnClick}
            isPolygonSelected={isPolygonSelected}
            pointOnClick={pointOnClick}
            isPointSelected={isPointSelected}
            exportAnnos={exportAnnos}
          />

          <Col style={{ border: '1px solid black' }} xs="9">
            <Center
              allAnnotations ={allAnnotations}
              allFrames={allFrames}
              currentFrameIndex={currentFrameIndex}
              imageHeight={imageHeight}
              imageWidth={imageWidth}
              isBoxSelected={isBoxSelected}
              isPolygonSelected={isPolygonSelected}
              isPointSelected={isPointSelected}
              isLabelsSelected={isLabelsSelected}
              labels={props.labels}
              lastFrameIndex={lastFrameIndex}
              offsetTop={offsetTop}
              saveAnnotations={saveAnnotations}
              setIsLabelsSelected={setIsLabelsSelected}
              size={size}
              tracks={tracks}
              unSelectAll={unSelectAll}
              imageRef={imageRef}
            />
            <BottomBar
              offsetTop={offsetTop}
              allFrames={allFrames}
              currentFrameIndex={currentFrameIndex}
              handleSliderChange={handleSliderChange}
              size={size}
            />
          </Col>
          <Col xs="2">
        <RightBar
          toggleLabelsSelected={() =>
            setIsLabelsSelected(!isLabelsSelected)
          }
          isLabelsSelected={isLabelsSelected}
          updateTracks={updateTracks}
          tracks={tracks}
          labels={props.labels}
        />
      </Col>
        </Row>
      </Container>
    </div>
  )
}

export default App
