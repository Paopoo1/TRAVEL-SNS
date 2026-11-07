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

Leaflet 1.9.4, MapLibre GL JS 5.6.1 and the MapLibre/Leaflet bridge 0.1.3 are bundled in `vendor/`, with their licenses. The default soft map uses actual OpenMapTiles geometry from OpenFreeMap, rendered locally with pale water, green parks and simplified roads/buildings. The style contains no hand-drawn geographic shapes. Attribution remains visible. OpenFreeMap's published public-instance terms currently require no registration or API key; see https://github.com/hyperknot/openfreemap and recheck terms before scaling or changing provider.

The map selector can switch to standard OpenStreetMap raster tiles. If WebGL or vector tile access fails, the app explicitly reports the fallback to the standard map. Maps need online access to `tiles.openfreemap.org` (vector) or `tile.openstreetmap.org` (standard). The cloud environment currently denies both destinations; requirements were saved in the environment draft, but successful live background rendering there is not confirmed. The custom style passed MapLibre's official style-spec validation. Coordinates, controls, markers, visit overlays and the offline fallback were browser-tested.

Place labels and app text use the bundled M PLUS Rounded 1c font (SIL OFL; see `assets/fonts/OFL.txt`). Lettering baked into standard raster tiles retains the provider's font.

## GPS photo pins

Enable GPS explicitly, then use “Photo at my location”. Mobile browsers receive an `image/*` input with `capture="environment"` as a camera hint; desktop browsers and some mobile browsers may also offer photo selection. After selection, acquire a location fix no older than 5 seconds with reported accuracy at most 100 m. Preview the photo, coordinates and accuracy, optionally add a title, then save. A selected existing photo uses the current recording location, not its EXIF shooting location. Never snap a GPS pin to a sample area.

GPS pins are stored under `trailbook-gps-visits-v1` in localStorage, separately from legacy spot records. Photos are resized and encoded as JPEG; raw image metadata is not preserved. Coordinates, reported accuracy, record time, local visit date, caption and photo are committed together. Cancel, denied permission, inaccurate fixes, GPS disabled during capture and storage failures do not commit a pin. The app does not store a movement trail, enable GPS automatically on reload, or share positions with other users. Watches pause while the page is hidden and stop when GPS is disabled.

GPS pins appear at their actual coordinates on feed and personal maps. Pins within 100 m of a group's first pin share visit-day intensity: one or two distinct days are blue, three or more are orange with a crown. Multiple photos on one day do not increase the day count. Existing curated records within 100 m contribute to the same GPS group. Nearby GPS records within 10 km of a demo area's center contribute to its local regular badge; this is a proximity rule, not an official area boundary. Statistics include GPS pins, and the personal gallery can recenter the map on any saved pin.

Validation covered browser-provided coordinates outside the demo areas, camera/file input, preview cancellation, save/reload, accuracy errors, permission denial, duplicate dates, orange/crown promotion, disabled GPS, statistics, language switching and mobile/desktop layout. Physical phone-camera behavior still depends on the user's browser.

## Prototype limits

Data stays in localStorage in this browser: photos, nickname, shop drafts, local events, saved cards, language and atlas preferences. Shared accounts, cross-device uploads, shop permissions and background push delivery are future work. The regulars list contains the local profile only. Initial feed photographs are labeled inspiration samples, not real user posts or photos of the selected Japanese area; see `assets/PHOTO-CREDITS.md`.

Preserve the photo atlas, visit crowns, route recommendations and shop workspace when developing further.
