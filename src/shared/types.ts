export type Toast = {
  kind: "ok" | "error";
  message: string;
};

export type Projects = {
  id: number;
  title: string;
  category: string;
  area: string;
  year: string;
  image: string;
};
