# Cloud Persistence Design

The tracker will use the existing authenticated database-backed template and persist the current tracker workspace as a per-user cloud state record. This is the lowest-risk migration from the current single-page localStorage implementation because invoices, bank guarantees, and payment history already operate as coherent in-memory arrays.

## Data Model

A new `tracker_states` table will store one row per authenticated user. The table will include `userId`, `invoicesJson`, `bgsJson`, `paymentHistoryJson`, `createdAt`, and `updatedAt`. The JSON payloads will be stored as text so the schema remains compatible with the current MySQL/Drizzle setup without requiring complex table decomposition during this correction.

## API Contract

A protected `tracker.getState` query will load the user's cloud state. If no record exists, it will create a seeded record from the existing default invoice and BG data so a fresh login still shows the current working dataset. A protected `tracker.saveState` mutation will validate and save the three arrays after add, edit, delete, restore, payment allocation, and payment reversal actions.

## Frontend Migration

The existing page will stop reading from and writing to `window.localStorage`. It will load state from `trpc.tracker.getState`, hydrate React state once, and save changes through `trpc.tracker.saveState`. The UI header will remove the `Export Data` and `Import Data` controls and replace the old browser-specific guidance with a short cloud-saved status line.

## Test Coverage

Vitest coverage will verify that tracker state helpers parse missing/invalid JSON safely and that the save/load helper returns the exact arrays needed by the UI. Existing authentication logout tests will remain intact.
