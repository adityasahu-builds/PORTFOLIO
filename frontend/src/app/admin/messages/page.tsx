"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/components/providers/ToastProvider";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { SearchBar } from "@/components/ui/SearchBar";
import { Skeleton } from "@/components/ui/Skeleton";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  AtSign,
  MessageSquare,
  ExternalLink,
  Inbox,
} from "lucide-react";

interface ContactMessage {
  _id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

interface MessagesResponse {
  data: ContactMessage[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function AdminMessagesPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const LIMIT = 12;

  const { data, isLoading } = useQuery<MessagesResponse>({
    queryKey: ["admin-messages", page, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
      });
      if (search) params.set("search", search);
      const res = await api.get(`/contact?${params}`);
      return res.data?.data;
    },
    placeholderData: (prev) => prev,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/contact/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
      queryClient.invalidateQueries({ queryKey: ["messages-count"] });
      queryClient.invalidateQueries({ queryKey: ["recent-messages"] });
      if (selectedMessage && selectedMessage._id === deleteConfirmId) {
        setSelectedMessage(null);
      }
      setDeleteConfirmId(null);
      toast.success("Message deleted successfully.");
    },
    onError: (err: any) => {
      setDeleteConfirmId(null);
      toast.error(err?.response?.data?.message || "Failed to delete message.");
    },
  });

  const messages = data?.data ?? [];
  const pagination = data?.pagination;
  const totalPages = pagination?.pages ?? 1;

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Inbox className="w-6 h-6 text-[#00d2ff]" />
            Inbox Messages
          </h1>
          <p className="text-slate-500 text-xs font-medium mt-1">
            {pagination?.total ?? 0} total contact {(pagination?.total ?? 0) === 1 ? "message" : "messages"}
          </p>
        </div>
      </div>

      {/* Search */}
      <SearchBar
        value={search}
        onChangeValue={handleSearchChange}
        placeholder="Search messages by sender name, email, or subject..."
        className="max-w-md"
      />

      {/* Main content */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 min-h-[500px]">
        {/* Message List */}
        <div className="xl:col-span-2 space-y-2">
          {isLoading ? (
            [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex gap-3 items-start p-4 rounded-xl bg-white/[0.01] border border-white/[0.04]"
              >
                <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-2/3" />
                  <Skeleton className="h-2.5 w-1/2" />
                  <Skeleton className="h-2.5 w-3/4" />
                </div>
              </div>
            ))
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-white/[0.04] bg-white/[0.01]">
              <Mail className="w-10 h-10 text-slate-700 mb-4" />
              <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">
                {search ? "No messages found" : "Your inbox is empty"}
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <motion.button
                key={msg._id}
                layout
                onClick={() => setSelectedMessage(msg)}
                className={`w-full flex items-start gap-3 p-4 rounded-xl border transition-all text-left cursor-pointer ${
                  selectedMessage?._id === msg._id
                    ? "bg-[#00d2ff]/5 border-[#00d2ff]/20 shadow-[0_0_12px_rgba(0,210,255,0.05)]"
                    : "bg-white/[0.01] border-white/[0.04] hover:bg-white/[0.02] hover:border-white/[0.08]"
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-700/40 to-cyan-700/20 flex items-center justify-center shrink-0 text-xs font-bold text-[#00d2ff] border border-blue-500/10">
                  {msg.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-200 truncate">{msg.fullName}</span>
                    <span className="text-[10px] text-slate-600 shrink-0 font-mono">
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{msg.subject}</p>
                  <p className="text-[10px] text-slate-650 truncate mt-0.5 leading-relaxed">{msg.message}</p>
                </div>
              </motion.button>
            ))
          )}
        </div>

        {/* Message Detail Panel */}
        <div className="xl:col-span-3">
          <AnimatePresence mode="wait">
            {selectedMessage ? (
              <motion.div
                key={selectedMessage._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="h-full rounded-2xl bg-white/[0.02] border border-white/[0.05] p-6 flex flex-col gap-5 backdrop-blur-sm"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-700/40 to-cyan-700/20 flex items-center justify-center shrink-0 text-base font-bold text-[#00d2ff] border border-blue-500/10">
                      {selectedMessage.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">
                        {selectedMessage.fullName}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5 font-mono">
                        <AtSign className="w-3 h-3 text-slate-500" />
                        {selectedMessage.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                      className="p-2 rounded-lg text-slate-400 hover:text-[#00d2ff] hover:bg-[#00d2ff]/10 transition-colors"
                      title="Reply via email"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-950/20"
                      onClick={() => setDeleteConfirmId(selectedMessage._id)}
                      title="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 text-slate-500 hover:text-white hover:bg-white/5"
                      onClick={() => setSelectedMessage(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="border-t border-white/[0.04]" />

                {/* Meta info */}
                <div className="grid grid-cols-2 gap-3 select-none">
                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-650" />
                    <span className="text-slate-400 font-semibold truncate font-sans uppercase tracking-wider">
                      {selectedMessage.subject}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 justify-end">
                    <Clock className="w-3.5 h-3.5 text-slate-650" />
                    <span className="font-mono">
                      {new Date(selectedMessage.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                {/* Message body */}
                <div className="flex-1 rounded-xl bg-black/40 border border-white/[0.04] p-5">
                  <p className="text-slate-350 text-xs leading-relaxed whitespace-pre-wrap font-sans">
                    {selectedMessage.message}
                  </p>
                </div>

                {/* Reply button */}
                <Button
                  onClick={() => window.open(`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`)}
                  icon={ExternalLink}
                  className="w-full text-xs font-semibold"
                >
                  Reply via Email
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full rounded-2xl bg-white/[0.01] border border-white/[0.04] border-dashed flex flex-col items-center justify-center gap-3 min-h-[400px] select-none"
              >
                <Mail className="w-8 h-8 text-slate-700" />
                <p className="text-slate-600 text-xs font-mono uppercase tracking-widest">Select a message to view details</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4 select-none">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </Button>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 tabular-nums">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}

      {/* Delete Confirm Modal */}
      <Dialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Message"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-400 leading-relaxed">
            Are you sure you want to permanently delete this message? This action is irreversible.
          </p>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              isLoading={deleteMutation.isPending}
              onClick={() => deleteConfirmId && deleteMutation.mutate(deleteConfirmId)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
