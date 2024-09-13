import React, { useState, useEffect } from 'react'

export default function InitialLoader() {
	const [isVisible, setIsVisible] = useState(true)

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsVisible(false)
		}, 4000)

		return () => clearTimeout(timer)
	}, [])

	if (!isVisible) return null

	return (
		<div className='fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900 text-white'>
			<div className='text-center'>
				<div className='bg-gray-800 rounded-lg p-6 mb-6 font-mono text-sm leading-relaxed shadow-lg w-[400px] max-w-full mx-auto'>
					<div className='mb-2 text-blue-400'>
						function<span className='text-yellow-300'> initPortfolio</span>(){' '}
						{`{`}
					</div>
					<div className='mb-2 pl-4'>
						<span className='text-purple-400'>const</span>{' '}
						<span className='text-blue-300'>experience</span> ={' '}
						<span className='text-orange-300'>"Software Engineer"</span>;
					</div>
					<div className='mb-2 pl-4'>
						<span className='text-purple-400'>let</span>{' '}
						<span className='text-blue-300'>skills</span> = [
						<span className='text-orange-300'>"React"</span>,{' '}
						<span className='text-orange-300'>"Next.js"</span>,{' '}
						<span className='text-orange-300'>"Node.js"</span>];
					</div>
					<div className='mb-2 pl-4'>
						<span className='text-purple-400'>return</span> {`{ `}
						<span className='text-blue-300'>name</span>:{' '}
						<span className='text-orange-300'>"Asif Alam"</span>, experience,
						skills {`}`};
					</div>
					<div>{`}`}</div>
				</div>
				<div className='w-2 h-5 bg-white mx-auto mb-4 animate-blink'></div>
				<h2 className='text-2xl font-bold text-blue-400 mb-2'>
					Initializing Portfolio...
				</h2>
				<p className='text-sm text-blue-300'>
					For the best experience, please view on a laptop or desktop device.
				</p>
			</div>
		</div>
	)
}
