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
  GraduationCap,
  Calendar,
  MapPin,
  Move,
  ExternalLink,
} from "lucide-react";
import MediaPicker from "@/components/ui/MediaPicker";

interface Education {
  _id: string;
  institutionName: string;
  degree: string;
  fieldOfStudy: string;
  location?: string;
  startDate: string;
  endDate?: string;
  currentlyStudying: boolean;
  grade?: string;
  description?: string;
  achievements: string[];
  institutionLogo?: string;
  institutionWebsite?: string;
  displayOrder: number;
  featured: boolean;
  status: "Active" | "Inactive";
}

type EducationFormData = Omit<Education, "_id">;

const defaultForm: EducationFormData = {
  institutionName: "",
  degree: "",
  fieldOfStudy: "",
  location: "",
  startDate: "",
  endDate: "",
  currentlyStudying: false,
  grade: "",
  description: "",
  achievements: [],
  institutionLogo: "",
  institutionWebsite: "",
  displayOrder: 0,
  featured: false,
  status: "Active",
};

export default function AdminEducationPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  const [modalOpen, setModalOpen] = useState(false);
  const [activeEducation, setActiveEducation] = useState<Education | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<string | null>(null);

  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [form, setForm] = useState<EducationFormData>(defaultForm);
  const [achievementsInput, setAchievementsInput] = useState("");

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // ----- Queries -----
  const { data: educations = [], isLoading, isError } = useQuery<Education[]>({
    queryKey: ["admin-educations"],
    queryFn: async () => {
      const res = await api.get("/education");
      return res.data?.data || [];
    },
  });

  // ----- Mutations -----
  const createMutation = useMutation({
    mutationFn: (data: EducationFormData) => api.post("/education", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-educations"] });
      queryClient.invalidateQueries({ queryKey: ["education-active"] });
      queryClient.invalidateQueries({ queryKey: ["education-active-contact"] });
      closeModal();
      showNotification("success", "Education record created successfully!");
    },
    onError: () => showNotification("error", "Failed to create education record."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EducationFormData> }) =>
      api.put(`/education/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-educations"] });
      queryClient.invalidateQueries({ queryKey: ["education-active"] });
      queryClient.invalidateQueries({ queryKey: ["education-active-contact"] });
      closeModal();
      showNotification("success", "Education record updated successfully!");
    },
    onError: () => showNotification("error", "Failed to update education record."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/education/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-educations"] });
      queryClient.invalidateQueries({ queryKey: ["education-active"] });
      queryClient.invalidateQueries({ queryKey: ["education-active-contact"] });
      setDeleteConfirmOpen(null);
      showNotification("success", "Education record deleted.");
    },
    onError: () => showNotification("error", "Failed to delete education record."),
  });

  const reorderMutation = useMutation({
    mutationFn: (orders: { id: string; displayOrder: number }[]) =>
      api.post("/education/reorder", { orders }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-educations"] }),
  });

  // ----- Helpers -----
  const openCreate = () => {
    setActiveEducation(null);
    setForm(defaultForm);
    setAchievementsInput("");
    setModalOpen(true);
  };

  const openEdit = (edu: Education) => {
    setActiveEducation(edu);
    setForm({
      institutionName: edu.institutionName,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy,
      location: edu.location || "",
      startDate: edu.startDate ? edu.startDate.split("T")[0] : "",
      endDate: edu.endDate ? edu.endDate.split("T")[0] : "",
      currentlyStudying: edu.currentlyStudying,
      grade: edu.grade || "",
      description: edu.description || "",
      achievements: edu.achievements || [],
      institutionLogo: edu.institutionLogo || "",
      institutionWebsite: edu.institutionWebsite || "",
      displayOrder: edu.displayOrder,
      featured: edu.featured,
      status: edu.status,
    });
    setAchievementsInput((edu.achievements || []).join("\n"));
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveEducation(null);
    setForm(defaultForm);
    setAchievementsInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      achievements: achievementsInput
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    if (activeEducation) {
      updateMutation.mutate({ id: activeEducation._id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleMoveUp = (idx: number) => {
    if (idx === 0) return;
    const sorted = [...educations].sort((a, b) => a.displayOrder - b.displayOrder);
    const orders = sorted.map((edu, i) => ({
      id: edu._id,
      displayOrder: i === idx ? i - 1 : i === idx - 1 ? i + 1 : i,
    }));
    reorderMutation.mutate(orders);
  };

  const handleMoveDown = (idx: number) => {
    const sorted = [...educations].sort((a, b) => a.displayOrder - b.displayOrder);
    if (idx === sorted.length - 1) return;
    const orders = sorted.map((edu, i) => ({
      id: edu._id,
      displayOrder: i === idx ? i + 1 : i === idx + 1 ? i - 1 : i,
    }));
    reorderMutation.mutate(orders);
  };

  const formatDate = (d?: string) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  // Filtered & paginated
  const filtered = educations
    .filter(
      (e) =>
        e.institutionName.toLowerCase().includes(search.toLowerCase()) ||
        e.degree.toLowerCase().includes(search.toLowerCase()) ||
        e.fieldOfStudy.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen bg-[#030712] text-white p-6 md:p-8">
      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border backdrop-blur-md ${
              notification.type === "success"
                ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-300"
                : "bg-red-950/90 border-red-500/30 text-red-300"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <GraduationCap className="w-6 h-6 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold font-display">Education CMS</h1>
          </div>
          <p className="text-slate-400 text-sm">
            Manage your academic history and education records.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-blue-900/30"
        >
          <Plus className="w-4 h-4" />
          Add Education
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 flex items-center gap-2.5">
        <Search className="w-4 h-4 text-slate-500 shrink-0" />
        <input
          type="text"
          placeholder="Search by institution, degree or field..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-32 gap-3">
          <AlertCircle className="w-10 h-10 text-red-400" />
          <p className="text-red-400 text-sm">Failed to load education records.</p>
        </div>
      ) : paginated.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4 border border-dashed border-white/10 rounded-2xl">
          <div className="p-4 rounded-full bg-blue-500/10">
            <GraduationCap className="w-8 h-8 text-blue-400/60" />
          </div>
          <div className="text-center">
            <p className="text-slate-400 font-medium">No education records found</p>
            <p className="text-slate-600 text-sm mt-1">
              {search ? "Try a different search term" : "Add your first education record"}
            </p>
          </div>
          {!search && (
            <button onClick={openCreate} className="text-blue-400 hover:text-blue-300 text-sm font-semibold flex items-center gap-1 transition-colors">
              <Plus className="w-4 h-4" /> Add Education
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {paginated.map((edu, idx) => (
            <motion.div
              key={edu._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-blue-500/20 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                {/* Order Controls */}
                <div className="flex flex-col gap-1 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleMoveUp(filtered.indexOf(edu))}
                    className="p-1 rounded-md hover:bg-white/10 text-slate-500 hover:text-white transition-all"
                    title="Move Up"
                  >
                    <Move className="w-3.5 h-3.5 rotate-180" />
                  </button>
                  <button
                    onClick={() => handleMoveDown(filtered.indexOf(edu))}
                    className="p-1 rounded-md hover:bg-white/10 text-slate-500 hover:text-white transition-all"
                    title="Move Down"
                  >
                    <Move className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Icon */}
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 flex-shrink-0">
                  <GraduationCap className="w-5 h-5 text-blue-400" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white">{edu.degree}</h3>
                    <span className="text-slate-400 text-sm">—</span>
                    <span className="text-slate-300 text-sm">{edu.fieldOfStudy}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        edu.status === "Active"
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                          : "bg-red-500/15 text-red-400 border border-red-500/20"
                      }`}
                    >
                      {edu.status}
                    </span>
                    {edu.featured && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-500/15 text-yellow-400 border border-yellow-500/20">
                        Featured
                      </span>
                    )}
                  </div>

                  <p className="text-slate-400 text-sm mb-2">{edu.institutionName}</p>

                  <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(edu.startDate)} — {edu.currentlyStudying ? "Present" : formatDate(edu.endDate)}
                    </span>
                    {edu.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {edu.location}
                      </span>
                    )}
                    {edu.grade && (
                      <span className="flex items-center gap-1.5 text-blue-400/70">
                        Grade: {edu.grade}
                      </span>
                    )}
                    {edu.institutionWebsite && (
                      <a
                        href={edu.institutionWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-400/70 hover:text-blue-400 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Website
                      </a>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    onClick={() => updateMutation.mutate({ id: edu._id, data: { status: edu.status === "Active" ? "Inactive" : "Active" } })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      edu.status === "Active"
                        ? "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                        : "border-red-500/30 text-red-400 hover:bg-red-500/10"
                    }`}
                  >
                    {edu.status === "Active" ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => updateMutation.mutate({ id: edu._id, data: { featured: !edu.featured } })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      edu.featured
                        ? "border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                        : "border-white/10 text-slate-400 hover:bg-white/5"
                    }`}
                  >
                    {edu.featured ? "Unfeature" : "Feature"}
                  </button>
                  <button
                    onClick={() => openEdit(edu)}
                    className="p-2 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmOpen(edu._id)}
                    className="p-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
          >
            Previous
          </button>
          <span className="text-slate-400 text-sm px-4">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
          >
            Next
          </button>
        </div>
      )}

      {/* ===== Create / Edit Modal ===== */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0a0f1e] shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
                <h2 className="text-lg font-bold font-display">
                  {activeEducation ? "Edit Education" : "Add Education"}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Institution & Degree */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Institution Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={form.institutionName}
                      onChange={(e) => setForm((f) => ({ ...f, institutionName: e.target.value }))}
                      placeholder="e.g. MIT, Stanford, IIT..."
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Degree <span className="text-red-400">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={form.degree}
                      onChange={(e) => setForm((f) => ({ ...f, degree: e.target.value }))}
                      placeholder="e.g. Bachelor of Technology"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Field & Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Field of Study <span className="text-red-400">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={form.fieldOfStudy}
                      onChange={(e) => setForm((f) => ({ ...f, fieldOfStudy: e.target.value }))}
                      placeholder="e.g. Computer Science (AI & ML)"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Location
                    </label>
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                      placeholder="City, Country"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Start Date <span className="text-red-400">*</span>
                    </label>
                    <input
                      required
                      type="date"
                      value={form.startDate}
                      onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-blue-500/50 transition-all text-sm [color-scheme:dark]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={form.endDate}
                      disabled={form.currentlyStudying}
                      onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-blue-500/50 transition-all text-sm [color-scheme:dark] disabled:opacity-40 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="flex items-end pb-2.5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.currentlyStudying}
                        onChange={(e) => setForm((f) => ({ ...f, currentlyStudying: e.target.checked, endDate: "" }))}
                        className="w-4 h-4 rounded border-white/20 bg-white/10 text-blue-500"
                      />
                      <span className="text-sm text-slate-300">Currently Studying</span>
                    </label>
                  </div>
                </div>

                {/* Grade, Website & Logo */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Grade / CGPA
                    </label>
                    <input
                      type="text"
                      value={form.grade}
                      onChange={(e) => setForm((f) => ({ ...f, grade: e.target.value }))}
                      placeholder="e.g. 8.5 CGPA or 85%"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Institution Website
                    </label>
                    <input
                      type="url"
                      value={form.institutionWebsite}
                      onChange={(e) => setForm((f) => ({ ...f, institutionWebsite: e.target.value }))}
                      placeholder="https://institution.edu"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                    />
                  </div>
                  <MediaPicker
                    label="Institution Logo"
                    placeholder="Select logo image..."
                    value={form.institutionLogo || ""}
                    onChange={(url) => setForm((f) => ({ ...f, institutionLogo: url }))}
                    acceptType="image"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Briefly describe your studies, research focus, or notable activities..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all text-sm resize-none"
                  />
                </div>

                {/* Achievements */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Achievements (one per line)
                  </label>
                  <textarea
                    rows={4}
                    value={achievementsInput}
                    onChange={(e) => setAchievementsInput(e.target.value)}
                    placeholder={"Dean's List recognition\nBest final year project award\n..."}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all text-sm font-mono resize-none"
                  />
                </div>

                {/* Display Order, Featured, Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={form.displayOrder}
                      onChange={(e) => setForm((f) => ({ ...f, displayOrder: Number(e.target.value) }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Status
                    </label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as "Active" | "Inactive" }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                    >
                      <option value="Active" className="bg-slate-900">Active</option>
                      <option value="Inactive" className="bg-slate-900">Inactive</option>
                    </select>
                  </div>
                  <div className="flex items-end pb-2.5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.featured}
                        onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                        className="w-4 h-4 rounded border-white/20 bg-white/10 text-yellow-500"
                      />
                      <span className="text-sm text-slate-300">Featured</span>
                    </label>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 text-sm font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      activeEducation ? "Update Education" : "Create Education"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Delete Confirm Dialog ===== */}
      <AnimatePresence>
        {deleteConfirmOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl border border-red-500/20 bg-[#0a0f1e] shadow-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-red-500/10 border border-red-500/20">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="font-bold text-white">Delete Education Record</h3>
              </div>
              <p className="text-slate-400 text-sm mb-6">
                This action cannot be undone. The education record will be permanently deleted from the database.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmOpen(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 text-sm font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteMutation.mutate(deleteConfirmOpen)}
                  disabled={deleteMutation.isPending}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-all disabled:opacity-60"
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
