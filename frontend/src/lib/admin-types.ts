export const ADMIN_PRODUCT_CATEGORIES = ['art', 'sale'] as const;

export type AdminProductCategory = (typeof ADMIN_PRODUCT_CATEGORIES)[number];
export type AdminProductCategoryFilter = AdminProductCategory | 'all';

export interface AdminImage {
  id: string;
  url: string;
  sort_order: number;
}

type AdminProductBase = {
  id: string;
  category: AdminProductCategory;
  title_ko: string;
  title_en: string;
  price_krw: number;
  price_usd?: number | null;
  is_available: boolean;
};

export interface AdminProductSummary extends AdminProductBase {
  images?: Array<Pick<AdminImage, 'url'>>;
}

export interface AdminProductDetail extends AdminProductBase {
  description_ko: string;
  description_en: string;
  images?: AdminImage[];
}

export interface AdminProductFormData {
  category: AdminProductCategory;
  title_ko: string;
  title_en: string;
  description_ko: string;
  description_en: string;
  price_krw: number;
  price_usd: number;
  is_available: boolean;
  images: AdminImage[];
}

export interface AdminProductFormInitialData
  extends Partial<AdminProductFormData> {
  id?: string;
}

export const ADMIN_ORDER_STATUSES = [
  'pending',
  'paid',
  'shipped',
  'cancelled',
] as const;

export type AdminOrderStatus = (typeof ADMIN_ORDER_STATUSES)[number];

export interface AdminOrderItem {
  product_id: string;
  title_en: string;
  quantity: number;
  price: number;
  currency: string;
}

export interface AdminOrder {
  id: string;
  email: string;
  total: number;
  currency: string;
  status: AdminOrderStatus;
  created_at: string;
  items?: AdminOrderItem[];
}

export interface PresignedImageUploadResponse {
  upload_url: string;
  key: string;
  image_id: string;
}
