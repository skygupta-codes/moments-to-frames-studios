# Moments To Frames Studio: Master Build Prompt

*To recreate this exact website from scratch, provide an AI Assistant (or human developer) with the following comprehensive prompt and ensure they have access to the original image assets.*

***

**Role & Objective:**
You are an expert web developer and UI/UX designer. Your objective is to build a premium, timeless photography studio website from scratch for "Moments To Frames Studio." 

**Technical Stack:**
The project must be built using purely static, vanilla web technologies for maximum performance and simplicity:
- `index.html` (Homepage)
- `maternity-portfolio.html` (Gallery Page)
- `styles.css` (All styling)
- `main.js` (All interactive logic)
*Do not use heavy frameworks like React, Next.js, Bootstrap, or TailwindCSS.*

**Design System & Aesthetics:**
The website must closely mimic the premium structure, layout, and luxurious aesthetic of `https://www.studiobellemere.com/`. 
- **Color Palette:** 
  - Primary: Black (`#000000`) & White (`#ffffff`) for maximum contrast.
  - Accents: Warm off-white (`#F2F2EF`) and Taupe/Beige (`#EAE9E5`) for backgrounds.
- **Typography:**
  - Headings: `Playfair Display` (google font).
  - Body Text: `Lora` (google font).
  - UI/Navigation: Elegant, widely tracked, uppercase sans-serif (`Helvetica Neue` or `Arial`).

---

### Core Page Requirements: `index.html`

**1. Header Navigation:**
- Fixed/sticky to the top. Transparent on initial load over the hero banner, transitioning to solid black when scrolled.
- Features a highly prominent, oversized, centered logo text: "MOMENTS TO FRAMES".
- Split navigation lines in uppercase and tracked out (Left: PORTFOLIO, SERVICES, BLOG | Right: CONTACT, ABOUT, INSTAGRAM).
- Must include a responsive mobile hamburger menu overlay.

**2. Hero Image Slider:**
- A full-screen horizontal ticker/slider showing three portrait-oriented photos touching edge-to-edge.
- Uses native JavaScript to infinitely append/prepend to a flex-track, resulting in a smooth, continuous slide from right to left.

**3. Statement Section:**
- A stark, dark-mode (`bg-black`) full-width section directly underneath the hero slider (no gap). 
- Features a small italicized serif subtitle, a large elegant serif main title ("OTTAWA MATERNITY & FAMILY PHOTOGRAPHY STUDIO"), heavily tracked small sans-serif tags below it, and a "WORK WITH US" outline button.

**4. About Section:**
- A simple, elegant, full-width centered text layout set below the dark Statement Section. 
- **Important Connection:** This section must have its background color match the Services section (`bg-white`) and have reduced top/bottom padding so it seamlessly integrates and flows into the photo grid below it without a harsh break.
- Use the following specific copy (2 paragraphs):
  * "Moments to Frames Studio is a boutique maternity and family photography studio located in Barrhaven, Ottawa. We offer more than portrait photography—we provide a thoughtfully curated experience designed to celebrate the magic of the wait and the beauty of timeless family bonds. From personalized styling guidance to gentle, natural posing, every detail is intentionally crafted to help you feel confident, radiant, and connected during this meaningful season."
  * "Our studio proudly serves families across Barrhaven, Nepean, Kanata, Manotick, and throughout Ottawa. Many of our maternity and family portrait clients also travel from surrounding communities across the region to document their most cherished milestones with us."
- **Styling Note:** Ensure the body text font size is considerably small and delicate (e.g., `0.9rem`) with a generous line height (e.g., `2.2`) to match the refined aesthetic of the Belle Mère reference.

**5. Services Highlight:**
- A responsive 2-column aesthetic layout highlighting "Maternity Portraits" and "Family Portraits".
- Each card should include "FROM $300" pricing and an interactive "LEARN MORE" button.
- Use JavaScript to create an expanding/collapsing accordion toggle for the Learn More button, revealing detailed session bullet points smoothly without cluttering the initial view.

**5. Testimonial Slider:**
- A minimal text-only block featuring an italicized serif quote from a client.
- Uses JavaScript to smoothly fade between an array of 5 testimonials every 5 seconds. 
- Must include small left/right navigational arrows and an indicator (e.g., "1/5"). Manual interaction must pause/reset the auto-slide timer.

**6. Location Section:**
- A responsive Google Maps `<iframe>` set to 100% width, centering on "K2G 7A2". 
- Beneath the map, use CSS flexbox to align "OUR LOCATION" to the left, and the physical address ("OTTAWA, ONTARIO | K2G 7A2") beautifully justified to the right.

**7. Instagram Grid & CTA:**
- A touching edge-to-edge 5-image horizontal row showcasing recent work.
- An "INQUIRE NOW" call-to-action button linking directly to the studio's Honeybook widget.

**8. Universal Footer & Sticky Element:**
- **Footer:** Deep black background with white text. Includes redundant navigation links, the studio logo, the address, and the contact email: `INFO@MOMENTSTOFRAMES.COM`. Social "INSTAGRAM" link must route to `https://instagram.com/momentstoframesstudio`.
- **Sticky CTA:** A small, aesthetically pleasing "BOOK NOW" button fixed to the bottom-right corner of the viewport permanently, linking to Honeybook. 

---

### Secondary Page Requirements: `maternity-portfolio.html`

**1. Layout Replication:**
- Must utilize the exact same header (nav) and footer configurations constructed in `index.html`. 

**2. Masonry Gallery:**
- Since the provided portrait assets will feature wildly varying aspect ratios (horizontals and verticals mixed together), standard CSS grids will leave awkward vertical gaps. 
- You MUST implement a true CSS Masonry layout using `column-count: 3;` (desktop) scaling down to `column-count: 1;` (mobile). 
- Iterate through all 21 curated image assets in the `images/` directory and wrap them carefully in `inline-block` divs with 100% width images to allow them to cascade smoothly down the screen.
- Set the `maternity-portfolio.html` link to be the active/primary link when users click "PORTFOLIO" on the site nav.

---

### Final Technical Directives:
- Ensure all external links (Instagram, Honeybook) use `target="_blank" rel="noopener noreferrer"`.
- Use CSS transitions (e.g., `transition: 0.3s ease;`) globally for hover states across all buttons and anchor tags to create a luxurious interaction feel.
- Images should feature subtle zoom-on-hover effects (`transform: scale(1.02);`) inside the portfolio cascades to promote interactivity.
