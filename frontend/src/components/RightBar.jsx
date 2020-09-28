import React, { useState, useRef } from 'react'
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Row,
  Col,
  Button,
  Container,
} from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

const Tracks = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const trackId = useRef(2)
  const onSelect = (e) => {
    const label = e.currentTarget.textContent
    const labelId = parseInt(e.currentTarget.getAttribute('id'))
    const newTracks = [
      ...props.tracks,
      {
        trackId: trackId.current,
        labelId,
        label,
      },
    ]
    props.updateTracks(newTracks)
    trackId.current += 1
  }

  const deleteTrack = (trackId) => {
    const newTracks = props.tracks.filter((track) => track.trackId != trackId)
    props.updateTracks(newTracks)
  }

  const toggleLabelSelected = () => {
    props.toggleLabelsSelected()
  }

  const toggle = () => setDropdownOpen((prevState) => !prevState)
  return (
    <Container>
      <Row>
        <Col xs="6">
          <Button
            style={{ textAlign: 'center' }}
            onClick={toggleLabelSelected}
            color={!props.isLabelsSelected ? 'warning' : 'secondary'}
          >
            Tracks
          </Button>
        </Col>
        <Col xs="6">
          <Button
            style={{ textAlign: 'center' }}
            onClick={toggleLabelSelected}
            color={props.isLabelsSelected ? 'warning' : 'secondary'}
          >
            Labels
          </Button>
        </Col>
      </Row>
      <Row >
        <Col style={{ textAlign: 'center', marginTop: 10 }}>
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle caret>Add new Track</DropdownToggle>
          <DropdownMenu>
            {props.labels
              ? props.labels.map((label) => (
                  <DropdownItem id={label.id} onClick={onSelect}>
                    {label.label}
                  </DropdownItem>
                ))
              : null}
          </DropdownMenu>
        </Dropdown>
        </Col>

      </Row>
      <Row style={{ marginTop: 30, borderBottom: '1px solid black' }}>
        <Col xs="4">TrackID</Col>
        <Col xs="8" style={{ borderLeft: '1px solid black' }}>
          Label
        </Col>
      </Row>{' '}
      {props.tracks.map((label) => (
        <Row>
          <Col xs="4">{label.trackId}</Col>
          <Col style={{ borderLeft: '1px solid black' }} xs="8">
            <>
              {label.label}
              <FontAwesomeIcon
                onClick={() => deleteTrack(label.trackId)}
                style={{ marginLeft: 10, color: 'red' }}
                icon={faTimes}
              />
            </>
          </Col>
        </Row>
      ))}
    </Container>
  )
}

export default Tracks
