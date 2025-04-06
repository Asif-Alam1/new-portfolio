import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  Check,
  GitBranch,
  AlertCircle,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  Settings,
  Wifi,
  WifiOff,
  Zap,
  ZapOff,
  HardDrive,
  Cpu,
  X,
  ExternalLink,
  MoreHorizontal // Using a standard icon for "more"
} from 'lucide-react';
import NextjsIcon from './icons/NextjsIcon';
import styles from '../styles/Bottombar.module.css';

// Helper component for more/less toggle (using Lucide icon)
const MoreButton = ({ expanded }) => {
  // You could potentially change the icon based on 'expanded' state if needed
  return <MoreHorizontal size={16} />;
};


const Bottombar = () => {
  const [branch, setBranch] = useState('main');
  const [errors, setErrors] = useState(0);
  const [warnings, setWarnings] = useState(0);
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(true);
  const [cpuUsage, setCpuUsage] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showAll, setShowAll] = useState(false); // Default to hidden on mobile initially

  const notificationsPanelRef = useRef(null);
  let notificationTimeout = useRef(null);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // Reset showAll when switching to mobile view if it was previously true
      if (mobile && showAll) {
         // setShowAll(false); // Optional: Decide if you want it to reset on resize
      } else if (!mobile) {
        // Always show all on desktop
        setShowAll(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [showAll]); // Re-run checkMobile if showAll changes (relevant for the optional reset)

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate performance metrics and error/warning counts
  useEffect(() => {
    // ... (simulation logic remains the same) ...
    // Initial values
    setCpuUsage(20 + Math.random() * 30)
    setMemoryUsage(40 + Math.random() * 20)

    // Simulate initial network status
    setIsOnline(Math.random() > 0.1); // 90% chance starts online

    const simulateMetrics = () => {
      // Random errors and warnings (with more realistic variation)
      setErrors(prev => {
        if (Math.random() > 0.2) return prev;
        return Math.floor(Math.random() * 3);
      });

      setWarnings(prev => {
        if (Math.random() > 0.3) return prev;
        return Math.floor(Math.random() * 5);
      });

      // CPU and memory usage simulation (with smoother transitions)
      setCpuUsage(prev => {
        const delta = Math.random() * 15 - 7.5;
        return Math.min(100, Math.max(5, prev + delta));
      });

      setMemoryUsage(prev => {
        const delta = Math.random() * 10 - 5;
        return Math.min(100, Math.max(20, prev + delta));
      });
    };

    const simulateNetworkStatus = () => {
      if (Math.random() > 0.95) { // 5% chance to change status
        const currentlyOnline = isOnline; // Capture state before update
        setIsOnline(prev => !prev);
        addNotification(
          !currentlyOnline ? 'Network Connected' : 'Network Disconnected',
          !currentlyOnline ? 'You are back online.' : 'Your network connection has been lost.',
          10000
        );
      }
    };

     const simulateBatteryDrain = () => {
      setBatteryLevel(prev => {
        const newLevel = Math.max(prev - (Math.random() * 0.5), 0);
        if (prev > 20 && newLevel <= 20) {
          addNotification(
            'Battery Low',
            'Your battery is running low (20%). Consider connecting to power.',
            0
          );
        }
        return newLevel;
      });
    };

    simulateMetrics(); // Initial run
    const metricsInterval = setInterval(simulateMetrics, 5000);
    const networkInterval = setInterval(simulateNetworkStatus, 30000);
    const batteryInterval = setInterval(simulateBatteryDrain, 60000);

    return () => {
      clearInterval(metricsInterval);
      clearInterval(networkInterval);
      clearInterval(batteryInterval);
      if (notificationTimeout.current) {
          clearTimeout(notificationTimeout.current);
      }
    };
  }, []); // Removed isOnline dependency as it causes re-subscriptions

  // Handle clicks outside the notifications panel to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isNotificationsPanelOpen &&
        notificationsPanelRef.current &&
        !notificationsPanelRef.current.contains(event.target) &&
        // Ensure clicking the bell icon itself doesn't immediately close it
        !event.target.closest(`.${styles.section}[data-section="notifications"]`)
      ) {
        setIsNotificationsPanelOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNotificationsPanelOpen]);

  const toggleNotificationsPanel = () => {
    setIsNotificationsPanelOpen(prev => !prev);
  };

  const addNotification = (title, description, autoHideMs = 0) => {
    const id = Date.now();
    const newNotification = { title, description, id, timestamp: new Date() };

    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep max 50 notifs

    if (autoHideMs > 0) {
        // Use a ref to manage timeout across renders if needed,
        // but simple setTimeout is often fine here.
        setTimeout(() => {
            removeNotification(id);
        }, autoHideMs);
    }
    return id;
  };

  const removeNotification = id => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setIsNotificationsPanelOpen(false); // Close panel when clearing
  };

  const toggleShowAll = () => {
    if (isMobile) {
      setShowAll(prev => !prev);
    }
  };

  // Format relative time for notifications
  const formatRelativeTime = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);

    if (diffSeconds < 5) return 'just now';
    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  // Determine which sections are visible based on state and screen size
  const shouldShowOptionalSections = showAll || !isMobile;

  return (
    <footer className={styles.bottomBar}>
      {/* Left Container */}
      <div className={styles.container}>
        <div
          className={styles.section}
          onClick={() => {
            const newBranch = branch === 'main' ? 'development' : 'main';
            setBranch(newBranch);
            addNotification('Branch Changed', `Switched to ${newBranch} branch`, 5000);
          }}
          title={`Current git branch: ${branch}. Click to switch.`}
        >
          <GitBranch className={styles.icon} size={14} />
          <p className={styles.hideOnMobileNarrow}>{branch}</p> {/* Hide text on very small screens */}
        </div>

        <div
          className={styles.section}
          onClick={() =>
            addNotification(
              'Code Issues',
              `Found ${errors} errors and ${warnings} warnings.`,
              5000
            )
          }
          title={`${errors} Errors, ${warnings} Warnings`}
        >
          <AlertCircle
            className={styles.icon}
            size={14}
            color={errors > 0 ? '#ff6b6b' : 'currentColor'} // Use hex for consistency
          />
          <p className={styles.errorText}>{errors}</p>
          <AlertTriangle
            className={`${styles.icon} ${styles.warningIcon}`}
            size={14}
            color={warnings > 0 ? '#ffbb55' : 'currentColor'}
          />
          <p>{warnings}</p>
        </div>

        {/* Optional Sections */}
        {shouldShowOptionalSections && (
          <>
            <div className={styles.section} title={`Network: ${isOnline ? 'Online' : 'Offline'}`}>
              {isOnline ? (
                <Wifi className={styles.icon} size={14} color="#4caf50" />
              ) : (
                <WifiOff className={styles.icon} size={14} color="#ff6b6b" />
              )}
              <p className={styles.hideOnMobileMedium}>{isOnline ? 'Online' : 'Offline'}</p>
            </div>

            <div className={styles.section} title={`CPU: ${Math.round(cpuUsage)}%`}>
              <Cpu className={`${styles.icon} ${styles.hideOnMobileMedium}`} size={14} />
              <div className={`${styles.progressContainer} ${styles.hideOnMobileWide}`}>
                <div
                  className={`${styles.progressBar} ${cpuUsage > 80 ? styles.critical : cpuUsage > 60 ? styles.warning : ''}`}
                  style={{ width: `${cpuUsage}%` }}
                ></div>
              </div>
              <p>{Math.round(cpuUsage)}%</p>
            </div>

            <div className={styles.section} title={`Memory: ${Math.round(memoryUsage)}%`}>
              <HardDrive className={`${styles.icon} ${styles.hideOnMobileMedium}`} size={14} />
               <div className={`${styles.progressContainer} ${styles.hideOnMobileWide}`}>
                <div
                  className={`${styles.progressBar} ${memoryUsage > 80 ? styles.critical : memoryUsage > 60 ? styles.warning : ''}`}
                  style={{ width: `${memoryUsage}%` }}
                ></div>
              </div>
              <p>{Math.round(memoryUsage)}%</p>
            </div>
          </>
        )}
      </div>

      {/* Right Container */}
      <div className={styles.container}>
         {/* Optional Sections (Right side) */}
        {shouldShowOptionalSections && (
          <>
            <div className={styles.section} title="Powered by Next.js">
              <NextjsIcon className={styles.icon} size={14} />
              <p className={styles.hideOnMobileMedium}>Next.js</p>
            </div>

            <div className={styles.section} title="Code formatted with Prettier">
              <Check className={styles.icon} size={14} color="#4caf50"/>
              <p className={styles.hideOnMobileMedium}>Prettier</p>
            </div>
          </>
        )}

        {/* Always Visible Right Side */}
         {isMobile && (
          <div
            className={`${styles.section} ${styles.moreButtonContainer}`}
            onClick={toggleShowAll}
            title={showAll ? "Hide optional sections" : "Show optional sections"}
          >
            <MoreButton expanded={showAll} />
          </div>
        )}

        <div
          className={`${styles.section} ${isNotificationsPanelOpen ? styles.active : ''}`}
          onClick={toggleNotificationsPanel}
          data-section="notifications"
          title={`${notifications.length} Notifications`}
        >
          <Bell className={styles.icon} size={14} />
          {notifications.length > 0 && (
            <span className={styles.notificationBadge}>
              {notifications.length > 9 ? '9+' : notifications.length}
            </span>
          )}
          {/* Simple indicator, chevron might take too much space */}
        </div>

        <div className={styles.section} title="Settings">
          <Settings className={styles.icon} size={14} />
        </div>

        <div className={styles.section} title="Current time">
          {/* <Clock size={14} className={styles.icon} /> Optional: add icon */}
          <p>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>

        <div className={styles.section} title={`Battery: ${Math.round(batteryLevel)}%`}>
           {batteryLevel <= 20 ? (
            <ZapOff size={14} className={`${styles.icon} ${styles.warning}`} />
          ) : (
            <Zap size={14} className={styles.icon} />
          )}
          <p className={styles.hideOnMobileNarrow}>{Math.round(batteryLevel)}%</p>
          <div className={`${styles.batteryContainer} ${styles.hideOnMobileMedium}`}>
            <div
              className={`${styles.batteryIndicator} ${
                batteryLevel <= 10 ? styles.critical :
                batteryLevel <= 20 ? styles.warning : ''
              }`}
              style={{ width: `${batteryLevel}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Notifications Panel */}
      {isNotificationsPanelOpen && (
         <div className={styles.notificationsPanel} ref={notificationsPanelRef}>
           <div className={styles.notificationsHeader}>
             <h3>Notifications</h3>
             <div>
               <button
                 className={styles.clearAllButton}
                 onClick={clearAllNotifications}
                 disabled={notifications.length === 0}
                 title="Clear all notifications"
               >
                 Clear All
               </button>
               <button
                 className={styles.closeButton}
                 onClick={() => setIsNotificationsPanelOpen(false)}
                 title="Close notifications"
               >
                 <X size={16} />
               </button>
             </div>
           </div>

           <div className={styles.notificationsContent}>
             {notifications.length === 0 ? (
               <div className={styles.emptyNotifications}>
                 <Bell size={24} className={styles.emptyIcon} />
                 <p>No new notifications</p>
                 <p className={styles.emptySubtext}>You're all caught up!</p>
               </div>
             ) : (
               notifications.map(notif => (
                 <div key={notif.id} className={styles.notification}>
                   <div className={styles.notificationHeader}>
                     <h4>{notif.title}</h4>
                     <div className={styles.notificationActions}>
                       <span className={styles.timestamp}>
                         {formatRelativeTime(notif.timestamp)}
                       </span>
                       <button
                         onClick={() => removeNotification(notif.id)}
                         className={styles.removeNotification}
                         title="Dismiss"
                       >
                         <X size={14} />
                       </button>
                     </div>
                   </div>
                   <p className={styles.notificationContentText}>{notif.description}</p> {/* Use specific class */}

                   {notif.title.includes('Battery') && batteryLevel <= 20 && (
                     <div className={styles.notificationFooterActions}>
                       <button className={styles.actionButton}>
                         <ExternalLink size={12} />
                         <span>Power Settings</span>
                       </button>
                     </div>
                   )}
                 </div>
               ))
             )}
           </div>
         </div>
      )}
    </footer>
  );
};

export default Bottombar;