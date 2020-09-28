export const onMouseMove = ({
  isBBoxDrawingMode,
  isDragBBox,
  isDragBBoxPoint,
  mouseEnteredBBoxId,
  mouseEnteredBBoxPoint,
  movementY,
  movementX,
  setRects,
  rects,
  cursorpt
}) => {
  if(isBBoxDrawingMode){
    followMouseInDrawingMode({
      setRects,
      rects,
      cursorpt
    })
  }else if(isDragBBoxPoint){
    dragPoint({
      mouseEnteredBBoxPoint,
      movementX,
      movementY,
      rects,
      setRects
    })
  }else if(isDragBBox){
    drag({
      mouseEnteredBBoxId,
      movementX,
      movementY,
      rects,
      setRects
    })
  }
}

// When Rect is in drawing mode then draw the rect live
const followMouseInDrawingMode = ({ setRects, rects, cursorpt }) => {
    let rect = {...rects[rects.length - 1]}
    const deltaX = cursorpt.x - rect.clickedX
    const deltaY = cursorpt.y - rect.clickedY
    const newRect = calculateNewRect(rect,  deltaX, deltaY)

    const rectsCopy = [...rects]
    rectsCopy[rects.length - 1] = newRect
    setRects(rectsCopy)
}





export const onMouseDown = ({ shapeId, isNewAnno, setRects, rects, cursorpt, endAnno }) => {
  
  if(isNewAnno.current){
        isNewAnno.current = false
        shapeId.current += 1  
        setRects([...rects,{
            id: shapeId.current,
            selected: false,
            label: "No Label",
            labelIds: [],
            trackId: null,
            clickedX: cursorpt.x,
            clickedY: cursorpt.y,
            x: cursorpt.x,
            y: cursorpt.y,
            width: 0,
            height: 0
        }])
    }
    else if(rects.length){
        endAnno()
    }

}

// Drag the rect
const drag = ({mouseEnteredBBoxId, rects, setRects, movementX, movementY})=> {
  const newRects = rects.map((rect,i)=>{
    if(i === mouseEnteredBBoxId){
      rect.x = rect.x + movementX
      rect.y = rect.y + movementY
    }
    return rect
})
setRects(newRects)
}
// Select the rect
export const select=({rects, setRects, boxIndex})=>{
  const newRects = rects.map((rect, i)=>{
      if(i == boxIndex){
        rect.selected = true
      }else{
        rect.selected = false
      }
    return rect
  })

  setRects(newRects)
}


const calculateNewRect = (rect,  deltaX, deltaY) =>{
  const cursorX = rect.x + rect.width + deltaX
  const cursorY = rect.y + rect.height + deltaY
  if (deltaX < 0 && deltaY < 0) {
    rect.x = cursorX
    rect.y = cursorY
    rect.width = deltaX * -1
    rect.height = deltaY * -1
  } else if (deltaX < 0) {
    rect.x = cursorX
    rect.width = deltaX * -1
    rect.height = deltaY
  } else if (deltaY < 0) {
    rect.y = cursorY
    rect.width = deltaX
    rect.height = deltaY * -1
  } else {
    rect.x = rect.clickedX
    rect.y = rect.clickedY
    rect.width = deltaX
    rect.height = deltaY
  }
  return rect
}
// Drag one Point of Rect
const dragPoint= ({mouseEnteredBBoxPoint, rects, setRects, movementX, movementY}) =>{
  const newRects = rects.map((rect,i)=>{
      if(i === mouseEnteredBBoxPoint.boxIndex){
        switch(mouseEnteredBBoxPoint.pointIndex){
          case 0:
            rect.x = rect.x + movementX
            rect.y = rect.y + movementY
            rect.width = rect.width - movementX
            rect.height = rect.height - movementY
            break
          case 1:
            rect.y = rect.y + movementY
            rect.width = rect.width + movementX
            rect.height = rect.height - movementY
            break
          case 2:
            rect.x = rect.x + movementX
            rect.width = rect.width - movementX
            rect.height = rect.height + movementY
            break
          case 3:
            rect.width = rect.width + movementX
            rect.height = rect.height + movementY
            break
        }
      }
      return rect
  })
  setRects(newRects)

}