"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/components/providers/ToastProvider";
import { Button } from "@/components/ui/Button";
import { InputField, SelectField, SwitchField } from "@/components/ui/Input";
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
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Sliders,
  Grid,
  Link as LinkIcon,
  Move,
  Wrench,
} from "lucide-react";

interface Skill {
  _id: string;
  title: string;
  slug: string;
  category: string;
  skillLevel: number;
  experience?: number;
  description?: string;
  featured: boolean;
  displayOrder: number;
  status: "Active" | "Inactive";
  x: string;
  y: string;
  connections: string[];
}

export default function AdminSkillsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  // Selection state for Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null); // null means "Add New"
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<string | null>(null); // stores ID to delete

  // Form State
  const [formState, setFormState] = useState({
    title: "",
    slug: "",
    category: "Frontend",
    skillLevel: 80,
    experience: 2,
    description: "",
    featured: false,
    displayOrder: 0,
    status: "Active" as "Active" | "Inactive",
    x: "50%",
    y: "50%",
    connections: "",
  });

  // Query: Get all skills
  const { data: skills = [], isLoading } = useQuery({
    queryKey: ["skills-admin"],
    queryFn: async () => {
      const res = await api.get("/skills");
      return res.data?.data || [];
    },
  });

  // Mutation: Create Skill
  const createMutation = useMutation({
    mutationFn: async (newSkill: any) => {
      return api.post("/skills", newSkill);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills-admin"] });
      queryClient.invalidateQueries({ queryKey: ["skills-active"] });
      toast.success("Skill node added successfully!");
      setModalOpen(false);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Failed to create skill.";
      toast.error(msg);
    },
  });

  // Mutation: Update Skill
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return api.put(`/skills/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills-admin"] });
      queryClient.invalidateQueries({ queryKey: ["skills-active"] });
      toast.success("Skill node updated successfully!");
      setModalOpen(false);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Failed to update skill.";
      toast.error(msg);
    },
  });

  // Mutation: Delete Skill
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/skills/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills-admin"] });
      queryClient.invalidateQueries({ queryKey: ["skills-active"] });
      toast.success("Skill deleted successfully.");
      setDeleteConfirmOpen(null);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Failed to delete skill.";
      toast.error(msg);
      setDeleteConfirmOpen(null);
    },
  });

  // Mutation: Bulk Delete
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      return api.post("/skills/bulk-delete", { ids });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills-admin"] });
      queryClient.invalidateQueries({ queryKey: ["skills-active"] });
      toast.success(`Successfully deleted ${selectedIds.length} skills.`);
      setSelectedIds([]);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Bulk delete failed.";
      toast.error(msg);
    },
  });

  // Mutation: Bulk Status Change
  const bulkStatusMutation = useMutation({
    mutationFn: async ({ ids, status }: { ids: string[]; status: "Active" | "Inactive" }) => {
      return api.post("/skills/bulk-status", { ids, status });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["skills-admin"] });
      queryClient.invalidateQueries({ queryKey: ["skills-active"] });
      toast.success(`Updated ${selectedIds.length} skills to ${variables.status}.`);
      setSelectedIds([]);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Bulk status change failed.";
      toast.error(msg);
    },
  });

  // Mutation: Reorder Skills (Drag & Drop)
  const reorderMutation = useMutation({
    mutationFn: async (orders: { id: string; displayOrder: number }[]) => {
      return api.post("/skills/reorder", { orders });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills-admin"] });
      queryClient.invalidateQueries({ queryKey: ["skills-active"] });
      toast.success("Constellation layout order saved.");
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Reordering failed.";
      toast.error(msg);
    },
  });

  // Open creation modal
  const openFormModal = (skill: Skill | null = null) => {
    setActiveSkill(skill);
    if (skill) {
      setFormState({
        title: skill.title,
        slug: skill.slug,
        category: skill.category,
        skillLevel: skill.skillLevel,
        experience: skill.experience || 1,
        description: skill.description || "",
        featured: skill.featured,
        displayOrder: skill.displayOrder,
        status: skill.status,
        x: skill.x,
        y: skill.y,
        connections: skill.connections.join(", "),
      });
    } else {
      setFormState({
        title: "",
        slug: "",
        category: "Frontend",
        skillLevel: 80,
        experience: 1,
        description: "",
        featured: false,
        displayOrder: skills.length + 1,
        status: "Active",
        x: "50%",
        y: "50%",
        connections: "",
      });
    }
    setModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedConnections = formState.connections
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    const payload = {
      ...formState,
      connections: parsedConnections,
    };

    if (activeSkill) {
      updateMutation.mutate({ id: activeSkill._id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  // Toggle single featured value instantly
  const toggleFeatured = (skill: Skill) => {
    updateMutation.mutate({
      id: skill._id,
      data: { featured: !skill.featured },
    });
  };

  // Toggle single status instantly
  const toggleStatus = (skill: Skill) => {
    updateMutation.mutate({
      id: skill._id,
      data: { status: skill.status === "Active" ? "Inactive" : "Active" },
    });
  };

  // Drag and Drop State and Handlers
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

    const list = [...filteredSkills];
    const [draggedItem] = list.splice(draggedIndex, 1);
    list.splice(index, 0, draggedItem);

    const orderPayload = list.map((item, idx) => ({
      id: item._id,
      displayOrder: idx + 1,
    }));

    reorderMutation.mutate(orderPayload);
    setDraggedIndex(null);
  };

  // Filter skills
  const filteredSkills = skills.filter((skill: Skill) => {
    const matchesSearch =
      skill.title.toLowerCase().includes(search.toLowerCase()) ||
      skill.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || skill.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", "Frontend", "Backend", "AI/ML", "Database", "DevOps", "Programming", "Tools", "Soft Skills"];

  // Bulk Actions Toggles
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredSkills.map((s: Skill) => s._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans relative">
      {/* Header Description & Add buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Wrench className="w-6 h-6 text-[#00d2ff]" />
            Skills Constellation
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Build, connect, and reposition constellation nodes in your interactive technology grid.
          </p>
        </div>
        <Button onClick={() => openFormModal(null)} icon={Plus}>
          Add Skill Node
        </Button>
      </div>

      {/* Control bar: Search + Filter */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-[#07070c]/50 border border-white/[0.04] p-4 rounded-2xl backdrop-blur-md">
        <SearchBar
          value={search}
          onChangeValue={setSearch}
          placeholder="Search skills by title or category..."
          className="flex-1 max-w-none"
        />
        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500 whitespace-nowrap hidden sm:block">
            Category
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full md:w-48 px-3 py-2.5 bg-[#0a0a0f]/60 border border-white/[0.04] rounded-xl text-xs text-white outline-none focus:border-[#00d2ff]/30 cursor-pointer capitalize font-sans"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-[#09090e] text-white">
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bulk Actions Panel */}
      {selectedIds.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-amber-955/20 border border-amber-500/20 backdrop-blur-md">
          <span className="text-xs text-amber-400 font-semibold font-mono">
            {selectedIds.length} items selected for bulk modification
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-emerald-400 hover:text-emerald-350"
              onClick={() => bulkStatusMutation.mutate({ ids: selectedIds, status: "Active" })}
            >
              Activate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => bulkStatusMutation.mutate({ ids: selectedIds, status: "Inactive" })}
            >
              Deactivate
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => bulkDeleteMutation.mutate(selectedIds)}
            >
              Delete Bulk
            </Button>
          </div>
        </div>
      )}

      {/* Table Interface with HTML5 Drag & Drop */}
      {isLoading ? (
        <div className="bg-[#07070c]/30 border border-white/[0.04] p-6 rounded-2xl">
          <TableSkeleton rows={4} cols={8} />
        </div>
      ) : filteredSkills.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title={search ? "No nodes found" : "No skill nodes yet"}
          description={
            search
              ? "No skills fit your search criteria. Try a different query."
              : "Populate your portfolio constellation grid with tech stacks and skills."
          }
          actionLabel={search ? undefined : "Create your first node"}
          onAction={search ? undefined : () => openFormModal(null)}
        />
      ) : (
        <Table>
          <TableHead>
            <TableHeadCell className="w-10 text-center">
              <input
                type="checkbox"
                checked={filteredSkills.length > 0 && selectedIds.length === filteredSkills.length}
                onChange={handleSelectAll}
                className="w-3.5 h-3.5 rounded border-white/[0.1] bg-[#0a0a0f] text-[#00d2ff] focus:ring-0 cursor-pointer"
              />
            </TableHeadCell>
            <TableHeadCell className="w-10 text-center">Sort</TableHeadCell>
            <TableHeadCell>Skill Title</TableHeadCell>
            <TableHeadCell>Category</TableHeadCell>
            <TableHeadCell className="text-center">Skill Level</TableHeadCell>
            <TableHeadCell className="text-center">Coordinates</TableHeadCell>
            <TableHeadCell className="text-center">Featured</TableHeadCell>
            <TableHeadCell className="text-center">Status</TableHeadCell>
            <TableHeadCell className="text-right">Actions</TableHeadCell>
          </TableHead>
          <TableBody>
            {filteredSkills.map((skill: Skill, index: number) => (
              <TableRow
                key={skill._id}
                draggable
                onDragStart={(e: React.DragEvent) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e: React.DragEvent) => handleDrop(e, index)}
                className={draggedIndex === index ? "opacity-35 bg-white/[0.02]" : ""}
              >
                {/* Checkbox select */}
                <TableCell className="text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(skill._id)}
                    onChange={() => handleSelectRow(skill._id)}
                    className="w-3.5 h-3.5 rounded border-white/[0.1] bg-[#0a0a0f] text-[#00d2ff] focus:ring-0 cursor-pointer"
                  />
                </TableCell>

                {/* Drag Handle icon */}
                <TableCell className="text-center text-slate-600 cursor-grab active:cursor-grabbing hover:text-slate-400">
                  <Move className="w-3.5 h-3.5 mx-auto" />
                </TableCell>

                {/* Title & Slug */}
                <TableCell className="font-semibold text-white">
                  <div className="flex flex-col">
                    <span>{skill.title}</span>
                    <span className="text-[10px] font-mono text-slate-500 font-medium mt-0.5">{skill.slug}</span>
                  </div>
                </TableCell>

                {/* Category */}
                <TableCell className="text-slate-400 capitalize">{skill.category}</TableCell>

                {/* Level Progress bar */}
                <TableCell>
                  <div className="flex items-center gap-3 justify-center w-full max-w-[120px] mx-auto select-none">
                    <span className="text-xs font-semibold font-mono text-slate-400 w-6 text-right">
                      {skill.skillLevel}%
                    </span>
                    <div className="w-16 h-1.5 rounded-full bg-white/[0.03] overflow-hidden border border-white/[0.05]">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-[#00d2ff] shadow-[0_0_8px_rgba(0,210,255,0.4)]"
                        style={{ width: `${skill.skillLevel}%` }}
                      />
                    </div>
                  </div>
                </TableCell>

                {/* Coordinates */}
                <TableCell className="text-center font-mono text-xs text-slate-500">
                  X: {skill.x} / Y: {skill.y}
                </TableCell>

                {/* Featured toggle badge */}
                <TableCell className="text-center">
                  <button onClick={() => toggleFeatured(skill)} className="cursor-pointer">
                    <Badge variant={skill.featured ? "featured" : "neutral"}>
                      {skill.featured ? "Featured" : "Standard"}
                    </Badge>
                  </button>
                </TableCell>

                {/* Status toggle bullet */}
                <TableCell className="text-center">
                  <button
                    onClick={() => toggleStatus(skill)}
                    className={`inline-block w-2.5 h-2.5 rounded-full cursor-pointer border transition-all ${
                      skill.status === "Active"
                        ? "bg-emerald-400 border-emerald-500/20 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                        : "bg-slate-700 border-white/[0.05]"
                    }`}
                    title={`Click to togggle Status (${skill.status})`}
                  />
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1.5 text-slate-500 hover:text-[#00d2ff] hover:bg-white/5"
                      onClick={() => openFormModal(skill)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/10"
                      onClick={() => setDeleteConfirmOpen(skill._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Delete Confirmation Box */}
      <Dialog
        isOpen={!!deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(null)}
        title="Delete Constellation Node"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-400 leading-relaxed">
            Are you sure you want to delete this skill node? This will remove its position and cut all connecting lines in your SVG constellation.
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
        title={activeSkill ? "Edit Skill Coordinates" : "Create Constellation Node"}
        variant="drawer"
      >
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* General Config */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#00d2ff] uppercase tracking-wider flex items-center gap-1.5 border-b border-white/[0.04] pb-2">
              <Sliders className="w-3.5 h-3.5" />
              <span>General Settings</span>
            </h3>

            <InputField
              label="Skill Title"
              required
              placeholder="e.g. Three.js"
              value={formState.title}
              onChange={(e) => {
                const val = e.target.value;
                const generatedSlug = val
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)/g, "");
                setFormState({
                  ...formState,
                  title: val,
                  slug: generatedSlug,
                });
              }}
            />

            <InputField
              label="Slug Identifier"
              required
              placeholder="e.g. threejs"
              value={formState.slug}
              onChange={(e) => setFormState({ ...formState, slug: e.target.value.toLowerCase() })}
              className="font-mono text-xs"
            />

            <div className="grid grid-cols-2 gap-4">
              <SelectField
                label="Category"
                value={formState.category}
                onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                options={categories
                  .filter((c) => c !== "all")
                  .map((c) => ({ label: c, value: c }))}
              />
              <InputField
                label="Level (0-100%)"
                type="number"
                min="0"
                max="100"
                value={formState.skillLevel}
                onChange={(e) => setFormState({ ...formState, skillLevel: parseInt(e.target.value) || 0 })}
                className="font-mono text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Experience (Years)"
                type="number"
                min="0"
                value={formState.experience}
                onChange={(e) => setFormState({ ...formState, experience: parseInt(e.target.value) || 0 })}
                className="font-mono text-xs"
              />
              <SelectField
                label="Status"
                value={formState.status}
                onChange={(e) => setFormState({ ...formState, status: e.target.value as any })}
                options={[
                  { label: "Active", value: "Active" },
                  { label: "Inactive", value: "Inactive" },
                ]}
              />
            </div>

            <InputField
              label="Tooltip Description Text"
              placeholder="e.g. 3D graphics · WebGL environments"
              value={formState.description}
              onChange={(e) => setFormState({ ...formState, description: e.target.value })}
            />
          </div>

          {/* Coordinates & Lines grid */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#00d2ff] uppercase tracking-wider flex items-center gap-1.5 border-b border-white/[0.04] pb-2">
              <Grid className="w-3.5 h-3.5" />
              <span>Constellation Coordinates & Links</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="X Position (Horizontal %)"
                placeholder="e.g. 55%"
                value={formState.x}
                onChange={(e) => setFormState({ ...formState, x: e.target.value })}
                className="font-mono text-xs"
              />
              <InputField
                label="Y Position (Vertical %)"
                placeholder="e.g. 8%"
                value={formState.y}
                onChange={(e) => setFormState({ ...formState, y: e.target.value })}
                className="font-mono text-xs"
              />
            </div>
            <span className="text-[10px] text-slate-500 block -mt-2 leading-relaxed">
              Set positions using percentage syntax (e.g. 10% to 90%) to align nodes in the SVG backdrop constellation.
            </span>

            <InputField
              label="Constellation Connector Lines (Slugs comma-separated)"
              placeholder="e.g. react, nodejs, typescript"
              value={formState.connections}
              onChange={(e) => setFormState({ ...formState, connections: e.target.value })}
              icon={LinkIcon}
            />
            <span className="text-[10px] text-slate-500 block -mt-2 leading-relaxed">
              Specify which technology slugs this node connects to. SVG lines will automatically draw between them.
            </span>
          </div>

          {/* Display settings */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold text-[#00d2ff] uppercase tracking-wider border-b border-white/[0.04] pb-2">Display Settings</h3>
            <div className="grid grid-cols-2 gap-6 items-center">
              <InputField
                label="Display Order"
                type="number"
                value={formState.displayOrder}
                onChange={(e) => setFormState({ ...formState, displayOrder: parseInt(e.target.value) || 0 })}
                className="font-mono text-xs"
              />
              <div className="pt-4">
                <SwitchField
                  label="Featured Node"
                  checked={formState.featured}
                  onChange={(checked) => setFormState({ ...formState, featured: checked })}
                />
              </div>
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
              {activeSkill ? "Save Changes" : "Publish Node"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
