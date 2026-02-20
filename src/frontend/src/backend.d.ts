import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MediaAsset {
    id: bigint;
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
    cleanupExpiredSessions(): Promise<void>;
    deleteMediaAsset(id: bigint): Promise<boolean>;
    getAllMediaAssets(): Promise<Array<MediaAsset>>;
    getAllVisitorSessions(): Promise<Array<VisitorSession>>;
    getAllVisits(): Promise<Array<Visit>>;
    getAssetsByDateRange(startDate: bigint, endDate: bigint): Promise<Array<MediaAsset>>;
    getAssetsByUploader(uploader: Principal): Promise<Array<MediaAsset>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMediaAssetByBlobId(blobId: string): Promise<MediaAsset | null>;
    getMediaAssetById(id: bigint): Promise<MediaAsset | null>;
    getOnlineUsers(): Promise<bigint>;
    getStableVisitorStats(): Promise<VisitorStats>;
    getTotalPageViews(): Promise<bigint>;
    getTotalVisitors(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVisitorStats(): Promise<VisitorStats>;
    isCallerAdmin(): Promise<boolean>;
    periodicCleanup(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    trackVisitor(sessionId: string, ipAddress: string, userAgent: string, pageUrl: string, referrer: string, deviceType: string, browser: string): Promise<void>;
    updateMediaAsset(id: bigint, newFilename: string, newMimeType: string, newData: Uint8Array, newSize: bigint): Promise<void>;
    uploadMediaAsset(filename: string, mimeType: string, data: Uint8Array, fileSize: bigint): Promise<void>;
}
