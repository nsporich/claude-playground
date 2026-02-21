export type AssetCategory = "skills" | "templates" | "prompts";

export interface CatalogAsset {
  name: string;
  slug: string;
  description: string;
  tags: string[];
  group: string;
  path: string;
  category: AssetCategory;
}

export interface Catalog {
  skills: CatalogAsset[];
  templates: CatalogAsset[];
  prompts: CatalogAsset[];
}
