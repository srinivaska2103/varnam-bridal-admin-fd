'use client';

import React, { useState } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/services/adminApi';
import { ModernDropdown } from '@/components/ui/ModernDropdown';
import {
  LifeBuoy,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  User,
  ShieldCheck,
  Send,
  Eye,
  FileText,
  Lock,
  PlusCircle,
  RefreshCw,
  X,
  Paperclip,
  Building2,
  SlidersHorizontal,
  FolderOpen,
  HelpCircle,
  Tag,
  Trash2,
  ExternalLink,
} from 'lucide-react';

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'OPEN', label: 'Open', badgeColor: 'bg-blue-500' },
  { value: 'IN_PROGRESS', label: 'In Progress', badgeColor: 'bg-amber-500' },
  { value: 'WAITING_FOR_USER', label: 'Waiting For User', badgeColor: 'bg-purple-500' },
  { value: 'RESOLVED', label: 'Resolved', badgeColor: 'bg-emerald-500' },
  { value: 'CLOSED', label: 'Closed', badgeColor: 'bg-stone-500' },
];

const STATUS_UPDATE_OPTIONS = [
  { value: 'OPEN', label: 'Open', badgeColor: 'bg-blue-500' },
  { value: 'IN_PROGRESS', label: 'In Progress', badgeColor: 'bg-amber-500' },
  { value: 'WAITING_FOR_USER', label: 'Waiting For User', badgeColor: 'bg-purple-500' },
  { value: 'RESOLVED', label: 'Resolved', badgeColor: 'bg-emerald-500' },
  { value: 'CLOSED', label: 'Closed', badgeColor: 'bg-stone-500' },
];

const PRIORITY_FILTER_OPTIONS = [
  { value: '', label: 'All Priorities' },
  { value: 'LOW', label: 'Low', badgeColor: 'bg-stone-400' },
  { value: 'MEDIUM', label: 'Medium', badgeColor: 'bg-amber-500' },
  { value: 'HIGH', label: 'High', badgeColor: 'bg-orange-600' },
  { value: 'CRITICAL', label: 'Critical', badgeColor: 'bg-rose-600' },
];

const PRIORITY_UPDATE_OPTIONS = [
  { value: 'LOW', label: 'Low', badgeColor: 'bg-stone-400' },
  { value: 'MEDIUM', label: 'Medium', badgeColor: 'bg-amber-500' },
  { value: 'HIGH', label: 'High', badgeColor: 'bg-orange-600' },
  { value: 'CRITICAL', label: 'Critical', badgeColor: 'bg-rose-600' },
];

export default function AdminSupportManagementPage({ onOpenMobileMenu }) {
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState('tickets'); // 'tickets' | 'articles' | 'config'
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);

  // Selected ticket for modal details / reply
  const [activeTicketId, setActiveTicketId] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [statusToUpdate, setStatusToUpdate] = useState('');
  const [priorityToUpdate, setPriorityToUpdate] = useState('');

  // Article Modal State
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [articleForm, setArticleForm] = useState({
    category_id: '',
    title: '',
    short_description: '',
    content: '',
    keywords: '',
    display_order: 0,
    is_published: true,
  });

  // 1. Fetch Analytics
  const { data: analyticsRes, refetch: refetchAnalytics } = useQuery({
    queryKey: ['admin-support-analytics'],
    queryFn: () => adminApi.getSupportAnalytics(),
    refetchInterval: 20000,
  });
  const analytics = analyticsRes?.data || {
    total: 0,
    open: 0,
    inProgress: 0,
    waitingForUser: 0,
    resolved: 0,
    closed: 0,
    criticalHighPending: 0,
  };

  // 2. Fetch Tickets Table
  const { data: ticketsRes, isLoading: loadingTickets, refetch: refetchTickets } = useQuery({
    queryKey: ['admin-support-tickets', search, statusFilter, priorityFilter, categoryFilter, page],
    queryFn: () =>
      adminApi.getSupportTickets({
        search: search || undefined,
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        category: categoryFilter || undefined,
        page,
        limit: 20,
      }),
    refetchInterval: 15000,
  });
  const tickets = ticketsRes?.data?.tickets || ticketsRes?.data || [];
  const meta = ticketsRes?.data?.pagination || ticketsRes?.meta || { total: 0, totalPages: 1, page: 1 };

  // 3. Fetch Categories & Articles
  const { data: categoriesRes } = useQuery({
    queryKey: ['admin-support-categories'],
    queryFn: () => adminApi.getSupportCategories(),
  });
  const categories = categoriesRes?.data || [];

  const { data: articlesRes, refetch: refetchArticles, isLoading: loadingArticles } = useQuery({
    queryKey: ['admin-support-articles'],
    queryFn: () => adminApi.getSupportArticles(),
    enabled: activeTab === 'articles',
  });
  const articles = articlesRes?.data || [];

  // 4. Fetch Active Ticket Details
  const { data: activeTicketRes, refetch: refetchActiveTicket } = useQuery({
    queryKey: ['admin-support-ticket-detail', activeTicketId],
    queryFn: () => adminApi.getSupportTicketById(activeTicketId),
    enabled: !!activeTicketId,
  });
  const activeTicket = activeTicketRes?.data;

  // Mutations
  const updateTicketMutation = useMutation({
    mutationFn: ({ id, payload }) => adminApi.updateSupportTicket(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-support-tickets']);
      queryClient.invalidateQueries(['admin-support-analytics']);
      if (activeTicketId) refetchActiveTicket();
    },
  });

  const replyMutation = useMutation({
    mutationFn: ({ id, message, isInternal }) =>
      isInternal
        ? adminApi.addSupportTicketInternalNote(id, { message })
        : adminApi.addSupportTicketReply(id, { message }),
    onSuccess: () => {
      setReplyMessage('');
      queryClient.invalidateQueries({ queryKey: ['admin-support-tickets'] });
      queryClient.invalidateQueries({ queryKey: ['admin-support-analytics'] });
      queryClient.invalidateQueries({ queryKey: ['admin-support-ticket-detail', activeTicketId] });
      if (activeTicketId) refetchActiveTicket();
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to submit reply';
      alert(`Could not send reply: ${msg}`);
    },
  });

  const createArticleMutation = useMutation({
    mutationFn: (payload) => adminApi.createSupportArticle(payload),
    onSuccess: () => {
      setIsArticleModalOpen(false);
      setArticleForm({
        category_id: '',
        title: '',
        short_description: '',
        content: '',
        keywords: '',
        display_order: 0,
        is_published: true,
      });
      refetchArticles();
    },
  });

  const deleteArticleMutation = useMutation({
    mutationFn: (id) => adminApi.deleteSupportArticle(id),
    onSuccess: () => {
      refetchArticles();
    },
  });

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !activeTicketId) return;
    replyMutation.mutate({
      id: activeTicketId,
      message: replyMessage,
      isInternal: isInternalNote,
    });
  };

  const handleArticleSubmit = (e) => {
    e.preventDefault();
    const keywordsArr = articleForm.keywords
      ? articleForm.keywords.split(',').map((k) => k.trim()).filter(Boolean)
      : [];
    createArticleMutation.mutate({
      ...articleForm,
      keywords: keywordsArr,
      display_order: Number(articleForm.display_order) || 0,
    });
  };

  return (
    <div className="flex flex-col min-h-full">
      <AdminHeader
        title="Ticket & Support Data Management"
        subtitle="Manage customer support tickets, platform communications, and help knowledge base"
        onOpenMobileMenu={onOpenMobileMenu}
      />

      <div className="p-3 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Top Control Bar with Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('tickets')}
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                activeTab === 'tickets'
                  ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <LifeBuoy className="w-4 h-4" />
              <span>Studio Tickets ({analytics.total})</span>
            </button>

            <button
              onClick={() => setActiveTab('articles')}
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                activeTab === 'articles'
                  ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Knowledge Base & Guides</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'articles' && (
              <button
                onClick={() => setIsArticleModalOpen(true)}
                className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>New Guide Article</span>
              </button>
            )}
            <button
              onClick={() => {
                refetchAnalytics();
                refetchTickets();
                if (activeTab === 'articles') refetchArticles();
              }}
              className="px-3.5 py-2 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Analytics Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm space-y-1">
            <span className="text-[11px] font-semibold text-stone-500 uppercase">Total Tickets</span>
            <div className="text-2xl font-black text-stone-900">{analytics.total}</div>
          </div>

          <div className="bg-white border border-blue-200 rounded-2xl p-4 shadow-sm space-y-1">
            <span className="text-[11px] font-semibold text-blue-600 uppercase">Open</span>
            <div className="text-2xl font-black text-blue-600">{analytics.open}</div>
          </div>

          <div className="bg-white border border-amber-200 rounded-2xl p-4 shadow-sm space-y-1">
            <span className="text-[11px] font-semibold text-amber-600 uppercase">In Progress</span>
            <div className="text-2xl font-black text-amber-600">{analytics.inProgress}</div>
          </div>

          <div className="bg-white border border-purple-200 rounded-2xl p-4 shadow-sm space-y-1">
            <span className="text-[11px] font-semibold text-purple-600 uppercase">Waiting User</span>
            <div className="text-2xl font-black text-purple-600">{analytics.waitingForUser}</div>
          </div>

          <div className="bg-white border border-emerald-200 rounded-2xl p-4 shadow-sm space-y-1">
            <span className="text-[11px] font-semibold text-emerald-600 uppercase">Resolved</span>
            <div className="text-2xl font-black text-emerald-600">{analytics.resolved}</div>
          </div>

          <div className="bg-white border border-rose-200 rounded-2xl p-4 shadow-sm space-y-1">
            <span className="text-[11px] font-semibold text-rose-600 uppercase">Critical / High</span>
            <div className="text-2xl font-black text-rose-600">{analytics.criticalHighPending}</div>
          </div>
        </div>

        {/* TAB 1: TICKETS VIEW */}
        {activeTab === 'tickets' && (
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search ticket #, subject, studio, email..."
                  className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                <div className="w-full sm:w-44">
                  <ModernDropdown
                    value={statusFilter}
                    onChange={(val) => setStatusFilter(val)}
                    options={STATUS_FILTER_OPTIONS}
                    placeholder="All Statuses"
                  />
                </div>

                <div className="w-full sm:w-44">
                  <ModernDropdown
                    value={priorityFilter}
                    onChange={(val) => setPriorityFilter(val)}
                    options={PRIORITY_FILTER_OPTIONS}
                    placeholder="All Priorities"
                  />
                </div>
              </div>
            </div>

            {/* Tickets Table */}
            <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4">Ticket Number</th>
                      <th className="py-3.5 px-4">Studio / Submitter</th>
                      <th className="py-3.5 px-4">Subject & Category</th>
                      <th className="py-3.5 px-4">Priority</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Created Date</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {loadingTickets ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-stone-400">
                          Loading support tickets...
                        </td>
                      </tr>
                    ) : tickets.length > 0 ? (
                      tickets.map((t) => (
                        <tr key={t.id} className="hover:bg-stone-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-orange-600">
                            #{t.ticket_number}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-stone-900">{t.businesses?.name || 'Studio'}</div>
                            <div className="text-[11px] text-stone-500">
                              {t.users?.name} &bull; {t.users?.email}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 max-w-xs">
                            <div className="font-semibold text-stone-800 truncate">{t.subject}</div>
                            <div className="text-[11px] text-stone-500">
                              {t.category} ({t.related_module || 'General'})
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                t.priority === 'CRITICAL'
                                  ? 'bg-rose-100 text-rose-700 border border-rose-200'
                                  : t.priority === 'HIGH'
                                  ? 'bg-orange-100 text-orange-700 border border-orange-200'
                                  : 'bg-stone-100 text-stone-600'
                              }`}
                            >
                              {t.priority}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                t.status === 'RESOLVED' || t.status === 'CLOSED'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : t.status === 'WAITING_FOR_USER'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-blue-50 text-blue-700 border-blue-200'
                              }`}
                            >
                              {t.status.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-stone-500 whitespace-nowrap">
                            {new Date(t.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => {
                                setActiveTicketId(t.id);
                                setStatusToUpdate(t.status);
                                setPriorityToUpdate(t.priority);
                              }}
                              className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-bold text-xs transition-all shadow-sm"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-stone-400">
                          No support tickets found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ARTICLES VIEW */}
        {activeTab === 'articles' && (
          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">Knowledge Base & Tutorial Guides</h3>
                <p className="text-xs text-stone-500">Guides displayed across the 9 studio help categories</p>
              </div>
              <span className="text-xs font-semibold text-stone-400">{articles.length} Published Articles</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Title & Slug</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Short Description</th>
                    <th className="py-3.5 px-4">Helpful / Views</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {loadingArticles ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-stone-400">
                        Loading articles...
                      </td>
                    </tr>
                  ) : articles.length > 0 ? (
                    articles.map((art) => (
                      <tr key={art.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-stone-900">{art.title}</div>
                          <div className="font-mono text-[11px] text-stone-400">/{art.slug}</div>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-stone-600">
                          {art.help_categories?.name || 'General'}
                        </td>
                        <td className="py-3.5 px-4 max-w-sm text-stone-600 truncate">
                          {art.short_description}
                        </td>
                        <td className="py-3.5 px-4 text-stone-500">
                          <span className="text-emerald-600 font-bold">+{art.helpful_count || 0}</span> / {art.view_count || 0} views
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              art.is_published
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-stone-100 text-stone-500'
                            }`}
                          >
                            {art.is_published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                if (confirm(`Delete article "${art.title}"?`)) {
                                  deleteArticleMutation.mutate(art.id);
                                }
                              }}
                              className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete Article"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-stone-400">
                        No articles found. Click &quot;New Guide Article&quot; to publish one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Ticket Details & Response Modal */}
      {activeTicketId && activeTicket && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/80">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold text-orange-600 bg-orange-100 border border-orange-200 px-2.5 py-1 rounded-lg">
                  #{activeTicket.ticket_number}
                </span>
                <div>
                  <h3 className="font-bold text-stone-900 text-base truncate max-w-md">
                    {activeTicket.subject}
                  </h3>
                  <div className="text-xs text-stone-500">
                    {activeTicket.businesses?.name} &bull; {activeTicket.users?.email}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveTicketId(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column: Messages Thread & Reply */}
              <div className="md:col-span-2 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Conversation & Internal Notes
                </h4>

                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
                  {activeTicket.support_ticket_messages?.map((msg) => {
                    const isInternal = msg.is_internal_note;
                    const isAdmin = msg.sender_type === 'ADMIN';

                    return (
                      <div
                        key={msg.id}
                        className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                          isInternal
                            ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                            : isAdmin
                            ? 'bg-orange-50/50 border-orange-200 text-stone-800'
                            : 'bg-stone-50 border-stone-200 text-stone-800'
                        }`}
                      >
                        <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-black/5 text-[10px]">
                          <span className="font-bold">
                            {isInternal ? (
                              <span className="text-amber-700 flex items-center gap-1">
                                <Lock className="w-3 h-3" /> INTERNAL ADMIN NOTE
                              </span>
                            ) : isAdmin ? (
                              'VARNAM SUPPORT TEAM'
                            ) : (
                              `${msg.users?.name || 'Studio Client'}`
                            )}
                          </span>
                          <span className="text-stone-400">
                            {new Date(msg.created_at).toLocaleString()}
                          </span>
                        </div>
                        <div className="whitespace-pre-wrap">{msg.message}</div>

                        {/* Attachments */}
                        {msg.support_ticket_attachments && msg.support_ticket_attachments.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-black/5 flex flex-wrap gap-2">
                            {msg.support_ticket_attachments.map((att) => (
                              <a
                                key={att.id}
                                href={att.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-stone-200 rounded-md text-[11px] text-orange-600 hover:underline"
                              >
                                <Paperclip className="w-3 h-3" />
                                <span className="truncate max-w-[120px]">{att.file_name}</span>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Reply Form */}
                <form onSubmit={handleReplySubmit} className="pt-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-700">New Response</span>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-amber-600">
                      <input
                        type="checkbox"
                        checked={isInternalNote}
                        onChange={(e) => setIsInternalNote(e.target.checked)}
                        className="rounded border-stone-300 text-amber-500 focus:ring-0"
                      />
                      <span>Internal Note (Hidden from Studio)</span>
                    </label>
                  </div>

                  <textarea
                    rows={3}
                    required
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder={
                      isInternalNote
                        ? 'Write internal staff note regarding logs, database, or next steps...'
                        : 'Write message to send to the studio client via email & portal...'
                    }
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-orange-500 focus:bg-white"
                  />

                  <div className="flex justify-end gap-2">
                    <button
                      type="submit"
                      disabled={replyMutation.isPending || !replyMessage.trim()}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                        isInternalNote
                          ? 'bg-amber-600 hover:bg-amber-500 text-white'
                          : 'bg-orange-600 hover:bg-orange-500 text-white'
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isInternalNote ? 'Save Internal Note' : 'Send Reply to Client'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Column: Status & Assignment Controls */}
              <div className="space-y-4 border-t md:border-t-0 md:border-l border-stone-100 pt-4 md:pt-0 md:pl-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Ticket Controls
                </h4>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1.5">
                      Update Status
                    </label>
                    <ModernDropdown
                      value={statusToUpdate}
                      onChange={(val) => {
                        setStatusToUpdate(val);
                        updateTicketMutation.mutate({
                          id: activeTicket.id,
                          payload: { status: val },
                        });
                      }}
                      options={STATUS_UPDATE_OPTIONS}
                      placeholder="Select status..."
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1.5">
                      Priority Level
                    </label>
                    <ModernDropdown
                      value={priorityToUpdate}
                      onChange={(val) => {
                        setPriorityToUpdate(val);
                        updateTicketMutation.mutate({
                          id: activeTicket.id,
                          payload: { priority: val },
                        });
                      }}
                      options={PRIORITY_UPDATE_OPTIONS}
                      placeholder="Select priority..."
                    />
                  </div>

                  <div className="pt-3 border-t border-stone-100 space-y-2 text-[11px]">
                    <div>
                      <span className="text-stone-400 block">Studio Business:</span>
                      <span className="font-bold text-stone-800">{activeTicket.businesses?.name}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block">Contact Phone:</span>
                      <span className="font-mono text-stone-700">
                        {activeTicket.users?.phone || activeTicket.businesses?.business_phone || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400 block">Category:</span>
                      <span className="font-semibold text-stone-700">{activeTicket.category}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block">Related Module:</span>
                      <span className="font-semibold text-stone-700">
                        {activeTicket.related_module || 'General'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Article Modal */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-bold text-stone-900 text-base">Create New Knowledge Base Article</h3>
              <button
                onClick={() => setIsArticleModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleArticleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1.5">Category</label>
                <ModernDropdown
                  value={articleForm.category_id}
                  onChange={(val) => setArticleForm({ ...articleForm, category_id: val })}
                  options={categories.map((c) => ({
                    value: c.id,
                    label: c.name,
                    badgeColor: 'bg-orange-500',
                  }))}
                  placeholder="Select Help Category..."
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Article Title</label>
                <input
                  type="text"
                  required
                  value={articleForm.title}
                  onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                  placeholder="e.g. How to Connect Custom Studio Domain"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Short Description</label>
                <input
                  type="text"
                  required
                  value={articleForm.short_description}
                  onChange={(e) =>
                    setArticleForm({ ...articleForm, short_description: e.target.value })
                  }
                  placeholder="Brief 1-sentence overview"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Step-by-step Content</label>
                <textarea
                  rows={6}
                  required
                  value={articleForm.content}
                  onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                  placeholder="Step 1: Navigate to settings... Step 2: Enter domain..."
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl font-sans"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Keywords (comma separated)
                </label>
                <input
                  type="text"
                  value={articleForm.keywords}
                  onChange={(e) => setArticleForm({ ...articleForm, keywords: e.target.value })}
                  placeholder="domain, dns, ssl, website"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsArticleModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createArticleMutation.isPending}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold"
                >
                  {createArticleMutation.isPending ? 'Publishing...' : 'Publish Guide Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

