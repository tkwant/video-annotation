import React from 'react'
import { Button, Col } from 'reactstrap'

const LeftBar = ({
  boxOnClick,
  isBoxSelected,
  polygonOnClick,
  isPolygonSelected,
  pointOnClick,
  isPointSelected,
  exportAnnos,
}) => {
  return (
    <>
      <Col xs="1" style={{ textAlign: 'center' }}>
        <Button
          onClick={boxOnClick}
          color={isBoxSelected ? 'warning' : 'primary'}
          style={{ margin: 10 }}
        >
          Box
        </Button>
        <Button
          onClick={polygonOnClick}
          color={isPolygonSelected ? 'warning' : 'primary'}
          style={{ margin: 10 }}
        >
          Polygon
        </Button>
        <Button
          onClick={pointOnClick}
          color={isPointSelected ? 'warning' : 'primary'}
          style={{ margin: 10 }}
        >
          Point
        </Button>
        <Button onClick={exportAnnos}>Save Annotations</Button>
      </Col>
    </>
  )
}

export default LeftBar
