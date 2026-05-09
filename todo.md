# GitHub Publishing Checklist

- [x] Confirm repository status and working tree.
- [x] Reuse the existing public GitHub repository for BG Payment Tracker.
- [x] Push the current project code to GitHub.
- [x] Verify the remote repository URL and share it with the user.

# GitHub Access Issue

- [x] Verify whether the repository still exists and whether it is private or public.
- [x] Confirm whether the user needs the repository made public or needs collaborator access.
- [x] Provide the corrected GitHub access details.

# Public Repository Request

- [x] Change the GitHub repository visibility from private to public.
- [x] Verify the repository opens as a public GitHub URL.
- [x] Share the final public repository link with the user.

# Web App Link Mismatch

- [x] Check the live Manus web app URL and confirm what it renders.
- [x] Check whether the GitHub URL is only showing source code instead of a web app.
- [x] Configure GitHub Pages if the user needs the app to open directly from GitHub.
- [x] Share the final correct web app URL.

# Package JSON GitHub Pages Deployment

- [x] Add the GitHub Pages homepage and deployment scripts to package.json.
- [x] Use the configured build output to publish the app to the GitHub Pages branch.
- [x] Confirm the GitHub Pages URL or identify the one manual setting GitHub requires.

# Excel Dashboard Integration Request

- [x] Inspect the uploaded workbook `NH_Package_03_04_Dashboard9-5-26.xlsx` and identify the dashboard sections, summary values, tables, and labels that should appear in the web app.
- [x] Update the BG Payment Tracker dashboard to include the Excel dashboard details while preserving the existing Swiss Financial Modernism interface.
- [x] Rebuild and republish the GitHub Pages version so the live GitHub URL reflects the new dashboard content.
- [x] Verify the live app opens correctly after publishing and summarize the added details for the user.

# Remove Date-wise Invoice Table

- [x] Remove the Date-wise Bitumen VG40 Invoice Details table from the dashboard tab.
- [x] Keep the Excel summary cards, terminal-wise breakdown, and company-wise breakdown visible.
- [x] Rebuild and republish the GitHub Pages app.
- [x] Verify the live dashboard no longer shows the date-wise invoice table.

# Remove RS-1 From Dashboard Heading

- [x] Change the dashboard heading from “NH PACKAGE 03 & 04 AMD-RAJKOT — BITUMEN & RS-1 DASHBOARD” to remove “RS-1”.
- [x] Rebuild and republish the GitHub Pages app.
- [x] Verify the live dashboard heading no longer includes “RS-1”.


# Sequential Lump-Sum Payment Allocation

- [x] Inspect the current invoice payment model and payment action flow in `client/src/pages/Home.tsx`.
- [x] Add a lump-sum payment input that can allocate amounts sequentially across unpaid invoices.
- [x] Update invoice records so fully covered invoices become paid and the final partially covered invoice keeps the unpaid pending balance.
- [x] Ensure dashboard totals use pending amounts rather than original net amounts when partial payments exist.
- [x] Build, deploy to GitHub Pages, push source to GitHub, and save a new Manus checkpoint.


# GitHub Pages Live Verification

- [x] Confirm the GitHub Pages app opens at the public URL.
- [x] Verify the deployed JavaScript bundle contains the sequential payment allocation UI.
- [x] Share the confirmed live GitHub Pages link with the user.

# Payment Amount Input Focus Bug

- [x] Reproduce and inspect why the payment amount input loses focus after each typed digit.
- [x] Refactor the payment modal so input focus is preserved while updating the allocation preview.
- [x] Build and deploy the focus fix to GitHub Pages.
- [x] Save a checkpoint and share the confirmed live link with the user.

# Date-wise Lump-Sum Payment History

- [x] Inspect the current direct payment state and sequential allocation handler.
- [x] Store each direct payment entry with payment date, company, amount received, and allocation details.
- [x] Add a date-wise payment history section or tab showing lump-sum payments clearly.
- [x] Show which invoices each payment adjusted, including fully paid and partly paid balances.
- [x] Build, deploy to GitHub Pages, push source to GitHub, and save a new checkpoint.


# Delete Old Payment History Entry

- [x] Inspect the current payment history records and invoice allocation fields.
- [x] Add a delete button for each date-wise payment history entry.
- [x] When a payment is deleted, reverse only that payment’s allocated amounts from the affected invoices.
- [x] Recalculate invoice status as paid, partly paid, or pending after deletion.
- [x] Build, deploy to GitHub Pages, push source to GitHub, verify live, and save a checkpoint.


# Restore Invoice And Safer Delete Confirmation

- [x] Check whether invoice `GJ0160012325` is still present in default invoice data and live source.
- [x] Restore invoice `GJ0160012325` with the provided 05 May 2026 HPCL PIPAVAV details if missing from the default data.
- [x] Add a confirmation prompt before deleting any invoice so invoices cannot be removed accidentally.
- [x] Improve partial-payment removal messaging and behavior so users can remove the payment entry from Payment History and reverse the invoice allocation.
- [x] Build, deploy to GitHub Pages, push source to GitHub, verify live, and save a checkpoint.


# Dashboard Refresh After Invoice Changes

- [x] Inspect dashboard summary cards, due lists, and visual effects that depend on invoice data.
- [x] Fix any cached or non-reactive dashboard calculations so adding invoices updates dashboard totals immediately.
- [x] Fix invoice deletion so dashboard totals, pending amount, paid amount, and due sections update immediately.
- [x] Validate build, deploy to GitHub Pages, push source, verify live markers, and save a checkpoint.

# Cross-Browser Data Consistency

- [x] Confirm current invoices, BGs, and payment history are stored in browser local storage.
- [x] Add a visible Export Data button so the current browser’s data can be downloaded as a backup JSON file.
- [x] Add an Import Data button so the same invoices, BGs, and payment history can be restored in another browser.
- [x] Add clear in-app guidance explaining that static GitHub Pages data is browser-specific unless a database-backed version is added.
- [x] Validate build, deploy to GitHub Pages, push source, verify live markers, and save a checkpoint.

# Cloud Saving Requirement
- [x] Remove export/import as the primary answer to cross-browser data differences.
- [x] Upgrade the static app to a database-backed version so data is saved in the cloud.
- [x] Create persistent storage for invoices, BG details, and payment history.
- [x] Load saved cloud data on app open so a new browser shows the same working data.
- [x] Save add, edit, delete, restore, payment, and payment-reversal changes to cloud storage.
- [x] Validate cloud procedures with automated tests, verify the database-backed app health, and save a checkpoint.

# Cloud Database Persistence Correction
- [x] Remove browser-only import/export controls from the tracker UI.
- [x] Persist invoices, bank guarantees, and payment history in the authenticated cloud database instead of localStorage.
- [x] Ensure payment allocation, edits, deletes, restore actions, and reports read from cloud-backed data.
- [x] Add automated tests for cloud-backed tracker procedures and core calculations.

# Live Web App Request

- [x] Confirm the latest checkpoint is ready for Manus publishing.
- [x] Explain that publishing must be done with the Manus Publish button, not by pushing to GitHub.
- [x] Share the available Manus-hosted domain or the exact publishing step for the user.

# Static GitHub Pages JSON Deployment Request

- [x] Restore the tracker as a client-only React SPA for GitHub Pages.
- [x] Use browser JSON/localStorage persistence for invoices, bank guarantees, and payment history.
- [x] Remove runtime dependency on server, authentication, tRPC, and database for the GitHub Pages deployment.
- [x] Configure Vite base path and routing for /bg-payment-tracker/.
- [x] Publish the static build to GitHub Pages using direct gh-pages deployment because GitHub workflow updates are blocked by the current app token permission.
- [x] Push the static deployment changes to GitHub main.
- [x] Verify https://siddharthpsp.github.io/bg-payment-tracker/ is live with the JSON/localStorage version.

# Restore Cloud-Saved Live App Without Export Import

- [x] Restore the BG Payment Tracker as a cloud-saved database-backed live app rather than the old static JSON/localStorage file.
- [x] Remove Export Data and Import Data controls and the browser-specific JSON guidance from the UI.
- [x] Ensure invoices, bank guarantees, and payment history load from and save to cloud database storage.
- [x] Verify add, edit, delete, direct payment allocation, payment deletion, and restore actions persist across browsers after login.
- [x] Run database migration, automated tests, build validation, and live preview verification.
- [x] Save a checkpoint and tell the user to publish the Manus live app from the UI.
- [x] Handle initial cloud-load errors without enabling autosave or overwriting saved tracker data.
- [x] Add a visible cloud-load error and retry state for failed initial database fetches.
- [x] Add automated coverage for add, edit, delete, direct payment allocation, payment deletion, and restore flows using the cloud-backed tracker state.
- [x] Verify that refreshed authenticated sessions restore updated invoices, BGs, and payment history from cloud state.

# GitHub Pages Static JSON Live App Request

- [x] Superseded by user correction: preserve the latest cloud-backed Manus checkpoint and do not prepare a browser-storage static version.
- [x] Superseded by user correction: do not restore or convert the tracker to client-only JSON/localStorage persistence.
- [x] Superseded by user correction: keep server, authentication, tRPC, and database for cloud storage.
- [x] Superseded by user correction: static build deployment validation is not applicable to the cloud-storage requirement.
- [x] Superseded by user correction: do not deploy a static browser-storage build to GitHub Pages.
- [x] Superseded by user correction: explain the valid cloud-backed live option instead of reporting a static GitHub Pages link.

# Cloud-Based GitHub Live Requirement Correction

- [x] Keep the BG Payment Tracker using cloud-based data storage; do not convert it to browser-only localStorage or JSON persistence.
- [x] Verify whether the current database-backed server application can be hosted directly on GitHub Pages.
- [x] Preserve the existing cloud-backed Manus checkpoint and avoid overwriting it with a static browser-storage build.
- [x] Explain the correct live deployment option for a cloud-backed app and, if GitHub is still required, clarify what type of GitHub integration is possible.

# GitHub Pages URL as Cloud App Entry Point

- [x] Confirm that `https://siddharthpsp.github.io/bg-payment-tracker/` cannot directly run the cloud-backed Node/tRPC/database app because GitHub Pages is static hosting.
- [x] Preserve the cloud-backed Manus app and avoid any browser/localStorage conversion.
- [x] Prepare a GitHub Pages static entry page or redirect to the Manus-hosted cloud app if the exact GitHub Pages URL must be used as the access link.
- [x] Validate the GitHub Pages URL behavior and report the final live access instructions to the user.

# GitHub-Only Hosting Clarification

- [ ] Explain why the current redirect uses the Manus URL for the server/database-backed app.
- [ ] Clarify that GitHub Pages can host the frontend files but cannot run the Node/tRPC backend or database by itself.
- [ ] Present valid options for a GitHub URL frontend with separate cloud backend, including required backend hosting and database credentials.
- [ ] Ask the user to choose between static browser-only GitHub Pages, GitHub Pages frontend plus external backend, or Manus cloud hosting/custom domain.

# Direct GitHub Pages App With Cloud Storage

- [x] Verify whether the previous cloud-based tracker used an external backend or database that can be called from GitHub Pages.
- [x] Remove or replace the GitHub Pages redirect if a direct GitHub-hosted frontend with cloud persistence is feasible.
- [x] Ensure the direct GitHub Pages app does not use browser localStorage as the source of truth for invoices, BGs, and payment history.
- [x] Validate the shared cloud data implementation with automated tests and production build.
- [x] Publish the updated GitHub Pages build after GitHub authentication is restored.

# No Manus Hosting Requirement

- [ ] Remove Manus-hosted backend/domain as the required runtime for the live app.
- [ ] Keep GitHub Pages as the public frontend URL if possible.
- [ ] Select a non-Manus cloud backend/database provider for shared invoices, BGs, and payment history.
- [ ] Configure the frontend to use the selected non-Manus cloud backend instead of the Manus backend URL.
- [ ] Validate shared cloud persistence across browsers/devices after the non-Manus backend is configured.

# Exact GitHub Pages Host Requirement

- [x] Make `https://siddharthpsp.github.io/bg-payment-tracker/` the production app URL that opens the tracker directly.
- [x] Do not use a Manus URL as the user-facing host.
- [ ] Keep tracker data cloud-saved rather than browser-local when opened from the GitHub Pages URL after the updated backend is published.

# Direct Open Without Manus Login

- [x] Make `https://siddharthpsp.github.io/bg-payment-tracker/` open the tracker directly without Manus login.
- [x] Remove Manus OAuth as a requirement for reading or saving tracker data from the GitHub Pages URL.
- [ ] Use a non-Manus cloud database or backend for shared invoices, BGs, and payment history.
- [x] Publish and verify the GitHub Pages URL opens directly in a fresh browser session.
- [ ] Publish the updated backend checkpoint so `tracker.getSharedState` and `tracker.saveSharedState` are available to the GitHub Pages frontend.
- [ ] Re-test the GitHub Pages page after backend publishing and confirm cloud load/save succeeds without login.

# Match Bridge Pile Tracker GitHub Pages Pattern

- [ ] Inspect `https://siddharthpsp.github.io/bridge-pile-tracker/` and its repository pattern to identify how it opens directly.
- [ ] Determine whether `bridge-pile-tracker` uses true shared cloud storage or browser/device storage.
- [ ] Apply the same direct-open GitHub Pages hosting pattern to `https://siddharthpsp.github.io/bg-payment-tracker/` where technically compatible.
- [ ] Explain any storage difference clearly if the previous tracker was not actually using shared cloud database storage.
