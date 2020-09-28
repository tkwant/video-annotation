import React from 'react'
import { Row } from 'reactstrap'
import Slider from 'react-rangeslider'

const BottomBar = ({
  size,
  currentFrameIndex,
  allFrames,
  handleSliderChange,
  offsetTop,
}) => {
  return (
    <Row
      style={{
        // backgroundColor: 'red',
        height: (size.height - offsetTop) * 0.1,
      }}
    >
      <Slider
        value={currentFrameIndex}
        orientation="horizontal"
        min={0}
        max={allFrames.length - 1}
        onChange={handleSliderChange}
      />
    </Row>
  )
}

export default BottomBar
