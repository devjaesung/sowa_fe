export interface InquiryItem {
  id: number;
  title: string;
  name: string;
  createdAt: string;
  hasReply: boolean;
}

export interface PortfolioItem {
  id: number;
  title: string;
  category: "주거" | "상업" | "오피스";
  year: string;
  area: string;
  summary: string;
  image: string;
}
