export interface IngredientDetail {
  name: string;
  safety: 'Safe' | 'Moderate' | 'Hazardous';
  description: string;
  category: string;
}

export interface AnalysisReport {
  id: string;
  username: string;
  product_name: string;
  company_name: string;
  image_path?: string;
  ingredients_raw: string;
  ingredients_list: string[];
  safety_score: number; // Float or Integer
  safety_level: 'Safe' | 'Moderate' | 'Hazardous';
  allergens: string[];
  ingredients_details: IngredientDetail[];
  summary: string;
  recommendations: string[];
  created_at: string;
}

export interface AnalysisStep {
  id: 'upload' | 'ocr' | 'extraction' | 'analysis' | 'formatting' | 'storage';
  label: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message?: string;
}

export interface User {
  username: string;
  email: string;
  token?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  error?: string;
}

