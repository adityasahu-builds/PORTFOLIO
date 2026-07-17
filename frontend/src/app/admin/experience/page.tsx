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
  Briefcase,
  Calendar,
  Layers,
  MapPin,
  Move,
} from "lucide-react";
import MediaPicker from "@/components/ui/MediaPicker";

interface Experience {
  _id: string;
  companyName: string;
  role: string;
  employmentType: string;
  location?: string;
  startDate: string;
  endDate?: string;
  currentlyWorking: boolean;
  companyLogo?: string;
  companyWebsite?: string;
  description?: string;
  responsibilities: string[];
  achievements: string[];
  technologiesUsed: string[];
  displayOrder: number;
  featured: boolean;
  status: "Active" | "Inactive";
  iconName: string;
}

export default function AdminExperiencePage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [activeExperience, setActiveExperience] = useState<Experience | null>(null); // null means "Add New"
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<string | null>(null); // ID to delete

  // Custom inline notification state
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Form State
  const [formState, setFormState] = useState({
    companyName: "",
    role: "",
    employmentType: "Full-time",
    location: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    companyWebsite: "",
    description: "",
    responsibilities: "",
    achievements: "",
    technologiesUsed: "",
    displayOrder: 0,
    featured: false,
    status: "Active" as "Active" | "Inactive",
    iconName: "Briefcase",
    companyLogo: "",
  });

  // Query: Get all experiences
  const { data: experiences = [], isLoading } = useQuery({
    queryKey: ["experiences-admin"],
    queryFn: async () => {
      const res = await api.get("/experience");
      return res.data?.data || [];
    },
  });

  // Mutation: Create Experience
  const createMutation = useMutation({
    mutationFn: async (newExp: any) => {
      return api.post("/experience", newExp);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiences-admin"] });
      queryClient.invalidateQueries({ queryKey: ["experiences-active"] });
      showNotification("success", "Experience milestone added successfully!");
      setModalOpen(false);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Failed to create experience.";
      showNotification("error", msg);
    },
  });

  // Mutation: Update Experience
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return api.put(`/experience/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiences-admin"] });
      queryClient.invalidateQueries({ queryKey: ["experiences-active"] });
      showNotification("success", "Experience milestone updated successfully!");
      setModalOpen(false);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Failed to update experience.";
      showNotification("error", msg);
    },
  });

  // Mutation: Delete Experience
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/experience/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiences-admin"] });
      queryClient.invalidateQueries({ queryKey: ["experiences-active"] });
      showNotification("success", "Experience milestone deleted successfully.");
      setDeleteConfirmOpen(null);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Failed to delete experience.";
      showNotification("error", msg);
      setDeleteConfirmOpen(null);
    },
  });

  // Mutation: Reorder Experiences (Drag & Drop)
  const reorderMutation = useMutation({
    mutationFn: async (orders: { id: string; displayOrder: number }[]) => {
      return api.post("/experience/reorder", { orders });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiences-admin"] });
      queryClient.invalidateQueries({ queryKey: ["experiences-active"] });
      showNotification("success", "Timeline reorder sequence saved.");
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Reordering failed.";
      showNotification("error", msg);
    },
  });

  // Helper date parsing for HTML form date controls (YYYY-MM-DD)
  const formatISOForInput = (dateString?: string) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  };

  // Open modal
  const openFormModal = (exp: Experience | null = null) => {
    setActiveExperience(exp);
    if (exp) {
      setFormState({
        companyName: exp.companyName,
        role: exp.role,
        employmentType: exp.employmentType,
        location: exp.location || "",
        startDate: formatISOForInput(exp.startDate),
        endDate: formatISOForInput(exp.endDate),
        currentlyWorking: exp.currentlyWorking,
        companyWebsite: exp.companyWebsite || "",
        description: exp.description || "",
        responsibilities: exp.responsibilities.join("\n"),
        achievements: exp.achievements.join("\n"),
        technologiesUsed: exp.technologiesUsed.join(", "),
        displayOrder: exp.displayOrder,
        featured: exp.featured,
        status: exp.status,
        iconName: exp.iconName || "Briefcase",
        companyLogo: exp.companyLogo || "",
      });
    } else {
      setFormState({
        companyName: "",
        role: "",
        employmentType: "Full-time",
        location: "",
        startDate: "",
        endDate: "",
        currentlyWorking: false,
        companyWebsite: "",
        description: "",
        responsibilities: "",
        achievements: "",
        technologiesUsed: "",
        displayOrder: experiences.length + 1,
        featured: false,
        status: "Active",
        iconName: "Briefcase",
        companyLogo: "",
      });
    }
    setModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Responsibilities and achievements can be parsed by split newline
    const parsedResponsibilities = formState.responsibilities
      .split("\n")
      .map((r) => r.trim())
      .filter(Boolean);

    const parsedAchievements = formState.achievements
      .split("\n")
      .map((a) => a.trim())
      .filter(Boolean);

    const parsedTech = formState.technologiesUsed
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: any = {
      ...formState,
      responsibilities: parsedResponsibilities,
      achievements: parsedAchievements,
      technologiesUsed: parsedTech,
    };

    // If currently working, omit endDate
    if (formState.currentlyWorking) {
      payload.endDate = "";
    }

    if (activeExperience) {
      updateMutation.mutate({ id: activeExperience._id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const toggleFeatured = (exp: Experience) => {
    updateMutation.mutate({
      id: exp._id,
      data: { featured: !exp.featured },
    });
  };

  const toggleStatus = (exp: Experience) => {
    updateMutation.mutate({
      id: exp._id,
      data: { status: exp.status === "Active" ? "Inactive" : "Active" },
    });
  };

  // Drag & Drop reordering handlers
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const list = [...filteredExps];
    const [draggedItem] = list.splice(draggedIndex, 1);
    list.splice(index, 0, draggedItem);

    const orderPayload = list.map((item, idx) => ({
      id: item._id,
      displayOrder: idx + 1,
    }));

    reorderMutation.mutate(orderPayload);
    setDraggedIndex(null);
  };

  // Filter & search
  const filteredExps = experiences.filter((exp: Experience) => {
    return (
      exp.companyName.toLowerCase().includes(search.toLowerCase()) ||
      exp.role.toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredExps.length / itemsPerPage);
  const paginatedExps = filteredExps.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const formatDateDisplay = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans relative">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border backdrop-blur-xl ${
              notification.type === "success"
                ? "bg-emerald-955/20 border-emerald-500/20 text-emerald-400"
                : "bg-rose-955/20 border-rose-500/20 text-rose-455"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-455 shrink-0" />
            )}
            <span className="text-xs font-semibold">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Experience Timeline</h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Build, edit, and drag-to-sort chronological items displaying on your public journey map.
          </p>
        </div>
        <button
          onClick={() => openFormModal(null)}
          className="group relative flex items-center gap-2 rounded-xl bg-white/[0.04] p-[1px] hover:shadow-[0_0_15px_rgba(0,210,255,0.15)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
        >
          <div className="flex items-center gap-2 rounded-xl bg-[#0a0a0f] hover:bg-[#050508] px-4 py-2.5 text-xs font-semibold text-white transition-colors duration-300">
            <Plus className="w-4 h-4 text-[#00d2ff]" />
            <span>Add Experience</span>
          </div>
        </button>
      </div>

      {/* Search Input bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-[#07070c]/50 border border-white/[0.04] p-4 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-2.5 flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="Search experiences by employer or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#0a0a0f]/60 border border-white/[0.04] rounded-xl text-xs text-white placeholder-slate-600 outline-none focus:border-[#00d2ff]/30 transition-all"
          />
        </div>
      </div>

      {/* Grid Table */}
      <div className="bg-[#07070c]/30 border border-white/[0.04] rounded-2xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.04] bg-[#09090e]/40 text-[10px] uppercase tracking-wider font-bold text-slate-500 select-none">
                <th className="py-4 px-6 w-10 text-center">Sort</th>
                <th className="py-4 px-6">Company & Location</th>
                <th className="py-4 px-6">Role / Position</th>
                <th className="py-4 px-6 text-center">Timeline Duration</th>
                <th className="py-4 px-6 text-center">Featured</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03] text-sm text-slate-300">
              {isLoading ? (
                [...Array(4)].map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td colSpan={7} className="py-8 px-6 text-center text-slate-650 font-mono text-xs">
                      Synchronizing experience timeline modules...
                    </td>
                  </tr>
                ))
              ) : paginatedExps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-500 font-mono text-xs uppercase tracking-widest">
                    No timeline items match active search
                  </td>
                </tr>
              ) : (
                paginatedExps.map((exp: Experience, index: number) => (
                  <tr
                    key={exp._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`hover:bg-white/[0.01] transition-colors group/row cursor-default ${
                      draggedIndex === index ? "opacity-30 bg-white/[0.02]" : ""
                    }`}
                  >
                    {/* Drag handle */}
                    <td className="py-4 px-6 text-center text-slate-650 cursor-grab active:cursor-grabbing group-hover/row:text-slate-400 transition-colors">
                      <Move className="w-3.5 h-3.5 mx-auto" />
                    </td>

                    {/* Company */}
                    <td className="py-4 px-6 font-semibold text-white">
                      <div className="flex flex-col">
                        <span>{exp.companyName}</span>
                        {exp.location && (
                          <span className="text-[10px] font-mono text-slate-500 font-medium tracking-wide mt-0.5 flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5" />
                            {exp.location}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span>{exp.role}</span>
                        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold mt-0.5">
                          {exp.employmentType}
                        </span>
                      </div>
                    </td>

                    {/* Duration */}
                    <td className="py-4 px-6 text-center font-mono text-xs text-slate-400">
                      {formatDateDisplay(exp.startDate)} - {exp.currentlyWorking ? "Present" : formatDateDisplay(exp.endDate)}
                    </td>

                    {/* Featured toggle */}
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => toggleFeatured(exp)}
                        className={`inline-block px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold rounded ${
                          exp.featured
                            ? "bg-[#00d2ff]/10 text-[#00d2ff] border border-[#00d2ff]/20"
                            : "bg-white/[0.02] border border-white/[0.04] text-slate-500"
                        }`}
                      >
                        {exp.featured ? "Featured" : "Standard"}
                      </button>
                    </td>

                    {/* Status toggle */}
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => toggleStatus(exp)}
                        className={`inline-block w-2.5 h-2.5 rounded-full cursor-pointer border ${
                          exp.status === "Active"
                            ? "bg-emerald-400 border-emerald-500/20 shadow-[0_0_8px_#34d399]"
                            : "bg-slate-700 border-white/[0.05]"
                        }`}
                        title={`Click to togggle Status (${exp.status})`}
                      />
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openFormModal(exp)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#00d2ff] hover:bg-white/5 transition-all"
                          title="Edit settings"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmOpen(exp._id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-450 hover:bg-rose-950/10 transition-all"
                          title="Delete Milestone"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        {!isLoading && totalPages > 1 && (
          <div className="p-4 bg-[#09090e]/40 border-t border-white/[0.04] flex items-center justify-between text-xs font-mono text-slate-500">
            <span>Showing {paginatedExps.length} of {filteredExps.length} items</span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 rounded-lg border border-white/[0.04] bg-[#0a0a0f] text-slate-300 disabled:opacity-30 disabled:pointer-events-none hover:text-white transition-colors"
              >
                Prev
              </button>
              <span className="text-slate-400">Page {page} of {totalPages}</span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 rounded-lg border border-white/[0.04] bg-[#0a0a0f] text-slate-300 disabled:opacity-30 disabled:pointer-events-none hover:text-white transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirm delete dialog */}
      <AnimatePresence>
        {deleteConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm p-6 rounded-2xl border border-white/[0.04] bg-[#0a0a0f] shadow-2xl space-y-4"
            >
              <h3 className="text-base font-bold text-white">Delete Experience Milestone</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Are you sure you want to permanently delete this timeline milestone? This will erase it from your public portfolio page.
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmOpen(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteMutation.mutate(deleteConfirmOpen)}
                  disabled={deleteMutation.isPending}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-xs font-semibold text-white transition-colors disabled:opacity-50"
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  <span>Delete</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Form modal drawer */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-sm">
            <div className="absolute inset-0" onClick={() => setModalOpen(false)} />
            
            <motion.div
              initial={{ x: "100%", opacity: 0.8 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.8 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl h-full border-l border-white/[0.04] bg-[#09090e]/95 backdrop-blur-xl shadow-2xl flex flex-col z-10 text-slate-200"
            >
              {/* Header */}
              <div className="h-16 border-b border-white/[0.04] flex items-center justify-between px-6 shrink-0 bg-[#07070a]">
                <h2 className="text-sm uppercase tracking-widest font-bold text-white">
                  {activeExperience ? "Edit Experience Milestone" : "Create Experience Milestone"}
                </h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Core Job Details */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-[#00d2ff] uppercase tracking-wider">Employment Details</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Company Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Google DeepMind"
                        value={formState.companyName}
                        onChange={(e) => setFormState({ ...formState, companyName: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0a0a0f]/60 border border-white/[0.04] rounded-xl text-xs text-white outline-none focus:border-[#00d2ff]/30 transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Role / Position</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Senior Frontend Developer"
                        value={formState.role}
                        onChange={(e) => setFormState({ ...formState, role: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0a0a0f]/60 border border-white/[0.04] rounded-xl text-xs text-white outline-none focus:border-[#00d2ff]/30 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Employment Type</label>
                      <select
                        value={formState.employmentType}
                        onChange={(e) => setFormState({ ...formState, employmentType: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0a0a0f]/60 border border-white/[0.04] rounded-xl text-xs text-white outline-none focus:border-[#00d2ff]/30 transition-all cursor-pointer font-sans"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Internship">Internship</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Contract">Contract</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Location</label>
                      <input
                        type="text"
                        placeholder="e.g. Mountain View, CA or Remote"
                        value={formState.location}
                        onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0a0a0f]/60 border border-white/[0.04] rounded-xl text-xs text-white outline-none focus:border-[#00d2ff]/30 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <hr className="border-white/[0.03]" />

                {/* Duration Calendars */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-[#00d2ff] uppercase tracking-wider">Milestone Dates</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Start Date</label>
                      <input
                        type="date"
                        required
                        value={formState.startDate}
                        onChange={(e) => setFormState({ ...formState, startDate: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0a0a0f]/60 border border-white/[0.04] rounded-xl text-xs text-white outline-none focus:border-[#00d2ff]/30 transition-all font-mono"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">End Date</label>
                      <input
                        type="date"
                        disabled={formState.currentlyWorking}
                        value={formState.currentlyWorking ? "" : formState.endDate}
                        onChange={(e) => setFormState({ ...formState, endDate: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0a0a0f]/60 border border-white/[0.04] rounded-xl text-xs text-white outline-none focus:border-[#00d2ff]/30 disabled:opacity-30 disabled:pointer-events-none transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white/[0.01] border border-white/[0.04] p-4 rounded-xl">
                    <input
                      type="checkbox"
                      id="currentlyWorking"
                      checked={formState.currentlyWorking}
                      onChange={(e) => setFormState({ ...formState, currentlyWorking: e.target.checked })}
                      className="w-4 h-4 rounded border-white/[0.1] bg-[#0a0a0f]/60 text-[#00d2ff] focus:ring-0"
                    />
                    <label htmlFor="currentlyWorking" className="text-xs text-slate-300 font-semibold cursor-pointer select-none">
                      I am currently working in this role / position
                    </label>
                  </div>
                </div>

                <hr className="border-white/[0.03]" />

                {/* Narrative Description & Lists */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-[#00d2ff] uppercase tracking-wider">Responsibilities & Key achievements</h3>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Brief Summary</label>
                    <input
                      type="text"
                      placeholder="e.g. Handled cinematic frontend animations and WebGL assets."
                      value={formState.description}
                      onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0a0a0f]/60 border border-white/[0.04] rounded-xl text-xs text-white outline-none focus:border-[#00d2ff]/30 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Responsibilities (One per line)</label>
                    <textarea
                      rows={3}
                      placeholder="Coded complex interactive diagrams&#10;Maintained server infrastructure layers"
                      value={formState.responsibilities}
                      onChange={(e) => setFormState({ ...formState, responsibilities: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0a0a0f]/60 border border-white/[0.04] rounded-xl text-xs text-white outline-none focus:border-[#00d2ff]/30 transition-all resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Achievements (One per line)</label>
                    <textarea
                      rows={3}
                      placeholder="Reduced page load jumps by 40%&#10;Awarded employee of the quarter milestone"
                      value={formState.achievements}
                      onChange={(e) => setFormState({ ...formState, achievements: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0a0a0f]/60 border border-white/[0.04] rounded-xl text-xs text-white outline-none focus:border-[#00d2ff]/30 transition-all resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Technologies Used (comma-separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Next.js, TS, GSAP, WebGL"
                      value={formState.technologiesUsed}
                      onChange={(e) => setFormState({ ...formState, technologiesUsed: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0a0a0f]/60 border border-white/[0.04] rounded-xl text-xs text-white outline-none focus:border-[#00d2ff]/30 transition-all"
                    />
                  </div>
                </div>

                <hr className="border-white/[0.03]" />

                {/* Visual Mapping */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-[#00d2ff] uppercase tracking-wider">Visual presentation</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Lucide Icon Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Code2, Cpu, Globe, Rocket, TerminalSquare"
                        value={formState.iconName}
                        onChange={(e) => setFormState({ ...formState, iconName: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0a0a0f]/60 border border-white/[0.04] rounded-xl text-xs text-white outline-none focus:border-[#00d2ff]/30 transition-all font-mono"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Display Order</label>
                      <input
                        type="number"
                        value={formState.displayOrder}
                        onChange={(e) => setFormState({ ...formState, displayOrder: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-[#0a0a0f]/60 border border-white/[0.04] rounded-xl text-xs text-white outline-none focus:border-[#00d2ff]/30 transition-all font-mono"
                      />
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 block -mt-2 leading-relaxed">
                    Suggest timeline icon names: `Code2`, `Cpu`, `Globe`, `Rocket`, `MonitorPlay`, `BrainCircuit`, `TerminalSquare` or default `Briefcase`.
                  </span>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Employer website URL</label>
                      <input
                        type="text"
                        placeholder="https://company.com"
                        value={formState.companyWebsite}
                        onChange={(e) => setFormState({ ...formState, companyWebsite: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0a0a0f]/60 border border-white/[0.04] rounded-xl text-xs text-white outline-none focus:border-[#00d2ff]/30 transition-all font-mono"
                      />
                    </div>

                    <MediaPicker
                      label="Company Logo"
                      placeholder="Select company logo..."
                      value={formState.companyLogo || ""}
                      onChange={(url) => setFormState({ ...formState, companyLogo: url })}
                      acceptType="image"
                    />
                  </div>

                  <div className="flex items-center gap-3 bg-white/[0.01] border border-white/[0.04] px-4 py-2.5 rounded-xl">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formState.featured}
                      onChange={(e) => setFormState({ ...formState, featured: e.target.checked })}
                      className="w-3.5 h-3.5 rounded border-white/[0.1] bg-[#0a0a0f]/60 text-[#00d2ff] focus:ring-0"
                    />
                    <label htmlFor="featured" className="text-xs text-slate-300 font-semibold cursor-pointer select-none">
                      Featured Milestone (Displays on public landing pages)
                    </label>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Status</label>
                    <select
                      value={formState.status}
                      onChange={(e) => setFormState({ ...formState, status: e.target.value as any })}
                      className="w-full px-3 py-2 bg-[#0a0a0f]/60 border border-white/[0.04] rounded-xl text-xs text-white outline-none focus:border-[#00d2ff]/30 transition-all cursor-pointer font-sans"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

              </form>

              {/* Form Footer */}
              <div className="h-20 border-t border-white/[0.04] flex items-center justify-end px-6 gap-3 shrink-0 bg-[#07070a]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/[0.04] bg-[#0a0a0f] hover:bg-[#050508] text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFormSubmit}
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#00d2ff] hover:bg-[#00b0d6] text-xs font-semibold text-black transition-colors disabled:opacity-50"
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : null}
                  <span>{activeExperience ? "Save Changes" : "Publish Milestone"}</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
