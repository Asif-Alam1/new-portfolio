import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { X, SplitSquareVertical, MoreHorizontal } from 'lucide-react'
import styles from '../styles/Tabsbar.module.css'

const tabsData = [
	{ icon: '/react_icon.svg', filename: 'home.jsx', path: '/' },
	{ icon: '/html_icon.svg', filename: 'about.html', path: '/about' },
	{ icon: '/css_icon.svg', filename: 'contact.css', path: '/contact' },
	{ icon: '/js_icon.svg', filename: 'projects.js', path: '/projects' },
	{ icon: '/markdown_icon.svg', filename: 'github.md', path: '/github' }
]

const Tabsbar = () => {
	const router = useRouter()
	const [openTabs, setOpenTabs] = useState(tabsData)
	const [activeTab, setActiveTab] = useState(router.pathname)

	useEffect(() => {
		setActiveTab(router.pathname)
	}, [router.pathname])

	const closeTab = (path, e) => {
		e.preventDefault()
		e.stopPropagation()
		const newTabs = openTabs.filter(tab => tab.path !== path)
		setOpenTabs(newTabs)
		if (activeTab === path && newTabs.length > 0) {
			router.push(newTabs[0].path)
		}
	}

	const handleTabClick = path => {
		setActiveTab(path)
	}

	const handleTabDragStart = (e, index) => {
		e.dataTransfer.setData('text/plain', index)
	}

	const handleTabDragOver = e => {
		e.preventDefault()
	}

	const handleTabDrop = (e, dropIndex) => {
		const dragIndex = parseInt(e.dataTransfer.getData('text/plain'), 10)
		const newTabs = [...openTabs]
		const [reorderedTab] = newTabs.splice(dragIndex, 1)
		newTabs.splice(dropIndex, 0, reorderedTab)
		setOpenTabs(newTabs)
	}

	return (
		<div className={styles.tabsbar}>
			<div className={styles.tabs}>
				{openTabs.map((tab, index) => (
					<Link href={tab.path} key={tab.path}>
						<div
							className={`${styles.tab} ${
								activeTab === tab.path ? styles.active : ''
							}`}
							onClick={() => handleTabClick(tab.path)}
							draggable
							onDragStart={e => handleTabDragStart(e, index)}
							onDragOver={handleTabDragOver}
							onDrop={e => handleTabDrop(e, index)}>
							<Image src={tab.icon} alt='Tab File Name' height={18} width={18} />
							<p>{tab.filename}</p>
							<button
								className={styles.closeTab}
								onClick={e => closeTab(tab.path, e)}
								title='Close tab'>
								<X size={14} />
							</button>
						</div>
					</Link>
				))}
			</div>
			<div className={styles.tabActions}>
				<button className={styles.actionButton} title='Split editor right'>
					<SplitSquareVertical size={16} />
				</button>
				<button className={styles.actionButton} title='More actions'>
					<MoreHorizontal size={16} />
				</button>
			</div>
		</div>
	)
}

export default Tabsbar
