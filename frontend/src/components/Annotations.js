import React, { useRef, useMemo, useEffect, useState } from 'react'
import { useKey, useSet } from 'react-use'
import * as PolygonHelper from './AnnotationTools/PolygonHelper'
import * as BoxHelper from './AnnotationTools/BoxHelper'
import * as PointHelper from './AnnotationTools/PointHelper'
import Dropdown from './Dropdown'
import Box from './AnnotationTools/Box'
//
import Polygon from './AnnotationTools/Polygon'
import Point from './AnnotationTools/Point'

export default (props) => {
  const shapeId = useRef(0)
  const isNewAnno = useRef(false)
  const {
    isPointSelected,
    isBoxSelected,
    isPolygonSelected,
  } = props.selectedAnnotationTool
  const svg = useRef(null)
  const [svgObj, setSvgObj] = useState()
  const [rects, setRects] = useState([])
  const [polygons, setPolygons] = useState([])
  const [points, setPoints] = useState([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [mouseEnteredPolygonId, setMouseEnteredPolygonId] = useState()
  const [mouseEnteredBBoxId, setMouseEnteredBBoxId] = useState()
  const [mouseEnteredPointPointId, setMouseEnteredPointPointId] = useState()

  const [mouseEnteredPolygonPoint, setMouseEnteredPolygonPoint] = useState()
  const [mouseEnteredBBoxPoint, setMouseEnteredBBoxPoint] = useState()

  const [polygonIdDropdownVisible, setPolygonIdDropdownVisible] = useState()
  const [rectIdDropdownVisible, setRectIdDropdownVisible] = useState()
  const [pointIdDropdownVisible, setPointIdDropdownVisible] = useState()

  const endAnno = () => {
    isNewAnno.current = true
  }

  const exitAnno = () => {
    props.unSelectAll()
    // setMouseEnteredPolygonId()
    // setMouseEnteredPolygonPoint()
  }
  const deleteAnno = () => {
    const filteredPolygons = polygons.filter((polygon) => !polygon.selected)
    setPolygons(filteredPolygons)
    const filteredRects = rects.filter((rect) => !rect.selected)
    setRects(filteredRects)
    const filteredPoints = points.filter(
      (_, i) => i != mouseEnteredPointPointId
    )
    setPoints(filteredPoints)
  }

  useEffect(() => {
    if (props.annotations.index != props.lastFrameIndex) {
      props.saveAnnotations({ rects, polygons, points })
    }
    setRects(props.annotations.rects)
    setPolygons(props.annotations.polygons)
    setPoints(props.annotations.points)
    shapeId.current = props.annotations.length
  }, [props.annotations, props.lastFrameIndex])

  useKey('Delete', deleteAnno, {}, [polygons])

  useKey('Escape', exitAnno)

  useKey('n', endAnno)

  useEffect(() => {
    setIsDrawing(isPointSelected || isBoxSelected || isPolygonSelected)
    if (isPolygonSelected || isBoxSelected) {
      isNewAnno.current = true
    }
  }, [props.selectedAnnotationTool])

  useEffect(() => {
    const pt = svg.current.createSVGPoint()
    setSvgObj(pt)
  }, [])

  const onMouseDown = (e) => {
    svgObj.x = e.clientX
    svgObj.y = e.clientY
    const cursorpt = svgObj.matrixTransform(
      svg.current.getScreenCTM().inverse()
    )
    if (isPolygonSelected) {
      PolygonHelper.onMouseDown({
        shapeId,
        isNewAnno,
        setPolygons,
        polygons,
        cursorpt,
      })
    } else if (isBoxSelected) {
      BoxHelper.onMouseDown({
        shapeId,
        isNewAnno,
        setRects,
        rects,
        cursorpt,
        endAnno,
      })
    } else if (isPointSelected) {
      PointHelper.onMouseDown({
        shapeId,
        isNewAnno,
        setPoints,
        points,
        cursorpt,
        endAnno,
      })
    }
  }

  const onMouseMove = (e) => {
    svgObj.x = e.clientX
    svgObj.y = e.clientY
    const cursorpt = svgObj.matrixTransform(
      svg.current.getScreenCTM().inverse()
    )
    const mousePressed = e.buttons === 1
    const isPolygonDrawingMode =
      polygons.length && !isNewAnno.current && isPolygonSelected
    const isDragPolygon = !isNaN(mouseEnteredPolygonId) && mousePressed
    const isDragPolygonPoint = mouseEnteredPolygonPoint && mousePressed
    if (isPolygonDrawingMode || isDragPolygon || isDragPolygonPoint) {
      const movementX = e.movementX
      const movementY = e.movementY
      PolygonHelper.onMouseMove({
        isPolygonDrawingMode,
        isDragPolygon,
        isDragPolygonPoint,
        polygons,
        setPolygons,
        cursorpt,
        mouseEnteredPolygonPoint,
        mouseEnteredPolygonId,
        movementX,
        movementY,
      })
    }
    const isBBoxDrawingMode =
      rects.length && !isNewAnno.current && isBoxSelected
    const isDragBBox = !isNaN(mouseEnteredBBoxId) && mousePressed
    const isDragBBoxPoint = mouseEnteredBBoxPoint && mousePressed
    if (isBBoxDrawingMode || isDragBBox || isDragBBoxPoint) {
      const movementX = e.movementX
      const movementY = e.movementY
      BoxHelper.onMouseMove({
        cursorpt,
        mouseEnteredBBoxId,
        mouseEnteredBBoxPoint,
        isBBoxDrawingMode,
        isDragBBox,
        isDragBBoxPoint,
        rects,
        setRects,
        movementX,
        movementY,
      })
    }

    const isDragPoint = !isNaN(mouseEnteredPointPointId) && mousePressed
    if (isDragPoint) {
      const movementX = e.movementX
      const movementY = e.movementY
      PointHelper.drag({
        points,
        setPoints,
        movementX,
        movementY,
        mouseEnteredPointPointId,
      })
    }
  }
  const onMouseEnterPoint = ({ shapeIndex, pointIndex, annoMode }) => {
    //Polygon
    if (annoMode === 'polygon') {
      setMouseEnteredPolygonPoint({ polygonIndex: shapeIndex, pointIndex })
    } else if (annoMode === 'bbox') {
      //BOX
      setMouseEnteredBBoxPoint({ boxIndex: shapeIndex, pointIndex })
    } else if (annoMode === 'point') {
      //Point
      setMouseEnteredPolygonId()
      setMouseEnteredBBoxId()
      PolygonHelper.select({ polygons, setPolygons })
      BoxHelper.select({ rects, setRects })

      setMouseEnteredPointPointId(shapeIndex)
    } else {
      throw new Error('unknown annotation mode')
    }
  }

  const onMouseLeavePoint = (e) => {
    const isButtonPressed = e.buttons === 1
    if (!isButtonPressed) {
      setMouseEnteredPolygonPoint()
      setMouseEnteredBBoxPoint()
      setMouseEnteredPointPointId()
    }
  }

  const onMouseEnterPolygon = (polygonInsideIndex) => {
    setMouseEnteredPolygonId(polygonInsideIndex)
    setMouseEnteredBBoxId()
    // unselect all Boxes
    BoxHelper.select({ rects, setRects })
    PolygonHelper.select({ polygons, setPolygons, polygonInsideIndex })
  }

  // console.log('rects')
  // console.log(rects)
  const onMouseEnterBox = (boxIndex) => {
    setMouseEnteredBBoxId(boxIndex)
    setMouseEnteredPolygonId()
    //Unselect all Polygons
    PolygonHelper.select({ polygons, setPolygons })
    BoxHelper.select({ rects, setRects, boxIndex })
  }
  return (
    <div>
      <Dropdown
        polygons={polygons}
        setPolygons={setPolygons}
        rects={rects}
        setRects={setRects}
        points={points}
        setPoints={setPoints}
        polygonIdDropdownVisible={polygonIdDropdownVisible}
        rectIdDropdownVisible={rectIdDropdownVisible}
        pointIdDropdownVisible={pointIdDropdownVisible}
        setPointIdDropdownVisible={setPointIdDropdownVisible}
        setPolygonIdDropdownVisible={setPolygonIdDropdownVisible}
        setRectIdDropdownVisible={setRectIdDropdownVisible}
        tracks={props.tracks}
        labels={props.labels}
        isLabelsSelected={props.isLabelsSelected}
      />
      <svg
        ref={svg}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        style={{
          position: 'absolute',
          cursor: isDrawing ? 'crosshair' : 'auto',
          width: props.imageWidth ? props.imageWidth : 0,
          height: props.imageHeight ? props.imageHeight : 0,
          zIndex: 1000,
        }}
      >
        {polygons.map((polygon, polygonIndex) => {
          return (
            <Polygon
              id={`polygon-${polygonIndex}`}
              key={`polygon-${polygonIndex}`}
              onMouseEnterPolygon={onMouseEnterPolygon}
              onMouseEnterPoint={onMouseEnterPoint}
              onMouseLeavePoint={onMouseLeavePoint}
              mouseEnteredPolygonPoint={mouseEnteredPolygonPoint}
              setPolygonIdDropdownVisible={setPolygonIdDropdownVisible}
              polygon={polygon}
              polygonIndex={polygonIndex}
            />
          )
        })}
        {rects.map((rect, i) => (
          <Box
            setRectIdDropdownVisible={setRectIdDropdownVisible}
            onMouseEnterPoint={onMouseEnterPoint}
            onMouseEnterBox={onMouseEnterBox}
            onMouseLeavePoint={onMouseLeavePoint}
            boxIndex={i}
            mouseEnteredBBoxPoint={mouseEnteredBBoxPoint}
            key={`box-${i}`}
            rect={rect}
          />
        ))}

        {points.map((point, i) => (
          <Point
            setPointIdDropdownVisible={setPointIdDropdownVisible}
            onMouseEnterPoint={onMouseEnterPoint}
            onMouseLeavePoint={onMouseLeavePoint}
            point={point}
            shapeIndex={i}
            isBig={mouseEnteredPointPointId == i}
            key={`${i}`}
          />
        ))}
      </svg>
    </div>
  )
}
