import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  ItemRecord,
  ClaimRecord,
  NotificationItem,
  UserRole,
  ReturnReceipt,
  ItemCategory,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_ITEMS,
  INITIAL_CLAIMS,
  INITIAL_NOTIFICATIONS,
} from '../data/seedData';

interface CampusFindContextType {
  // State
  users: User[];
  currentUser: User | null;
  items: ItemRecord[];
  claims: ClaimRecord[];
  notifications: NotificationItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedItemForClaim: ItemRecord | null;
  setSelectedItemForClaim: (item: ItemRecord | null) => void;
  selectedClaimForReview: ClaimRecord | null;
  setSelectedClaimForReview: (claim: ClaimRecord | null) => void;
  viewingReceipt: { claim: ClaimRecord; receipt: ReturnReceipt } | null;
  setViewingReceipt: (data: { claim: ClaimRecord; receipt: ReturnReceipt } | null) => void;

  // Authentication & Accounts (Module 1)
  login: (email: string, password?: string) => { success: boolean; error?: string };
  quickLoginAs: (userId: string) => void;
  register: (user: Omit<User, 'id' | 'createdAt'>) => { success: boolean; error?: string };
  logout: () => void;

  // Manage Item Reports (Module 2)
  submitReport: (report: Omit<ItemRecord, 'id' | 'trackingNumber' | 'reportStatus' | 'itemStatus' | 'createdAt' | 'updatedAt' | 'reporterId' | 'reporterName' | 'reporterRole' | 'reporterContact'>) => ItemRecord;
  approveReport: (itemId: string, remarks?: string) => void;
  rejectReport: (itemId: string, remarks: string) => void;

  // Check Claims and Returns (Module 4)
  submitClaim: (
    itemId: string,
    claimData: {
      dateLost: string;
      lostLocation: string;
      ownershipProofDetails: string;
      proofType: ClaimRecord['proofType'];
      proofDocumentUrl?: string;
    }
  ) => { success: boolean; error?: string; claim?: ClaimRecord };
  approveClaim: (
    claimId: string,
    handoverInfo: {
      handoverLocation: string;
      releasingOfficer: string;
      notes?: string;
    }
  ) => void;
  rejectClaim: (claimId: string, adminNotes: string) => void;

  // Matching Utility (Module 5)
  findPossibleMatches: (target: {
    title: string;
    category?: ItemCategory | string;
    description?: string;
    location?: string;
    excludeItemId?: string;
  }) => ItemRecord[];

  // Notifications & Utilities
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  resetAllData: () => void;
}

const CampusFindContext = createContext<CampusFindContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'campusfind_users_v2',
  CURRENT_USER: 'campusfind_current_user_v2',
  ITEMS: 'campusfind_items_v2',
  CLAIMS: 'campusfind_claims_v2',
  NOTIFICATIONS: 'campusfind_notifications_v2',
};

export const CampusFindProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with localStorage or defaults
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (saved) return JSON.parse(saved);
      // Default initial login as Student A (Maria Santos) for fast interactive onboarding
      return INITIAL_USERS[0];
    } catch {
      return INITIAL_USERS[0];
    }
  });

  const [items, setItems] = useState<ItemRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ITEMS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 25) {
          return parsed;
        }
      }
      return INITIAL_ITEMS;
    } catch {
      return INITIAL_ITEMS;
    }
  });

  const [claims, setClaims] = useState<ClaimRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLAIMS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 6) {
          return parsed;
        }
      }
      return INITIAL_CLAIMS;
    } catch {
      return INITIAL_CLAIMS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 8) {
          return parsed;
        }
      }
      return INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  // UI Navigation states
  const [activeTab, setActiveTab] = useState<string>('search');
  const [selectedItemForClaim, setSelectedItemForClaim] = useState<ItemRecord | null>(null);
  const [selectedClaimForReview, setSelectedClaimForReview] = useState<ClaimRecord | null>(null);
  const [viewingReceipt, setViewingReceipt] = useState<{ claim: ClaimRecord; receipt: ReturnReceipt } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (e) {
      console.warn('Failed to persist users to localStorage', e);
    }
  }, [users]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    } catch (e) {
      console.warn('Failed to persist currentUser', e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to persist items', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(claims));
    } catch (e) {
      console.warn('Failed to persist claims', e);
    }
  }, [claims]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {
      console.warn('Failed to persist notifications', e);
    }
  }, [notifications]);

  // MODULE 1: MANAGE ACCOUNTS
  const login = (email: string, password?: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const user = users.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (!user) {
      return { success: false, error: 'Account not found. Please verify your institutional email.' };
    }

    if (password && user.password && user.password !== password) {
      return { success: false, error: 'Invalid password. Please check your credentials.' };
    }

    setCurrentUser(user);
    if (user.role === 'admin') {
      setActiveTab('admin_overview');
    } else {
      setActiveTab('search');
    }

    return { success: true };
  };

  const quickLoginAs = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      if (user.role === 'admin') {
        setActiveTab('admin_overview');
      } else {
        setActiveTab('search');
      }
    }
  };

  const register = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const existing = users.find((u) => u.email.toLowerCase() === userData.email.trim().toLowerCase());
    if (existing) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    const newUser: User = {
      ...userData,
      id: `USR-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    setActiveTab(newUser.role === 'admin' ? 'admin_overview' : 'search');

    // Welcome notification
    const welcomeNotif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      userId: newUser.id,
      title: 'Welcome to CampusFind LCUP',
      message: `Account activated for ${newUser.fullName} (${newUser.universityId}). You can now report and search for campus items.`,
      type: 'system',
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [welcomeNotif, ...prev]);

    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveTab('search');
  };

  // MODULE 2: MANAGE ITEM REPORTS
  const submitReport = (
    reportData: Omit<
      ItemRecord,
      | 'id'
      | 'trackingNumber'
      | 'reportStatus'
      | 'itemStatus'
      | 'createdAt'
      | 'updatedAt'
      | 'reporterId'
      | 'reporterName'
      | 'reporterRole'
      | 'reporterContact'
    >
  ): ItemRecord => {
    if (!currentUser) {
      throw new Error('User must be logged in to submit a report');
    }

    const year = new Date().getFullYear();
    const prefix = reportData.type === 'found' ? 'LCUP-F' : 'LCUP-L';
    const randSeq = Math.floor(100 + Math.random() * 900);
    const trackingNumber = `${prefix}-${year}-${randSeq}`;

    const newItem: ItemRecord = {
      ...reportData,
      id: `ITM-${Date.now()}`,
      trackingNumber,
      reporterId: currentUser.id,
      reporterName: currentUser.fullName,
      reporterRole: currentUser.role,
      reporterContact: currentUser.contactNumber,
      reportStatus: 'pending',
      itemStatus: 'available',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setItems((prev) => [newItem, ...prev]);

    // Create notifications for user and admin
    const userNotif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      userId: currentUser.id,
      title: `${reportData.type === 'found' ? 'Found' : 'Lost'} Item Report Submitted`,
      message: `Your report for "${newItem.title}" (${trackingNumber}) has been submitted and is awaiting Lost & Found Office review.`,
      type: 'report',
      timestamp: new Date().toISOString(),
      read: false,
      relatedItemId: newItem.id,
    };

    const adminNotif: NotificationItem = {
      id: `NOTIF-${Date.now() + 1}`,
      userId: 'ADM-001',
      title: `New ${reportData.type === 'found' ? 'Found' : 'Lost'} Item Report Pending`,
      message: `${currentUser.fullName} submitted a report for "${newItem.title}" at ${newItem.location}.`,
      type: 'report',
      timestamp: new Date().toISOString(),
      read: false,
      relatedItemId: newItem.id,
    };

    const userNotifs: NotificationItem[] = [userNotif];

    // If report is lost, check for possible matching found items
    if (reportData.type === 'lost') {
      const matches = findPossibleMatches({
        title: newItem.title,
        category: newItem.category,
        description: newItem.description,
        location: newItem.location,
        excludeItemId: newItem.id,
      });

      if (matches.length > 0) {
        const matchNotif: NotificationItem = {
          id: `NOTIF-${Date.now() + 2}`,
          userId: currentUser.id,
          title: `Possible Match Found in Registry! (${matches.length})`,
          message: `We found ${matches.length} existing found item(s) in custody that may match your reported "${newItem.title}". Click to inspect and verify.`,
          type: 'report',
          timestamp: new Date().toISOString(),
          read: false,
          relatedItemId: matches[0].id,
        };
        userNotifs.push(matchNotif);
      }
    }

    setNotifications((prev) => [...userNotifs, adminNotif, ...prev]);

    return newItem;
  };

  // MODULE 5: LIGHTWEIGHT POSSIBLE MATCHES
  const findPossibleMatches = (target: {
    title: string;
    category?: ItemCategory | string;
    description?: string;
    location?: string;
    excludeItemId?: string;
  }): ItemRecord[] => {
    if (!target.title) return [];

    const stopWords = new Set([
      'the', 'a', 'an', 'in', 'on', 'at', 'with', 'for', 'of', 'and', 'or', 'by', 'from',
      'left', 'lost', 'found', 'near', 'beside', 'my', 'item', 'belonging', 'please'
    ]);

    const targetWords = `${target.title} ${target.description || ''}`
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 3 && !stopWords.has(w));

    const targetLocWords = (target.location || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 4 && !stopWords.has(w));

    const scored = items
      .filter((i) => {
        // Exclude self if given
        if (target.excludeItemId && i.id === target.excludeItemId) return false;
        // Target matches against approved found items available in registry
        return i.type === 'found' && i.reportStatus === 'approved' && i.itemStatus !== 'claimed';
      })
      .map((item) => {
        let score = 0;
        const itemText = `${item.title} ${item.description} ${item.distinguishingFeatures}`.toLowerCase();
        const itemLoc = item.location.toLowerCase();

        // Category match (+3 points)
        if (target.category && target.category === item.category) {
          score += 3;
        }

        // Title and description keyword matches (+2 points per word)
        for (const word of targetWords) {
          if (itemText.includes(word)) {
            score += 2;
          }
        }

        // Location keyword similarity (+1.5 points)
        for (const locWord of targetLocWords) {
          if (itemLoc.includes(locWord)) {
            score += 1.5;
            break;
          }
        }

        return { item, score };
      })
      .filter((res) => res.score >= 3)
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, 4).map((res) => res.item);
  };

  const approveReport = (itemId: string, remarks?: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    const reviewerName = currentUser?.fullName || 'Corazon A. Aquino-Valdez';

    setItems((prev) =>
      prev.map((i) =>
        i.id === itemId
          ? {
              ...i,
              reportStatus: 'approved',
              adminRemarks: remarks || 'Report reviewed and approved for publication in CampusFind.',
              adminReviewedAt: new Date().toISOString(),
              adminReviewedBy: reviewerName,
              updatedAt: new Date().toISOString(),
            }
          : i
      )
    );

    // Notify original reporter
    const notif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      userId: item.reporterId,
      title: 'Report Approved by Lost & Found Office',
      message: `Your ${item.type} item report "${item.title}" (${item.trackingNumber}) has been verified and approved.`,
      type: 'report',
      timestamp: new Date().toISOString(),
      read: false,
      relatedItemId: item.id,
    };

    setNotifications((prev) => [notif, ...prev]);
  };

  const rejectReport = (itemId: string, remarks: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    const reviewerName = currentUser?.fullName || 'Corazon A. Aquino-Valdez';

    setItems((prev) =>
      prev.map((i) =>
        i.id === itemId
          ? {
              ...i,
              reportStatus: 'rejected',
              adminRemarks: remarks,
              adminReviewedAt: new Date().toISOString(),
              adminReviewedBy: reviewerName,
              updatedAt: new Date().toISOString(),
            }
          : i
      )
    );

    // Notify reporter
    const notif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      userId: item.reporterId,
      title: 'Report Update: Not Approved',
      message: `Your ${item.type} report "${item.title}" (${item.trackingNumber}) was not approved. Reason: ${remarks}`,
      type: 'report',
      timestamp: new Date().toISOString(),
      read: false,
      relatedItemId: item.id,
    };

    setNotifications((prev) => [notif, ...prev]);
  };

  // MODULE 4: CHECK CLAIMS AND RETURNS
  const submitClaim = (
    itemId: string,
    claimData: {
      dateLost: string;
      lostLocation: string;
      ownershipProofDetails: string;
      proofType: ClaimRecord['proofType'];
      proofDocumentUrl?: string;
    }
  ) => {
    if (!currentUser) {
      return { success: false, error: 'You must be logged in to claim an item.' };
    }

    const item = items.find((i) => i.id === itemId);
    if (!item) {
      return { success: false, error: 'Item record not found.' };
    }

    if (item.itemStatus === 'claimed') {
      return { success: false, error: 'This item has already been claimed and returned.' };
    }

    // Check if user already submitted a pending claim for this item
    const existingClaim = claims.find(
      (c) => c.itemId === itemId && c.claimantId === currentUser.id && c.status === 'pending'
    );
    if (existingClaim) {
      return { success: false, error: 'You already have a pending claim submitted for this item.' };
    }

    const newClaim: ClaimRecord = {
      id: `CLM-${Date.now().toString().slice(-4)}`,
      itemId: item.id,
      itemTrackingNumber: item.trackingNumber,
      itemTitle: item.title,
      itemCategory: item.category,
      itemLocation: item.location,
      claimantId: currentUser.id,
      claimantName: currentUser.fullName,
      claimantEmail: currentUser.email,
      claimantPhone: currentUser.contactNumber,
      claimantUniversityId: currentUser.universityId,
      claimantRole: currentUser.role,
      claimantDepartment: currentUser.departmentOrCollege,
      dateLost: claimData.dateLost,
      lostLocation: claimData.lostLocation,
      ownershipProofDetails: claimData.ownershipProofDetails,
      proofType: claimData.proofType,
      proofDocumentUrl: claimData.proofDocumentUrl,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    setClaims((prev) => [newClaim, ...prev]);

    // Create notifications
    const userNotif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      userId: currentUser.id,
      title: 'Ownership Claim Submitted',
      message: `Your ownership claim for "${item.title}" (${item.trackingNumber}) has been submitted. Please wait for the Lost & Found Office to verify your proof.`,
      type: 'claim',
      timestamp: new Date().toISOString(),
      read: false,
      relatedItemId: item.id,
      relatedClaimId: newClaim.id,
    };

    const adminNotif: NotificationItem = {
      id: `NOTIF-${Date.now() + 1}`,
      userId: 'ADM-001',
      title: 'New Ownership Claim Awaiting Review',
      message: `${currentUser.fullName} (${currentUser.universityId}) submitted an ownership claim for "${item.title}".`,
      type: 'claim',
      timestamp: new Date().toISOString(),
      read: false,
      relatedItemId: item.id,
      relatedClaimId: newClaim.id,
    };

    setNotifications((prev) => [userNotif, adminNotif, ...prev]);

    return { success: true, claim: newClaim };
  };

  const approveClaim = (
    claimId: string,
    handoverInfo: {
      handoverLocation: string;
      releasingOfficer: string;
      notes?: string;
    }
  ) => {
    const claim = claims.find((c) => c.id === claimId);
    if (!claim) return;

    const receiptNumber = `RET-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const returnReceipt: ReturnReceipt = {
      receiptNumber,
      handoverDate: new Date().toISOString(),
      handoverLocation: handoverInfo.handoverLocation,
      releasingOfficer: handoverInfo.releasingOfficer,
      claimantName: claim.claimantName,
      claimantUniversityId: claim.claimantUniversityId,
      claimantContact: claim.claimantPhone,
      remarks: handoverInfo.notes || 'Ownership verified through presentation of matching proof. Item handed over to claimant.',
    };

    // Update claim
    setClaims((prev) =>
      prev.map((c) =>
        c.id === claimId
          ? {
              ...c,
              status: 'approved',
              reviewedAt: new Date().toISOString(),
              reviewedBy: handoverInfo.releasingOfficer,
              adminNotes: handoverInfo.notes || 'Ownership verified. Property release approved.',
              returnReceipt,
            }
          : c
      )
    );

    // Update linked item to claimed and not available
    setItems((prev) =>
      prev.map((i) =>
        i.id === claim.itemId
          ? {
              ...i,
              itemStatus: 'claimed',
              updatedAt: new Date().toISOString(),
            }
          : i
      )
    );

    // Notify claimant
    const notif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      userId: claim.claimantId,
      title: 'Claim Approved - Property Handover Recorded',
      message: `Your claim for "${claim.itemTitle}" has been verified! Official Handover Receipt ${receiptNumber} has been generated. You can view and download your return certificate.`,
      type: 'return',
      timestamp: new Date().toISOString(),
      read: false,
      relatedItemId: claim.itemId,
      relatedClaimId: claim.id,
    };

    setNotifications((prev) => [notif, ...prev]);
  };

  const rejectClaim = (claimId: string, adminNotes: string) => {
    const claim = claims.find((c) => c.id === claimId);
    if (!claim) return;

    const reviewerName = currentUser?.fullName || 'Corazon A. Aquino-Valdez';

    setClaims((prev) =>
      prev.map((c) =>
        c.id === claimId
          ? {
              ...c,
              status: 'rejected',
              reviewedAt: new Date().toISOString(),
              reviewedBy: reviewerName,
              adminNotes,
            }
          : c
      )
    );

    // Notify claimant
    const notif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      userId: claim.claimantId,
      title: 'Claim Decision: Ownership Unverified',
      message: `Your ownership claim for "${claim.itemTitle}" could not be verified. Administrator Remarks: "${adminNotes}"`,
      type: 'claim',
      timestamp: new Date().toISOString(),
      read: false,
      relatedItemId: claim.itemId,
      relatedClaimId: claim.id,
    };

    setNotifications((prev) => [notif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    if (!currentUser) return;
    setNotifications((prev) =>
      prev.map((n) =>
        n.userId === currentUser.id || (currentUser.role === 'admin' && n.userId === 'ADM-001')
          ? { ...n, read: true }
          : n
      )
    );
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.ITEMS);
    localStorage.removeItem(STORAGE_KEYS.CLAIMS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);

    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setItems(INITIAL_ITEMS);
    setClaims(INITIAL_CLAIMS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActiveTab('search');
    setSelectedItemForClaim(null);
    setSelectedClaimForReview(null);
    setViewingReceipt(null);
  };

  return (
    <CampusFindContext.Provider
      value={{
        users,
        currentUser,
        items,
        claims,
        notifications,
        activeTab,
        setActiveTab,
        selectedItemForClaim,
        setSelectedItemForClaim,
        selectedClaimForReview,
        setSelectedClaimForReview,
        viewingReceipt,
        setViewingReceipt,
        login,
        quickLoginAs,
        register,
        logout,
        submitReport,
        approveReport,
        rejectReport,
        submitClaim,
        approveClaim,
        rejectClaim,
        findPossibleMatches,
        markNotificationAsRead,
        clearNotifications,
        resetAllData,
      }}
    >
      {children}
    </CampusFindContext.Provider>
  );
};

export const useCampusFind = () => {
  const context = useContext(CampusFindContext);
  if (!context) {
    throw new Error('useCampusFind must be used within a CampusFindProvider');
  }
  return context;
};
