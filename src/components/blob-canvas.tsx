import { FC, HTMLAttributes, useEffect, useRef, useState } from 'react'
import * as blobs2Animate from 'blobs/v2/animate'

const SIZE=400

const renderBlob = (ctx: CanvasRenderingContext2D) => {
  let goAgain = true

  const animation = blobs2Animate.canvasPath()
  const renderAnimation = () => {
    ctx.fillStyle = 'white'
    ctx.globalAlpha = 0.3
    ctx.clearRect(0, 0, SIZE, SIZE)
    ctx.fill(animation.renderFrame())
    if (goAgain) requestAnimationFrame(renderAnimation)
  }
  requestAnimationFrame(renderAnimation)

  const generateBlob = (duration = 3000): blobs2Animate.CanvasKeyframe => ({
    duration,
    timingFunction: "ease",
    callback: loopAnimation,
    blobOptions: {
      randomness: 5,
      extraPoints: 1,
      seed: Math.random(),
      size: SIZE
    }
  })

  const loopAnimation = () => {
      animation.transition(generateBlob())
  }

  animation.transition(generateBlob(0))

  return () => { goAgain = false }
}

export const BlobCanvas: FC<HTMLAttributes<HTMLCanvasElement>> = attrs => {
  const [render, setRender] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    setRender(true)
  })

  useEffect(() => {
    if (!render) return

    if (!canvasRef.current) return

    const canvas = canvasRef.current.getContext("2d")
    if (!canvas) return

    return renderBlob(canvas)
  }, [render])

  if (!render) return null

  return <canvas width={SIZE} height={SIZE} {...attrs} ref={canvasRef} />
}
