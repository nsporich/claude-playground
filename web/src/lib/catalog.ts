import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { AssetCategory, Catalog, CatalogAsset } from "./types";

// process.cwd() returns the web/ directory when running under Next.js
const REPO_ROOT = path.resolve(process.cwd(), "..");

/**
 * Reads catalog.json from the repo root and returns a typed Catalog object.
 * Each asset gets its `category` field populated based on which array it belongs to.
 */
export function getCatalog(): Catalog {
  const catalogPath = path.resolve(REPO_ROOT, "catalog.json");
  const raw = fs.readFileSync(catalogPath, "utf-8");
  const data = JSON.parse(raw) as Record<string, Omit<CatalogAsset, "category">[]>;

  const categories: AssetCategory[] = ["agents", "skills"];
  const catalog: Catalog = { agents: [], skills: [] };

  for (const category of categories) {
    catalog[category] = (data[category] ?? []).map((asset) => ({
      ...asset,
      category,
    }));
  }

  return catalog;
}

/**
 * Returns a flat array of all assets across all categories.
 */
export function getAllAssets(): CatalogAsset[] {
  const catalog = getCatalog();
  return [...catalog.agents, ...catalog.skills];
}

/**
 * Returns a single CatalogAsset by category and slug, or undefined if not found.
 */
export function getAsset(
  category: AssetCategory,
  slug: string,
): CatalogAsset | undefined {
  const catalog = getCatalog();
  return catalog[category].find((asset) => asset.slug === slug);
}

/**
 * Reads the raw .md file for an asset, strips YAML frontmatter, and returns
 * the markdown body as a string.
 */
export function getAssetContent(asset: CatalogAsset): string {
  const filePath = path.resolve(REPO_ROOT, asset.path);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { content } = matter(raw);
  return content.trim();
}

/**
 * Returns unique sorted group names for a given category.
 */
export function getAllGroups(category: AssetCategory): string[] {
  const catalog = getCatalog();
  const groups = new Set(
    catalog[category]
      .map((asset) => asset.group)
      .filter((g): g is string => !!g),
  );
  return [...groups].sort();
}

/**
 * Returns unique sorted tags across all assets.
 */
export function getAllTags(): string[] {
  const assets = getAllAssets();
  const tags = new Set(assets.flatMap((asset) => asset.tags));
  return [...tags].sort();
}
