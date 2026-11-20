export type Language = 'fr' | 'ar';

export interface Category {
  id: number;
  name_fr: string;
  name_ar: string;
  slug: string;
  description_fr?: string | null;
  description_ar?: string | null;
  image_url?: string | null;
  order: number;
  is_active: boolean;
  products_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo_url?: string | null;
  description_fr?: string | null;
  description_ar?: string | null;
  is_active: boolean;
  products_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  is_primary: boolean;
  order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: number;
  name_fr: string;
  name_ar: string;
  slug: string;
  reference: string;
  price: number;
  old_price?: number | null;
  description_fr?: string | null;
  description_ar?: string | null;
  category_id?: number | null;
  brand_id?: number | null;
  gender: 'homme' | 'femme' | 'unisexe' | 'enfant';
  frame_shape: string;
  colors?: string[] | null;
  specifications?: Record<string, string> | null;
  is_available: boolean;
  is_featured: boolean;
  is_new: boolean;
  is_best_seller: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
  category?: Category | null;
  brand?: Brand | null;
  images?: ProductImage[];
  primary_image?: ProductImage | null;
}

export interface Promotion {
  id: number;
  title_fr: string;
  title_ar: string;
  description_fr?: string | null;
  description_ar?: string | null;
  discount_percentage?: number | null;
  promotional_price?: number | null;
  cta_text_fr?: string | null;
  cta_text_ar?: string | null;
  cta_link?: string | null;
  banner_image_url?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface WebsiteSettingItem {
  key: string;
  value_fr?: string | null;
  value_ar?: string | null;
  group?: string;
  type?: string;
}

export type WebsiteSettings = Record<string, WebsiteSettingItem>;

export interface ContactMessage {
  id: number;
  name: string;
  phone?: string | null;
  email?: string | null;
  subject?: string | null;
  message: string;
  product_reference?: string | null;
  is_read: boolean;
  created_at: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number;
  to?: number;
}

export interface CatalogFilters {
  category?: string;
  brand?: string;
  gender?: string;
  shape?: string;
  color?: string;
  price_min?: number;
  price_max?: number;
  is_available?: boolean;
  featured?: boolean;
  new?: boolean;
  best_seller?: boolean;
  promotions?: boolean;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'featured';
  page?: number;
  per_page?: number;
}
