import type { Metadata } from "next";
import { getAllAssets, getAllTags } from "@/lib/catalog";
import BrowseClient from "./BrowseClient";

export const metadata: Metadata = {
  title: "Browse | Claude Playground",
};

export default function BrowsePage() {
  const assets = getAllAssets();
  const allTags = getAllTags();

  return <BrowseClient assets={assets} allTags={allTags} />;
}
