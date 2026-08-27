# SUMMER — Personal Portfolio (Static, GitHub Pages ready)

This repository contains a static personal portfolio for SUMMER (Communication Arts student, Performance Communication). It's built with HTML, CSS, and vanilla JavaScript and is ready to deploy to GitHub Pages.

Key points
- 0‑baht approach: no paid templates, plugins, APIs, fonts, or hosting required.
- Uses free Google Fonts (optional — you may replace with local fonts).
- Data-driven project structure: edit `projects/data.json` to add/update projects.
- All media stored under `assets/images/projects/{project-id}/` (you create the folders and add images).

Recommended repository structure:
/
├── index.html
├── about.html
├── work.html
├── experience.html
├── contact.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── assets/
│   ├── images/
│   │   └── projects/
│   └── placeholder files...
└── projects/
    └── data.json
    └── project.html

How to deploy on GitHub Pages
1. Create a new **public** repository on GitHub (or use an existing one).
2. Push all files above to the repository root.
   - You can use GitHub.com's upload UI, GitHub Desktop, or git from terminal.
3. In the repository, go to Settings → Pages (or Settings → Code and automation → Pages).
4. Under "Source" select "Deploy from a branch", choose the default branch (e.g., `main`), and save.
5. GitHub will publish the site at `https://<your-username>.github.io/<repo-name>/`. It can take a minute.

Editing notes — easy place to update content
- Add or edit projects:
  - Open `/projects/data.json`. Each project has an `id` (slug). Create a folder `assets/images/projects/{id}/` and upload project images named in `images` array.
  - Fields:
    - id: unique slug (used in URL `projects/project.html?id={id}`)
    - title, type, categories (array), role, year, achievement (optional)
    - images: list of image paths relative to site root (e.g., `assets/images/projects/break-the-silent/1.jpg`)
    - videos: list of embeddable links (YouTube embed URL e.g. `https://www.youtube.com/embed/VIDEO_ID`)
    - concept, myRole, process: HTML strings (simple paragraphs)
    - links: array of { "label": "YouTube", "url": "https://..." } objects
- Replace images:
  - Put images into `assets/images/projects/{id}/` using the same filenames referenced in `projects/data.json`.
  - Use web-optimized images (JPEG/WEBP) sized appropriately for a web display (1200px width is adequate).
- Add a new page:
  - Use existing page templates as a model.
- Update fonts:
  - The site currently loads Google Fonts in each HTML head. If you prefer not to load external fonts, replace font-family rules in `css/styles.css` with system fonts and remove the Google Fonts <link> tags.

Accessibility & performance tips
- Keep images compressed. Use modern formats (WebP) where possible.
- Provide meaningful alt text for images in `projects/data.json` (currently placeholders).
- Avoid adding heavy JS libraries. The site uses small vanilla JS for interactivity.

Troubleshooting
- If project pages show "Project not found", verify:
  - `projects/data.json` contains an item with the matching `id`
  - The `projects/data.json` is reachable at `/projects/data.json`
  - Browser caching — do a hard refresh (Ctrl/Cmd+Shift+R)
- If images do not appear, check the path under `assets/images/...` and filenames.

License & assets
- This template is free to use and adapt.
- Replace any placeholder images with your own or free assets. If you use any third-party free assets that require attribution, store the attribution in a text file `assets/ATTRIBUTIONS.txt`.

If you'd like, I can:
- Generate ready-to-drop placeholder images (free stock/CC0) and add them to the assets folder.
- Convert the site to a single-file portfolio (for easy upload).
- Create a small resume/printable PDF template that matches the site style.

Enjoy — and when you're ready, tell me your GitHub repo name and I can push these files directly into it for you.
