import type { PortfolioImage } from "../../api/types";

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
  parent: string; // 빈 문자열 = 대분류, 숫자 문자열 = 소분류의 상위 카테고리 id
}

export interface PortfolioFormState {
  id: string;
  category_id: string;
  title: string;
  description: string;
  is_featured: boolean;
  order: string;
  images: File[];            // 새로 업로드할 파일들
  existingImages: PortfolioImage[]; // 편집 시 현재 등록된 이미지
}

export interface SettingsFormState {
  site_title: string | undefined;
  hero_title: string | undefined;
  hero_subtitle: string | undefined;
  logo_image: File | null;
  hero_image: File | null;
}
