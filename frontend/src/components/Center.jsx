import React from 'react'
import { Row } from 'reactstrap'
import Annotations from './Annotations'

// Preload all Images. When the Images are not preloaded playing the video is not smooth
var Preload = require('react-preload').Preload

const Center = ({
  size,
  offsetTop,
  tracks,
  setIsLabelsSelected,
  labels,
  allAnnotations,
  currentFrameIndex,
  lastFrameIndex,
  saveAnnotations,
  isBoxSelected,
  isPointSelected,
  isPolygonSelected,
  unSelectAll,
  isLabelsSelected,
  allFrames,
  imageHeight,
  imageWidth,
  imageRef,
}) => {
  return (
    <Row
      style={{
        userSelect: 'none',
        position: 'relative',
        height: (size.height - offsetTop) * 0.8,
      }}
    >
      <Annotations
        tracks={tracks}
        setIsLabelsSelected={setIsLabelsSelected}
        labels={labels}
        annotations={
          allAnnotations.length
            ? allAnnotations[currentFrameIndex]
            : { rects: [], polygons: [], points: [], index: 0 }
        }
        lastFrameIndex={lastFrameIndex.current}
        saveAnnotations={saveAnnotations}
        selectedAnnotationTool={{
          isBoxSelected,
          isPolygonSelected,
          isPointSelected,
        }}
        unSelectAll={unSelectAll}
        imageHeight={imageHeight ? imageHeight : 0}
        imageWidth={imageWidth ? imageWidth : 0}
        isLabelsSelected={isLabelsSelected}
      />

      <Preload
        loadingIndicator={<div>loading</div>}
        images={allFrames.map((image) => image.url)}
        autoResolveDelay={3000}
        resolveOnError={true}
        mountChildren={true}
      >
        <img
          ref={imageRef}
          style={{
            height: imageHeight ? imageHeight : 0,
            width: imageWidth ? imageWidth : 0,
          }}
          src={allFrames.length ? allFrames[currentFrameIndex].url : null}
        />
      </Preload>
    </Row>
  )
}

export default Center
