import React, { useState } from 'react'
import RawPoint from './RawPoint'

const Point = ({
  point,
  shapeIndex,
  isBig,
  onMouseEnterPoint,
  onMouseLeavePoint,
  setPointIdDropdownVisible
}) => {
  // const [mouseEntered, setMouseEntered] = useState(false)

    return (
      <g>
        <text
          onClick={() => {
            setPointIdDropdownVisible(shapeIndex)
          }}
          x={point.x}
          y={point.y}
          fontFamily="Verdana"
          fontSize="20"
          fill="red"
        >
          {`${point.trackId?`Track ${point.trackId}`:''}, ${point.label}`}
        </text>
        <RawPoint
          annoMode={'point'}
          point={[point.x, point.y]}
          shapeIndex={shapeIndex}
          isBig={isBig}
          onMouseEnterPoint={onMouseEnterPoint}
          onMouseLeavePoint={onMouseLeavePoint}
        />
      </g>
    )
  
}

export default Point
