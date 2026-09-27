import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Helper: attach `_id` alias for complete backward compatibility with frontend
function withId<T extends { id: string }>(item: T | null): (T & { _id: string }) | null {
  if (!item) return null;
  return { ...item, _id: item.id };
}

function withIds<T extends { id: string }>(items: T[]): (T & { _id: string })[] {
  return items.map((item) => ({ ...item, _id: item.id }));
}

// Convert MongoDB style filters ($or, $in, $regex, $gte, etc.) to Prisma WhereInput
function convertMongoWhere(query: any): any {
  if (!query) return {};
  const where: any = {};
  if (query.$or) {
    where.OR = query.$or.map((cond: any) => convertMongoWhere(cond));
  }
  for (const [key, value] of Object.entries(query)) {
    if (key === "$or") continue;
    const targetKey = key === "_id" ? "id" : key;
    if (value && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)) {
      const v = value as any;
      if (v.$in) {
        where[targetKey] = { in: v.$in };
      } else if (v.$nin) {
        where[targetKey] = { notIn: v.$nin };
      } else if (v.$ne !== undefined) {
        where[targetKey] = { not: v.$ne };
      } else if (v.$regex) {
        const pattern = typeof v.$regex === "object" && v.$regex.source ? v.$regex.source : String(v.$regex);
        where[targetKey] = { contains: pattern, mode: "insensitive" };
      } else if (v.$not) {
        if (v.$not.$regex) {
          const pattern = typeof v.$not.$regex === "object" && v.$not.$regex.source ? v.$not.$regex.source : String(v.$not.$regex);
          where[targetKey] = { not: { contains: pattern, mode: "insensitive" } };
        } else {
          where[targetKey] = { not: v.$not };
        }
      } else if (v.$gte !== undefined || v.$lt !== undefined || v.$lte !== undefined || v.$gt !== undefined) {
        where[targetKey] = {};
        if (v.$gte !== undefined) where[targetKey].gte = v.$gte;
        if (v.$lte !== undefined) where[targetKey].lte = v.$lte;
        if (v.$gt !== undefined) where[targetKey].gt = v.$gt;
        if (v.$lt !== undefined) where[targetKey].lt = v.$lt;
      } else {
        where[targetKey] = v;
      }
    } else {
      where[targetKey] = value;
    }
  }
  return where;
}

function mapSort(sortObj: any): any {
  if (!sortObj) return undefined;
  if (Array.isArray(sortObj)) return sortObj;
  const res: any[] = [];
  for (const [k, v] of Object.entries(sortObj)) {
    const field = k === "_id" ? "id" : k;
    res.push({
      [field]: v === -1 || v === "desc" ? "desc" : "asc",
    });
  }
  return res.length > 0 ? res : undefined;
}

export interface QueryPromise<T> extends Promise<T> {
  sort(sortObj: any): QueryPromise<T>;
  skip(n: number): QueryPromise<T>;
  limit(n: number): QueryPromise<T>;
  select(fields?: any): QueryPromise<T>;
  lean(): Promise<T>;
  exec(): Promise<T>;
}

export function createQuery<T>(
  execFn: (opts: { skip?: number; take?: number; orderBy?: any; select?: any }) => Promise<T>
): QueryPromise<T> {
  let skipVal: number | undefined;
  let takeVal: number | undefined;
  let orderVal: any;
  let selectVal: any;

  const run = () => execFn({ skip: skipVal, take: takeVal, orderBy: orderVal, select: selectVal });

  let promiseInstance: Promise<T> | null = null;
  const getPromise = () => {
    if (!promiseInstance) {
      promiseInstance = Promise.resolve().then(run);
    }
    return promiseInstance;
  };

  const p = new Promise<T>((resolve, reject) => {
    Promise.resolve().then(() => {
      getPromise().then(resolve, reject);
    });
  }) as QueryPromise<T>;

  p.sort = (sortObj: any) => {
    orderVal = sortObj;
    return p;
  };
  p.skip = (n: number) => {
    skipVal = n;
    return p;
  };
  p.limit = (n: number) => {
    takeVal = n;
    return p;
  };
  p.select = (fields?: any) => {
    selectVal = fields;
    return p;
  };
  p.lean = () => {
    return run();
  };
  p.exec = () => {
    return run();
  };

  return p;
}

// ==========================================
// 1. USER MODEL
// ==========================================
export interface IUser {
  id: string;
  _id: string;
  username: string;
  email: string;
  password: string;
  role: "admin" | "editor";
  refreshToken?: string | null;
  createdAt: Date;
  updatedAt: Date;
  comparePassword?: (candidate: string) => Promise<boolean>;
  save?: () => Promise<any>;
}

export const User = {
  findOne(query: any): QueryPromise<(IUser & { comparePassword: (c: string) => Promise<boolean>; save: () => Promise<any> }) | null> {
    const where = convertMongoWhere(query);
    if (where.email) where.email = String(where.email).toLowerCase().trim();
    if (where.username) where.username = String(where.username).toLowerCase().trim();

    return createQuery(async () => {
      const user = await prisma.user.findFirst({ where });
      if (!user) return null;

      const userObj = {
        ...user,
        _id: user.id,
        role: user.role as "admin" | "editor",
        comparePassword: async function (candidate: string) {
          return bcrypt.compare(candidate, user.password);
        },
        save: async function () {
          let passwordToSave = this.password;
          if (passwordToSave && !passwordToSave.startsWith("$2")) {
            const salt = await bcrypt.genSalt(10);
            passwordToSave = await bcrypt.hash(passwordToSave, salt);
            this.password = passwordToSave;
          }
          return prisma.user.update({
            where: { id: user.id },
            data: {
              username: this.username,
              email: this.email,
              password: passwordToSave,
              role: this.role,
              refreshToken: this.refreshToken ?? null,
            },
          });
        },
      };
      return userObj;
    });
  },

  findById(id: string): QueryPromise<(IUser & { comparePassword: (c: string) => Promise<boolean>; save: () => Promise<any> }) | null> {
    return createQuery(async () => {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) return null;

      const userObj = {
        ...user,
        _id: user.id,
        role: user.role as "admin" | "editor",
        comparePassword: async function (candidate: string) {
          return bcrypt.compare(candidate, user.password);
        },
        save: async function () {
          let passwordToSave = this.password;
          if (passwordToSave && !passwordToSave.startsWith("$2")) {
            const salt = await bcrypt.genSalt(10);
            passwordToSave = await bcrypt.hash(passwordToSave, salt);
            this.password = passwordToSave;
          }
          return prisma.user.update({
            where: { id: user.id },
            data: {
              username: this.username,
              email: this.email,
              password: passwordToSave,
              role: this.role,
              refreshToken: this.refreshToken ?? null,
            },
          });
        },
      };
      return userObj;
    });
  },

  async findByIdAndUpdate(id: string, updateData: any) {
    const data = { ...updateData };
    if (data.password && !data.password.startsWith("$2")) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }
    const updated = await prisma.user.update({
      where: { id },
      data,
    });
    return withId(updated);
  },

  async create(data: any) {
    let password = data.password;
    if (password && !password.startsWith("$2")) {
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
    }

    const user = await prisma.user.create({
      data: {
        username: data.username.toLowerCase().trim(),
        email: data.email.toLowerCase().trim(),
        password,
        role: data.role || "admin",
        refreshToken: data.refreshToken || null,
      },
    });

    return withId(user);
  },

  async countDocuments(query: any = {}) {
    const where = convertMongoWhere(query);
    return prisma.user.count({ where });
  },
};

// ==========================================
// 2. PROJECT MODEL
// ==========================================
export interface IProject {
  id: string;
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string | null;
  longDescription?: string | null;
  techStack: string[];
  technologies?: string[];
  gitHubUrl?: string | null;
  githubUrl?: string | null;
  liveUrl?: string | null;
  thumbnail?: string | null;
  image?: string | null;
  galleryImages: string[];
  featured: boolean;
  category: string;
  displayOrder: number;
  order?: number;
  status: string;
  number?: string | null;
  problemStatement?: string | null;
  solution?: string | null;
  keyFeatures: string[];
  accentColor?: string | null;
  mockupType?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const Project = {
  find(query: any = {}): QueryPromise<(IProject & { _id: string })[]> {
    const where = convertMongoWhere(query);
    return createQuery(async (opts) => {
      const results = await prisma.project.findMany({
        where,
        orderBy: opts.orderBy ? mapSort(opts.orderBy) : [{ displayOrder: "asc" }, { order: "asc" }, { createdAt: "desc" }],
        skip: opts.skip,
        take: opts.take,
      });
      return withIds(results) as any;
    });
  },

  findOne(query: any): QueryPromise<(IProject & { _id: string }) | null> {
    const where = convertMongoWhere(query);
    return createQuery(async () => {
      const item = await prisma.project.findFirst({ where });
      return withId(item) as any;
    });
  },

  findById(id: string): QueryPromise<(IProject & { _id: string }) | null> {
    return createQuery(async () => {
      const item = await prisma.project.findUnique({ where: { id } });
      return withId(item) as any;
    });
  },

  async create(data: any) {
    const item = await prisma.project.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description || data.shortDescription || "",
        shortDescription: data.shortDescription || data.description || "",
        longDescription: data.longDescription || "",
        techStack: data.techStack || data.technologies || [],
        technologies: data.technologies || data.techStack || [],
        gitHubUrl: data.gitHubUrl || data.githubUrl || "",
        githubUrl: data.githubUrl || data.gitHubUrl || "",
        liveUrl: data.liveUrl || "",
        thumbnail: data.thumbnail || data.image || "",
        image: data.image || data.thumbnail || "",
        galleryImages: data.galleryImages || [],
        featured: Boolean(data.featured),
        category: data.category || "General",
        displayOrder: data.displayOrder ?? data.order ?? 0,
        order: data.order ?? data.displayOrder ?? 0,
        status: data.status || "Completed",
        number: data.number || "",
        problemStatement: data.problemStatement || "",
        solution: data.solution || "",
        keyFeatures: data.keyFeatures || [],
        accentColor: data.accentColor || "#00d2ff",
        mockupType: data.mockupType || "portfolio",
      },
    });
    return withId(item);
  },

  async findByIdAndUpdate(id: string, data: any, _options: any = {}) {
    const updateData: any = { ...data };
    delete updateData.id;
    delete updateData._id;

    if (updateData.displayOrder !== undefined && updateData.order === undefined) {
      updateData.order = updateData.displayOrder;
    }
    if (updateData.order !== undefined && updateData.displayOrder === undefined) {
      updateData.displayOrder = updateData.order;
    }

    const item = await prisma.project.update({
      where: { id },
      data: updateData,
    });
    return withId(item);
  },

  async updateMany(query: any, data: any) {
    const where = convertMongoWhere(query);
    return prisma.project.updateMany({
      where,
      data,
    });
  },

  async findByIdAndDelete(id: string) {
    const item = await prisma.project.delete({ where: { id } });
    return withId(item);
  },

  async countDocuments(query: any = {}) {
    const where = convertMongoWhere(query);
    return prisma.project.count({ where });
  },

  async insertMany(items: any[]) {
    const created: any[] = [];
    for (const item of items) {
      created.push(await this.create(item));
    }
    return created;
  },
};

// ==========================================
// 3. SKILL MODEL
// ==========================================
export interface ISkill {
  id: string;
  _id: string;
  title: string;
  slug: string;
  category: string;
  icon?: string | null;
  iconName?: string | null;
  imageUrl?: string | null;
  skillLevel: number;
  experience: number;
  description?: string | null;
  featured: boolean;
  displayOrder: number;
  status: string;
  x: string;
  y: string;
  connections: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const Skill = {
  find(query: any = {}): QueryPromise<(ISkill & { _id: string })[]> {
    const where = convertMongoWhere(query);
    return createQuery(async (opts) => {
      const results = await prisma.skill.findMany({
        where,
        orderBy: opts.orderBy ? mapSort(opts.orderBy) : [{ displayOrder: "asc" }, { createdAt: "desc" }],
        skip: opts.skip,
        take: opts.take,
      });
      return withIds(results) as any;
    });
  },

  findOne(query: any): QueryPromise<(ISkill & { _id: string }) | null> {
    const where = convertMongoWhere(query);
    return createQuery(async () => {
      const item = await prisma.skill.findFirst({ where });
      return withId(item) as any;
    });
  },

  findById(id: string): QueryPromise<(ISkill & { _id: string }) | null> {
    return createQuery(async () => {
      const item = await prisma.skill.findUnique({ where: { id } });
      return withId(item) as any;
    });
  },

  async create(data: any) {
    const item = await prisma.skill.create({
      data: {
        title: data.title,
        slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        category: data.category || "Frontend",
        icon: data.icon || data.iconName || "",
        iconName: data.iconName || data.icon || "",
        imageUrl: data.imageUrl || "",
        skillLevel: data.skillLevel ?? 80,
        experience: data.experience ?? 1,
        description: data.description || "",
        featured: Boolean(data.featured),
        displayOrder: data.displayOrder ?? 0,
        status: data.status || "Active",
        x: String(data.x ?? "0"),
        y: String(data.y ?? "0"),
        connections: data.connections || [],
      },
    });
    return withId(item);
  },

  async findByIdAndUpdate(id: string, data: any, _options: any = {}) {
    const updateData: any = { ...data };
    delete updateData.id;
    delete updateData._id;
    if (updateData.x !== undefined) updateData.x = String(updateData.x);
    if (updateData.y !== undefined) updateData.y = String(updateData.y);

    const item = await prisma.skill.update({
      where: { id },
      data: updateData,
    });
    return withId(item);
  },

  async updateMany(query: any, data: any) {
    const where = convertMongoWhere(query);
    return prisma.skill.updateMany({ where, data });
  },

  async deleteMany(query: any) {
    const where = convertMongoWhere(query);
    return prisma.skill.deleteMany({ where });
  },

  async findByIdAndDelete(id: string) {
    const item = await prisma.skill.delete({ where: { id } });
    return withId(item);
  },

  async countDocuments(query: any = {}) {
    const where = convertMongoWhere(query);
    return prisma.skill.count({ where });
  },

  async insertMany(items: any[]) {
    const created: any[] = [];
    for (const item of items) {
      created.push(await this.create(item));
    }
    return created;
  },
};

// ==========================================
// 4. EXPERIENCE MODEL
// ==========================================
export interface IExperience {
  id: string;
  _id: string;
  companyName: string;
  role: string;
  employmentType: string;
  location: string;
  startDate: Date;
  endDate?: Date | null;
  currentlyWorking: boolean;
  description: string;
  responsibilities: string[];
  achievements: string[];
  technologiesUsed: string[];
  companyWebsite?: string | null;
  companyLogo?: string | null;
  displayOrder: number;
  featured: boolean;
  status: string;
  iconName?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const Experience = {
  find(query: any = {}): QueryPromise<(IExperience & { _id: string })[]> {
    const where = convertMongoWhere(query);
    return createQuery(async (opts) => {
      const results = await prisma.experience.findMany({
        where,
        orderBy: opts.orderBy ? mapSort(opts.orderBy) : [{ displayOrder: "asc" }, { startDate: "desc" }],
        skip: opts.skip,
        take: opts.take,
      });
      return withIds(results) as any;
    });
  },

  findById(id: string): QueryPromise<(IExperience & { _id: string }) | null> {
    return createQuery(async () => {
      const item = await prisma.experience.findUnique({ where: { id } });
      return withId(item) as any;
    });
  },

  async create(data: any) {
    const item = await prisma.experience.create({
      data: {
        companyName: data.companyName,
        role: data.role,
        employmentType: data.employmentType || "Full-time",
        location: data.location || "",
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        currentlyWorking: Boolean(data.currentlyWorking),
        description: data.description || "",
        responsibilities: data.responsibilities || [],
        achievements: data.achievements || [],
        technologiesUsed: data.technologiesUsed || [],
        companyWebsite: data.companyWebsite || "",
        companyLogo: data.companyLogo || "",
        displayOrder: data.displayOrder ?? 0,
        featured: Boolean(data.featured),
        status: data.status || "Active",
        iconName: data.iconName || "",
      },
    });
    return withId(item);
  },

  async findByIdAndUpdate(id: string, data: any, _options: any = {}) {
    const updateData: any = { ...data };
    delete updateData.id;
    delete updateData._id;
    if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
    if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);

    const item = await prisma.experience.update({
      where: { id },
      data: updateData,
    });
    return withId(item);
  },

  async findByIdAndDelete(id: string) {
    const item = await prisma.experience.delete({ where: { id } });
    return withId(item);
  },

  async countDocuments(query: any = {}) {
    const where = convertMongoWhere(query);
    return prisma.experience.count({ where });
  },

  async insertMany(items: any[]) {
    const created: any[] = [];
    for (const item of items) {
      created.push(await this.create(item));
    }
    return created;
  },
};

// ==========================================
// 5. EDUCATION MODEL
// ==========================================
export interface IEducation {
  id: string;
  _id: string;
  institutionName: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: Date;
  endDate?: Date | null;
  currentlyStudying: boolean;
  grade?: string | null;
  description?: string | null;
  achievements: string[];
  institutionLogo?: string | null;
  institutionWebsite?: string | null;
  displayOrder: number;
  featured: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export const Education = {
  find(query: any = {}): QueryPromise<(IEducation & { _id: string })[]> {
    const where = convertMongoWhere(query);
    return createQuery(async (opts) => {
      const results = await prisma.education.findMany({
        where,
        orderBy: opts.orderBy ? mapSort(opts.orderBy) : [{ displayOrder: "asc" }, { startDate: "desc" }],
        skip: opts.skip,
        take: opts.take,
      });
      return withIds(results) as any;
    });
  },

  findById(id: string): QueryPromise<(IEducation & { _id: string }) | null> {
    return createQuery(async () => {
      const item = await prisma.education.findUnique({ where: { id } });
      return withId(item) as any;
    });
  },

  async create(data: any) {
    const item = await prisma.education.create({
      data: {
        institutionName: data.institutionName,
        degree: data.degree,
        fieldOfStudy: data.fieldOfStudy,
        location: data.location || "",
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        currentlyStudying: Boolean(data.currentlyStudying),
        grade: data.grade || "",
        description: data.description || "",
        achievements: data.achievements || [],
        institutionLogo: data.institutionLogo || "",
        institutionWebsite: data.institutionWebsite || "",
        displayOrder: data.displayOrder ?? 0,
        featured: Boolean(data.featured),
        status: data.status || "Active",
      },
    });
    return withId(item);
  },

  async findByIdAndUpdate(id: string, data: any, _options: any = {}) {
    const updateData: any = { ...data };
    delete updateData.id;
    delete updateData._id;
    if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
    if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);

    const item = await prisma.education.update({
      where: { id },
      data: updateData,
    });
    return withId(item);
  },

  async findByIdAndDelete(id: string) {
    const item = await prisma.education.delete({ where: { id } });
    return withId(item);
  },

  async countDocuments(query: any = {}) {
    const where = convertMongoWhere(query);
    return prisma.education.count({ where });
  },

  async insertMany(items: any[]) {
    const created: any[] = [];
    for (const item of items) {
      created.push(await this.create(item));
    }
    return created;
  },
};

// ==========================================
// 6. CERTIFICATE MODEL
// ==========================================
export interface ICertificate {
  id: string;
  _id: string;
  title: string;
  issuingOrganization: string;
  issueDate: Date;
  expirationDate?: Date | null;
  credentialId?: string | null;
  credentialUrl?: string | null;
  certificateImage?: string | null;
  skills: string[];
  description?: string | null;
  displayOrder: number;
  featured: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export const Certificate = {
  find(query: any = {}): QueryPromise<(ICertificate & { _id: string })[]> {
    const where = convertMongoWhere(query);
    return createQuery(async (opts) => {
      const results = await prisma.certificate.findMany({
        where,
        orderBy: opts.orderBy ? mapSort(opts.orderBy) : [{ displayOrder: "asc" }, { issueDate: "desc" }],
        skip: opts.skip,
        take: opts.take,
      });
      return withIds(results) as any;
    });
  },

  findById(id: string): QueryPromise<(ICertificate & { _id: string }) | null> {
    return createQuery(async () => {
      const item = await prisma.certificate.findUnique({ where: { id } });
      return withId(item) as any;
    });
  },

  async create(data: any) {
    const item = await prisma.certificate.create({
      data: {
        title: data.title,
        issuer: data.issuer || data.issuingOrganization || "",
        issueDate: String(data.issueDate || ""),
        expiryDate: data.expiryDate || data.expirationDate || "",
        doesNotExpire: Boolean(data.doesNotExpire),
        credentialId: data.credentialId || "",
        credentialUrl: data.credentialUrl || "",
        imageUrl: data.imageUrl || data.certificateImage || "",
        skills: data.skills || [],
        displayOrder: data.displayOrder ?? 0,
        featured: Boolean(data.featured),
        status: data.status || "Active",
      },
    });
    return withId(item);
  },

  async findByIdAndUpdate(id: string, data: any, _options: any = {}) {
    const updateData: any = { ...data };
    delete updateData.id;
    delete updateData._id;
    if (updateData.issuingOrganization && !updateData.issuer) {
      updateData.issuer = updateData.issuingOrganization;
      delete updateData.issuingOrganization;
    }
    if (updateData.expirationDate && !updateData.expiryDate) {
      updateData.expiryDate = updateData.expirationDate;
      delete updateData.expirationDate;
    }
    if (updateData.certificateImage && !updateData.imageUrl) {
      updateData.imageUrl = updateData.certificateImage;
      delete updateData.certificateImage;
    }
    if (updateData.issueDate) updateData.issueDate = String(updateData.issueDate);
    if (updateData.expiryDate) updateData.expiryDate = String(updateData.expiryDate);

    const item = await prisma.certificate.update({
      where: { id },
      data: updateData,
    });
    return withId(item);
  },

  async findByIdAndDelete(id: string) {
    const item = await prisma.certificate.delete({ where: { id } });
    return withId(item);
  },

  async countDocuments(query: any = {}) {
    const where = convertMongoWhere(query);
    return prisma.certificate.count({ where });
  },

  async insertMany(items: any[]) {
    const created: any[] = [];
    for (const item of items) {
      created.push(await this.create(item));
    }
    return created;
  },
};

// ==========================================
// 7. PERSONAL INFO MODEL
// ==========================================
export class PersonalInfo {
  id?: string;
  _id?: string;
  hero: any;
  about: any;
  contact: any;
  socialLinks: any;
  seo: any;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: any = {}) {
    this.hero = data.hero || {};
    this.about = data.about || {};
    this.contact = data.contact || {};
    this.socialLinks = data.socialLinks || {};
    this.seo = data.seo || {};
    if (data.id) {
      this.id = data.id;
      this._id = data.id;
    }
  }

  async save() {
    if (this.id) {
      const updated = await prisma.personalInfo.update({
        where: { id: this.id },
        data: {
          hero: this.hero as any,
          about: this.about as any,
          contact: this.contact as any,
          socialLinks: this.socialLinks as any,
          seo: this.seo as any,
        },
      });
      this.id = updated.id;
      this._id = updated.id;
      return this;
    } else {
      const created = await prisma.personalInfo.create({
        data: {
          hero: this.hero as any,
          about: this.about as any,
          contact: this.contact as any,
          socialLinks: this.socialLinks as any,
          seo: this.seo as any,
        },
      });
      this.id = created.id;
      this._id = created.id;
      return this;
    }
  }

  static findOne(): QueryPromise<PersonalInfo | null> {
    return createQuery(async () => {
      const info = await prisma.personalInfo.findFirst();
      if (!info) return null;
      return new PersonalInfo(info);
    });
  }

  static async create(data: any) {
    const info = await prisma.personalInfo.create({
      data: {
        hero: (data.hero as any) || {},
        about: (data.about as any) || {},
        contact: (data.contact as any) || {},
        socialLinks: (data.socialLinks as any) || {},
        seo: (data.seo as any) || {},
      },
    });
    return withId(info);
  }

  static async countDocuments() {
    return prisma.personalInfo.count();
  }
}

// ==========================================
// 8. CONTACT MODEL
// ==========================================
export interface IContact {
  id: string;
  _id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

export const Contact = {
  find(query: any = {}): QueryPromise<(IContact & { _id: string })[]> {
    const where = convertMongoWhere(query);
    return createQuery(async (opts) => {
      const results = await prisma.contact.findMany({
        where,
        orderBy: opts.orderBy ? mapSort(opts.orderBy) : [{ createdAt: "desc" }],
        skip: opts.skip,
        take: opts.take,
      });
      return withIds(results) as any;
    });
  },

  findById(id: string): QueryPromise<(IContact & { _id: string }) | null> {
    return createQuery(async () => {
      const item = await prisma.contact.findUnique({ where: { id } });
      return withId(item) as any;
    });
  },

  async create(data: any) {
    const item = await prisma.contact.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        subject: data.subject,
        message: data.message,
      },
    });
    return withId(item);
  },

  async findByIdAndDelete(id: string) {
    const item = await prisma.contact.delete({ where: { id } });
    return withId(item);
  },

  async countDocuments(query: any = {}) {
    const where = convertMongoWhere(query);
    return prisma.contact.count({ where });
  },
};

// ==========================================
// 9. VISITOR SESSION MODEL
// ==========================================
export interface IVisitorSession {
  id: string;
  _id: string;
  sessionId: string;
  ipHash: string;
  country: string;
  city: string;
  deviceType: string;
  browser: string;
  os: string;
  screenSize: string;
  referralSource: string;
  landingPage: string;
  visitTime: Date;
  lastActiveTime: Date;
  sessionDuration: number;
  createdAt: Date;
  updatedAt: Date;
}

export class VisitorSession {
  id?: string;
  _id?: string;
  sessionId: string;
  ipHash?: string;
  country?: string;
  city?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
  screenSize?: string;
  referralSource?: string;
  landingPage?: string;
  visitTime: Date;
  lastActiveTime: Date;
  sessionDuration: number;

  constructor(data: any = {}) {
    this.sessionId = data.sessionId || "";
    this.ipHash = data.ipHash || "";
    this.country = data.country || "Unknown";
    this.city = data.city || "Unknown";
    this.deviceType = data.deviceType || "Desktop";
    this.browser = data.browser || "Unknown";
    this.os = data.os || "Unknown";
    this.screenSize = data.screenSize || "";
    this.referralSource = data.referralSource || "Direct";
    this.landingPage = data.landingPage || "/";
    this.visitTime = data.visitTime ? new Date(data.visitTime) : new Date();
    this.lastActiveTime = data.lastActiveTime ? new Date(data.lastActiveTime) : new Date();
    this.sessionDuration = data.sessionDuration || 0;
    if (data.id) {
      this.id = data.id;
      this._id = data.id;
    }
  }

  async save() {
    if (this.id) {
      const updated = await prisma.visitorSession.update({
        where: { id: this.id },
        data: {
          lastActiveTime: this.lastActiveTime,
          sessionDuration: this.sessionDuration,
          deviceType: this.deviceType,
          landingPage: this.landingPage,
        },
      });
      this.id = updated.id;
      this._id = updated.id;
      return this;
    } else {
      const created = await prisma.visitorSession.create({
        data: {
          sessionId: this.sessionId,
          ipHash: this.ipHash || "",
          country: this.country || "Unknown",
          city: this.city || "Unknown",
          deviceType: this.deviceType || "Desktop",
          browser: this.browser || "Unknown",
          os: this.os || "Unknown",
          screenSize: this.screenSize || "Unknown",
          referralSource: this.referralSource || "Direct",
          landingPage: this.landingPage || "/",
          visitTime: this.visitTime,
          lastActiveTime: this.lastActiveTime,
          sessionDuration: this.sessionDuration,
        },
      });
      this.id = created.id;
      this._id = created.id;
      return this;
    }
  }

  static findOne(query: any): QueryPromise<VisitorSession | null> {
    const where = convertMongoWhere(query);
    return createQuery(async () => {
      const item = await prisma.visitorSession.findFirst({ where });
      if (!item) return null;
      return new VisitorSession(item);
    });
  }

  static find(query: any = {}): QueryPromise<VisitorSession[]> {
    const where = convertMongoWhere(query);
    return createQuery(async (opts) => {
      const results = await prisma.visitorSession.findMany({
        where,
        orderBy: opts.orderBy ? mapSort(opts.orderBy) : [{ visitTime: "desc" }],
        skip: opts.skip,
        take: opts.take,
      });
      return results.map((r) => new VisitorSession(r));
    });
  }

  static async create(data: any) {
    const session = new VisitorSession(data);
    return session.save();
  }

  static async countDocuments(query: any = {}) {
    const where = convertMongoWhere(query);
    return prisma.visitorSession.count({ where });
  }

  static async aggregate(pipeline: any[]): Promise<any[]> {
    const groupStage = pipeline.find((stage) => stage.$group);
    if (!groupStage) return [];

    const field = String(groupStage.$group._id).replace("$", "");
    let validField: "browser" | "deviceType" | "country" | "referralSource" | null = null;
    if (field === "browser") validField = "browser";
    else if (field === "deviceType") validField = "deviceType";
    else if (field === "country") validField = "country";
    else if (field === "referralSource") validField = "referralSource";

    if (validField) {
      try {
        const groups = await prisma.visitorSession.groupBy({
          by: [validField],
          _count: { _all: true },
          orderBy: {
            _count: {
              [validField]: "desc",
            },
          },
          take: 10,
        });
        return groups.map((g) => ({
          name: g[validField] || "Unknown",
          count: (g as any)._count?._all || (g as any)._count?.[validField] || 1,
        }));
      } catch {
        return [];
      }
    }
    return [];
  }
}

// ==========================================
// 10. ANALYTICS EVENT MODEL
// ==========================================
export interface IAnalyticsEvent {
  id: string;
  _id: string;
  sessionId: string;
  eventName: string;
  pagePath: string;
  details?: any;
  timestamp: Date;
}

export const AnalyticsEvent = {
  find(query: any = {}): QueryPromise<(IAnalyticsEvent & { _id: string })[]> {
    const where = convertMongoWhere(query);
    return createQuery(async (opts) => {
      const results = await prisma.analyticsEvent.findMany({
        where,
        orderBy: opts.orderBy ? mapSort(opts.orderBy) : { timestamp: "desc" },
        skip: opts.skip,
        take: opts.take,
      });
      return withIds(results) as any;
    });
  },

  async create(data: any) {
    const item = await prisma.analyticsEvent.create({
      data: {
        sessionId: data.sessionId,
        eventName: data.eventName,
        pagePath: data.pagePath || "/",
        details: data.details || {},
        timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
      },
    });
    return withId(item);
  },

  async countDocuments(query: any = {}) {
    const where = convertMongoWhere(query);
    return prisma.analyticsEvent.count({ where });
  },

  async aggregate(pipeline: any[]): Promise<any[]> {
    const matchStage = pipeline.find((s) => s.$match);
    const groupStage = pipeline.find((s) => s.$group);
    const eventName = matchStage?.$match?.eventName;
    const groupField = groupStage?.$group?._id;

    if (eventName === "pageView") {
      try {
        const groups = await prisma.analyticsEvent.groupBy({
          by: ["pagePath"],
          where: { eventName: "pageView" },
          _count: { _all: true },
          orderBy: { _count: { pagePath: "desc" } },
          take: 10,
        });
        return groups.map((g) => ({
          path: g.pagePath,
          views: (g as any)._count?._all || 1,
        }));
      } catch {
        return [];
      }
    }

    if (eventName) {
      try {
        const events = await prisma.analyticsEvent.findMany({
          where: { eventName },
          take: 500,
        });
        const counts: Record<string, number> = {};
        for (const ev of events) {
          const details = (ev.details as any) || {};
          let key = "";
          if (groupField === "$details.slug") key = details.slug;
          else if (groupField === "$details.platform") key = details.platform;
          else if (groupField === "$details.label") key = details.label;
          if (key) {
            counts[key] = (counts[key] || 0) + 1;
          }
        }
        const result = Object.entries(counts).map(([k, count]) => {
          if (groupField === "$details.slug") return { slug: k, views: count };
          if (groupField === "$details.platform") return { platform: k, clicks: count };
          if (groupField === "$details.label") return { label: k, clicks: count };
          return { key: k, count };
        });
        result.sort((a: any, b: any) => (b.views || b.clicks || b.count) - (a.views || a.clicks || a.count));
        return result.slice(0, 10);
      } catch {
        return [];
      }
    }
    return [];
  },
};

// ==========================================
// 11. MEDIA MODEL
// ==========================================
export interface IMedia {
  id: string;
  _id: string;
  originalName: string;
  publicId: string;
  secureUrl: string;
  width?: number | null;
  height?: number | null;
  size: number;
  mimeType: string;
  folder: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const Media = {
  find(query: any = {}): QueryPromise<(IMedia & { _id: string })[]> {
    const where = convertMongoWhere(query);
    return createQuery(async (opts) => {
      const results = await prisma.media.findMany({
        where,
        orderBy: opts.orderBy ? mapSort(opts.orderBy) : [{ createdAt: "desc" }],
        skip: opts.skip,
        take: opts.take,
      });
      return withIds(results) as any;
    });
  },

  findById(id: string): QueryPromise<(IMedia & { _id: string }) | null> {
    return createQuery(async () => {
      const item = await prisma.media.findUnique({ where: { id } });
      return withId(item) as any;
    });
  },

  async create(data: any) {
    const item = await prisma.media.create({
      data: {
        originalName: data.originalName,
        publicId: data.publicId,
        secureUrl: data.secureUrl,
        width: data.width || null,
        height: data.height || null,
        size: data.size || 0,
        mimeType: data.mimeType || "",
        folder: data.folder || "portfolio",
        tags: data.tags || [],
      },
    });
    return withId(item);
  },

  async findByIdAndDelete(id: string) {
    const item = await prisma.media.delete({ where: { id } });
    return withId(item);
  },

  async countDocuments(query: any = {}) {
    const where = convertMongoWhere(query);
    return prisma.media.count({ where });
  },
};
