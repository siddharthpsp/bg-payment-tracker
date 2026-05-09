# Bridge Pile Tracker Pattern Findings

The existing `https://siddharthpsp.github.io/bridge-pile-tracker/` opens directly from GitHub Pages without requiring Manus login. Its repository is a single static `index.html` file.

The direct-open behavior works because the app is fully client-side and hosted on GitHub Pages. Its shared sync behavior is implemented with JsonBin API calls from browser JavaScript. The source defines a `BIN_ID`, a `MASTER_KEY`, an API URL in the form `https://api.jsonbin.io/v3/b/${BIN_ID}`, and uses `fetch(API + '/latest')` for reading plus `fetch(API, { method: 'PUT', ... })` for saving.

This means the bridge app is not using a Manus backend, Node server, tRPC, Supabase, or Firebase. It uses a static GitHub Pages frontend plus JsonBin as the cloud JSON store. To match this pattern for the BG tracker, the BG tracker should be exported as a static GitHub Pages app and its save/load layer should read and write one cloud JSON record through JsonBin instead of requiring Manus OAuth or a Manus server URL.

Important security note: the bridge app's JsonBin write key is embedded in public frontend code. This matches the prior implementation pattern and allows no-login shared editing, but it also means anyone who can inspect the page source can modify the shared data. A more secure no-login version would require a small backend proxy or authenticated rules, but that would no longer be the exact same simple pattern.
