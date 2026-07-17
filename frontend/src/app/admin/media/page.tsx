"use client";

import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  Search,
  Copy,
  Trash2,
  Eye,
  FileText,
  X,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Grid,
  File,
  Loader2,
  ExternalLink,
} from "lucide-react";

interface MediaAsset {
  _id: string;
  originalName: string;
  publicId: string;
  secureUrl: string;
  width?: number;
  height?: number;
  size: number;
  mimeType: string;
  folder: string;
  tags: string[];
  createdAt: string;
}

interface UploadQueueItem {
  id: string;
  file: File;
  progress: number;
  status: "idle" | "uploading" | "success" | "error";
  errorMessage?: string;
}

export default function AdminMediaPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [search, setSearch] = useState("");
  const [mimeTypeFilter, setMimeTypeFilter] = useState(""); // "" | "image" | "document"
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  // Upload Queue State
  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);

  // Preview overlay state
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);

  // Confirm delete state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Notification state
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch Media Assets Query
  const { data, isLoading } = useQuery({
    queryKey: ["media-assets", page, search, mimeTypeFilter],
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
  });

  const mediaList: MediaAsset[] = data?.media || [];
  const totalPages = data?.totalPages || 1;

  // Delete Media Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/media/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media-assets"] });
      showNotification("success", "Media asset deleted successfully.");
      setDeleteConfirmId(null);
      if (previewAsset && previewAsset._id === deleteConfirmId) {
        setPreviewAsset(null);
      }
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Failed to delete media asset.";
      showNotification("error", msg);
    },
  });

  // Handle Drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  // Handle Drop events
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      addFilesToQueue(Array.from(e.dataTransfer.files));
    }
  };

  // Handle file input select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      addFilesToQueue(Array.from(e.target.files));
    }
  };

  // Add files to upload queue
  const addFilesToQueue = (files: File[]) => {
    const newItems: UploadQueueItem[] = files.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      progress: 0,
      status: "idle",
    }));

    setUploadQueue((prev) => [...newItems, ...prev]);

    // Automatically trigger upload for the new idle files
    newItems.forEach((item) => {
      uploadFile(item);
    });
  };

  // Upload file execution
  const uploadFile = async (item: UploadQueueItem) => {
    setUploadQueue((prev) =>
      prev.map((q) => (q.id === item.id ? { ...q, status: "uploading", progress: 0 } : q))
    );

    const formData = new FormData();
    formData.append("file", item.file);
    // Add default tags based on file extension
    const tags = item.file.type.startsWith("image/") ? "image,upload" : "doc,upload";
    formData.append("tags", tags);

    try {
      await api.post("/media/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || item.file.size;
          const percent = Math.round((progressEvent.loaded * 100) / total);
          setUploadQueue((prev) =>
            prev.map((q) => (q.id === item.id ? { ...q, progress: percent } : q))
          );
        },
      });

      setUploadQueue((prev) =>
        prev.map((q) => (q.id === item.id ? { ...q, status: "success", progress: 100 } : q))
      );

      // Invalidate queries to refresh listing
      queryClient.invalidateQueries({ queryKey: ["media-assets"] });
    } catch (error: any) {
      const msg = error.response?.data?.message || "Upload failed.";
      setUploadQueue((prev) =>
        prev.map((q) => (q.id === item.id ? { ...q, status: "error", errorMessage: msg } : q))
      );
    }
  };

  // Retry failed upload
  const handleRetryUpload = (item: UploadQueueItem) => {
    uploadFile(item);
  };

  // Remove item from queue list
  const handleClearQueueItem = (id: string) => {
    setUploadQueue((prev) => prev.filter((item) => item.id !== id));
  };

  // Copy URL to Clipboard
  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    showNotification("success", "Secure URL copied to clipboard!");
  };

  // Format file size
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl ${
              notification.type === "success"
                ? "bg-[#051e15]/80 border-emerald-500/20 text-emerald-400"
                : "bg-[#250d0e]/80 border-red-500/20 text-red-400"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span className="text-xs font-medium font-mono">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Info */}
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold tracking-tight text-white font-mono uppercase">Media Library</h1>
        <p className="text-slate-400 text-xs font-medium max-w-2xl">
          Upload images, logos, certificates, and resumes to Cloudinary, then pick them across portfolio form sections.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Upload Pane */}
        <div className="lg:col-span-4 space-y-4">
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`relative group border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
              isDragActive
                ? "border-[#00d2ff] bg-[#00d2ff]/5"
                : "border-white/[0.04] bg-[#07070c]/50 hover:border-white/[0.1] hover:bg-[#07070c]/70"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              className="hidden"
              accept="image/*,application/pdf,.doc,.docx,text/plain"
            />
            <UploadCloud className={`w-10 h-10 mb-4 transition-colors ${isDragActive ? "text-[#00d2ff]" : "text-slate-400 group-hover:text-white"}`} />
            <p className="text-xs font-semibold text-white select-none">
              Drag & Drop files here, or <span className="text-[#00d2ff] underline">Browse</span>
            </p>
            <p className="text-[10px] text-slate-500 mt-2 font-mono">
              Accepts Images and documents up to 10MB
            </p>
          </div>

          {/* Upload Queue Container */}
          {uploadQueue.length > 0 && (
            <div className="border border-white/[0.04] bg-[#07070c]/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-white/[0.04] pb-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono">
                  Upload Queue ({uploadQueue.length})
                </span>
                <button
                  onClick={() => setUploadQueue([])}
                  className="text-[9px] uppercase font-bold tracking-widest text-slate-500 hover:text-white transition-colors"
                >
                  Clear Queue
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
                {uploadQueue.map((item) => (
                  <div key={item.id} className="bg-white/[0.01] border border-white/[0.03] p-3 rounded-xl space-y-1.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-white font-medium truncate">{item.file.name}</p>
                        <p className="text-[9px] text-slate-500 font-mono">{formatBytes(item.file.size)}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.status === "success" && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                        {item.status === "error" && (
                          <button
                            onClick={() => handleRetryUpload(item)}
                            className="p-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                            title="Retry Upload"
                          >
                            <RefreshCw className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          onClick={() => handleClearQueueItem(item.id)}
                          className="p-1 rounded text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative w-full h-1.5 bg-white/[0.03] rounded-full overflow-hidden">
                      <div
                        className={`absolute top-0 left-0 h-full rounded-full transition-all duration-300 ${
                          item.status === "success"
                            ? "bg-emerald-500"
                            : item.status === "error"
                            ? "bg-red-500"
                            : "bg-[#00d2ff]"
                        }`}
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>

                    {item.status === "error" && item.errorMessage && (
                      <p className="text-[9px] text-red-400 font-mono">{item.errorMessage}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Media Grid & Actions */}
        <div className="lg:col-span-8 space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-[#07070c]/30 border border-white/[0.04] p-3 rounded-2xl">
            {/* Search */}
            <div className="flex items-center gap-2.5 w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 shrink-0" />
              <input
                type="text"
                placeholder="Search files..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-1.5 bg-[#0a0a0f]/60 border border-white/[0.04] rounded-xl text-xs text-white outline-none focus:border-[#00d2ff]/30 transition-all font-mono"
              />
            </div>

            {/* Mime Filter */}
            <div className="flex items-center gap-1.5 shrink-0 bg-white/[0.01] border border-white/[0.04] p-1 rounded-xl">
              <button
                onClick={() => {
                  setMimeTypeFilter("");
                  setPage(1);
                }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                  mimeTypeFilter === ""
                    ? "bg-white/[0.05] text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Grid className="w-3 h-3" />
                All
              </button>
              <button
                onClick={() => {
                  setMimeTypeFilter("image");
                  setPage(1);
                }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                  mimeTypeFilter === "image"
                    ? "bg-white/[0.05] text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <ImageIcon className="w-3 h-3" />
                Images
              </button>
              <button
                onClick={() => {
                  setMimeTypeFilter("document");
                  setPage(1);
                }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                  mimeTypeFilter === "document"
                    ? "bg-white/[0.05] text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <File className="w-3 h-3" />
                Docs
              </button>
            </div>
          </div>

          {/* Grid Output */}
          {isLoading ? (
            <div className="h-96 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#00d2ff]" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 font-mono">Loading Media...</span>
            </div>
          ) : mediaList.length === 0 ? (
            <div className="h-96 border border-white/[0.04] bg-[#07070c]/20 rounded-3xl flex flex-col items-center justify-center gap-3 text-center p-6">
              <Grid className="w-8 h-8 text-slate-600" />
              <div className="space-y-1">
                <p className="text-xs text-white font-semibold">No media files found</p>
                <p className="text-[10px] text-slate-500 max-w-xs">
                  Your search parameters or filter returned no matches. Upload items to start building your library.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {mediaList.map((asset) => {
                  const isImg = asset.mimeType.startsWith("image/");
                  return (
                    <motion.div
                      layout
                      key={asset._id}
                      className="group relative border border-white/[0.03] bg-[#07070c]/40 hover:border-white/[0.08] hover:bg-[#07070c]/70 rounded-2xl overflow-hidden flex flex-col aspect-square transition-all duration-500 hover:-translate-y-1"
                    >
                      {/* Image Preview or Doc Icon */}
                      <div className="flex-1 relative overflow-hidden bg-black/20 flex items-center justify-center">
                        {isImg ? (
                          <img
                            src={asset.secureUrl}
                            alt={asset.originalName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <FileText className="w-10 h-10 text-[#00d2ff]/40 group-hover:scale-110 transition-transform duration-500" />
                        )}

                        {/* Top corner file type badge */}
                        <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 border border-white/[0.05] text-[8px] font-mono text-slate-400 uppercase">
                          {asset.mimeType.split("/")[1] || "RAW"}
                        </div>

                        {/* Hover Overlay Controls */}
                        <div className="absolute inset-0 bg-[#030308]/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                          <button
                            onClick={() => setPreviewAsset(asset)}
                            className="p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-[#00d2ff]/10 hover:border-[#00d2ff]/20 transition-all duration-300"
                            title="Preview File"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleCopyUrl(asset.secureUrl)}
                            className="p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-[#00d2ff]/10 hover:border-[#00d2ff]/20 transition-all duration-300"
                            title="Copy URL"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(asset._id)}
                            className="p-2 rounded-xl bg-white/5 border border-white/10 text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all duration-300"
                            title="Delete Asset"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Footer Details */}
                      <div className="p-3 border-t border-white/[0.03] space-y-0.5">
                        <p className="text-[11px] text-slate-300 font-semibold truncate group-hover:text-white transition-colors">
                          {asset.originalName}
                        </p>
                        <p className="text-[9px] text-slate-500 font-mono flex items-center justify-between">
                          <span>{formatBytes(asset.size)}</span>
                          {asset.width && asset.height && (
                            <span>
                              {asset.width}x{asset.height}
                            </span>
                          )}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-white/[0.04] pt-4">
                  <span className="text-[10px] font-mono text-slate-500">
                    Page {page} of {totalPages}
                  </span>
                  <div className="flex items-center gap-1 bg-white/[0.01] border border-white/[0.04] p-1 rounded-xl">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Asset Preview Modal overlay */}
      <AnimatePresence>
        {previewAsset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#030308]/90 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setPreviewAsset(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#07070c] border border-white/[0.05] rounded-3xl w-full max-w-3xl overflow-hidden max-h-[85vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-white/[0.04] flex items-center justify-between">
                <span className="text-xs font-mono font-bold tracking-widest text-slate-400 truncate pr-4">
                  {previewAsset.originalName}
                </span>
                <button
                  onClick={() => setPreviewAsset(null)}
                  className="p-1.5 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Main Content Layout */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-6">
                {/* Visual Preview */}
                <div className="flex-1 bg-black/40 rounded-2xl flex items-center justify-center p-4 border border-white/[0.02] min-h-[300px]">
                  {previewAsset.mimeType.startsWith("image/") ? (
                    <img
                      src={previewAsset.secureUrl}
                      alt={previewAsset.originalName}
                      className="max-w-full max-h-[40vh] object-contain rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <FileText className="w-20 h-20 text-[#00d2ff]/40" />
                      <a
                        href={previewAsset.secureUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#00d2ff] hover:underline flex items-center gap-1 font-mono"
                      >
                        Open original file <ExternalLink className="w-3. h-3" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Metadata details panel */}
                <div className="w-full md:w-80 flex flex-col justify-between space-y-4">
                  <div className="space-y-4 font-mono text-xs">
                    <div>
                      <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Mime Type</h4>
                      <p className="text-white">{previewAsset.mimeType}</p>
                    </div>

                    <div>
                      <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Dimensions</h4>
                      <p className="text-white">
                        {previewAsset.width && previewAsset.height
                          ? `${previewAsset.width} x ${previewAsset.height} px`
                          : "N/A (Document)"}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">File Size</h4>
                      <p className="text-white">{formatBytes(previewAsset.size)}</p>
                    </div>

                    <div>
                      <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Created At</h4>
                      <p className="text-white">{new Date(previewAsset.createdAt).toLocaleString()}</p>
                    </div>

                    <div>
                      <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Public ID</h4>
                      <p className="text-slate-400 break-all select-all bg-white/[0.01] border border-white/[0.04] p-2 rounded-lg leading-relaxed text-[11px]">
                        {previewAsset.publicId}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/[0.04] flex items-center gap-2">
                    <button
                      onClick={() => handleCopyUrl(previewAsset.secureUrl)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-[#00d2ff]/10 hover:bg-[#00d2ff]/20 text-[#00d2ff] border border-[#00d2ff]/20 rounded-xl text-xs font-semibold tracking-wide transition-all"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copy URL
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(previewAsset._id)}
                      className="p-2 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/25 transition-all"
                      title="Delete Asset"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal overlay */}
      <AnimatePresence>
        {deleteConfirmId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#030308]/90 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setDeleteConfirmId(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#07070c] border border-white/[0.05] rounded-3xl w-full max-w-sm overflow-hidden p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 text-red-400">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <h3 className="font-bold text-base text-white font-mono">Delete Asset?</h3>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Are you sure you want to permanently delete this media asset? This action will destroy the file on Cloudinary and remove it from the CMS.
              </p>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 py-2 bg-white/5 border border-white/[0.04] text-slate-300 hover:text-white rounded-xl text-xs font-semibold tracking-wide transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (deleteConfirmId) {
                      deleteMutation.mutate(deleteConfirmId);
                    }
                  }}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold tracking-wide shadow-[0_4px_15px_rgba(239,68,68,0.2)] transition-all"
                >
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
