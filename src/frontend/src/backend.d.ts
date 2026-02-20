import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface BlogPost {
    id: bigint;
    title: string;
    content: string;
    authorId: Principal;
    published: boolean;
    createdAt: bigint;
    publishedAt?: bigint;
    updatedAt: bigint;
    excerpt: string;
    imageId?: string;
}
export interface MediaAsset {
    id: bigint;
    assetId: string;
    size: bigint;
    mimeType: string;
    filename: string;
    uploadedAt: bigint;
    uploadedBy: Principal;
}
export interface Variant {
    id: bigint;
    displayOrder: bigint;
    name: string;
    overridePrice?: bigint;
    vehicleId: bigint;
}
export interface VisitorStats {
    totalVisitors: bigint;
    weeklyVisitors: bigint;
    monthlyVisitors: bigint;
    dailyVisitors: bigint;
    pageViews: bigint;
}
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createBlogPost(title: string, content: string, excerpt: string, authorId: Principal, imageId: string | null, published: boolean, publishedAt: bigint | null): Promise<BlogPost>;
    createVariant(vehicleId: bigint, name: string, displayOrder: bigint, overridePrice: bigint | null): Promise<Variant>;
    getBlogPosts(start: bigint, limit: bigint, publishedFilter: boolean | null): Promise<Array<BlogPost>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVisitorStats(): Promise<VisitorStats>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    trackPageView(): Promise<void>;
    trackVisitor(): Promise<void>;
    updateBlogPost(id: bigint, title: string, content: string, excerpt: string, authorId: Principal, imageId: string | null, published: boolean, publishedAt: bigint | null): Promise<BlogPost | null>;
    uploadMediaAsset(filename: string, assetId: string, mimeType: string, size: bigint): Promise<MediaAsset>;
}
