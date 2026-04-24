# Claude Code Notes

## When adding a new route or project

Whenever a new page, project, or route is added, update **both** of the following or social previews and search indexing will break:

1. **`scripts/prerender.mjs`** — Add an entry to the `routes` array with `path`, `title`, and `description`. This bakes static OG/Twitter meta tags into the built HTML so iMessage, Discord, Slack, and search engines can read them.

2. **`public/sitemap.xml`** — Add a `<url><loc>...</loc></url>` entry for the new route using `https://danielocheltree.com`.

Both files use `danielocheltree.com` as the canonical domain — keep that consistent.
