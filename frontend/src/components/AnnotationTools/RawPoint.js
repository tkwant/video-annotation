import React from 'react'

const RawPoint = ({
  onMouseEnterPoint,
  onMouseLeavePoint,
  point,
  isBig,
  shapeIndex,
  pointIndex,
  annoMode,
}) => {
  const onMouseEnter = () => {
    // setIsBig(true)
    onMouseEnterPoint({ shapeIndex, pointIndex, annoMode })
  }
  return (
    <circle
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeavePoint}
      cx={point[0]}
      cy={point[1]}
      r={isBig ? 12 : 5}
      fill="red"
    ></circle>
  )
}

export default RawPoint
