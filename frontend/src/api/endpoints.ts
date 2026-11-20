import { apiClient } from './client';
import {
  AdminUser,
  Brand,
  CatalogFilters,
  Category,
  ContactMessage,
  PaginatedResponse,
  Product,
  Promotion,
  WebsiteSettings,
} from '../types';

/* =========================================================================
   PUBLIC API ENDPOINTS
   ========================================================================= */

export async function getSettings(): Promise<WebsiteSettings> {
  return apiClient<WebsiteSettings>('/settings');
}

export async function getCategories(): Promise<Category[]> {
  return apiClient<Category[]>('/categories');
}

export async function getBrands(): Promise<Brand[]> {
  return apiClient<Brand[]>('/brands');
}

export async function getProducts(
  filters: CatalogFilters = {}
): Promise<PaginatedResponse<Product>> {
  return apiClient<PaginatedResponse<Product>>('/products', {
    params: filters,
  });
}

export async function getProduct(
  slug: string
): Promise<{ product: Product; related: Product[] }> {
  return apiClient<{ product: Product; related: Product[] }>(`/products/${slug}`);
}

export async function getPromotions(): Promise<Promotion[]> {
  return apiClient<Promotion[]>('/promotions');
}

export async function submitContact(data: {
  name: string;
  phone?: string;
  email?: string;
  subject?: string;
  message: string;
  product_reference?: string;
}): Promise<{ message: string; message_ar: string; data: ContactMessage }> {
  return apiClient('/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/* =========================================================================
   ADMIN AUTH & OVERVIEW
   ========================================================================= */

export async function adminLogin(credentials: {
  email: string;
  password: string;
}): Promise<{ token: string; user: AdminUser; message: string }> {
  return apiClient('/admin/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function adminLogout(): Promise<{ message: string }> {
  return apiClient('/admin/logout', { method: 'POST' });
}

export async function getAdminMe(): Promise<{ user: AdminUser }> {
  return apiClient('/admin/me');
}

export async function getAdminStats(): Promise<{
  stats: {
    total_products: number;
    available_products: number;
    out_of_stock: number;
    featured_products: number;
    total_categories: number;
    total_brands: number;
    active_promotions: number;
    unread_messages: number;
  };
  recent_products: Product[];
  recent_messages: ContactMessage[];
}> {
  return apiClient('/admin/stats');
}

/* =========================================================================
   ADMIN PRODUCTS CRUD
   ========================================================================= */

export async function getAdminProducts(params?: {
  page?: number;
  search?: string;
  category_id?: number;
  brand_id?: number;
  is_available?: boolean;
}): Promise<PaginatedResponse<Product>> {
  return apiClient('/admin/products', { params });
}

export async function getAdminProduct(id: number): Promise<Product> {
  return apiClient(`/admin/products/${id}`);
}

export async function createAdminProduct(formData: FormData): Promise<{
  message: string;
  product: Product;
}> {
  return apiClient('/admin/products', {
    method: 'POST',
    body: formData,
  });
}

export async function updateAdminProduct(
  id: number,
  formData: FormData
): Promise<{ message: string; product: Product }> {
  return apiClient(`/admin/products/${id}`, {
    method: 'POST',
    body: formData,
  });
}

export async function deleteAdminProduct(id: number): Promise<{ message: string }> {
  return apiClient(`/admin/products/${id}`, {
    method: 'DELETE',
  });
}

export async function uploadAdminProductImage(
  productId: number,
  file: File,
  isPrimary: boolean = false
): Promise<{ message: string; image: any }> {
  const formData = new FormData();
  formData.append('image', file);
  if (isPrimary) formData.append('is_primary', '1');

  return apiClient(`/admin/products/${productId}/images`, {
    method: 'POST',
    body: formData,
  });
}

export async function deleteAdminProductImage(
  imageId: number
): Promise<{ message: string }> {
  return apiClient(`/admin/products/images/${imageId}`, {
    method: 'DELETE',
  });
}

export async function setAdminPrimaryProductImage(
  imageId: number
): Promise<{ message: string }> {
  return apiClient(`/admin/products/images/${imageId}/primary`, {
    method: 'PUT',
  });
}

/* =========================================================================
   ADMIN CATEGORIES CRUD
   ========================================================================= */

export async function getAdminCategories(): Promise<Category[]> {
  return apiClient('/admin/categories');
}

export async function createAdminCategory(
  formData: FormData
): Promise<{ message: string; category: Category }> {
  return apiClient('/admin/categories', {
    method: 'POST',
    body: formData,
  });
}

export async function updateAdminCategory(
  id: number,
  formData: FormData
): Promise<{ message: string; category: Category }> {
  return apiClient(`/admin/categories/${id}`, {
    method: 'POST',
    body: formData,
  });
}

export async function deleteAdminCategory(id: number): Promise<{ message: string }> {
  return apiClient(`/admin/categories/${id}`, {
    method: 'DELETE',
  });
}

/* =========================================================================
   ADMIN BRANDS CRUD
   ========================================================================= */

export async function getAdminBrands(): Promise<Brand[]> {
  return apiClient('/admin/brands');
}

export async function createAdminBrand(
  formData: FormData
): Promise<{ message: string; brand: Brand }> {
  return apiClient('/admin/brands', {
    method: 'POST',
    body: formData,
  });
}

export async function updateAdminBrand(
  id: number,
  formData: FormData
): Promise<{ message: string; brand: Brand }> {
  return apiClient(`/admin/brands/${id}`, {
    method: 'POST',
    body: formData,
  });
}

export async function deleteAdminBrand(id: number): Promise<{ message: string }> {
  return apiClient(`/admin/brands/${id}`, {
    method: 'DELETE',
  });
}

/* =========================================================================
   ADMIN PROMOTIONS CRUD
   ========================================================================= */

export async function getAdminPromotions(): Promise<Promotion[]> {
  return apiClient('/admin/promotions');
}

export async function createAdminPromotion(
  formData: FormData
): Promise<{ message: string; promotion: Promotion }> {
  return apiClient('/admin/promotions', {
    method: 'POST',
    body: formData,
  });
}

export async function updateAdminPromotion(
  id: number,
  formData: FormData
): Promise<{ message: string; promotion: Promotion }> {
  return apiClient(`/admin/promotions/${id}`, {
    method: 'POST',
    body: formData,
  });
}

export async function toggleAdminPromotion(
  id: number
): Promise<{ message: string; is_active: boolean }> {
  return apiClient(`/admin/promotions/${id}/toggle`, {
    method: 'PUT',
  });
}

export async function deleteAdminPromotion(id: number): Promise<{ message: string }> {
  return apiClient(`/admin/promotions/${id}`, {
    method: 'DELETE',
  });
}

/* =========================================================================
   ADMIN SETTINGS & MESSAGES
   ========================================================================= */

export async function getAdminSettings(): Promise<{
  settings: any[];
  grouped: Record<string, any[]>;
  keyed: Record<string, any>;
}> {
  return apiClient('/admin/settings');
}

export async function updateAdminSettings(settings: Record<string, any>): Promise<{
  message: string;
}> {
  return apiClient('/admin/settings', {
    method: 'POST',
    body: JSON.stringify({ settings }),
  });
}

export async function uploadAdminFile(
  file: File,
  folder: string = 'settings'
): Promise<{ url: string; message: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  return apiClient('/admin/upload', {
    method: 'POST',
    body: formData,
  });
}

export async function getAdminMessages(
  page: number = 1
): Promise<PaginatedResponse<ContactMessage>> {
  return apiClient('/admin/messages', { params: { page } });
}

export async function markAdminMessageAsRead(
  id: number
): Promise<{ message: string; contact_message: ContactMessage }> {
  return apiClient(`/admin/messages/${id}/read`, { method: 'PUT' });
}

export async function deleteAdminMessage(id: number): Promise<{ message: string }> {
  return apiClient(`/admin/messages/${id}`, { method: 'DELETE' });
}
