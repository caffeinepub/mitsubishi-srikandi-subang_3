import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface WebsiteSettings {
    mainBannerImageId?: bigint;
    mainBannerVideoId?: bigint;
    mainBannerImageId2?: bigint;
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
    salesConsultantName?: string;
    salesConsultantPhotoId?: bigint;
    footerAboutText?: string;
    homepageBannerMode?: string;
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
export interface AdminRecord {
    principal: Principal;
    createdAt: bigint;
    role: UserRole;
    updatedAt: bigint;
}
export interface VisitorSession {
    lastActivity: bigint;
    isOnline: boolean;
    firstVisit: bigint;
    sessionId: string;
    ipAddress: string;
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
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
}
export enum BannerImageType {
    mainBanner = "mainBanner",
    ctaBanner = "ctaBanner"
}
export enum UserRole {
    admin = "admin",
    super_admin = "super_admin"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    cleanupExpiredSessions(): Promise<void>;
    deleteAdmin(principal: Principal): Promise<void>;
    deleteMediaAsset(id: bigint): Promise<boolean>;
    clearAllMediaAssets(): Promise<void>;
    forceSetMeAsSuperAdmin(): Promise<string>;
    getAdmins(): Promise<Array<AdminRecord>>;
    getAllMediaAssets(): Promise<Array<MediaAsset>>;
    getAllVisitorSessions(): Promise<Array<VisitorSession>>;
    getAllVisits(): Promise<Array<Visit>>;
    getAssetsByDateRange(startDate: bigint, endDate: bigint): Promise<Array<MediaAsset>>;
    getAssetsByUploader(uploader: Principal): Promise<Array<MediaAsset>>;
    getBannerImages(): Promise<Array<BannerImage>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getDailyVisitorTrend(): Promise<Array<[bigint, bigint]>>;
    getMediaAssetByBlobId(blobId: string): Promise<MediaAsset | null>;
    getMediaAssetById(id: bigint): Promise<MediaAsset | null>;
    getMediaAssets(): Promise<Array<MediaAsset>>;
    getMyRole(): Promise<UserRole | null>;
    getOnlineUsers(): Promise<bigint>;
    getPublicVisitorStats(): Promise<VisitorStats>;
    getStableVisitorStats(): Promise<VisitorStats>;
    getTopPageViews(): Promise<Array<[string, bigint]>>;
    getTotalPageViews(): Promise<bigint>;
    getTotalVisitors(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVisitorStats(): Promise<VisitorStats>;
    getPublicMediaAssetById(id: bigint): Promise<MediaAsset | null>;
    getWebsiteSettings(): Promise<WebsiteSettings>;
    isCallerAdmin(): Promise<boolean>;
    periodicCleanup(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    trackVisitor(sessionId: string, ipAddress: string, userAgent: string, pageUrl: string, referrer: string, deviceType: string, browser: string): Promise<void>;
    updateAdminRole(principal: Principal, newRole: UserRole): Promise<void>;
    updateMediaAsset(id: bigint, newFilename: string, newMimeType: string, newData: Uint8Array, newSize: bigint): Promise<void>;
    updateWebsiteSettings(newSettings: WebsiteSettings): Promise<void>;
    uploadBannerImage(filename: string, bannerType: BannerImageType, mimeType: string, data: Uint8Array, fileSize: bigint): Promise<bigint>;
    uploadMediaAsset(filename: string, mimeType: string, data: Uint8Array, fileSize: bigint): Promise<void>;
    whoAmI(): Promise<string>;
    initAdmin(): Promise<string>;
    forceBecomeAdmin(): Promise<string>;
}
