export const onMouseDown = ({ shapeId, setPoints, points, cursorpt }) => {
  shapeId.current += 1
  const pointsCopy = [...points]
  pointsCopy.push({
    id: shapeId.current,
    x: cursorpt.x,
    y: cursorpt.y,
    label: 'No Label',
    labelIds: [],
    trackId: null,
  })
  setPoints(pointsCopy)
}

export const drag = ({
  points,
  setPoints,
  movementX,
  movementY,
  mouseEnteredPointPointId,
}) => {
  const newPoints = points.map((point, i) => {
    if (i === mouseEnteredPointPointId) {
      point.x += movementX
      point.y += movementY
    }
    return point
  })
  setPoints(newPoints)
}
