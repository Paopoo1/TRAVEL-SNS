# Trailbook

Browser-first travel SNS prototype. Serve this directory with `python3 -m http.server 8000`; no build or package installation is needed. Mobile prototype: `mobile/` (Expo), maintained separately.

## Browser workflow

- Explore real maps, select Kyoto/Higashiyama, Osaka/Namba or Tokyo/Asakusa, and open a spot to record a visit photo and date.
- The bottom-left icon opens your profile and personal atlas. Switch between a world overview and a saved area selection.
- First visits appear light blue. Three distinct visit dates at a spot give orange and a crown; same-day photo duplicates count once. Area regular badges count distinct dates across the area.
- Visit color is a 100 m circle around a geographic point, not an official area boundary. Model-route lines connect sample stops and are not turn-by-turn navigation.
- Explore the photo feed, save cards, filter categories, or open the expandable trip tools for sample routes and the shop/event workspace.
- The top-right selector offers eight UI languages. User-written text stays in its original language; some explanatory content is not yet translated.

## Geographic maps and font

Leaflet 1.9.4 is bundled in `vendor/leaflet/` under its included BSD license. Actual geographic maps replace the earlier illustrations. Standard OpenStreetMap raster tiles are the only basemap and require no API key. Place labels and the app use the bundled M PLUS Rounded 1c font (SIL OFL; see `assets/fonts/OFL.txt`). “Show place labels” toggles our spot labels; lettering baked into the OpenStreetMap tiles uses the provider's font and cannot be changed with CSS.

Native geographic zoom, touch pinch, panning and reset are available. Views are retained during in-page navigation and language changes. Maps require online access to `tile.openstreetmap.org`; failures display a retry message. OpenStreetMap attribution stays visible. CARTO is no longer used because its tile endpoint returned API-key-required images.

Geographic coordinates, map controls, markers, 100 m visit overlays, crowns, the bundled font and responsive UI were checked. External tile access remains restricted in this cloud environment, so successful live background rendering there is not confirmed.

## Prototype limits

Data stays in localStorage in this browser: photos, nickname, shop drafts, local events, saved cards, language and atlas preferences. Shared accounts, cross-device uploads, shop permissions and background push delivery are future work. The regulars list contains the local profile only. Initial feed photographs are labeled inspiration samples, not real user posts or photos of the selected Japanese area; see `assets/PHOTO-CREDITS.md`.

Preserve the photo atlas, visit crowns, route recommendations and shop workspace when developing further.
