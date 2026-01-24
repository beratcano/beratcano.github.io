# Portfolio Website - Claude Code Context

## Project Overview
Personal portfolio website for Berat Can, hosted on GitHub Pages.

**Live URL:** https://beratcan.me
**Repository:** beratcano/beratcano.github.io

## Tech Stack
- Pure HTML5, CSS3, Vanilla JavaScript (no frameworks)
- GitHub Pages for hosting
- No build process - direct static file deployment

## Project Structure
```
/
├── index.html              # Home page
├── 404.html                # Custom 404 page
├── cv.pdf                  # Downloadable CV
├── CNAME                   # Custom domain config
├── css/
│   ├── style.css           # Main styles + theme variables
│   ├── header.css          # Header component styles
│   └── footer.css          # Footer component styles
├── js/
│   ├── include.js          # Dynamic header/footer inclusion
│   ├── theme-toggle.js     # Light/dark theme switching
│   └── skills-chart.js     # Skills compass chart logic
├── includes/
│   ├── header.html         # Shared header (nav + actions)
│   └── footer.html         # Shared footer
├── skills/index.html       # Skills page with compass chart
├── portfolio/
│   ├── index.html          # Lab landing (Design/Dev split)
│   ├── design/index.html   # Design projects grid
│   └── development/index.html  # Dev projects with filtering
├── contact/index.html      # Contact page
├── shotglow/
│   ├── index.html          # Screenshot beautifier app
│   └── about/index.html    # Case study page
├── circlegraph/
│   ├── index.html          # Leaf Chroma app
│   └── about/index.html    # Case study page
├── league/
│   ├── index.html          # League Hub app
│   └── about/index.html    # Case study page
```

## Design System

### Light Theme (Default)
- **Background:** #FAFAFA
- **Background Secondary:** #FFFFFF
- **Text:** #1A1A1A
- **Text Secondary:** #666666
- **Accent:** #059669 (emerald green)
- **Accent Hover:** #047857
- **Border:** #E5E5E5

### Dark Theme
- **Background:** #0F0F0F
- **Background Secondary:** #1A1A1A
- **Text:** #E5E5E5
- **Text Secondary:** #A0A0A0
- **Accent:** #34D399 (light emerald)
- **Accent Hover:** #6EE7B7
- **Border:** #2D2D2D

### Fonts
- **Mono:** IBM Plex Mono (code, headings)
- **Sans:** Inter (body text)
- **Serif:** Playfair Display (italic accents)

## Header Components
- Navigation: Home, Skills, Lab, Contact, Blog (Medium)
- Actions: Buy Me a Coffee link, Theme toggle (sun/moon)

## Key Patterns
- Fetch-based HTML includes for header/footer (`js/include.js`)
- CSS custom properties for theming with `[data-theme="dark"]` selector
- Theme toggle saves preference to localStorage
- JSON data sources for dynamic content
- Devicons for skill icons (theme-aware, not colored)
- Canvas API for image processing (ShotGlow)
- SVG for data visualization (Circle Graph, Skills Compass)
- Project cards with "Try it" (new tab) and "Learn more" links
- Case study pages with dual navigation (back to projects / go to app)

## Development Commands
```bash
# Local development - use any static server
python3 -m http.server 8000
# or
npx serve .

# Deploy - just push to main branch
git add . && git commit -m "message" && git push
```

## Current Pages
1. **Home** - Landing with hero, CTAs, and about brief
2. **Skills** - Interactive compass chart with filtering
3. **Lab** - Split into Design and Development sections
4. **Contact** - Availability status, social links, CV download
5. **Blog** - Links to Medium (@beratcano)

## Project Case Studies
Each project has an about page at `/project/about/`:
- **/shotglow/about/** - Screenshot beautifier case study
- **/circlegraph/about/** - Leaf Chroma case study
- **/league/about/** - League Hub case study

## Conventions
- Use CSS custom properties for colors (defined in css/style.css)
- Keep JavaScript vanilla (no frameworks)
- Use Devicons for tech stack icons (plain, not colored)
- Use Lucide-style SVG icons for UI
- Mobile-first responsive design
- Support both light and dark themes
- Nav uses "Lab" instead of "Portfolio"
- Project links open in new tabs
- Case study descriptions clamped to 3 lines on cards
