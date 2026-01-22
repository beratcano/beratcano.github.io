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
│   ├── header.html         # Shared header
│   └── footer.html         # Shared footer
├── skills/index.html       # Skills page with compass chart
├── portfolio/index.html    # Portfolio page
├── contact/index.html      # Contact page
├── shotglow/               # Screenshot beautifier tool
├── circlegraph/            # Leaf Chroma plant visualization
└── league/                 # League Hub gaming stats
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

## Key Patterns
- Fetch-based HTML includes for header/footer (`js/include.js`)
- CSS custom properties for theming with `[data-theme="dark"]` selector
- Theme toggle saves preference to localStorage
- JSON data sources for dynamic content
- Canvas API for image processing (ShotGlow)
- SVG for data visualization (Circle Graph, Skills Compass)

## Development Commands
```bash
# Local development - use any static server
python -m http.server 8000
# or
npx serve .

# Deploy - just push to main branch
git add . && git commit -m "message" && git push
```

## Current Pages
1. **Home** - Landing with intro and about
2. **Skills** - Interactive compass chart
3. **Portfolio** - Project showcase
4. **Contact** - Social links and email

## Special Projects
1. **ShotGlow** - Screenshot beautifier with gradients
2. **Leaf Chroma / Circle Graph** - Seasonal plant visualization
3. **League Hub** - Gaming statistics dashboard

## Conventions
- Use CSS custom properties for colors (defined in css/style.css)
- Keep JavaScript vanilla (no frameworks)
- Use Devicons for tech stack icons
- Use Lucide Icons for UI icons
- Mobile-first responsive design
- Support both light and dark themes
