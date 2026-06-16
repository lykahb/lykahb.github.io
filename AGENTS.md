# Agent Instructions

This is a Zola static site.

## Run Locally

Prefer serving the site for routine development and Playwright verification:

```sh
zola serve --interface 127.0.0.1 --port 1111 --force
```

After editing files, reload or navigate the Playwright page after Zola's live-reload rebuild has completed, and wait for a concrete expected page change before asserting.

Use `zola check` for low-write validation when changes affect Zola inputs such as `zola.toml`, Markdown content, front matter, templates, shortcodes, Sass, internal links, or taxonomy/page structure:

```sh
zola check --skip-external-links
```

`zola check` tries to build pages without writing output to disk. It is not enough by itself for changes that Zola treats mostly as static served assets, such as JavaScript, standalone HTML, images, or plain CSS. For those, verify through `zola serve` and browser/Playwright checks that exercise the changed asset.

Use a production build only when you specifically need to validate generated output in `public/`:

```sh
zola build
```

The generated site is written to Zola's default `public/` directory.

## Development Notes

Treat `public/` and `docs/` as generated output. Do not manually edit files under either directory during routine changes. Edit the corresponding source files under `content/`, `static/`, `templates/`, `sass/`, or other source directories instead, then let Zola regenerate or serve the result.

The `master` branch is the development/source branch. Publish generated static files from the root of the `gh-pages` branch. Use `scripts/publish-gh-pages.sh` to build `public/` and update the local `gh-pages` branch; pushing `gh-pages` remains a separate manual step.

Use `dev-docs/` for source-only design notes, behavior contracts, and test plans that should not be part of the public static site. Do not place these files under `content/`, `static/`, `templates/`, or generated `docs/` unless they are intentionally public site assets.
