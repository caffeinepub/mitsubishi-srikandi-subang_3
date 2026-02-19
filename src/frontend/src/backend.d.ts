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
export interface ProductLike {
    id: bigint;
    userId: Principal;
    timestamp: bigint;
    vehicleId: bigint;
}
export interface ArticleComment {
    id: bigint;
    content: string;
    userId: Principal;
    articleId: bigint;
    timestamp: bigint;
}
export interface ContactSubmission {
    id: bigint;
    userId?: Principal;
    name: string;
    email: string;
    message: string;
    timestamp: bigint;
}
export interface CreditSimulation {
    id: bigint;
    userId: Principal;
    term: bigint;
    timestamp: bigint;
    amount: bigint;
    vehicleId: bigint;
}
export interface VisitorStats {
    totalVisitors: bigint;
    weeklyVisitors: bigint;
    monthlyVisitors: bigint;
    dailyVisitors: bigint;
    pageViews: bigint;
}
export interface Vehicle {
    id: bigint;
    vehicleName: string;
    publishStatus: boolean;
    description: string;
    basePrice: bigint;
}
export interface WebsiteSettings {
    id: bigint;
    dealerAddress: string;
    operationalHours: string;
    instagramUrl: string;
    siteName: string;
    contactEmail: string;
    contactWhatsapp: string;
    youtubeUrl: string;
    facebookUrl: string;
    contactPhone: string;
    tiktokUrl: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addArticleComment(articleId: bigint, content: string): Promise<bigint>;
    addVehicle(vehicle: Vehicle): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCreditSimulation(vehicleId: bigint, amount: bigint, term: bigint): Promise<bigint>;
    deleteArticleComment(commentId: bigint): Promise<void>;
    deleteVehicle(id: bigint): Promise<void>;
    getAllContactSubmissions(): Promise<Array<ContactSubmission>>;
    getAllCreditSimulations(): Promise<Array<CreditSimulation>>;
    getAllVehiclePreviews(): Promise<Array<Vehicle>>;
    getAllVehiclesAdmin(): Promise<Array<Vehicle>>;
    getArticleComments(articleId: bigint): Promise<Array<ArticleComment>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyCreditSimulations(): Promise<Array<CreditSimulation>>;
    getProductLikes(vehicleId: bigint): Promise<Array<ProductLike>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVehicle(id: bigint): Promise<Vehicle | null>;
    getVehicleAdmin(id: bigint): Promise<Vehicle | null>;
    getVisitorStats(): Promise<VisitorStats>;
    getWebsiteSettings(id: bigint): Promise<WebsiteSettings | null>;
    incrementPageView(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    likeProduct(vehicleId: bigint): Promise<bigint>;
    resetVisitorStats(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveWebsiteSettings(settings: WebsiteSettings): Promise<void>;
    submitContactForm(name: string, email: string, message: string): Promise<bigint>;
    unlikeProduct(likeId: bigint): Promise<void>;
    updateVehicle(id: bigint, vehicle: Vehicle): Promise<void>;
}
