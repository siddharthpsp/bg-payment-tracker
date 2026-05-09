# GitHub Publishing Checklist

- [x] Confirm repository status and working tree.
- [x] Reuse the existing public GitHub repository for BG Payment Tracker.
- [x] Push the current project code to GitHub.
- [x] Verify the remote repository URL and share it with the user.

# GitHub Access Issue

- [ ] Verify whether the repository still exists and whether it is private or public.
- [ ] Confirm whether the user needs the repository made public or needs collaborator access.
- [ ] Provide the corrected GitHub access details.

# Public Repository Request

- [ ] Change the GitHub repository visibility from private to public.
- [ ] Verify the repository opens as a public GitHub URL.
- [ ] Share the final public repository link with the user.

# Web App Link Mismatch

- [ ] Check the live Manus web app URL and confirm what it renders.
- [ ] Check whether the GitHub URL is only showing source code instead of a web app.
- [ ] Configure GitHub Pages if the user needs the app to open directly from GitHub.
- [ ] Share the final correct web app URL.

# Package JSON GitHub Pages Deployment

- [ ] Add the GitHub Pages homepage and deployment scripts to package.json.
- [ ] Use the configured build output to publish the app to the GitHub Pages branch.
- [ ] Confirm the GitHub Pages URL or identify the one manual setting GitHub requires.

# Excel Dashboard Integration Request

- [ ] Inspect the uploaded workbook `NH_Package_03_04_Dashboard9-5-26.xlsx` and identify the dashboard sections, summary values, tables, and labels that should appear in the web app.
- [ ] Update the BG Payment Tracker dashboard to include the Excel dashboard details while preserving the existing Swiss Financial Modernism interface.
- [ ] Rebuild and republish the GitHub Pages version so the live GitHub URL reflects the new dashboard content.
- [ ] Verify the live app opens correctly after publishing and summarize the added details for the user.

# Remove Date-wise Invoice Table

- [ ] Remove the Date-wise Bitumen VG40 Invoice Details table from the dashboard tab.
- [ ] Keep the Excel summary cards, terminal-wise breakdown, and company-wise breakdown visible.
- [ ] Rebuild and republish the GitHub Pages app.
- [ ] Verify the live dashboard no longer shows the date-wise invoice table.

# Remove RS-1 From Dashboard Heading

- [ ] Change the dashboard heading from “NH PACKAGE 03 & 04 AMD-RAJKOT — BITUMEN & RS-1 DASHBOARD” to remove “RS-1”.
- [ ] Rebuild and republish the GitHub Pages app.
- [ ] Verify the live dashboard heading no longer includes “RS-1”.


# Sequential Lump-Sum Payment Allocation

- [x] Inspect the current invoice payment model and payment action flow in `client/src/pages/Home.tsx`.
- [x] Add a lump-sum payment input that can allocate amounts sequentially across unpaid invoices.
- [x] Update invoice records so fully covered invoices become paid and the final partially covered invoice keeps the unpaid pending balance.
- [x] Ensure dashboard totals use pending amounts rather than original net amounts when partial payments exist.
- [x] Build, deploy to GitHub Pages, push source to GitHub, and save a new Manus checkpoint.


# GitHub Pages Live Verification

- [x] Confirm the GitHub Pages app opens at the public URL.
- [x] Verify the deployed JavaScript bundle contains the sequential payment allocation UI.
- [ ] Share the confirmed live GitHub Pages link with the user.

# Payment Amount Input Focus Bug

- [x] Reproduce and inspect why the payment amount input loses focus after each typed digit.
- [x] Refactor the payment modal so input focus is preserved while updating the allocation preview.
- [ ] Build and deploy the focus fix to GitHub Pages.
- [ ] Save a checkpoint and share the confirmed live link with the user.

# Date-wise Lump-Sum Payment History

- [x] Inspect the current direct payment state and sequential allocation handler.
- [x] Store each direct payment entry with payment date, company, amount received, and allocation details.
- [x] Add a date-wise payment history section or tab showing lump-sum payments clearly.
- [x] Show which invoices each payment adjusted, including fully paid and partly paid balances.
- [ ] Build, deploy to GitHub Pages, push source to GitHub, and save a new checkpoint.


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

- [ ] Restore the tracker as a client-only React SPA for GitHub Pages.
- [ ] Use browser JSON/localStorage persistence for invoices, bank guarantees, and payment history.
- [ ] Remove runtime dependency on server, authentication, tRPC, and database for the GitHub Pages deployment.
- [ ] Configure Vite base path and routing for /bg-payment-tracker/.
- [ ] Add or update GitHub Actions deployment to publish the static build to GitHub Pages.
- [ ] Push the static deployment changes to GitHub main.
- [ ] Verify https://siddharthpsp.github.io/bg-payment-tracker/ is live with the JSON/localStorage version.
