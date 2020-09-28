const findHighestPoint = (points) => {
  let highestPoint = points[0]
  points.forEach((point) => {
    if (point[1] < highestPoint[1]) {
      highestPoint = point
    }
  })
  return highestPoint
}

export const onMouseMove = ({
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
}) => {
  // If Polygon is in drawing mode then show the polygon live
  if (isPolygonDrawingMode) {
    followMouseInDrawingMode({
      polygons,
      setPolygons,
      cursorpt,
    })
  } else if (isDragPolygonPoint) {
    // Drag one Point of Polygon
    dragPoint({
      mouseEnteredPolygonPoint,
      polygons,
      setPolygons,
      movementX,
      movementY,
    })
  } else if (isDragPolygon) {
    // Drag the Polygon
    drag({
      mouseEnteredPolygonId,
      polygons,
      setPolygons,
      movementX,
      movementY,
    })
  }
  //
}

const followMouseInDrawingMode = ({ polygons, setPolygons, cursorpt }) => {
  const polygonsCopy = [...polygons]
  const polygon = polygonsCopy[polygons.length - 1]
  const pointsCopy = [...polygon.points]
  polygon.points = pointsCopy
  polygon.points[pointsCopy.length - 1][1] = cursorpt.y
  polygon.points[pointsCopy.length - 1][0] = cursorpt.x
  polygonsCopy[polygonsCopy.length - 1] = polygon
  setPolygons(polygonsCopy)
}

const drag = ({
  mouseEnteredPolygonId,
  polygons,
  setPolygons,
  movementX,
  movementY,
}) => {
  const newPolygons = polygons.map((polygon, i) => {
    let points = polygon.points
    let highestPoint = polygon.highestPoint
    if (i === mouseEnteredPolygonId) {
      points = polygon.points.map((point) => [
        point[0] + movementX,
        point[1] + movementY,
      ])
      highestPoint = findHighestPoint(polygon.points)
    }

    return { ...polygon, points, highestPoint }
  })
  setPolygons(newPolygons)
}

const dragPoint = ({
  mouseEnteredPolygonPoint,
  polygons,
  setPolygons,
  movementX,
  movementY,
}) => {
  const newPolygons = polygons.map((polygon, i) => {
    let points = polygon.points
    let highestPoint = polygon.highestPoint
    if (i === mouseEnteredPolygonPoint.polygonIndex) {
      points = polygon.points.map((point, j) => {
        if (j === mouseEnteredPolygonPoint.pointIndex) {
          return [point[0] + movementX, point[1] + movementY]
        } else {
          return point
        }
      })
      highestPoint = findHighestPoint(polygon.points)
    }
    return { ...polygon, points, highestPoint }
  })
  setPolygons(newPolygons)
}
export const select = ({ polygons, setPolygons, polygonInsideIndex }) => {
  const newPolygons = polygons.map((polygon, i) => {
    if (i == polygonInsideIndex) {
      polygon.selected = true
    } else {
      polygon.selected = false
    }
    return polygon
  })

  setPolygons(newPolygons)
}

export const onMouseDown = ({
  shapeId,
  isNewAnno,
  setPolygons,
  polygons,
  cursorpt,
}) => {
  // When it is not in drawing Mode then create a new Polygon
  if (isNewAnno.current) {
    isNewAnno.current = false
    shapeId.current += 1
    setPolygons([
      ...polygons,
      {
        id: shapeId.current,
        points: [
          [cursorpt.x, cursorpt.y],
          [cursorpt.x, cursorpt.y],
        ],
        selected: false,
        label: 'no label',
        labelIds: [],
        trackId: null,
        highestPoint: [cursorpt.x, cursorpt.y],
      },
    ])
  } else if (polygons.length) {
    const polygonsCopy = [...polygons]
    polygonsCopy[polygonsCopy.length - 1].points = [
      ...polygonsCopy[polygonsCopy.length - 1].points,
      [cursorpt.x, cursorpt.y],
    ]
    polygonsCopy[polygonsCopy.length - 1].highestPoint = findHighestPoint(
      polygonsCopy[polygonsCopy.length - 1].points
    )
    setPolygons(polygonsCopy)
  }
}
