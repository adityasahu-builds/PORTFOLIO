"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/components/providers/ToastProvider";
import { Button } from "@/components/ui/Button";
import { InputField, TextAreaField, SelectField, SwitchField } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeadCell,
} from "@/components/ui/Table";
import { Dialog } from "@/components/ui/Dialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { SearchBar } from "@/components/ui/SearchBar";
import { Pagination } from "@/components/ui/Pagination";
import MediaPicker from "@/components/ui/MediaPicker";
import { Plus, Edit2, Trash2, Eye, Briefcase } from "lucide-react";

interface Project {
  _id: string;
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  techStack: string[];
  gitHubUrl?: string;
  liveUrl?: string;
  thumbnail?: string;
  featured: boolean;
  category: string;
  displayOrder: number;
  status: string;
  number?: string;
  problemStatement?: string;
  solution?: string;
  keyFeatures: string[];
  accentColor?: string;
  mockupType: string;
}

export default function AdminProjectsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null); // null means "Add New"
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<string | null>(null); // stores project ID to delete

  // Form State
  const [formState, setFormState] = useState({
    title: "",
    slug: "",
    description: "",
    longDescription: "",
    techStack: "",
    gitHubUrl: "",
    liveUrl: "",
    thumbnail: "",
    featured: false,
    category: "",
    displayOrder: 0,
    status: "Completed",
    number: "",
    problemStatement: "",
    solution: "",
    keyFeatures: "",
    accentColor: "",
    mockupType: "portfolio",
  });

  // Query: Get all projects
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await api.get("/projects");
      return res.data?.data || [];
    },
  });

  // Mutation: Create Project
  const createMutation = useMutation({
    mutationFn: async (newProject: any) => {
      return api.post("/projects", newProject);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["featured-projects"] });
      toast.success("Project created successfully!");
      setModalOpen(false);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Failed to create project.";
      toast.error(msg);
    },
  });

  // Mutation: Update Project
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return api.put(`/projects/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["featured-projects"] });
      toast.success("Project updated successfully!");
      setModalOpen(false);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Failed to update project.";
      toast.error(msg);
    },
  });

  // Mutation: Delete Project
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["featured-projects"] });
      toast.success("Project deleted successfully.");
      setDeleteConfirmOpen(null);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Failed to delete project.";
      toast.error(msg);
      setDeleteConfirmOpen(null);
    },
  });

  // Handle open Form modal
  const openFormModal = (project: Project | null = null) => {
    setActiveProject(project);
    if (project) {
      setFormState({
        title: project.title,
        slug: project.slug,
        description: project.description,
        longDescription: project.longDescription || "",
        techStack: project.techStack.join(", "),
        gitHubUrl: project.gitHubUrl || "",
        liveUrl: project.liveUrl || "",
        thumbnail: project.thumbnail || "",
        featured: project.featured,
        category: project.category,
        displayOrder: project.displayOrder,
        status: project.status,
        number: project.number || "",
        problemStatement: project.problemStatement || "",
        solution: project.solution || "",
        keyFeatures: project.keyFeatures.join(", "),
        accentColor: project.accentColor || "",
        mockupType: project.mockupType || "portfolio",
      });
    } else {
      setFormState({
        title: "",
        slug: "",
        description: "",
        longDescription: "",
        techStack: "",
        gitHubUrl: "",
        liveUrl: "",
        thumbnail: "",
        featured: false,
        category: "",
        displayOrder: projects.length + 1,
        status: "Completed",
        number: String(projects.length + 1).padStart(2, "0"),
        problemStatement: "",
        solution: "",
        keyFeatures: "",
        accentColor: "#00d2ff",
        mockupType: "portfolio",
      });
    }
    setModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedTechStack = formState.techStack
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const parsedKeyFeatures = formState.keyFeatures
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    const payload = {
      ...formState,
      techStack: parsedTechStack,
      keyFeatures: parsedKeyFeatures,
    };

    if (activeProject) {
      updateMutation.mutate({ id: activeProject._id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  // Filter & Search projects list
  const filteredProjects = projects.filter((project: Project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.techStack.join(" ").toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || project.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Unique categories list for filters
  const categoriesList: string[] = ["all", ...(Array.from(new Set(projects.map((p: Project) => p.category))) as string[])];

  // Pagination calculation
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans relative">
      {/* Header Title & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-[#00d2ff]" />
            Project Modules
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Build, edit, and reorganize projects on your website database portfolio.
          </p>
        </div>
        <Button onClick={() => openFormModal(null)} icon={Plus}>
          Add Project
        </Button>
      </div>

      {/* Search & Filter Controls bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-[#07070c]/50 border border-white/[0.04] p-4 rounded-2xl backdrop-blur-md">
        <SearchBar
          value={search}
          onChangeValue={(val) => {
            setSearch(val);
            setPage(1);
          }}
          placeholder="Search projects by title or technologies..."
          className="flex-1 max-w-none"
        />
        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500 whitespace-nowrap hidden sm:block">
            Category
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="w-full md:w-48 px-3 py-2.5 bg-[#0a0a0f]/60 border border-white/[0.04] rounded-xl text-xs text-white outline-none focus:border-[#00d2ff]/30 cursor-pointer capitalize font-sans"
          >
            {categoriesList.map((cat) => (
              <option key={cat} value={cat} className="bg-[#09090e] text-white">
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects Table grid */}
      {isLoading ? (
        <div className="bg-[#07070c]/30 border border-white/[0.04] p-6 rounded-2xl">
          <TableSkeleton rows={4} cols={7} />
        </div>
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title={search ? "No projects found" : "No projects yet"}
          description={
            search
              ? "No project items match your search. Try adjusting filters."
              : "Populate your developer showcase dashboard with application details."
          }
          actionLabel={search ? undefined : "Add your first project"}
          onAction={search ? undefined : () => openFormModal(null)}
        />
      ) : (
        <div className="space-y-4">
          <Table>
            <TableHead>
              <TableHeadCell>ID & Image</TableHeadCell>
              <TableHeadCell>Title</TableHeadCell>
              <TableHeadCell>Category</TableHeadCell>
              <TableHeadCell>Tech Stack</TableHeadCell>
              <TableHeadCell className="text-center">Featured</TableHeadCell>
              <TableHeadCell className="text-center">Status</TableHeadCell>
              <TableHeadCell className="text-right">Actions</TableHeadCell>
            </TableHead>
            <TableBody>
              {paginatedProjects.map((project: Project) => (
                <TableRow key={project._id}>
                  {/* Thumbnail / Number */}
                  <TableCell>
                    <div className="flex items-center gap-3 font-mono text-xs font-semibold text-slate-500 select-none">
                      <div className="w-12 h-8 rounded bg-slate-900 border border-white/[0.05] overflow-hidden flex items-center justify-center relative shrink-0">
                        {project.thumbnail ? (
                          <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px]" style={{ color: project.accentColor }}>
                            {project.mockupType.substring(0, 4).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <span>{project.number || "—"}</span>
                    </div>
                  </TableCell>

                  {/* Title & Slug */}
                  <TableCell className="font-semibold text-white">
                    <div className="flex flex-col">
                      <span>{project.title}</span>
                      <span className="text-[10px] font-mono text-slate-500 font-medium tracking-wide lowercase mt-0.5">
                        {project.slug}
                      </span>
                    </div>
                  </TableCell>

                  {/* Category */}
                  <TableCell className="text-slate-400 capitalize">{project.category}</TableCell>

                  {/* Tech Stack */}
                  <TableCell className="max-w-xs">
                    <div className="flex flex-wrap gap-1">
                      {project.techStack.slice(0, 3).map((t, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-white/[0.03] border border-white/[0.04] px-1.5 py-0.5 rounded text-slate-400 font-medium"
                        >
                          {t}
                        </span>
                      ))}
                      {project.techStack.length > 3 && (
                        <span className="text-[10px] text-slate-500 font-bold self-center">
                          +{project.techStack.length - 3}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Featured */}
                  <TableCell className="text-center">
                    <span
                      className={`inline-block w-2 h-2 rounded-full transition-all ${
                        project.featured
                          ? "bg-[#00d2ff] shadow-[0_0_8px_rgba(0,210,255,0.6)]"
                          : "bg-slate-700"
                      }`}
                    />
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        project.status === "Completed"
                          ? "success"
                          : project.status === "Currently Building"
                          ? "warning"
                          : "neutral"
                      }
                    >
                      {project.status}
                    </Badge>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all"
                          title="Preview Live URL"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1.5 text-slate-500 hover:text-[#00d2ff] hover:bg-white/5"
                        onClick={() => openFormModal(project)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1.5 text-slate-500 hover:text-rose-450 hover:bg-rose-950/10"
                        onClick={() => setDeleteConfirmOpen(project._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination Toolbar */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <Dialog
        isOpen={!!deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(null)}
        title="Delete Project Module"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-400 leading-relaxed">
            Are you sure you want to permanently delete this project? This will erase it from your public portfolio view and database document indexes. This action is irreversible.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setDeleteConfirmOpen(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              isLoading={deleteMutation.isPending}
              onClick={() => deleteConfirmOpen && deleteMutation.mutate(deleteConfirmOpen)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Dialog>

      {/* CRUD Form Modal Drawer */}
      <Dialog
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={activeProject ? "Edit Project Properties" : "Create New Project Module"}
        variant="drawer"
      >
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Visual Settings section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#00d2ff] uppercase tracking-wider border-b border-white/[0.04] pb-2">
              Visual Details & Layout
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Display Order"
                type="number"
                value={formState.displayOrder}
                onChange={(e) => setFormState({ ...formState, displayOrder: parseInt(e.target.value) || 0 })}
                className="font-mono text-xs"
              />
              <InputField
                label="Mockup Display Number"
                placeholder="e.g. 01"
                value={formState.number}
                onChange={(e) => setFormState({ ...formState, number: e.target.value })}
                className="font-mono text-xs"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <InputField
                label="Accent Color Hex"
                placeholder="e.g. #00d2ff"
                value={formState.accentColor}
                onChange={(e) => setFormState({ ...formState, accentColor: e.target.value })}
                className="font-mono text-xs col-span-2"
              />
              <SelectField
                label="Mockup Frame Type"
                value={formState.mockupType}
                onChange={(e) => setFormState({ ...formState, mockupType: e.target.value })}
                options={[
                  { label: "Portfolio", value: "portfolio" },
                  { label: "Restaurant", value: "restaurant" },
                  { label: "School", value: "school" },
                ]}
              />
            </div>
          </div>

          {/* Core Properties section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#00d2ff] uppercase tracking-wider border-b border-white/[0.04] pb-2">
              Core Metadata
            </h3>

            <InputField
              label="Project Title"
              required
              placeholder="e.g. School Management System"
              value={formState.title}
              onChange={(e) => {
                const newTitle = e.target.value;
                const generatedSlug = newTitle
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)/g, "");
                setFormState({
                  ...formState,
                  title: newTitle,
                  slug: generatedSlug,
                });
              }}
            />

            <InputField
              label="Url slug identifier"
              required
              placeholder="e.g. school-management"
              value={formState.slug}
              onChange={(e) => setFormState({ ...formState, slug: e.target.value.toLowerCase() })}
              className="font-mono text-xs"
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Category Tag"
                required
                placeholder="e.g. EdTech & Administration"
                value={formState.category}
                onChange={(e) => setFormState({ ...formState, category: e.target.value })}
              />
              <SelectField
                label="Building Status"
                value={formState.status}
                onChange={(e) => setFormState({ ...formState, status: e.target.value })}
                options={[
                  { label: "Completed", value: "Completed" },
                  { label: "Currently Building", value: "Currently Building" },
                  { label: "Coming Soon", value: "Coming Soon" },
                  { label: "Planning", value: "Planning" },
                ]}
              />
            </div>

            <TextAreaField
              label="Brief summary card text (Short description)"
              required
              rows={2}
              placeholder="Enter short description displaying on card index..."
              value={formState.description}
              onChange={(e) => setFormState({ ...formState, description: e.target.value })}
            />

            <TextAreaField
              label="Full specifications description (optional)"
              rows={4}
              placeholder="Markdown descriptions details..."
              value={formState.longDescription}
              onChange={(e) => setFormState({ ...formState, longDescription: e.target.value })}
            />
          </div>

          {/* Tech & Showcase Details section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#00d2ff] uppercase tracking-wider border-b border-white/[0.04] pb-2">
              Tech Stack & details
            </h3>

            <InputField
              label="Tech Stack (comma-separated)"
              required
              placeholder="e.g. Next.js, PostgreSQL, Prisma, TypeScript"
              value={formState.techStack}
              onChange={(e) => setFormState({ ...formState, techStack: e.target.value })}
            />

            <TextAreaField
              label="Problem Statement"
              rows={2}
              placeholder="What problem does this project solve?..."
              value={formState.problemStatement}
              onChange={(e) => setFormState({ ...formState, problemStatement: e.target.value })}
            />

            <TextAreaField
              label="Solution Statement"
              rows={2}
              placeholder="How does this project solve the problem?..."
              value={formState.solution}
              onChange={(e) => setFormState({ ...formState, solution: e.target.value })}
            />

            <InputField
              label="Key Features (comma-separated)"
              placeholder="e.g. Live Attendance, Parent Portal, RBAC"
              value={formState.keyFeatures}
              onChange={(e) => setFormState({ ...formState, keyFeatures: e.target.value })}
            />
          </div>

          {/* Connections & Media section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#00d2ff] uppercase tracking-wider border-b border-white/[0.04] pb-2">
              Connections Links & Assets
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="GitHub Link URL"
                placeholder="https://github.com/..."
                value={formState.gitHubUrl}
                onChange={(e) => setFormState({ ...formState, gitHubUrl: e.target.value })}
                className="font-mono text-xs"
              />
              <InputField
                label="Live Demo URL"
                placeholder="https://..."
                value={formState.liveUrl}
                onChange={(e) => setFormState({ ...formState, liveUrl: e.target.value })}
                className="font-mono text-xs"
              />
            </div>

            <MediaPicker
              label="Preview Thumbnail Image"
              placeholder="Select thumbnail image..."
              value={formState.thumbnail || ""}
              onChange={(url) => setFormState({ ...formState, thumbnail: url })}
              acceptType="image"
            />

            <div className="pt-2">
              <SwitchField
                label="Featured Project (Displays on main portfolio page list)"
                checked={formState.featured}
                onChange={(checked) => setFormState({ ...formState, featured: checked })}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/[0.04]">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              {activeProject ? "Save Changes" : "Publish Project"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
