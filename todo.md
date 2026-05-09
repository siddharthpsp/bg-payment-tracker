# GitHub Publishing Checklist

- [ ] Confirm repository status and working tree.
- [ ] Create a private GitHub repository for BG Payment Tracker.
- [ ] Push the current project code to GitHub.
- [ ] Verify the remote repository URL and share it with the user.

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
