import React, { useState, useEffect } from 'react'
import {
	Bell,
	Check,
	GitBranch,
	AlertCircle,
	AlertTriangle,
	ChevronUp,
	ChevronDown,
	Settings
} from 'lucide-react'
import NextjsIcon from './icons/NextjsIcon'
import styles from '../styles/Bottombar.module.css'

const Bottombar = () => {
	const [branch, setBranch] = useState('main')
	const [errors, setErrors] = useState(0)
	const [warnings, setWarnings] = useState(0)
	const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] =
		useState(false)
	const [notifications, setNotifications] = useState([])
	const [batteryLevel, setBatteryLevel] = useState(100)
	const [currentTime, setCurrentTime] = useState(new Date())

	useEffect(() => {
		const timer = setInterval(() => setCurrentTime(new Date()), 1000)
		return () => clearInterval(timer)
	}, [])

	useEffect(() => {
		const simulateIssues = () => {
			setErrors(Math.floor(Math.random() * 3))
			setWarnings(Math.floor(Math.random() * 5))
		}
		simulateIssues()
		const interval = setInterval(simulateIssues, 30000)
		return () => clearInterval(interval)
	}, [])

	useEffect(() => {
		const simulateBatteryDrain = () => {
			setBatteryLevel(prev => Math.max(prev - 1, 0))
		}
		const interval = setInterval(simulateBatteryDrain, 60000)
		return () => clearInterval(interval)
	}, [])

	const toggleNotificationsPanel = () => {
		setIsNotificationsPanelOpen(prev => !prev)
	}

	const addNotification = (title, description) => {
		setNotifications(prev => [...prev, { title, description, id: Date.now() }])
	}

	const removeNotification = id => {
		setNotifications(prev => prev.filter(notif => notif.id !== id))
	}

	return (
		<footer className={styles.bottomBar}>
			<div className={styles.container}>
				<div
					className={styles.section}
					onClick={() => {
						setBranch(prev => (prev === 'main' ? 'development' : 'main'))
						addNotification(
							'Branch Changed',
							`Switched to ${branch === 'main' ? 'development' : 'main'} branch`
						)
					}}>
					<GitBranch className={styles.icon} size={14} />
					<p>{branch}</p>
				</div>
				<div
					className={styles.section}
					onClick={() =>
						addNotification(
							'Issues Update',
							`Found ${errors} errors and ${warnings} warnings`
						)
					}>
					<AlertCircle
						className={styles.icon}
						size={14}
						color={errors > 0 ? 'red' : 'currentColor'}
					/>
					<p className={styles.errorText}>{errors}</p>&nbsp;&nbsp;
					<AlertTriangle
						className={styles.icon}
						size={14}
						color={warnings > 0 ? 'orange' : 'currentColor'}
					/>
					<p>{warnings}</p>
				</div>
			</div>
			<div className={styles.container}>
				<div className={styles.section}>
					<NextjsIcon className={styles.icon} size={14} />
					<p>Powered by Next.js</p>
				</div>
				<div className={styles.section}>
					<Check className={styles.icon} size={14} />
					<p>Prettier</p>
				</div>
				<div className={styles.section} onClick={toggleNotificationsPanel}>
					<Bell className={styles.icon} size={14} />
					{isNotificationsPanelOpen ? (
						<ChevronDown size={14} />
					) : (
						<ChevronUp size={14} />
					)}
				</div>
				<div className={styles.section}>
					<Settings className={styles.icon} size={14} />
				</div>
				<div className={styles.section}>
					<p>{currentTime.toLocaleTimeString()}</p>
				</div>
				<div className={styles.section}>
					<div
						className={styles.batteryIndicator}
						style={{ width: `${batteryLevel}%` }}></div>
					<p>{batteryLevel}%</p>
				</div>
			</div>
			{isNotificationsPanelOpen && (
				<div className={styles.notificationsPanel}>
					{notifications.length === 0 ? (
						<p className={styles.noNotifications}>No notifications</p>
					) : (
						notifications.map(notif => (
							<div key={notif.id} className={styles.notification}>
								<h4>{notif.title}</h4>
								<p>{notif.description}</p>
								<button
									onClick={() => removeNotification(notif.id)}
									className={styles.closeNotification}>
									×
								</button>
							</div>
						))
					)}
				</div>
			)}
		</footer>
	)
}

export default Bottombar
