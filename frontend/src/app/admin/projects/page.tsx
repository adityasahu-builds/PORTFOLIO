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
import { Plus, Edit2, Trash2, Briefcase, Star, ExternalLink } from "lucide-react";

const GithubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

interface Project {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  longDescription?: string;
  techStack: string[];
  technologies?: string[];
  gitHubUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  thumbnail?: string;
  image?: string;
  featured: boolean;
  category: string;
  displayOrder: number;
  order?: number;
  status: string;
  number?: string;
  problemStatement?: string;
  solution?: string;
  keyFeatures?: string[];
  accentColor?: string;
  mockupType?: string;
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
  const [activeDeleteProject, setActiveDeleteProject] = useState<Project | null>(null);

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
    category: "Full-Stack",
    displayOrder: 1,
    status: "Completed",
    number: "01",
    problemStatement: "",
    solution: "",
    keyFeatures: "",
    accentColor: "#00d2ff",
    mockupType: "portfolio",
  });

  // Query: Get all projects from database
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await api.get("/projects?includePortfolio=true");
      return res.data?.data || [];
    },
    staleTime: 1000 * 10,
    refetchOnMount: true,
  });

  // Count currently featured projects (excluding activeProject being edited)
  const currentlyFeaturedCount = projects.filter(
    (p) => Boolean(p.featured) && (!activeProject || p._id !== activeProject._id)
  ).length;

  // Mutation: Create Project
  const createMutation = useMutation({
    mutationFn: async (newProject: any) => {
      return api.post("/projects", newProject);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["featured-projects"] });
      queryClient.invalidateQueries({ queryKey: ["all-projects"] });
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
      queryClient.invalidateQueries({ queryKey: ["all-projects"] });
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
      queryClient.invalidateQueries({ queryKey: ["all-projects"] });
      toast.success("Project deleted successfully.");
      setActiveDeleteProject(null);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Failed to delete project.";
      toast.error(msg);
      setActiveDeleteProject(null);
    },
  });

  // Handle open Form modal
  const openFormModal = (project: Project | null = null) => {
    setActiveProject(project);
    if (project) {
      const techList = project.technologies && project.technologies.length > 0
        ? project.technologies
        : project.techStack || [];

      setFormState({
        title: project.title || "",
        slug: project.slug || "",
        description: project.shortDescription || project.description || "",
        longDescription: project.longDescription || "",
        techStack: Array.isArray(techList) ? techList.join(", ") : "",
        gitHubUrl: project.githubUrl || project.gitHubUrl || "",
        liveUrl: project.liveUrl || "",
        thumbnail: project.image || project.thumbnail || "",
        featured: Boolean(project.featured),
        category: project.category || "Full-Stack",
        displayOrder: project.order ?? project.displayOrder ?? 1,
        status: project.status || "Completed",
        number: project.number || String(project.order ?? project.displayOrder ?? 1).padStart(2, "0"),
        problemStatement: project.problemStatement || "",
        solution: project.solution || "",
        keyFeatures: Array.isArray(project.keyFeatures) ? project.keyFeatures.join(", ") : "",
        accentColor: project.accentColor || "#00d2ff",
        mockupType: project.mockupType || "portfolio",
      });
    } else {
      const nextOrder = projects.length + 1;
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
        category: "Full-Stack",
        displayOrder: nextOrder,
        status: "Completed",
        number: String(nextOrder).padStart(2, "0"),
        problemStatement: "",
        solution: "",
        keyFeatures: "",
        accentColor: "#00d2ff",
        mockupType: "portfolio",
      });
    }
    setModalOpen(true);
  };

  // Featured toggle with 3-limit guard
  const handleFeaturedToggle = (checked: boolean) => {
    if (checked && currentlyFeaturedCount >= 3) {
      toast.error(
        "You already have 3 featured projects. Unfeature an existing project before featuring this one."
      );
      return;
    }
    setFormState((prev) => ({ ...prev, featured: checked }));
  };

  // Handle submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formState.title.trim()) {
      toast.error("Project title is required.");
      return;
    }

    if (!formState.description.trim()) {
      toast.error("Short description is required.");
      return;
    }

    // Featured limit validation
    if (formState.featured && currentlyFeaturedCount >= 3) {
      toast.error(
        "You already have 3 featured projects. Unfeature an existing project before featuring this one."
      );
      return;
    }

    // URL validation if provided
    if (
      formState.gitHubUrl.trim() &&
      !formState.gitHubUrl.startsWith("http://") &&
      !formState.gitHubUrl.startsWith("https://")
    ) {
      toast.error("GitHub URL must start with http:// or https://");
      return;
    }

    if (
      formState.liveUrl.trim() &&
      !formState.liveUrl.startsWith("http://") &&
      !formState.liveUrl.startsWith("https://")
    ) {
      toast.error("Live Demo URL must start with http:// or https://");
      return;
    }

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
      shortDescription: formState.description,
      techStack: parsedTechStack,
      technologies: parsedTechStack,
      keyFeatures: parsedKeyFeatures,
      githubUrl: formState.gitHubUrl,
      image: formState.thumbnail,
      order: formState.displayOrder,
    };

    if (activeProject) {
      updateMutation.mutate({ id: activeProject._id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  // Filter & Search projects list
  const filteredProjects = [...projects]
    .sort((a, b) => (a.order ?? a.displayOrder ?? 0) - (b.order ?? b.displayOrder ?? 0))
    .filter((project: Project) => {
      const techText = (project.technologies || project.techStack || []).join(" ");
      const matchesSearch =
        project.title.toLowerCase().includes(search.toLowerCase()) ||
        techText.toLowerCase().includes(search.toLowerCase()) ||
        (project.slug && project.slug.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory =
        categoryFilter === "all" ||
        (project.category && project.category.toLowerCase() === categoryFilter.toLowerCase());
      return matchesSearch && matchesCategory;
    });

  // Unique categories list for filters
  const categoriesList: string[] = [
    "all",
    ...(Array.from(new Set(projects.map((p: Project) => p.category).filter(Boolean))) as string[]),
  ];

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
            Projects Management
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            One source of truth for homepage featured projects, all projects archive, and database entries.
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
          placeholder="Search projects by title, slug, or technologies..."
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

      {/* Projects Table */}
      {isLoading ? (
        <div className="bg-[#07070c]/30 border border-white/[0.04] p-6 rounded-2xl">
          <TableSkeleton rows={4} cols={7} />
        </div>
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title={search ? "No projects found" : "No projects yet."}
          description={
            search
              ? "No project items match your search. Try adjusting filters."
              : "Populate your database portfolio with project applications."
          }
          actionLabel={search ? undefined : "+ Add Project"}
          onAction={search ? undefined : () => openFormModal(null)}
        />
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-white/[0.04]">
            <Table>
              <TableHead>
                <TableHeadCell>Order & Image</TableHeadCell>
                <TableHeadCell>Name & Slug</TableHeadCell>
                <TableHeadCell className="text-center">Featured</TableHeadCell>
                <TableHeadCell className="text-center">Order</TableHeadCell>
                <TableHeadCell className="text-center">Status</TableHeadCell>
                <TableHeadCell className="text-center">Links</TableHeadCell>
                <TableHeadCell className="text-right">Actions</TableHeadCell>
              </TableHead>
              <TableBody>
                {paginatedProjects.map((project: Project) => {
                  const projectImg = project.image || project.thumbnail;
                  const projectOrder = project.order ?? project.displayOrder ?? 1;
                  const techList = project.technologies && project.technologies.length > 0
                    ? project.technologies
                    : project.techStack || [];
                  const ghUrl = project.githubUrl || project.gitHubUrl;
                  const liveUrl = project.liveUrl;

                  return (
                    <TableRow key={project._id}>
                      {/* Order & Thumbnail */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-semibold text-[#00d2ff]">
                            {String(projectOrder).padStart(2, "0")}
                          </span>
                          <div className="w-12 h-8 rounded bg-slate-900 border border-white/[0.08] overflow-hidden flex items-center justify-center shrink-0 relative">
                            {projectImg ? (
                              <img
                                src={projectImg}
                                alt={project.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Briefcase className="w-4 h-4 text-slate-500" />
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Name & Slug */}
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold text-white text-sm">
                            {project.title}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400 font-medium tracking-wide mt-0.5">
                            {project.slug}
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {techList.slice(0, 2).map((t, i) => (
                              <span
                                key={i}
                                className="text-[9px] bg-white/[0.04] px-1.5 py-0.2 rounded text-slate-400"
                              >
                                {t}
                              </span>
                            ))}
                            {techList.length > 2 && (
                              <span className="text-[9px] text-slate-500">
                                +{techList.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Featured status badge */}
                      <TableCell className="text-center">
                        {project.featured ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#00d2ff]/10 text-[#00d2ff] border border-[#00d2ff]/30 shadow-[0_0_10px_rgba(0,210,255,0.2)]">
                            <Star className="w-3 h-3 fill-current" /> Featured
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-slate-500 bg-white/[0.02] border border-white/[0.04]">
                            Not Featured
                          </span>
                        )}
                      </TableCell>

                      {/* Order number */}
                      <TableCell className="text-center">
                        <span className="font-mono text-xs font-semibold text-slate-300">
                          {projectOrder}
                        </span>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            project.status === "Completed"
                              ? "success"
                              : project.status === "in-progress" || project.status === "Currently Building"
                              ? "warning"
                              : "neutral"
                          }
                        >
                          {project.status || "Completed"}
                        </Badge>
                      </TableCell>

                      {/* GitHub & Live Demo Availability */}
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          {ghUrl ? (
                            <a
                              href={ghUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                              title="GitHub Repository Available"
                            >
                              <GithubIcon className="w-4 h-4" />
                            </a>
                          ) : (
                            <span className="text-slate-600 font-mono text-xs" title="No GitHub link">—</span>
                          )}

                          {liveUrl ? (
                            <a
                              href={liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded text-[#00d2ff] hover:text-white hover:bg-[#00d2ff]/10 transition-colors"
                              title="Live Demo Available"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          ) : (
                            <span className="text-slate-600 font-mono text-xs" title="No Live link">—</span>
                          )}
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1.5 text-slate-400 hover:text-[#00d2ff] hover:bg-white/5"
                            onClick={() => openFormModal(project)}
                            title="Edit Project"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/10"
                            onClick={() => setActiveDeleteProject(project)}
                            title="Delete Project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Toolbar */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Confirm Delete Dialog (Section 7 Exact Requirement) */}
      <Dialog
        isOpen={!!activeDeleteProject}
        onClose={() => setActiveDeleteProject(null)}
        title={`Delete "${activeDeleteProject?.title}"?`}
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            This action cannot be undone.
          </p>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.04]">
            <Button variant="ghost" onClick={() => setActiveDeleteProject(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              isLoading={deleteMutation.isPending}
              onClick={() => activeDeleteProject && deleteMutation.mutate(activeDeleteProject._id)}
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
        title={activeProject ? `Edit "${activeProject.title}"` : "Add Project"}
        variant="drawer"
      >
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Core Metadata */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#00d2ff] uppercase tracking-wider border-b border-white/[0.04] pb-2">
              Project Details
            </h3>

            <InputField
              label="Project Name"
              required
              placeholder="e.g. CV Analyzer"
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
                  slug: activeProject ? formState.slug : generatedSlug,
                });
              }}
            />

            <InputField
              label="URL Slug Identifier"
              required
              placeholder="e.g. cv-analyzer"
              value={formState.slug}
              onChange={(e) => setFormState({ ...formState, slug: e.target.value.toLowerCase() })}
              className="font-mono text-xs"
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Category"
                required
                placeholder="e.g. AI & Automation"
                value={formState.category}
                onChange={(e) => setFormState({ ...formState, category: e.target.value })}
              />
              <SelectField
                label="Project Status"
                value={formState.status}
                onChange={(e) => setFormState({ ...formState, status: e.target.value })}
                options={[
                  { label: "Completed", value: "Completed" },
                  { label: "In Progress", value: "in-progress" },
                  { label: "Archived", value: "archived" },
                ]}
              />
            </div>

            <TextAreaField
              label="Short Description (used on project cards/list)"
              required
              rows={2}
              placeholder="Concise project summary..."
              value={formState.description}
              onChange={(e) => setFormState({ ...formState, description: e.target.value })}
            />

            <TextAreaField
              label="Full Description (optional)"
              rows={3}
              placeholder="Detailed project background and specifications..."
              value={formState.longDescription}
              onChange={(e) => setFormState({ ...formState, longDescription: e.target.value })}
            />
          </div>

          {/* Ordering & Featured section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#00d2ff] uppercase tracking-wider border-b border-white/[0.04] pb-2">
              Visibility & Display Order
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Display Order (Lower = higher position)"
                type="number"
                min={1}
                value={formState.displayOrder}
                onChange={(e) => setFormState({ ...formState, displayOrder: parseInt(e.target.value) || 1 })}
                className="font-mono text-xs"
              />
              <InputField
                label="Display Number (e.g. 01, 02)"
                placeholder="01"
                value={formState.number}
                onChange={(e) => setFormState({ ...formState, number: e.target.value })}
                className="font-mono text-xs"
              />
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <SwitchField
                label="Featured Project (Showcase on homepage top 3)"
                checked={formState.featured}
                onChange={handleFeaturedToggle}
              />
              <p className="text-[11px] text-slate-400 font-sans">
                {formState.featured
                  ? "★ This project will appear in the homepage Featured Projects section."
                  : `Currently ${currentlyFeaturedCount}/3 projects featured. Exactly 3 projects can be featured.`}
              </p>
            </div>
          </div>

          {/* Tech Stack & Features */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#00d2ff] uppercase tracking-wider border-b border-white/[0.04] pb-2">
              Technologies & Features
            </h3>

            <InputField
              label="Technologies (comma-separated)"
              required
              placeholder="e.g. Next.js, TypeScript, Express, Gemini"
              value={formState.techStack}
              onChange={(e) => setFormState({ ...formState, techStack: e.target.value })}
            />

            <InputField
              label="Key Features (comma-separated)"
              placeholder="e.g. ATS Score Engine, PDF Parser, Real-Time Feedback"
              value={formState.keyFeatures}
              onChange={(e) => setFormState({ ...formState, keyFeatures: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Accent Color Hex"
                placeholder="#00d2ff"
                value={formState.accentColor}
                onChange={(e) => setFormState({ ...formState, accentColor: e.target.value })}
                className="font-mono text-xs"
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

          {/* Links & Project Image */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#00d2ff] uppercase tracking-wider border-b border-white/[0.04] pb-2">
              URLs & Project Image
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="GitHub URL"
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
              label="Project Image (Cloudinary / Media Library / URL)"
              placeholder="Choose from media library or paste image URL..."
              value={formState.thumbnail}
              onChange={(url) => setFormState({ ...formState, thumbnail: url })}
              acceptType="image"
            />
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
              {activeProject ? "Save Changes" : "Create Project"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
