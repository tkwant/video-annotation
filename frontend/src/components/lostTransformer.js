export const transformToLost = (imageHeight, imageWidth, anno, i) => {
  const lines = []
  const bBoxes = anno.rects.map((rect) => {
    return {
      id: rect.id,
      labelIds: rect.labelIds,
      trackId: rect.trackId,
      data: {
        h: rect.height / imageHeight,
        w: rect.width / imageWidth,
        x: rect.x / imageWidth,
        y: rect.y / imageHeight,
      },
    }
  })
  const polygons = anno.polygons.map((polygon) => {
    return {
      id: polygon.id,
      labelIds: polygon.labelIds,
      trackId: polygon.trackId,
      data: polygon.points.map((point) => ({
        x: point[0] / imageWidth,
        y: point[1] / imageHeight,
      })),
    }
  })

  const points = anno.points.map((point) => {
    return {
      id: point.id,
      trackId: point.trackId,
      labelIds: point.labelIds,
      data: {
        x: point.x / imageWidth,
        y: point.y / imageHeight,
      },
    }
  })
  return {
    lines,
    bBoxes,
    polygons,
    points,
  }
}

export const transformFromLost = (
  imageHeight,
  imageWidth,
  lostAnno,
  i,
  labels
) => {
  let newRects = []
  let newPolygons = []
  let newPoints = []
  if (lostAnno) {
    newRects = lostAnno.bBoxes.map((bBox) => {
      const label = labels.filter((label) => label.id === bBox.labelIds[0])[0]
        .label
      return {
        clickedX: imageWidth * bBox.data.x,
        clickedY: imageHeight * bBox.data.y,
        height: imageHeight * bBox.data.h,
        id: bBox.id,
        label,
        labelIds: bBox.labelIds,
        selected: false,
        trackId: bBox.trackId,
        width: imageWidth * bBox.data.w,
        x: imageWidth * bBox.data.x,
        y: imageHeight * bBox.data.y,
      }
    })
    newPolygons = lostAnno.polygons.map((polygon) => {
      const label = labels.filter(
        (label) => label.id === polygon.labelIds[0]
      )[0].label
      let highestPoint = [
        polygon.data[0].x * imageWidth,
        polygon.data[0].y * imageHeight,
      ]
      const points = polygon.data.map((point) => {
        point.x = point.x * imageWidth
        point.y = point.y * imageHeight
        if (point.y < highestPoint[1]) {
          highestPoint = [point.x, point.y]
        }
        return [point.x, point.y]
      })
      return {
        highestPoint,
        points: points,
        id: polygon.id,
        label,
        labelIds: polygon.labelIds,
        selected: false,
        trackId: polygon.trackId,
      }
    })
    newPoints = lostAnno.points.map((point) => {
      const label = labels.filter((label) => label.id === point.labelIds[0])[0]
        .label
      return {
        x: point.data.x * imageWidth,
        y: point.data.y * imageHeight,
        id: point.id,
        label,
        labelIds: point.labelIds,
        trackId: point.trackId,
      }
    })
  }
  return {
    polygons: newPolygons,
    rects: newRects,
    points: newPoints,
    index: i,
  }
}
