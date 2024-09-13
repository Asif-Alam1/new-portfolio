import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import {
	Minus,
	Maximize2,
	X,
	Palette,
	Github,
	Linkedin,
	Mail,
	FileText,
	Coffee
} from 'lucide-react'
import styles from '../styles/Titlebar.module.css'
import Link from 'next/link'

const themes = [
	{ name: 'GitHub Dark', value: 'github-dark' },
	{ name: 'Dracula', value: 'dracula' },
	{ name: 'Ayu Dark', value: 'ayu-dark' },
	{ name: 'Ayu Mirage', value: 'ayu-mirage' },
	{ name: 'Nord', value: 'nord' },
	{ name: 'Night Owl', value: 'night-owl' }
]

const menuItems = [
	{
		name: 'File',
		subItems: [
			{
				name: 'New Project',
				icon: <FileText size={14} />,
				action: () => console.log('New Project')
			},
			{
				name: 'Save All',
				icon: <FileText size={14} />,
				action: () => console.log('Save All')
			},
			{
				name: 'Auto Save',
				icon: <FileText size={14} />,
				action: () => console.log('Auto Save')
			},
			{ name: 'Exit', icon: <X size={14} />, action: () => window.close() }
		]
	},
	{
		name: 'Edit',
		subItems: [
			{ name: 'Undo', action: () => document.execCommand('undo') },
			{ name: 'Redo', action: () => document.execCommand('redo') },
			{ name: 'Cut', action: () => document.execCommand('cut') },
			{ name: 'Copy', action: () => document.execCommand('copy') },
			{ name: 'Paste', action: () => document.execCommand('paste') }
		]
	},
	{
		name: 'View',
		subItems: [
			{
				name: 'Toggle Full Screen',
				action: () => document.documentElement.requestFullscreen()
			},
			{ name: 'Toggle Sidebar', action: () => console.log('Toggle Sidebar') }
		]
	},
	{
		name: 'Go',
		subItems: [
			{ name: 'Home', action: router => router.push('/') },
			{ name: 'About', action: router => router.push('/about') },
			{ name: 'Projects', action: router => router.push('/projects') },
			{ name: 'Contact', action: router => router.push('/contact') }
		]
	}
]

const Titlebar = () => {
	const [activeMenu, setActiveMenu] = useState(null)
	const [currentTheme, setCurrentTheme] = useState('github-dark')
	const router = useRouter()
	const titlebarRef = useRef(null)

	const handleMenuClick = menu => {
		setActiveMenu(activeMenu === menu ? null : menu)
	}

	const handleSubItemClick = action => {
		if (typeof action === 'function') {
			action(router)
		}
		setActiveMenu(null)
	}

	const changeTheme = theme => {
		setCurrentTheme(theme)
		document.documentElement.setAttribute('data-theme', theme)
		localStorage.setItem('theme', theme)
		setActiveMenu(null)
	}

	useEffect(() => {
		const savedTheme = localStorage.getItem('theme')
		if (savedTheme) {
			changeTheme(savedTheme)
		}

		const handleClickOutside = event => {
			if (titlebarRef.current && !titlebarRef.current.contains(event.target)) {
				setActiveMenu(null)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	return (
		<section className={styles.titlebar} ref={titlebarRef}>
			<div className={styles.left}>
				<Image
					src='/vscode_icon.svg'
					alt='VSCode Icon'
					height={15}
					width={15}
					className={styles.icon}
				/>
				<div className={styles.items}>
					{menuItems.map(item => (
						<div
							key={item.name}
							className={`${styles.menuItem} ${
								activeMenu === item.name ? styles.active : ''
							}`}
							onClick={() => handleMenuClick(item.name)}>
							{item.name}
							{activeMenu === item.name && (
								<div className={styles.dropdown}>
									{item.subItems.map(subItem => (
										<div
											key={subItem.name}
											className={styles.subItem}
											onClick={() => handleSubItemClick(subItem.action)}>
											{subItem.icon && (
												<span className={styles.subItemIcon}>
													{subItem.icon}
												</span>
											)}
											{subItem.name}
										</div>
									))}
								</div>
							)}
						</div>
					))}
				</div>
			</div>
			<p className={styles.title}>Asif Alam - Visual Studio Code</p>
			<div className={styles.right}>
				<div
					className={`${styles.menuItem} ${
						activeMenu === 'theme' ? styles.active : ''
					}`}
					onClick={() => handleMenuClick('theme')}>
					<Palette size={14} className={styles.themeIcon} />
					{activeMenu === 'theme' && (
						<div className={styles.dropdown}>
							{themes.map(theme => (
								<div
									key={theme.value}
									className={styles.subItem}
									onClick={() => changeTheme(theme.value)}>
									{theme.name}
								</div>
							))}
						</div>
					)}
				</div>
				<Link
					href='https://github.com/asif-alam1'
					target='_blank'
					rel='noopener noreferrer'
					className={styles.iconButton}
					title='GitHub'>
					<Github size={14} style={{ marginRight: '0.5rem' }} />
				</Link>
				<Link
					href='https://linkedin.com/in/asif-alam-talukder'
					target='_blank'
					rel='noopener noreferrer'
					className={styles.iconButton}
					title='LinkedIn'>
					<Linkedin size={14} />
				</Link>
				<a
					href='mailto:asiftalukder151@gmail.com'
					className={styles.iconButton}
					title='Email'>
					<Mail size={14} />
				</a>

				<div className={styles.windowButtons}>
					<button
						className={`${styles.windowButton} ${styles.minimize}`}
						onClick={() => console.log('Minimize')}
						title='Minimize'></button>
					<button
						className={`${styles.windowButton} ${styles.maximize}`}
						onClick={() => console.log('Maximize')}
						title='Maximize'></button>
					<button
						className={`${styles.windowButton} ${styles.close}`}
						onClick={() => console.log('Close')}
						title='Close'></button>
				</div>
			</div>
		</section>
	)
}

export default Titlebar
