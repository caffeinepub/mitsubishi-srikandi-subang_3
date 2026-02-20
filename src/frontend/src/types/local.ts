// Local type definitions for types not exported by backend
// These should match the backend types but are defined here for frontend use

import { Principal } from '@dfinity/principal';

export interface Vehicle {
  id: bigint;
  vehicleName: string;
  description: string;
  basePrice: bigint;
  publishStatus: boolean;
}

export interface Variant {
  id: bigint;
  vehicleId: bigint;
  name: string;
  displayOrder: bigint;
  overridePrice?: bigint;
}

export interface Color {
  id: bigint;
  vehicleId: bigint;
  name: string;
  colorCode?: string;
  active: boolean;
}

export interface VehicleImage {
  id: bigint;
  vehicleId: bigint;
  variantId?: bigint;
  colorId?: bigint;
  imageId: string;
  default: boolean;
}

export interface Specification {
  id: bigint;
  vehicleId: bigint;
  name: string;
  value: string;
}

export interface Feature {
  id: bigint;
  vehicleId: bigint;
  name: string;
  description: string;
}

export interface VehicleCatalog {
  vehicle: Vehicle;
  variants: Variant[];
  colors: Color[];
  images: VehicleImage[];
  specifications: Specification[];
  features: Feature[];
}

export interface Promotion {
  id: bigint;
  title: string;
  description: string;
  imageId?: string;
  startDate: bigint;
  endDate: bigint;
  active: boolean;
}

export interface Testimonial {
  id: bigint;
  customerName: string;
  content: string;
  rating: bigint;
  vehicleId?: bigint;
  imageId?: string;
  approved: boolean;
  timestamp: bigint;
}

export interface BlogPost {
  id: bigint;
  title: string;
  content: string;
  excerpt: string;
  authorId: Principal;
  imageId?: string;
  published: boolean;
  publishedAt?: bigint;
  createdAt: bigint;
  updatedAt: bigint;
}

export interface MediaAsset {
  id: bigint;
  filename: string;
  blobId: string;
  mimeType: string;
  size: bigint;
  uploadedBy: Principal;
  uploadedAt: bigint;
}

export interface WebsiteSettings {
  id: bigint;
  siteName: string;
  contactPhone: string;
  contactWhatsapp: string;
  contactEmail: string;
  dealerAddress: string;
  operationalHours: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;
  mainBannerImageId?: string;
  ctaBannerImageId?: string;
  lastUpdated: bigint;
}

export interface AdminUser {
  principal: Principal;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: bigint;
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
  vehicleId: bigint;
  amount: bigint;
  term: bigint;
  timestamp: bigint;
}

export interface VisitorStats {
  totalVisitors: bigint;
  todayVisitors: bigint;
  yesterdayVisitors: bigint;
  weeklyVisitors: bigint;
  monthlyVisitors: bigint;
  yearlyVisitors: bigint;
  onlineUsers: bigint;
  pageViews: bigint;
}

export interface CommercialVehicleCategory {
  id: bigint;
  name: string;
  description: string;
  imageId?: string;
  displayOrder: bigint;
}
