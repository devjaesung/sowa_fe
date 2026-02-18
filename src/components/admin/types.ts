export type TabKey = "dashboard" | "categories" | "portfolio" | "inquiries" | "settings";
export type NoticeTone = "success" | "error";
export type PortfolioEditorMode = "create" | "edit" | null;
export type CategoryEditorMode = "create" | "edit" | null;

export interface NoticeState {
  tone: NoticeTone;
  message: string;
}

export interface CategoryFormState {
  name: string;
  order: string;
}

export interface PortfolioFormState {
  id: string;
  category_id: string;
  title: string;
  description: string;
  is_featured: boolean;
  order: string;
  image: File | null;
}

export interface SettingsFormState {
  site_title: string | undefined;
  hero_title: string | undefined;
  hero_subtitle: string | undefined;
  logo_image: File | null;
  hero_image: File | null;
}
