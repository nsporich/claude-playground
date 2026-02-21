import Link from "next/link";
import { getCatalog } from "@/lib/catalog";
import AssetCard from "@/components/AssetCard";
import InstallCommand from "@/components/InstallCommand";

export default function Home() {
  const catalog = getCatalog();

  const skillCount = catalog.skills.length;
  const templateCount = catalog.templates.length;
  const promptCount = catalog.prompts.length;

  // Pick one featured asset from each category
  const featured = [
    catalog.skills[0],
    catalog.templates[0],
    catalog.prompts[0],
  ].filter(Boolean);

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="pt-8 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">
          Claude Playground
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          A curated collection of reusable Claude Code skills, templates, and
          prompts.
        </p>
        <div className="mx-auto mt-8 max-w-2xl">
          <InstallCommand command="curl -fsSL https://raw.githubusercontent.com/USER/claude-playground/main/install.sh | bash" />
        </div>
      </section>

      {/* Stats */}
      <p className="text-center text-sm text-gray-500">
        {skillCount} skills, {templateCount} templates, {promptCount} prompts
        available
      </p>

      {/* Featured */}
      <section>
        <h2 className="mb-6 text-2xl font-semibold text-gray-900">Featured</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((asset) => (
            <AssetCard key={asset.slug} asset={asset} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="text-center">
        <Link
          href="/browse"
          className="inline-block rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-700"
        >
          Browse all assets
        </Link>
      </div>
    </div>
  );
}
