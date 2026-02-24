import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
}
export interface AdminUser {
    principal: Principal;
    name: string;
    createdAt: bigint;
    role: UserRole;
    email: string;
}
export interface MediaAsset {
    id: bigint;
    data: Uint8Array;
    size: bigint;
    mimeType: string;
    filename: string;
    uploadedAt: bigint;
    uploadedBy: Principal;
}
export interface BannerImage {
    id: bigint;
    bannerType: BannerImageType;
    data: Uint8Array;
    size: bigint;
    mimeType: string;
    filename: string;
    uploadedAt: bigint;
    uploadedBy: Principal;
}
export interface VisitorSession {
    lastActivity: bigint;
    isOnline: boolean;
    firstVisit: bigint;
    sessionId: string;
    ipAddress: string;
}
export interface VisitorStats {
    visitorsThisWeek: bigint;
    visitorsYesterday: bigint;
    visitorsThisYear: bigint;
    onlineNow: bigint;
    totalVisitors: bigint;
    visitorsToday: bigint;
    pageViewsToday: bigint;
    visitorsThisMonth: bigint;
}
export interface Visit {
    id: string;
    referrer: string;
    visitedAt: bigint;
    pageUrl: string;
    deviceType: string;
    browser: string;
    sessionId: string;
    userAgent: string;
    ipAddress: string;
}
export interface WebsiteSettings {
    mainBannerImageId?: bigint;
    dealerAddress: string;
    operationalHours: string;
    lastUpdated: bigint;
    instagramUrl: string;
    ctaBannerImageId?: bigint;
    siteName: string;
    contactEmail: string;
    contactWhatsapp: string;
    youtubeUrl: string;
    facebookUrl: string;
    contactPhone: string;
    tiktokUrl: string;
}
export enum BannerImageType {
    mainBanner = "mainBanner",
    ctaBanner = "ctaBanner"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    cleanupExpiredSessions(): Promise<void>;
    createAdminUser(name: string, email: string, role: UserRole): Promise<AdminUser>;
    deleteMediaAsset(id: bigint): Promise<boolean>;
    getAllAdminUsers(): Promise<Array<AdminUser>>;
    getAllMediaAssets(): Promise<Array<MediaAsset>>;
    getAllVisitorSessions(): Promise<Array<VisitorSession>>;
    getAllVisits(): Promise<Array<Visit>>;
    getAssetsByDateRange(startDate: bigint, endDate: bigint): Promise<Array<MediaAsset>>;
    getAssetsByUploader(uploader: Principal): Promise<Array<MediaAsset>>;
    getBannerImages(): Promise<Array<BannerImage>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMediaAssetByBlobId(blobId: string): Promise<MediaAsset | null>;
    getMediaAssetById(id: bigint): Promise<MediaAsset | null>;
    getMediaAssets(): Promise<Array<MediaAsset>>;
    getOnlineUsers(): Promise<bigint>;
    getStableVisitorStats(): Promise<VisitorStats>;
    getTotalPageViews(): Promise<bigint>;
    getTotalVisitors(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVisitorStats(): Promise<VisitorStats>;
    getWebsiteSettings(): Promise<WebsiteSettings>;
    isCallerAdmin(): Promise<boolean>;
    periodicCleanup(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    trackVisitor(sessionId: string, ipAddress: string, userAgent: string, pageUrl: string, referrer: string, deviceType: string, browser: string): Promise<void>;
    updateMediaAsset(id: bigint, newFilename: string, newMimeType: string, newData: Uint8Array, newSize: bigint): Promise<void>;
    updateWebsiteSettings(newSettings: WebsiteSettings): Promise<void>;
    uploadBannerImage(filename: string, bannerType: BannerImageType, mimeType: string, data: Uint8Array, fileSize: bigint): Promise<bigint>;
    uploadMediaAsset(filename: string, mimeType: string, data: Uint8Array, fileSize: bigint): Promise<void>;
}
