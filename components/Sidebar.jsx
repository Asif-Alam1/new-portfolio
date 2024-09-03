import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
	Files,
	Github,
	Code,
	Mail,
	User,
	Settings,
	ChevronLeft,
	ChevronRight
} from 'lucide-react'
import styles from '../styles/Sidebar.module.css'

const sidebarTopItems = [
	{ Icon: Files, path: '/', label: 'Files' },
	{ Icon: Github, path: '/github', label: 'GitHub' },
	{ Icon: Code, path: '/projects', label: 'Projects' },
	{ Icon: Mail, path: '/contact', label: 'Contact' }
]

const sidebarBottomItems = [
	{ Icon: User, path: '/about', label: 'About' },
	{ Icon: Settings, path: '/settings', label: 'Settings' }
]

const Sidebar = () => {
	const router = useRouter()
	const [isCollapsed, setIsCollapsed] = useState(false)

	const toggleSidebar = () => {
		setIsCollapsed(!isCollapsed)
	}

	const renderIcon = (Icon, path, label) => (
		<div
			className={`${styles.iconContainer} ${
				router.pathname === path && styles.active
			}`}
			title={label}>
			<Icon size={28} strokeWidth={1.5} className={styles.icon} />
			{!isCollapsed && <span className={styles.iconLabel}>{label}</span>}
		</div>
	)

	return (
		<aside
			className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
			<div className={styles.sidebarTop}>
				{sidebarTopItems.map(({ Icon, path, label }) => (
					<Link href={path} key={path}>
						{renderIcon(Icon, path, label)}
					</Link>
				))}
			</div>
			<div className={styles.sidebarBottom}>
				{sidebarBottomItems.map(({ Icon, path, label }) => (
					<Link href={path} key={path}>
						{renderIcon(Icon, path, label)}
					</Link>
				))}
				<div
					className={`${styles.iconContainer} ${styles.toggleButton}`}
					onClick={toggleSidebar}
					title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}>
					{isCollapsed ? (
						<ChevronRight size={28} strokeWidth={1.5} className={styles.icon} />
					) : (
						<ChevronLeft size={28} strokeWidth={1.5} className={styles.icon} />
					)}
				</div>
			</div>
		</aside>
	)
}

export default Sidebar
