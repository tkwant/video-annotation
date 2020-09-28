import { Row, Col, Button } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import {
  faPlay,
  faPause,
  faStepBackward,
  faStepForward,
} from '@fortawesome/free-solid-svg-icons'
const TopBar = ({ size, offsetTop, prev, isPlay, setIsPlay, next }) => {
  return (
    <Row
      style={{
        marginTop: 20,
        height: (size.height - offsetTop) * 0.08,
        textAlign: 'center',
      }}
    >
      <Col xs="4" />
      <Col xs="1">
        <Button onClick={prev}>
          <FontAwesomeIcon icon={faStepBackward} />
        </Button>
      </Col>
      <Col xs="1">
        <Button
          onClick={() => {
            setIsPlay(!isPlay)
          }}
        >
          {isPlay ? (
            <FontAwesomeIcon icon={faPause} />
          ) : (
            <FontAwesomeIcon icon={faPlay} />
          )}
        </Button>
      </Col>
      <Col xs="1">
        <Button onClick={next}>
          <FontAwesomeIcon icon={faStepForward} />
        </Button>
      </Col>
      <Col xs="4" />
    </Row>
  )
}

export default TopBar
