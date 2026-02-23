export type AssetCategory = "agents" | "skills";

export interface CatalogAsset {
  name: string;
  slug: string;
  description: string;
  tags: string[];
  group?: string;
  path: string;
  category: AssetCategory;
  requires?: { skills: string[]; agents: string[] };
  suggests?: { agents: string[] };
  features?: string[];
  used_by?: string[];
}

export interface Catalog {
  agents: CatalogAsset[];
  skills: CatalogAsset[];
}
