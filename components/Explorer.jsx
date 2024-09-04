import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
	ChevronRight,
	FolderPlus,
	FilePlus,
	Trash2,
	RefreshCw
} from 'lucide-react'
import styles from '../styles/Explorer.module.css'

const initialExplorerItems = [
	{ name: 'home.jsx', path: '/', icon: 'react_icon.svg' },
	{ name: 'about.html', path: '/about', icon: 'html_icon.svg' },
	{ name: 'contact.css', path: '/contact', icon: 'css_icon.svg' },
	{ name: 'projects.js', path: '/projects', icon: 'js_icon.svg' },
	{ name: 'github.md', path: '/github', icon: 'markdown_icon.svg' }
]

const Explorer = () => {
	const [portfolioOpen, setPortfolioOpen] = useState(true)
	const [explorerItems, setExplorerItems] = useState(initialExplorerItems)
	const [selectedFile, setSelectedFile] = useState(null)
	const [isCreatingFile, setIsCreatingFile] = useState(false)
	const [newFileName, setNewFileName] = useState('')

	useEffect(() => {
		const handleKeyDown = event => {
			if (event.key === 'Delete' && selectedFile) {
				deleteFile(selectedFile)
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [selectedFile])

	const togglePortfolio = () => setPortfolioOpen(!portfolioOpen)

	const addFile = () => {
		setIsCreatingFile(true)
	}

	const handleNewFileNameSubmit = e => {
		e.preventDefault()
		if (newFileName) {
			const fileExtension = newFileName.split('.').pop()
			let icon
			switch (fileExtension) {
				case 'js':
				case 'jsx':
					icon = 'react_icon.svg'
					break
				case 'html':
					icon = 'html_icon.svg'
					break
				case 'css':
					icon = 'css_icon.svg'
					break
				case 'md':
					icon = 'markdown_icon.svg'
					break
				default:
					icon = 'file_icon.svg'
			}
			setExplorerItems([
				...explorerItems,
				{ name: newFileName, path: `/${newFileName}`, icon }
			])
			setNewFileName('')
			setIsCreatingFile(false)
		}
	}

	const deleteFile = fileToDelete => {
		setExplorerItems(explorerItems.filter(item => item.name !== fileToDelete))
		if (selectedFile === fileToDelete) {
			setSelectedFile(null)
		}
	}

	const refreshExplorer = () => {
		setExplorerItems([...initialExplorerItems])
	}

	return (
		<div className={styles.explorer}>
			<div className={styles.explorerHeader}>
				<p className={styles.title}>Explorer</p>
				<div className={styles.actions}>
					<FolderPlus
						size={16}
						className={styles.actionIcon}
						onClick={() =>
							alert('Create folder functionality to be implemented')
						}
					/>
					<FilePlus size={16} className={styles.actionIcon} onClick={addFile} />
					<RefreshCw
						size={16}
						className={styles.actionIcon}
						onClick={refreshExplorer}
					/>
				</div>
			</div>
			<div>
				<div className={styles.heading} onClick={togglePortfolio}>
					<ChevronRight
						className={styles.chevron}
						style={portfolioOpen ? { transform: 'rotate(90deg)' } : {}}
					/>
					Portfolio
				</div>
				<div
					className={styles.files}
					style={portfolioOpen ? { display: 'block' } : { display: 'none' }}>
					{explorerItems.map(item => (
						<div
							key={item.name}
							className={`${styles.file} ${
								selectedFile === item.name ? styles.selected : ''
							}`}
							onClick={() => setSelectedFile(item.name)}>
							<Link href={item.path}>
								<div className={styles.fileContent}>
									<Image
										src={`/${item.icon}`}
										alt='File Icon'
										height={18}
										width={18}
									/>
									<p>{item.name}</p>
								</div>
							</Link>
							<Trash2
								size={14}
								className={styles.deleteIcon}
								onClick={e => {
									e.stopPropagation()
									deleteFile(item.name)
								}}
							/>
						</div>
					))}
					{isCreatingFile && (
						<form onSubmit={handleNewFileNameSubmit}>
							<input
								type='text'
								value={newFileName}
								onChange={e => setNewFileName(e.target.value)}
								placeholder='Enter file name'
								className={styles.newFileInput}
								autoFocus
							/>
						</form>
					)}
				</div>
			</div>
		</div>
	)
}

export default Explorer
