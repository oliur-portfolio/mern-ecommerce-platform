export type TUserRole = "admin" | "manager" | "employee" | "intern";
export type TUserStatus = "active" | "blocked";

export interface IImage {
  url: string;
  publicId: string;
}

export interface IProduct {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  rating: number;
  images: IImage[];
  createdAt: string;
  updatedAt: string;
}

export interface IGetProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  search?: string;
  sort?: "latest" | "oldest" | "price_asc" | "price_desc" | "rating_desc";
}

export interface IGetProductsResponse {
  success: boolean;
  message: string;
  products: IProduct[];
  totalProducts?: number;
  currentPage?: number;
  totalPages?: number;
}
