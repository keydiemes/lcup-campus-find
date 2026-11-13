export type UserRole = 'student' | 'faculty' | 'staff' | 'admin';

export interface User {
  id: string;
  email: string;
  password?: string;
  fullName: string;
  role: UserRole;
  universityId: string; // e.g. 2023-10492 or FAC-2018-042
  departmentOrCollege: string; // e.g. College of Engineering & Technology
  contactNumber: string;
  avatarUrl?: string;
  createdAt: string;
}

export type ItemType = 'lost' | 'found';

export type ItemCategory =
  | 'electronics'
  | 'bags_wallets'
  | 'books_documents'
  | 'ids_cards'
  | 'keys_accessories'
  | 'clothing_uniforms'
  | 'personal_items'
  | 'others';

export type ReportStatus = 'pending' | 'approved' | 'rejected';
export type ItemStatus = 'available' | 'claimed' | 'returned';

export interface ItemRecord {
  id: string;
  trackingNumber: string; // e.g. LCUP-F-2026-001
  type: ItemType;
  title: string;
  category: ItemCategory;
  description: string;
  distinguishingFeatures: string;
  location: string; // Campus venue
  dateOccurred: string; // YYYY-MM-DD
  timeOccurred: string;
  imageUrl?: string;
  reporterId: string;
  reporterName: string;
  reporterRole: UserRole;
  reporterContact: string;
  storageLocation?: string; // e.g. "Turned over to L&F Office - Room 102"
  reportStatus: ReportStatus;
  adminRemarks?: string;
  adminReviewedAt?: string;
  adminReviewedBy?: string;
  itemStatus: ItemStatus;
  createdAt: string;
  updatedAt: string;
}

export type ClaimStatus = 'pending' | 'approved' | 'rejected';
export type ProofType =
  | 'serial_number'
  | 'receipt_invoice'
  | 'matching_photo'
  | 'lockscreen_passcode'
  | 'bag_contents'
  | 'other';

export interface ReturnReceipt {
  receiptNumber: string;
  handoverDate: string;
  handoverLocation: string;
  releasingOfficer: string;
  claimantName: string;
  claimantUniversityId: string;
  claimantContact: string;
  remarks?: string;
}

export interface ClaimRecord {
  id: string;
  itemId: string;
  itemTrackingNumber: string;
  itemTitle: string;
  itemCategory: ItemCategory;
  itemLocation: string;
  claimantId: string;
  claimantName: string;
  claimantEmail: string;
  claimantPhone: string;
  claimantUniversityId: string;
  claimantRole: UserRole;
  claimantDepartment: string;
  dateLost: string;
  lostLocation: string;
  ownershipProofDetails: string;
  proofType: ProofType;
  proofDocumentUrl?: string;
  status: ClaimStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  adminNotes?: string;
  returnReceipt?: ReturnReceipt;
}

export interface NotificationItem {
  id: string;
  userId: string; // or 'all_admin'
  title: string;
  message: string;
  type: 'report' | 'claim' | 'return' | 'system';
  timestamp: string;
  read: boolean;
  relatedItemId?: string;
  relatedClaimId?: string;
}
