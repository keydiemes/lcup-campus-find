import React from 'react';
import { useCampusFind } from '../context/CampusFindContext';
import { ItemRecord, ClaimRecord, ReturnReceipt } from '../types';
import { AdminOverviewPage } from './admin/AdminOverviewPage';
import { AdminItemReportsPage } from './admin/AdminItemReportsPage';
import { AdminClaimsVerificationPage } from './admin/AdminClaimsVerificationPage';
import { AdminHandoverArchivePage } from './admin/AdminHandoverArchivePage';
import { AdminSummaryReportsPage } from './admin/AdminSummaryReportsPage';
import { AdminAccountsPage } from './admin/AdminAccountsPage';

interface AdminPortalProps {
  onSelectItem: (item: ItemRecord) => void;
  onSelectClaim: (claim: ClaimRecord) => void;
  onViewReceipt: (claim: ClaimRecord, receipt: ReturnReceipt) => void;
  onOpenSummaryModal: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onSelectItem,
  onSelectClaim,
  onViewReceipt,
  onOpenSummaryModal,
}) => {
  const { activeTab } = useCampusFind();

  // Route to the corresponding dedicated module page
  switch (activeTab) {
    case 'admin_reports':
      return <AdminItemReportsPage onSelectItem={onSelectItem} />;

    case 'admin_claims':
      return <AdminClaimsVerificationPage onSelectClaim={onSelectClaim} />;

    case 'admin_returns':
      return (
        <AdminHandoverArchivePage
          onViewReceipt={onViewReceipt}
          onSelectItem={onSelectItem}
          onOpenSummaryModal={onOpenSummaryModal}
        />
      );

    case 'admin_analytics':
      return <AdminSummaryReportsPage onOpenSummaryModal={onOpenSummaryModal} />;

    case 'admin_accounts':
      return (
        <AdminAccountsPage
          onSelectItem={onSelectItem}
          onSelectClaim={onSelectClaim}
        />
      );

    case 'admin_overview':
    default:
      return (
        <AdminOverviewPage
          onSelectItem={onSelectItem}
          onSelectClaim={onSelectClaim}
          onViewReceipt={onViewReceipt}
          onOpenSummaryModal={onOpenSummaryModal}
        />
      );
  }
};
