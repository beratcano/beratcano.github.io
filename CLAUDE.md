# Portfolio Website - Claude Code Init

## Project Overview
Personal portfolio website for Berat Can, hosted on GitHub Pages.

**Live URL:** https://beratcano.github.io (custom domain pending setup)
**Repository:** beratcano/beratcano.github.io

## Tech Stack
- Pure HTML5, CSS3, Vanilla JavaScript (no frameworks)
- GitHub Pages for hosting
- No build process - direct static file deployment

## Project Structure
```
/
├── index.html              # Home page
├── style.css               # Main styles
├── header.css              # Header component styles
├── footer.css              # Footer component styles
├── include.js              # Dynamic header/footer inclusion
├── skills-chart.js         # Skills compass chart logic
├── skills-data.json        # Skills data
├── categories.json         # Skill categories
├── components/
│   ├── header.html         # Shared header
│   └── footer.html         # Shared footer
├── skills/index.html       # Skills page with compass chart
├── portfolio/index.html    # Portfolio page (placeholder)
├── contact/index.html      # Contact page
├── shotglow/               # Screenshot beautifier tool
├── circlegraph/            # Leaf Chroma plant visualization
└── league/                 # League Hub gaming stats
```

## Design System
- **Background:** #0A0A0A
- **Text:** #E0E0E0
- **Accent:** #00FFFF (cyan)
- **Borders:** #333333
- **Fonts:** IBM Plex Mono (headings), Inter (body), Playfair Display (italics)

## Key Patterns
- Fetch-based HTML includes for header/footer (`include.js`)
- CSS custom properties for theming
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
3. **Portfolio** - Under construction
4. **Contact** - Social links and email

## Special Projects
1. **ShotGlow** - Screenshot beautifier with gradients
2. **Circle Graph / Leaf Chroma** - Seasonal plant visualization
3. **League Hub** - Gaming statistics dashboard

## Conventions
- Use CSS custom properties for colors
- Keep JavaScript vanilla (no frameworks)
- Use Devicons for tech stack icons
- Use Lucide Icons for UI icons
- Mobile-first responsive design
- Maintain dark theme consistency
