# Kadmia website — what changed (26 October 2026)

Everything in the SEO review that could be implemented in the code is done. This note lists
what changed, what still needs your input, and how to deploy.

**Backup of the originals:** `C:\Users\malka\Documents\New folder\HTML Script - backup 2026-10-26`
The folder is a git repo, so `git diff` will show every change line by line.

---

## 1. Headline numbers

| Page | Images before | Images now (desktop 1x) |
|---|---|---|
| Homepage | **21.0 MB** | **0.52 MB** |
| Blog index | **14.3 MB** | **0.12 MB** |
| Projects (31 photos) | ~45 MB | **0.38 MB** |

That is a 97% reduction on the homepage. On a 10 Mbps connection the homepage photo payload
drops from roughly 17 seconds to under half a second.

---

## 2. Images

- Every photo is now **WebP** at up to four widths (480 / 960 / 1600 px, plus 2000 px for the
  hero), served through `srcset` + `sizes` — phones download the small file, desktops the large one.
- The homepage previously had **zero `<img>` tags** — all photos were CSS `background-image`.
  They are now real `<img>` elements with `alt`, `width`/`height`, `loading="lazy"` and
  `decoding="async"` (hero excepted, which is eager with `fetchpriority="high"`).
- The two remaining **Squarespace CDN URLs** (`Radian-hero.jpg`, `Web-8895.jpg`) are gone.
  Those images are now local, so the site no longer depends on an old hosting account.
- New `og-image.jpg` (1200×630, 118 KB) — previously a 7 MB JPEG declared as 1200×630.
  Replaces the broken social previews.
- New `apple-touch-icon.png` and `favicon-32.png`.
- Blog post hero images and blog card images all converted.

Alt text was written from the actual photographs (e.g. "Kitchen with timber joinery and island
bench"), and on the projects page the existing per-photo `aria-label` captions are reused.

## 3. URLs and canonicals — now one shape everywhere

Every page had three competing URLs (sitemap ≠ canonical ≠ internal links). Now:

- **Clean URLs are canonical**: `/services`, `/projects`, `/process`, `/calculator`, `/contact`,
  `/blog`, `/blog/<slug>`.
- Every internal link, canonical tag, `og:url` and sitemap entry uses that form.
- `vercel.json` adds **308 redirects** from every `.html` URL (including `/index.html`) to its
  clean equivalent, so old links and Google's index consolidate properly.
- `sitemap.xml` rebuilt with clean URLs and true `lastmod` dates.
- Fixed the mismatched blog file: the local file was `blog-sydney-custom-home-costs-by-suburb.html`,
  the deployed file was `blog-custom-home-costs-sydney-suburbs.html`, and `vercel.json` still
  pointed at the old name. Renamed locally, redirect added, stale file removed.

## 4. Titles, descriptions, H1s

| Page | New title (length) | New H1 |
|---|---|---|
| Home | Custom Home Builder Sydney \| Knock Down Rebuilds & Duplexes (59) | Custom Home Builders *in Sydney* |
| Services | Home Building Services Sydney \| Kadmia Constructions (52) | Home Building *Services in Sydney* |
| Projects | Custom Home Projects Sydney \| Kadmia Constructions (50) | Sydney Custom Home *Projects* |
| Process | Our Building Process \| Sydney Custom Home Builder (49) | Our Building *Process* |
| Calculator | Home Building Cost Calculator Sydney \| Kadmia (45) | Sydney Build Cost *Calculator* |
| Contact | Contact \| Custom Home Builder Sydney \| Kadmia (45) | Start Your *Project* (unchanged) |
| Blog | Sydney Home Building Blog \| Costs, Approvals & Advice (53) | unchanged |
| Posts | brand suffix removed (60–66) | unchanged |

Meta descriptions are all now 124–157 characters (homepage was 188).

The homepage H1 had no keyword value at all before ("Your Dream Build Starts Here").
The brand line is preserved as the opening of the hero paragraph.

## 5. Local SEO signals

- **Every page now has a click-to-call button in the nav** (`tel:+61478575251`), visible on
  desktop as a phone number and as an icon under 1280 px.
- **Every footer has NAP**: phone, email, service area and NSW Contractor Licence 102596S —
  plus the existing ABN/ASIC line. Previously only the contact page had a phone number, and no
  page had an address or a licence number.
- The contact page's `Licence No. 000000` placeholder is replaced with
  **NSW Contractor Licence 102596S**, and the licence is also in the `HomeBuilder` schema
  as an `identifier`.
- Footers gained a third column ("Popular Guides") linking the four cost/approval articles.
  That is sitewide internal linking to the blog posts, which previously only had links from `/blog`.
- `LocalBusiness` replaced with **`HomeBuilder`**, with `areaServed`, offer catalogue and NAP.

## 6. Structured data

Every page now carries a JSON-LD graph: `HomeBuilder` + `WebSite` + page type.

| Page | Added |
|---|---|
| Home | `HomeBuilder`, `WebSite` |
| Services | `BreadcrumbList`, `Service` |
| Projects | `BreadcrumbList`, `ItemList` |
| Process | `BreadcrumbList`, `WebPage` |
| Calculator | `BreadcrumbList`, `WebApplication` |
| Blog | `BreadcrumbList`, `Blog` (+ post list) |
| Contact | `BreadcrumbList`, `ContactPage` |
| Posts | `BreadcrumbList`, `BlogPosting` with `image`, `mainEntityOfPage`, `dateModified`, `publisher_logo` |

Previously only the homepage and blog posts had any schema at all.

## 7. Other fixes

- `<html lang="en-AU">` (was `en`).
- `theme-color`, `apple-touch-icon`, `twitter:image` added.
- Skip-to-content link + anchor target (keyboard/screen-reader).
- Branded **404 page** (`404.html`) with links back and a call button.
- `robots.txt` now disallows `/crm`.
- Security headers added to `vercel.json` (`X-Content-Type-Options`, `Referrer-Policy`,
  `X-Frame-Options`, `Permissions-Policy`).
- The projects page lightbox now opens the optimised WebP images (it was loading the 3–7 MB
  originals), and its thumbnails use the 480 px renditions.

## 8. Analytics

**Google Analytics 4 is live on all 13 pages** — measurement ID `G-8MS9XJ03GP`.

It loads asynchronously (`gtag.js` appended after the page is interactive, so it never delays
rendering). Verified working: the tag injects, `gtag` initialises and the config call carries
the correct ID.

Three conversion events fire automatically:

| Event | Fires when |
|---|---|
| `call_click` | any `tel:` link is tapped (nav, footer, contact page) |
| `enquiry_submit` | the contact form is submitted |
| `calculator_complete` | the cost calculator produces an estimate (sends the $ figure as the value) |

Note: `127.0.0.1` pageviews are not filtered — if you ever open the site locally with the real
files, add an internal-traffic filter in GA4 if that bothers you.

---

## 9. What you need to do

### Before you deploy

1. **Search Console** — a domain property may already exist: three
   `google-site-verification` TXT records are already published on `kadmia.com.au`
   (`CRevUv0…`, `nVFiCT…`, `DltuyI…`). Check `search.google.com/search-console` and see whether
   `kadmia.com.au` is listed before creating a new one.

   Note: DNS is **not** on Vercel — the nameservers are `ns-cloud-a1..a4.googledomains.com`
   (Google / Squarespace Domains). Add or change DNS records there, not in the Vercel dashboard.

The licence number (102596S) is now filled in on the contact page, in every footer and in the
schema. The label reads "NSW Contractor Licence" — if your licence is issued under a different
category name, change it in `_build\transform.py` (`LICENCE_LABEL`) and re-run, or just edit the
13 footers and the contact page directly.

### After you deploy

4. **Change the apex redirect from 307 to 308.** `https://kadmia.com.au` currently redirects to
   `https://www.kadmia.com.au` with a *temporary* 307. In Vercel: Project → Settings → Domains →
   set the apex to "Redirect to www" (permanent). A temporary redirect does not pass ranking
   signals the way a permanent one does.
5. **Test the contact form.** It posts to `formsubmit.co`; the first submission triggers an
   activation email you must click. Send one test enquiry and confirm it arrives.
6. **Check the redirects** — visit `https://www.kadmia.com.au/kadmia-services.html` and confirm
   it lands on `/services`, and that `/services` still serves.
7. **Delete the old 20-megapixel originals** from the repo once you're happy: `Print-Me-*.jpg`,
   `Web-*.jpg`, `Marlborough Render.jpg`, `KDR-Image.jpg`, `iStock-502011582.jpg`. They are no
   longer referenced and add ~90 MB to every deployment. `images-src/` holds the two former
   Squarespace images if you ever need them.
8. **Add your business address** to the footer and the `HomeBuilder` schema if you have one —
   it is the one NAP field still missing.

### Content work still outstanding

These need your input, so I left them alone rather than inventing facts:

- **Splitting `/services` into four pages** (`/services/knock-down-rebuild`, `/services/custom-homes`,
  `/services/duplexes`, `/services/granny-flats`). This is the single biggest remaining SEO win —
  four separate search markets instead of one page. It needs real copy per service.
- **Project case studies** — `/projects` is still one page with 31 photos in carousels. Each
  project should be its own page with block size, timeline, cost band and the client's story.
- **Suburb landing pages** — start with the two suburbs where you have the most completed work.
- **Google Business Profile** — claim/verify, add photos, post fortnightly, ask every finished
  client for a review. This will move local rankings more than anything in the code.
- The contact form still uses placeholder-style labels inside a grid; giving each field a real
  `<label>` would improve accessibility.

---

## 10. How the build works

The generated files are plain HTML — no build step is required to deploy.

If you want to regenerate after editing sources, the tooling is in the workspace at
`kadmia-site\_build\`:

| Script | Purpose |
|---|---|
| `images.py` | rebuilds the WebP renditions, og-image, icons |
| `transform.py` | applies the head/link/image/footer/schema changes |
| `reset.py` | restores the pristine HTML before a re-run |
| `verify.py` | checks titles, canonicals, schema, alt text |
| `crawl.py` | crawls every internal link and asset (run against `serve.py`) |
| `serve.py` | local preview that mimics the Vercel rewrites |

`transform.py` reads from `_build\pristine\`, so re-running it always produces the same result
rather than stacking changes on top of changes.
