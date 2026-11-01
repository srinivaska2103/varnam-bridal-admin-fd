import { apiClient } from './apiClient';

export const adminApi = {
  // OTP-based Super Admin Authentication
  requestOtp: (email) => apiClient.post('/admin/auth/request-otp', { email }),
  verifyOtp: (email, otp) => apiClient.post('/admin/auth/verify-otp', { email, otp }),
  getMe: () => apiClient.get('/auth/me'),

  // 1. Dashboard Overview
  getDashboard: () => apiClient.get('/admin/dashboard'),

  // 2. Revenue Analytics
  getRevenue: (params = {}) => apiClient.get('/admin/revenue', { params }),

  // 3. Accounts Management
  getAccounts: (params = {}) => apiClient.get('/admin/accounts', { params }),
  getAccountById: (id) => apiClient.get(`/admin/accounts/${id}`),
  updateAccountStatus: (id, data) => apiClient.patch(`/admin/accounts/${id}/status`, data),

  // 4. Subscriptions Management
  getSubscriptions: (params = {}) => apiClient.get('/admin/subscriptions', { params }),

  // 5. Payments Management (Razorpay Verified Orders)
  getPayments: (params = {}) => apiClient.get('/admin/payments', { params }),

  // 6. Plans Configuration
  getPlans: () => apiClient.get('/admin/plans'),

  // 7. Premium Sales Enquiries
  getPremiumEnquiries: (params = {}) => apiClient.get('/admin/enquiries', { params }),
  updatePremiumEnquiry: (id, data) => apiClient.patch(`/admin/enquiries/${id}`, data),

  // 8. Reports & Exports
  getReports: (params = {}) => apiClient.get('/admin/reports', { params }),
  exportReportCsvUrl: (type, params = {}) => {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
    const query = new URLSearchParams({ type, format: 'csv', ...params }).toString();
    return `${baseURL}/admin/reports?${query}`;
  },

  // 9. Platform Activity & Audit Logs
  getActivityLogs: (params = {}) => apiClient.get('/admin/activity', { params }),

  // 10. WhatsApp Pay-As-You-Use Billing & Settlements
  getWhatsAppBillingOverview: () => apiClient.get('/whatsapp-billing/admin/overview'),
  getWhatsAppStudios: () => apiClient.get('/whatsapp-billing/admin/studios'),
  getWhatsAppCampaignUsages: () => apiClient.get('/whatsapp-billing/admin/usages'),
  getWhatsAppPricingRules: (countryCode = 'IN') => apiClient.get(`/whatsapp-billing/pricing-rules?country_code=${countryCode}`),
  updateWhatsAppBillingConfig: (data) => apiClient.put('/whatsapp-billing/config', data),
  upsertWhatsAppPricingRule: (data) => apiClient.post('/whatsapp-billing/pricing-rules', data),
  getMetaInvoicesAndSettlements: () => apiClient.get('/whatsapp-billing/admin/meta-invoices'),
  recordMetaInvoice: (data) => apiClient.post('/whatsapp-billing/admin/meta-invoices', data),
  recordMetaSettlement: (data) => apiClient.post('/whatsapp-billing/admin/meta-settlements', data),

  // 11. Help Center & Support Ticket Management (Platform Admin)
  getSupportAnalytics: () => apiClient.get('/admin/support/analytics'),
  getSupportTickets: (params = {}) => apiClient.get('/admin/support/tickets', { params }),
  getSupportTicketById: (id) => apiClient.get(`/admin/support/tickets/${id}`),
  updateSupportTicket: (id, data) => apiClient.patch(`/admin/support/tickets/${id}`, data),
  addSupportTicketReply: (id, data) => apiClient.post(`/admin/support/tickets/${id}/messages`, data),
  addSupportTicketInternalNote: (id, data) => apiClient.post(`/admin/support/tickets/${id}/internal-notes`, data),

  // Knowledge Base Articles Management
  getSupportArticles: (params = {}) => apiClient.get('/support/articles', { params }),
  createSupportArticle: (data) => apiClient.post('/admin/support/articles', data),
  updateSupportArticle: (id, data) => apiClient.patch(`/admin/support/articles/${id}`, data),
  deleteSupportArticle: (id) => apiClient.delete(`/admin/support/articles/${id}`),
  getSupportCategories: () => apiClient.get('/support/categories'),
};
