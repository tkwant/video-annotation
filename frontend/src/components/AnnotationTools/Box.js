import React from 'react'
import RawPoint from './RawPoint'
const Box = ({rect, onMouseEnterPoint, boxIndex, mouseEnteredBBoxPoint, onMouseEnterBox, onMouseLeavePoint, setRectIdDropdownVisible}) => {
    const points = [[rect.x, rect.y], [rect.x + rect.width, rect.y], [rect.x, rect.y + rect.height], [rect.x +rect.width, rect.y + rect.height]]
    return(
        <g>
        <text
          onClick={() => {
            setRectIdDropdownVisible(boxIndex)
          }}
          x={rect.x}
          y={rect.y}
          fontFamily="Verdana"
          fontSize="20"
          fill="red"
        >
          {`${rect.trackId?`Track ${rect.trackId}`:''}, ${rect.label}`}
        </text>
        <rect
        x={rect.x}
        y={rect.y}
        onMouseEnter={() => onMouseEnterBox(boxIndex)}
        width={rect.width}
        height={rect.height}
        stroke="blue"
        fill={rect.selected ? 'green' : 'blue'}
        fillOpacity="0.5"
        strokeOpacity="0.8"
      />
        {rect.selected &&
            points.map((point,i)=>
                <RawPoint
                annoMode='bbox'
                onMouseLeavePoint={onMouseLeavePoint}
                key={`point-${i}`}
                onMouseEnterPoint={onMouseEnterPoint}
                isBig={mouseEnteredBBoxPoint?(mouseEnteredBBoxPoint.boxIndex=== boxIndex) && (mouseEnteredBBoxPoint.pointIndex ===i):false}
                // onMouseMovePoint={onMouseMovePoint}
                pointIndex={i}
                shapeIndex={boxIndex}
                point={point}
              />
            )

          }
      </g>
    )
}

export default Box