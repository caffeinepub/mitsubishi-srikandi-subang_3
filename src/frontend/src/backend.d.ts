import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface VisitorSession {
    lastActivity: bigint;
    isOnline: boolean;
    firstVisit: bigint;
    sessionId: string;
    ipAddress: string;
}
export interface VisitorStats {
    todayVisitors: bigint;
    yesterdayVisitors: bigint;
    totalVisitors: bigint;
    onlineUsers: bigint;
    weeklyVisitors: bigint;
    yearlyVisitors: bigint;
    monthlyVisitors: bigint;
    pageViews: bigint;
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
    getAllVisitorSessions(): Promise<Array<VisitorSession>>;
    getAllVisits(): Promise<Array<Visit>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMonthlyVisitors(): Promise<bigint>;
    getOnlineUsers(): Promise<bigint>;
    getPageViewsByUrl(): Promise<Array<[string, bigint]>>;
    getTodayVisitors(): Promise<bigint>;
    getTotalPageViews(): Promise<bigint>;
    getTotalVisitors(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVisitorStats(): Promise<VisitorStats>;
    getVisitorTrendLast30Days(): Promise<Array<[bigint, bigint]>>;
    getWeeklyVisitors(): Promise<bigint>;
    getYearlyVisitors(): Promise<bigint>;
    getYesterdayVisitors(): Promise<bigint>;
    isCallerAdmin(): Promise<boolean>;
    periodicCleanup(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    trackVisitor(sessionId: string, ipAddress: string, userAgent: string, pageUrl: string, referrer: string, deviceType: string, browser: string): Promise<void>;
}
