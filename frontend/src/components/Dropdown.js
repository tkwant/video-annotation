import React, { useState, useEffect } from 'react'
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'

export default ({
  polygons,
  setPolygons,
  rects,
  setRects,
  points, 
  setPoints,
  polygonIdDropdownVisible,
  rectIdDropdownVisible,
  pointIdDropdownVisible,
  setPointIdDropdownVisible,
  setRectIdDropdownVisible,
  labels,
  isLabelsSelected,
  tracks,
  setPolygonIdDropdownVisible,
}) => {
  const [dropdownX, setDropdownX] = useState(0)
  const [dropdownY, setDropdownY] = useState(0)

  // When select dropdown item
  const onSelect = (e) => {
    const label = e.currentTarget.getAttribute('label')
    const labelId = Number(e.currentTarget.getAttribute('label_id'))
    const trackId = (e.currentTarget.getAttribute('track_id'))
    if(!isNaN(polygonIdDropdownVisible)){
      const newPolygons = polygons.map((polygon, i) => {
        let newLabel = polygon.label
        let newTrackId = polygon.trackId
        if (i === polygonIdDropdownVisible) {
          newLabel = label
          newTrackId = trackId
        }
        return { ...polygon, trackId: newTrackId, label: newLabel,  labelIds: trackId?[labelId]:[]}
      })
      setPolygons(newPolygons)
    }else if(!isNaN(rectIdDropdownVisible)){
      const newRects = rects.map((rect, i) => {
        let newLabel = rect.label
        let newTrackId = rect.trackId
        if (i === rectIdDropdownVisible) {
          newLabel = label
          newTrackId = trackId
        }
        return { ...rect, trackId: newTrackId, label:newLabel, trackId, labelIds: trackId?[labelId]:[]  }
      })
      setRects(newRects)
    }else if(!isNaN(pointIdDropdownVisible)){
      const newPoints = points.map((point, i) => {
        let newLabel = point.label
        let newTrackId = point.trackId
        if (i === pointIdDropdownVisible) {
          newLabel = label
          newTrackId = trackId
        }
        return { ...point, trackId: newTrackId, label:newLabel, trackId,  labelIds: trackId?[labelId]:[] }
      })
      setPoints(newPoints)
    }

  }

  useEffect(() => {
    if (!isNaN(polygonIdDropdownVisible)) {
      const highestPoint = polygons[polygonIdDropdownVisible].highestPoint
      setDropdownX(highestPoint[0])
      setDropdownY(highestPoint[1])
    } 
  }, [polygonIdDropdownVisible])

  useEffect(()=>{
    if(!isNaN(rectIdDropdownVisible)){
      const newDropdownX = rects[rectIdDropdownVisible].x
      const newDropdownY = rects[rectIdDropdownVisible].y
      setDropdownX(newDropdownX)
      setDropdownY(newDropdownY)
    }
  }, [rectIdDropdownVisible])

  useEffect(()=>{
    if(!isNaN(pointIdDropdownVisible)){
      const newDropdownX = points[pointIdDropdownVisible].x
      const newDropdownY = points[pointIdDropdownVisible].y
      setDropdownX(newDropdownX)
      setDropdownY(newDropdownY)
    }
  }, [pointIdDropdownVisible])

  const renderItems = () => {
    if (isLabelsSelected) {
      return labels.map((label) => (
        <DropdownItem label={label.label} key={label.id} label_id={label.id} onClick={onSelect}>
          {label.label}
        </DropdownItem>
      ))
    } else {
      return tracks.map((track) => (
        <DropdownItem
          key={track.labelId}
          label={track.label}
          label_id={track.labelId}
          track_id={track.trackId}
          onClick={onSelect}
        >{`Track ${track.trackId}, ${track.label}`}</DropdownItem>
      ))
    }
  }

  const closeDropdown = () => {
    setPolygonIdDropdownVisible(undefined)
    setRectIdDropdownVisible(undefined)
    setPointIdDropdownVisible(undefined)
  }

  return (
    <div style={{ position: 'absolute', left: dropdownX, top: dropdownY, zIndex: 2000 }}>
      <Dropdown
        style={{ opacity: 0.8 }}
        isOpen={!isNaN(polygonIdDropdownVisible) || !isNaN(rectIdDropdownVisible)|| !isNaN(pointIdDropdownVisible)}
        toggle={closeDropdown}
      >
        <DropdownToggle style={{ visibility: 'hidden' }}></DropdownToggle>

        <DropdownMenu
          modifiers={{
            setMaxHeight: {
              enabled: true,
              order: 890,
              fn: (data) => {
                return {
                  ...data,
                  styles: {
                    ...data.styles,
                    overflow: 'auto',
                    maxHeight: '200px',
                  },
                }
              },
            },
          }}
        >
          {renderItems()}
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}
