"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  X,
  AlertCircle,
  CheckCircle,
  Award,
  Calendar,
  ExternalLink,
  Link as LinkIcon,
  Star,
  Tag,
} from "lucide-react";
import MediaPicker from "@/components/ui/MediaPicker";

interface Certificate {
  _id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  doesNotExpire: boolean;
  credentialId?: string;
  credentialUrl?: string;
  imageUrl?: string;
  skills: string[];
  featured: boolean;
  displayOrder: number;
  status: "Active" | "Inactive";
}

type CertificateFormData = Omit<Certificate, "_id">;

const defaultForm: CertificateFormData = {
  title: "",
  issuer: "",
  issueDate: "",
  expiryDate: "",
  doesNotExpire: false,
  credentialId: "",
  credentialUrl: "",
  imageUrl: "",
  skills: [],
  featured: false,
  displayOrder: 0,
  status: "Active",
};

export default function AdminCertificatesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCertificate, setActiveCertificate] = useState<Certificate | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [form, setForm] = useState<CertificateFormData>(defaultForm);
  const [skillInput, setSkillInput] = useState("");

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const { data: certificates = [], isLoading } = useQuery<Certificate[]>({
    queryKey: ["admin-certificates"],
    queryFn: async () => {
      const res = await api.get("/certificates");
      return res.data?.data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: CertificateFormData) => api.post("/certificates", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-certificates"] });
      queryClient.invalidateQueries({ queryKey: ["certificates-count"] });
      closeModal();
      showNotification("success", "Certificate created successfully.");
    },
    onError: (err: any) =>
      showNotification("error", err?.response?.data?.message || "Failed to create certificate."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CertificateFormData }) =>
      api.put(`/certificates/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-certificates"] });
      closeModal();
      showNotification("success", "Certificate updated successfully.");
    },
    onError: (err: any) =>
      showNotification("error", err?.response?.data?.message || "Failed to update certificate."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/certificates/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-certificates"] });
      queryClient.invalidateQueries({ queryKey: ["certificates-count"] });
      setDeleteConfirmId(null);
      showNotification("success", "Certificate deleted successfully.");
    },
    onError: (err: any) => {
      setDeleteConfirmId(null);
      showNotification("error", err?.response?.data?.message || "Failed to delete certificate.");
    },
  });

  const openCreate = () => {
    setActiveCertificate(null);
    setForm(defaultForm);
    setSkillInput("");
    setModalOpen(true);
  };

  const openEdit = (cert: Certificate) => {
    setActiveCertificate(cert);
    setForm({
      title: cert.title,
      issuer: cert.issuer,
      issueDate: cert.issueDate,
      expiryDate: cert.expiryDate || "",
      doesNotExpire: cert.doesNotExpire,
      credentialId: cert.credentialId || "",
      credentialUrl: cert.credentialUrl || "",
      imageUrl: cert.imageUrl || "",
      skills: cert.skills || [],
      featured: cert.featured,
      displayOrder: cert.displayOrder,
      status: cert.status,
    });
    setSkillInput("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveCertificate(null);
    setForm(defaultForm);
    setSkillInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeCertificate) {
      updateMutation.mutate({ id: activeCertificate._id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !form.skills.includes(trimmed)) {
      setForm((f) => ({ ...f, skills: [...f.skills, trimmed] }));
    }
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    setForm((f) => ({ ...f, skills: f.skills.filter((s) => s !== skill) }));
  };

  const filtered = certificates.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.issuer.toLowerCase().includes(search.toLowerCase())
  );

  const isMutating = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-xl text-sm font-medium ${
              notification.type === "success"
                ? "bg-emerald-950/80 border-emerald-700/40 text-emerald-300"
                : "bg-rose-950/80 border-rose-700/40 text-rose-300"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Award className="w-5 h-5 text-amber-400" />
            Certificates
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {filtered.length} {filtered.length === 1 ? "certificate" : "certificates"}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-[#00d2ff] text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-blue-900/30"
        >
          <Plus className="w-4 h-4" />
          Add Certificate
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2.5 max-w-sm">
        <Search className="w-4 h-4 text-slate-500 shrink-0" />
        <input
          type="text"
          placeholder="Search certificates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 bg-[#0a0a0f]/60 border border-white/[0.06] rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:border-[#00d2ff]/30 transition-all"
        />
      </div>

      {/* Certificates Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl bg-white/[0.02] border border-white/[0.04] p-5 space-y-3"
            >
              <div className="h-4 bg-white/[0.04] rounded w-3/4" />
              <div className="h-3 bg-white/[0.03] rounded w-1/2" />
              <div className="h-3 bg-white/[0.03] rounded w-2/3" />
              <div className="flex gap-2 mt-2">
                <div className="h-5 w-14 bg-white/[0.03] rounded-full" />
                <div className="h-5 w-14 bg-white/[0.03] rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Award className="w-10 h-10 text-slate-700" />
          <p className="text-slate-500 text-sm font-mono uppercase tracking-widest">
            {search ? "No certificates found" : "No certificates yet"}
          </p>
          {!search && (
            <button
              onClick={openCreate}
              className="mt-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-slate-300 hover:text-white transition-colors"
            >
              Add your first certificate
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((cert, idx) => (
              <motion.div
                key={cert._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.04, duration: 0.35 }}
                className="group relative rounded-2xl bg-white/[0.02] border border-white/[0.05] p-5 flex flex-col gap-3 hover:border-white/[0.10] hover:bg-white/[0.03] transition-all"
              >
                {/* Featured badge */}
                {cert.featured && (
                  <div className="absolute top-3 right-3">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  </div>
                )}

                {/* Status pill */}
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-widest border ${
                      cert.status === "Active"
                        ? "text-emerald-400 bg-emerald-950/30 border-emerald-800/30"
                        : "text-slate-500 bg-slate-900/30 border-slate-800/30"
                    }`}
                  >
                    {cert.status}
                  </span>
                </div>

                {/* Title & Issuer */}
                <div>
                  <h3 className="text-sm font-semibold text-white leading-snug">{cert.title}</h3>
                  <p className="text-xs text-[#00d2ff] mt-0.5">{cert.issuer}</p>
                </div>

                {/* Dates */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Calendar className="w-3 h-3" />
                  <span>{cert.issueDate}</span>
                  {!cert.doesNotExpire && cert.expiryDate && (
                    <span>— {cert.expiryDate}</span>
                  )}
                  {cert.doesNotExpire && <span className="text-slate-600">· No Expiry</span>}
                </div>

                {/* Credential */}
                {cert.credentialId && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <LinkIcon className="w-3 h-3" />
                    <span className="truncate">{cert.credentialId}</span>
                  </div>
                )}

                {/* Skills tags */}
                {cert.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {cert.skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/[0.04] text-slate-400 border border-white/[0.06]"
                      >
                        <Tag className="w-2.5 h-2.5" />
                        {skill}
                      </span>
                    ))}
                    {cert.skills.length > 4 && (
                      <span className="text-[10px] text-slate-600">+{cert.skills.length - 4}</span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1 border-t border-white/[0.04] mt-auto">
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-[#00d2ff] hover:bg-[#00d2ff]/10 transition-colors"
                      title="View credential"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    onClick={() => openEdit(cert)}
                    className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(cert._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              onClick={closeModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#09090e] border border-white/[0.08] shadow-2xl"
            >
              <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-[#09090e] z-10">
                <h2 className="text-base font-bold text-white">
                  {activeCertificate ? "Edit Certificate" : "Add Certificate"}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-widest">
                      Title *
                    </label>
                    <input
                      required
                      value={form.title}
                      onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                      placeholder="e.g. AWS Solutions Architect"
                      className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:border-[#00d2ff]/40 transition-all"
                    />
                  </div>

                  {/* Issuer */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-widest">
                      Issuer *
                    </label>
                    <input
                      required
                      value={form.issuer}
                      onChange={(e) => setForm((f) => ({ ...f, issuer: e.target.value }))}
                      placeholder="e.g. Amazon Web Services"
                      className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:border-[#00d2ff]/40 transition-all"
                    />
                  </div>

                  {/* Issue Date */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-widest">
                      Issue Date *
                    </label>
                    <input
                      required
                      value={form.issueDate}
                      onChange={(e) => setForm((f) => ({ ...f, issueDate: e.target.value }))}
                      placeholder="e.g. Jan 2024"
                      className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:border-[#00d2ff]/40 transition-all"
                    />
                  </div>

                  {/* Expiry Date */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-widest">
                      Expiry Date
                    </label>
                    <input
                      disabled={form.doesNotExpire}
                      value={form.expiryDate || ""}
                      onChange={(e) => setForm((f) => ({ ...f, expiryDate: e.target.value }))}
                      placeholder="e.g. Jan 2027"
                      className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:border-[#00d2ff]/40 transition-all disabled:opacity-40"
                    />
                  </div>

                  {/* Does not expire */}
                  <div className="sm:col-span-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, doesNotExpire: !f.doesNotExpire, expiryDate: "" }))}
                      className={`relative w-10 h-5 rounded-full transition-colors ${
                        form.doesNotExpire ? "bg-[#00d2ff]" : "bg-white/[0.08]"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                          form.doesNotExpire ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                    <span className="text-sm text-slate-400">This certificate does not expire</span>
                  </div>

                  {/* Credential ID */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-widest">
                      Credential ID
                    </label>
                    <input
                      value={form.credentialId || ""}
                      onChange={(e) => setForm((f) => ({ ...f, credentialId: e.target.value }))}
                      placeholder="e.g. ABC123XYZ"
                      className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:border-[#00d2ff]/40 transition-all"
                    />
                  </div>

                  {/* Credential URL */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-widest">
                      Credential URL
                    </label>
                    <input
                      value={form.credentialUrl || ""}
                      onChange={(e) => setForm((f) => ({ ...f, credentialUrl: e.target.value }))}
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:border-[#00d2ff]/40 transition-all"
                    />
                  </div>

                  {/* Image URL */}
                  <div className="sm:col-span-2">
                    <MediaPicker
                      label="Certificate Image"
                      placeholder="Select certificate image..."
                      value={form.imageUrl || ""}
                      onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
                      acceptType="image"
                    />
                  </div>

                  {/* Skills */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-widest">
                      Skills / Technologies
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSkill();
                          }
                        }}
                        placeholder="Type a skill and press Enter or Add"
                        className="flex-1 px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:border-[#00d2ff]/40 transition-all"
                      />
                      <button
                        type="button"
                        onClick={addSkill}
                        className="px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-slate-300 hover:text-white transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    {form.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {form.skills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-[#00d2ff]/10 text-[#00d2ff] border border-[#00d2ff]/20"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="hover:text-rose-400 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Display Order */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-widest">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={form.displayOrder}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, displayOrder: parseInt(e.target.value) || 0 }))
                      }
                      className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white outline-none focus:border-[#00d2ff]/40 transition-all"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-widest">
                      Status
                    </label>
                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          status: e.target.value as "Active" | "Inactive",
                        }))
                      }
                      className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white outline-none focus:border-[#00d2ff]/40 transition-all appearance-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  {/* Featured toggle */}
                  <div className="sm:col-span-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, featured: !f.featured }))}
                      className={`relative w-10 h-5 rounded-full transition-colors ${
                        form.featured ? "bg-amber-500" : "bg-white/[0.08]"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                          form.featured ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                    <span className="text-sm text-slate-400">Featured certificate</span>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-2 border-t border-white/[0.05]">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-slate-400 hover:text-white text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isMutating}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-[#00d2ff] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {isMutating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : activeCertificate ? (
                      "Update Certificate"
                    ) : (
                      "Create Certificate"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setDeleteConfirmId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-sm rounded-2xl bg-[#09090e] border border-white/[0.08] p-6 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-rose-950/50 flex items-center justify-center">
                  <Trash2 className="w-4.5 h-4.5 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Delete Certificate</h3>
                  <p className="text-xs text-slate-500 mt-0.5">This action cannot be undone.</p>
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-5">
                Are you sure you want to permanently delete this certificate?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-slate-400 hover:text-white text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteMutation.mutate(deleteConfirmId)}
                  disabled={deleteMutation.isPending}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  Delete
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
