# Kadmia Constructions — Website Reference

## Site Structure

| Page | File | Description |
|------|------|-------------|
| Home | `kadmia.html` | Hero, stats, services grid, about, project carousel, process summary |
| Services | `kadmia-services.html` | Tabbed interface — 4 service cards that switch content panels |
| Projects | `kadmia-projects.html` | 3 project rows (Linda St, Smart St, Radian) with carousels + lightbox |
| Process | `kadmia-process.html` | 5-stage timeline — Consultation, Design, Approvals, Construction, Handover |
| Calculator | `estimator.html` | Cost calculator with per-m² rates, location multipliers, inclusions/upgrades |
| Contact | `kadmia-contact.html` | Contact details (email, phone, hours, service area) + enquiry form with file upload |

### Shared Styles
- **`styles.css`** — Shared nav, footer, typography, buttons, variables, responsive breakpoints
- **Fonts** — Bebas Neue (headings), Barlow Condensed (nav, labels), Barlow (body)

---

## Navigation Items
`Home | Services | Projects | Process | Calculator | Contact`

---

## Calculator Parameters

### Base Rates (per m²) — reduced 10%
| Project Type | Standard | Premium | Luxury |
|---|---|---|---|
| Knock Down Re-Build | $1,980 | $2,700 | $3,780 |
| Custom Home | $1,890 | $2,610 | $3,600 |
| Granny Flat | $2,160 | $2,880 | $4,050 |
| Duplex / Multi-Occupancy | $1,800 | $2,520 | $3,420 |
| Major Renovation | $1,620 | $2,250 | $3,150 |

### Storey Multiplier
| Storeys | Multiplier |
|---|---|
| Single | 1.00× |
| Double | 0.90× |
| Triple | 0.84× |

### Location Multipliers
| Region | Multiplier |
|---|---|
| Eastern Suburbs | 1.22× |
| North Shore | 1.18× |
| Inner West | 1.12× |
| Hills District | 1.06× |
| Sutherland Shire | 1.04× |
| Western Sydney | 0.93× |
| South Western Sydney | 0.90× |
| Central Coast | 0.88× |

### Additional Cost Layers
- Site Costs: 5% of base construction
- Council Approvals: 3.5% of base construction
- No contingency (removed)

### Inclusions & Upgrades (fixed)
| Feature | Cost |
|---|---|
| Double Garage with Internal Access | $32,000 |
| In-ground Concrete Pool | $55,000 |
| Covered Alfresco with Outdoor Kitchen | $28,000 |
| Ducted Air Conditioning Throughout | $14,000 |
| Hybrid Timber / Herringbone Flooring | $18,000 |
| Stone Benchtops Throughout | $12,000 |
| Smart Home Wiring & Security | $8,000 |
| Solar Panel System (6.6kW) | $7,000 |
| Landscaping Package | $15,000 |

---

## Image Inventory
- **Print-Me-1.jpg → Print-Me-16.jpg** — Linda Street project photos
- **Web-01.jpg → Web-14.jpg** — Smart Street project photos
- Radian project currently uses placeholder images (Print-Me-9 through 16) — real photos needed

---

## Key Technical Details

- **Nav fix**: All pages have `width: 100%; box-sizing: border-box;` on the `<nav>` element
- **Scrollbar stability**: `styles.css` sets `scrollbar-gutter: stable` on `<html>` to prevent layout shift
- **Lightbox scrollbar**: Projects page measures scrollbar width and applies `padding-right` to body before hiding overflow
- **Carousel sizing**: Projects page uses JavaScript (`sizePhotos()`) to calculate photo widths at runtime based on actual wrapper width
- **Contact email**: `info@kadmia.com.au`
- **ABN**: 31 686 498 519
- **Form not connected to backend**: Uses placeholder success message — ready for Netlify Forms or similar

---

## Known To-Do
- [ ] Radian project needs real photos (currently using Print-Me placeholders)
- [ ] Connect contact form to backend (Netlify Forms recommended)
- [ ] Add favicon
- [ ] Add meta descriptions and Open Graph tags for SEO
- [ ] Verify phone number (currently 0400 000 000 placeholder)
- [ ] Verify licence number (currently 000000 placeholder)
