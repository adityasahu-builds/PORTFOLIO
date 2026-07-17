"use client";

import React, { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  Image as ImageIcon,
  Search,
  Grid,
  File,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Upload,
  FolderOpen,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MediaAsset {
  _id: string;
  originalName: string;
  secureUrl: string;
  mimeType: string;
  size: number;
}

interface MediaPickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  acceptType?: "all" | "image" | "document";
}

export default function MediaPicker({
  value,
  onChange,
  label,
  placeholder = "https://...",
  acceptType = "all",
}: MediaPickerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const itemsPerPage = 8;
  const mimeTypeFilter = acceptType === "all" ? "" : acceptType;

  // Fetch library assets
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["media-picker-assets", page, search, mimeTypeFilter],
    queryFn: async () => {
      const res = await api.get("/media", {
        params: {
          page,
          limit: itemsPerPage,
          search,
          mimeTypeFilter,
        },
      });
      return res.data?.data || { media: [], total: 0, totalPages: 1 };
    },
    enabled: modalOpen, // only query when modal is open
  });

  const mediaList: MediaAsset[] = data?.media || [];
  const totalPages = data?.totalPages || 1;

  // Upload file handler
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("tags", "picker-upload");

    try {
      const res = await api.post("/media/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const uploadedAsset = res.data?.data;
      if (uploadedAsset?.secureUrl) {
        onChange(uploadedAsset.secureUrl);
        setModalOpen(false);
      }
    } catch (error) {
      console.error("Picker upload failed:", error);
    } finally {
      setIsUploading(false);
      refetch();
    }
  };

  const handleSelectAsset = (secureUrl: string) => {
    onChange(secureUrl);
    setModalOpen(false);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
          {label}
        </label>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 bg-[#0a0a0f]/60 border border-white/[0.04] rounded-xl text-xs text-white outline-none focus:border-[#00d2ff]/30 transition-all font-mono"
        />

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-white/5 border border-white/[0.04] text-xs font-semibold text-white rounded-xl hover:bg-white/[0.08] active:bg-white/[0.12] transition-all flex items-center gap-1.5 select-none shrink-0"
        >
          <FolderOpen className="w-3.5 h-3.5" />
          Browse
        </button>

        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-semibold transition-all select-none shrink-0"
          >
            Clear
          </button>
        )}
      </div>

      {/* Picker Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-[#030308]/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#07070c] border border-white/[0.05] rounded-3xl w-full max-w-2xl overflow-hidden max-h-[85vh] flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-white/[0.04] flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <ImageIcon className="w-4 h-4 text-[#00d2ff]" />
                  <span className="text-xs font-mono font-bold tracking-widest uppercase">
                    Select Media Asset
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Controls */}
              <div className="px-6 py-3 border-b border-white/[0.03] flex items-center justify-between gap-4">
                {/* Search */}
                <div className="flex items-center gap-2.5 w-48 sm:w-64">
                  <Search className="w-4 h-4 text-slate-500 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search file library..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="w-full px-4 py-1.5 bg-[#0a0a0f]/60 border border-white/[0.04] rounded-xl text-xs text-white outline-none focus:border-[#00d2ff]/30 transition-all font-mono"
                  />
                </div>

                {/* Upload Button */}
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleUpload}
                    className="hidden"
                    accept={
                      acceptType === "image"
                        ? "image/*"
                        : acceptType === "document"
                        ? "application/pdf,.doc,.docx,text/plain"
                        : "image/*,application/pdf,.doc,.docx,text/plain"
                    }
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-3.5 py-1.5 bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 text-[#00d2ff] border border-[#00d2ff]/20 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50 select-none"
                  >
                    {isUploading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    Upload New
                  </button>
                </div>
              </div>

              {/* Asset grid list */}
              <div className="flex-1 overflow-y-auto p-6 max-h-[50vh]">
                {isLoading ? (
                  <div className="h-60 flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-[#00d2ff]" />
                    <span className="text-[9px] uppercase font-bold tracking-widest text-slate-500 font-mono">
                      Querying Library...
                    </span>
                  </div>
                ) : mediaList.length === 0 ? (
                  <div className="h-60 flex flex-col items-center justify-center gap-2 text-slate-500 font-mono text-[10px]">
                    No files found matching filter criteria.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {mediaList.map((asset) => {
                      const isSelected = value === asset.secureUrl;
                      const isImg = asset.mimeType.startsWith("image/");
                      return (
                        <div
                          key={asset._id}
                          onClick={() => handleSelectAsset(asset.secureUrl)}
                          className={`group relative border rounded-xl overflow-hidden aspect-square flex flex-col cursor-pointer transition-all duration-300 ${
                            isSelected
                              ? "border-[#00d2ff] bg-[#00d2ff]/5"
                              : "border-white/[0.03] bg-white/[0.01] hover:border-white/[0.08] hover:bg-white/[0.03]"
                          }`}
                        >
                          {/* Image or Icon */}
                          <div className="flex-1 relative bg-black/10 flex items-center justify-center overflow-hidden">
                            {isImg ? (
                              <img
                                src={asset.secureUrl}
                                alt={asset.originalName}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <File className="w-8 h-8 text-[#00d2ff]/30 group-hover:scale-110 transition-transform duration-500" />
                            )}

                            {isSelected && (
                              <div className="absolute inset-0 bg-[#00d2ff]/10 flex items-center justify-center">
                                <div className="w-6 h-6 rounded-full bg-[#00d2ff] text-black flex items-center justify-center">
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Footer Details */}
                          <div className="p-2 border-t border-white/[0.03] bg-[#07070c]/50">
                            <p className="text-[10px] text-slate-300 font-semibold truncate group-hover:text-white">
                              {asset.originalName}
                            </p>
                            <p className="text-[8px] text-slate-500 font-mono">
                              {formatBytes(asset.size)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Pagination Footer */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-white/[0.04] flex items-center justify-between bg-black/10">
                  <span className="text-[9px] font-mono text-slate-500">
                    Page {page} of {totalPages}
                  </span>
                  <div className="flex items-center gap-1 bg-white/[0.01] border border-white/[0.04] p-1 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
