import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

// ============================================================================
// REAL-TIME NOTIFICATIONS HOOK
// ============================================================================

export const useRealtimeNotifications = (options = {}) => {
  const { currentUser, isAuthenticated } = useAuth();
  const { limitCount = 50, enabled = true } = options;
  
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    if (!enabled || !isAuthenticated || !currentUser?.uid) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef,
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    unsubscribeRef.current = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setNotifications(docs);
        setLoading(false);
      },
      (err) => {
        console.error('Notifications listener error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [currentUser?.uid, isAuthenticated, enabled, limitCount]);

  const markAsRead = useCallback(async (notificationId) => {
    if (!currentUser?.uid) return { success: false, error: 'User not authenticated' };

    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        isRead: true,
        readAt: serverTimestamp()
      });
      return { success: true };
    } catch (err) {
      console.error('Error marking notification as read:', err);
      return { success: false, error: err.message };
    }
  }, [currentUser?.uid]);

  const markAllAsRead = useCallback(async () => {
    if (!currentUser?.uid) return { success: false, error: 'User not authenticated' };

    try {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      const updatePromises = unreadNotifications.map(notification => 
        updateDoc(doc(db, 'notifications', notification.id), {
          isRead: true,
          readAt: serverTimestamp()
        })
      );
      
      await Promise.all(updatePromises);
      return { success: true };
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      return { success: false, error: err.message };
    }
  }, [currentUser?.uid, notifications]);

  const deleteNotification = useCallback(async (notificationId) => {
    if (!currentUser?.uid) return { success: false, error: 'User not authenticated' };

    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        isDeleted: true,
        deletedAt: serverTimestamp()
      });
      return { success: true };
    } catch (err) {
      console.error('Error deleting notification:', err);
      return { success: false, error: err.message };
    }
  }, [currentUser?.uid]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return {
    notifications,
    loading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };
};

// ============================================================================
// NOTIFICATION CREATION HOOK (Admin use)
// ============================================================================

export const useNotificationCreator = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createNotification = useCallback(async (notificationData) => {
    if (!isAuthenticated || !currentUser?.uid) {
      setError('User not authenticated');
      return { success: false, error: 'User not authenticated' };
    }

    setLoading(true);
    setError(null);

    try {
      const notificationsRef = collection(db, 'notifications');
      const notificationPayload = {
        ...notificationData,
        createdAt: serverTimestamp(),
        isRead: false,
        isDeleted: false
      };

      const docRef = await addDoc(notificationsRef, notificationPayload);
      return { success: true, data: { id: docRef.id } };
    } catch (err) {
      console.error('Error creating notification:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [currentUser?.uid, isAuthenticated]);

  const createBulkNotifications = useCallback(async (notificationsData) => {
    if (!isAuthenticated || !currentUser?.uid) {
      setError('User not authenticated');
      return { success: false, error: 'User not authenticated' };
    }

    setLoading(true);
    setError(null);

    try {
      const notificationsRef = collection(db, 'notifications');
      const timestamp = serverTimestamp();
      
      const notifications = notificationsData.map(data => ({
        ...data,
        createdAt: timestamp,
        isRead: false,
        isDeleted: false
      }));

      const promises = notifications.map(notification => 
        addDoc(notificationsRef, notification)
      );

      const results = await Promise.all(promises);
      return { success: true, data: results };
    } catch (err) {
      console.error('Error creating bulk notifications:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [currentUser?.uid, isAuthenticated]);

  return {
    createNotification,
    createBulkNotifications,
    loading,
    error
  };
};

// ============================================================================
// NOTIFICATION TYPES AND HELPERS
// ============================================================================

export const NOTIFICATION_TYPES = {
  ENROLLMENT_SUCCESS: 'enrollment_success',
  COURSE_COMPLETED: 'course_completed',
  PAYMENT_SUCCESS: 'payment_success',
  PAYMENT_FAILED: 'payment_failed',
  COURSE_UPDATED: 'course_updated',
  NEW_COURSE_AVAILABLE: 'new_course_available',
  COUPON_EXPIRING: 'coupon_expiring',
  SYSTEM_ANNOUNCEMENT: 'system_announcement'
};

export const createNotificationData = (type, userId, data = {}) => {
  const baseData = {
    userId,
    type,
    createdAt: serverTimestamp(),
    isRead: false,
    isDeleted: false
  };

  switch (type) {
    case NOTIFICATION_TYPES.ENROLLMENT_SUCCESS:
      return {
        ...baseData,
        title: 'Enrollment Successful!',
        message: `You have successfully enrolled in ${data.courseTitle}`,
        actionUrl: `/learn/${data.courseId}`,
        icon: 'book-open',
        priority: 'high'
      };

    case NOTIFICATION_TYPES.COURSE_COMPLETED:
      return {
        ...baseData,
        title: 'Course Completed!',
        message: `Congratulations! You have completed ${data.courseTitle}`,
        actionUrl: `/course/${data.courseId}`,
        icon: 'award',
        priority: 'high'
      };

    case NOTIFICATION_TYPES.PAYMENT_SUCCESS:
      return {
        ...baseData,
        title: 'Payment Successful!',
        message: `Your payment of ₹${data.amount} has been processed successfully`,
        actionUrl: `/profile`,
        icon: 'credit-card',
        priority: 'medium'
      };

    case NOTIFICATION_TYPES.PAYMENT_FAILED:
      return {
        ...baseData,
        title: 'Payment Failed',
        message: `Your payment for ${data.courseTitle} could not be processed`,
        actionUrl: `/course/${data.courseId}`,
        icon: 'alert-circle',
        priority: 'high'
      };

    case NOTIFICATION_TYPES.COURSE_UPDATED:
      return {
        ...baseData,
        title: 'Course Updated',
        message: `${data.courseTitle} has been updated with new content`,
        actionUrl: `/course/${data.courseId}`,
        icon: 'refresh-cw',
        priority: 'medium'
      };

    case NOTIFICATION_TYPES.NEW_COURSE_AVAILABLE:
      return {
        ...baseData,
        title: 'New Course Available!',
        message: `Check out the new course: ${data.courseTitle}`,
        actionUrl: `/course/${data.courseId}`,
        icon: 'star',
        priority: 'medium'
      };

    case NOTIFICATION_TYPES.COUPON_EXPIRING:
      return {
        ...baseData,
        title: 'Coupon Expiring Soon',
        message: `Your coupon ${data.couponCode} expires in ${data.daysLeft} days`,
        actionUrl: `/courses`,
        icon: 'clock',
        priority: 'medium'
      };

    case NOTIFICATION_TYPES.SYSTEM_ANNOUNCEMENT:
      return {
        ...baseData,
        title: data.title || 'System Announcement',
        message: data.message,
        actionUrl: data.actionUrl || '/',
        icon: 'megaphone',
        priority: data.priority || 'low'
      };

    default:
      return {
        ...baseData,
        title: 'Notification',
        message: 'You have a new notification',
        icon: 'bell',
        priority: 'low'
      };
  }
};

export default {
  useRealtimeNotifications,
  useNotificationCreator,
  NOTIFICATION_TYPES,
  createNotificationData
};