import React from 'react'
import RawPoint from './RawPoint'


const Polygon = ({
    polygon,
    polygonIndex,
    onMouseEnterPoint,
    onMouseLeavePoint,
    mouseEnteredPolygonPoint,
    // setIsDropDownOpen,
    onMouseEnterPolygon,
    setPolygonIdDropdownVisible,
    // setDropDownTop,
    // setDropDownLeft,
    id
  }) => {
    return (
      <g>
        <text
          onClick={() => {
            // setIsDropDownOpen(true)
            // setDropDownLeft(polygon.highestPoint[0])
            // setDropDownTop(polygon.highestPoint[1])
            setPolygonIdDropdownVisible(polygonIndex)
          }}
          x={polygon.highestPoint[0]}
          y={polygon.highestPoint[1]}
          fontFamily="Verdana"
          fontSize="20"
          fill="red"
        >
          {`${polygon.trackId?`Track ${polygon.trackId}`:''}, ${polygon.label}`}
        </text>
        <polygon
          id={id}
          // onMouseMove={(e) => onMouseMovePolygon({ e, polygonIndex })}
          onMouseEnter={() => onMouseEnterPolygon(polygonIndex)}
          points={polygon.points}
          stroke="blue"
          fill={polygon.selected ? 'green' : 'blue'}
          fillOpacity="0.4"
        />
        {polygon.selected &&
          polygon.points.map((point, pointIndex) => (
            <RawPoint
              annoMode='polygon'              
              key={`point-${pointIndex}`}
              onMouseEnterPoint={onMouseEnterPoint}
              isBig={mouseEnteredPolygonPoint?(mouseEnteredPolygonPoint.polygonIndex=== polygonIndex) && (mouseEnteredPolygonPoint.pointIndex ===pointIndex):false}
              onMouseLeavePoint={onMouseLeavePoint}
              // onMouseMovePoint={onMouseMovePoint}
              shapeIndex={polygonIndex}
              pointIndex={pointIndex}
              point={point}
            />
          ))}
      </g>
    )
  }


  export default Polygon