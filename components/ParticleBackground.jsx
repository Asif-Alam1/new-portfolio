import React, { useEffect, useRef } from 'react'
import { useSpring, animated } from 'react-spring'

const ParticleBackground = () => {
	const canvasRef = useRef(null)
	const particlesRef = useRef([])
	const animationRef = useRef(null)

	const config = {
		particleCount: 50,
		particleSize: 2,
		particleColor: '#61dafb',
		lineColor: 'rgba(97, 218, 251, 0.1)',
		lineDistance: 150,
		speed: 0.5
	}

	const initParticles = canvas => {
		const ctx = canvas.getContext('2d')
		const particles = []

		for (let i = 0; i < config.particleCount; i++) {
			particles.push({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				vx: (Math.random() - 0.5) * config.speed,
				vy: (Math.random() - 0.5) * config.speed,
				size: Math.random() * config.particleSize + 1,
				color: config.particleColor
			})
		}

		particlesRef.current = particles
	}

	const drawParticles = canvas => {
		const ctx = canvas.getContext('2d')
		ctx.clearRect(0, 0, canvas.width, canvas.height)

		// Draw particles
		particlesRef.current.forEach(particle => {
			ctx.beginPath()
			ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
			ctx.fillStyle = particle.color
			ctx.fill()

			// Update position
			particle.x += particle.vx
			particle.y += particle.vy

			// Bounce off walls
			if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
			if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1
		})

		// Draw connections
		for (let i = 0; i < particlesRef.current.length; i++) {
			for (let j = i + 1; j < particlesRef.current.length; j++) {
				const p1 = particlesRef.current[i]
				const p2 = particlesRef.current[j]
				const dx = p1.x - p2.x
				const dy = p1.y - p2.y
				const distance = Math.sqrt(dx * dx + dy * dy)

				if (distance < config.lineDistance) {
					ctx.beginPath()
					ctx.moveTo(p1.x, p1.y)
					ctx.lineTo(p2.x, p2.y)
					ctx.strokeStyle = config.lineColor
					ctx.lineWidth = 0.5
					ctx.stroke()
				}
			}
		}

		animationRef.current = requestAnimationFrame(() => drawParticles(canvas))
	}

	const handleResize = () => {
		if (canvasRef.current) {
			canvasRef.current.width = window.innerWidth
			canvasRef.current.height = window.innerHeight
			initParticles(canvasRef.current)
		}
	}

	useEffect(() => {
		if (canvasRef.current) {
			canvasRef.current.width = window.innerWidth
			canvasRef.current.height = window.innerHeight

			initParticles(canvasRef.current)
			drawParticles(canvasRef.current)

			window.addEventListener('resize', handleResize)
		}

		return () => {
			window.removeEventListener('resize', handleResize)
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current)
			}
		}
	}, [])

	const fadeIn = useSpring({
		from: { opacity: 0 },
		to: { opacity: 0.6 },
		config: { duration: 1000 }
	})

	return (
		<animated.canvas
			ref={canvasRef}
			style={{
				...fadeIn,
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				zIndex: 1,
				pointerEvents: 'none' // This is the critical change
			}}
		/>
	)
}

export default ParticleBackground