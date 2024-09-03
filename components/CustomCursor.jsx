import React, { useEffect, useRef } from 'react'

const CustomCursor = () => {
	const cursorOuterRef = useRef(null)
	const cursorInnerRef = useRef(null)
	const requestRef = useRef(null)
	const previousTimeRef = useRef(null)
	const [coords, setCoords] = React.useState({ x: 0, y: 0 })
	const [isVisible, setIsVisible] = React.useState(false)
	const [isActive, setIsActive] = React.useState(false)
	const endX = useRef(0)
	const endY = useRef(0)

	const onMouseMove = React.useCallback(({ clientX, clientY }) => {
		setCoords({ x: clientX, y: clientY })
		cursorInnerRef.current.style.top = `${clientY}px`
		cursorInnerRef.current.style.left = `${clientX}px`
		endX.current = clientX
		endY.current = clientY
	}, [])

	const animateOuterCursor = React.useCallback(
		time => {
			if (previousTimeRef.current !== undefined) {
				coords.x += (endX.current - coords.x) / 8
				coords.y += (endY.current - coords.y) / 8
				cursorOuterRef.current.style.top = `${coords.y}px`
				cursorOuterRef.current.style.left = `${coords.x}px`
			}
			previousTimeRef.current = time
			requestRef.current = requestAnimationFrame(animateOuterCursor)
		},
		[requestRef] // eslint-disable-line
	)

	useEffect(() => {
		const mouseEnterEvent = () => setIsVisible(true)
		const mouseLeaveEvent = () => setIsVisible(false)
		document.addEventListener('mouseenter', mouseEnterEvent)
		document.addEventListener('mouseleave', mouseLeaveEvent)
		document.addEventListener('mousemove', onMouseMove)
		requestRef.current = requestAnimationFrame(animateOuterCursor)

		return () => {
			document.removeEventListener('mouseenter', mouseEnterEvent)
			document.removeEventListener('mouseleave', mouseLeaveEvent)
			document.removeEventListener('mousemove', onMouseMove)
			cancelAnimationFrame(requestRef.current)
		}
	}, [animateOuterCursor, onMouseMove])

	useEffect(() => {
		const mouseDownEvent = () => setIsActive(true)
		const mouseUpEvent = () => setIsActive(false)
		const mouseOverEvent = e => {
			const element = e.target
			const isPointer = window.getComputedStyle(element).cursor === 'pointer'
			setIsActive(isPointer)
		}

		document.addEventListener('mousedown', mouseDownEvent)
		document.addEventListener('mouseup', mouseUpEvent)
		document.addEventListener('mouseover', mouseOverEvent)

		return () => {
			document.removeEventListener('mousedown', mouseDownEvent)
			document.removeEventListener('mouseup', mouseUpEvent)
			document.removeEventListener('mouseover', mouseOverEvent)
		}
	}, [])

	return (
		<>
			<div
				ref={cursorOuterRef}
				className={`cursor-outer ${isActive ? 'active' : ''} ${
					isVisible ? 'visible' : ''
				}`}
			/>
			<div
				ref={cursorInnerRef}
				className={`cursor-inner ${isActive ? 'active' : ''} ${
					isVisible ? 'visible' : ''
				}`}
			/>
		</>
	)
}

export default CustomCursor
