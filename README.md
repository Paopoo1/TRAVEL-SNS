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

Leaflet 1.9.4 is bundled in `vendor/leaflet/` under its included BSD license. Actual geographic maps replace the earlier illustrations. The default CARTO basemap has no built-in text, and our place labels use the bundled M PLUS Rounded 1c font (SIL OFL; see `assets/fonts/OFL.txt`). The same rounded font is used in the app. Enable “Show street labels” for standard OpenStreetMap tiles; lettering inside those raster tiles is supplied by OpenStreetMap and cannot be restyled by CSS.

Native geographic zoom, touch pinch, panning and reset are available. Views are retained during in-page navigation and language changes. Maps require online tile access to `basemaps.cartocdn.com` and optionally `tile.openstreetmap.org`; failures display a retry message rather than a fabricated map. OpenStreetMap and CARTO attribution stays visible.

Onboarding validation confirmed geographic point coordinates, map controls, tile source selection, markers, 100 m visit overlays, crowns, the bundled font and responsive UI. The cloud environment denied external tile requests, so a successful live background-tile render is not yet verified there. Network requirements were saved in the environment draft.

## Prototype limits

Data stays in localStorage in this browser: photos, nickname, shop drafts, local events, saved cards, language and atlas preferences. Shared accounts, cross-device uploads, shop permissions and background push delivery are future work. The regulars list contains the local profile only. Initial feed photographs are labeled inspiration samples, not real user posts or photos of the selected Japanese area; see `assets/PHOTO-CREDITS.md`.

Preserve the photo atlas, visit crowns, route recommendations and shop workspace when developing further.
