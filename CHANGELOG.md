# Changelog

All notable changes to the **Personalized Adaptive Learning (PAL) / DAZ Platform** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-07-22

### Added
- **Prerequisite Topic Unlocking**: Implemented prerequisite unlocking logic in `client/src/pages/SubjectPage.jsx`. Topics are dynamically evaluated against user progress; Topic 1 is unlocked by default, while Topic $N$ requires a passing score ($\ge 70\%$) on Topic $N-1$.
- **Topic Status Indicators**: Added `<Unlock />`, `<Lock />`, and `<CheckCircle />` visual status icons to indicate topic state, disabling navigation for locked topics.
- **Complete Chapter 1 Database Seeding**: Expanded `server/scripts/seed.js` to seed subtopics 1.2 through 1.7 (Rank of a Matrix, Inverse of a Matrix, Applications of Matrices, Gaussian Elimination Method, Consistency of Non-Homogeneous Equations, and Homogeneous Linear Equations) along with diagnostic MCQ assessments.
- **Static Remedial Resources**: Added slide presentations and PDF study guides for all Chapter 1 subtopics to `client/public/slides/` so that assessment failure correctly displays the corresponding presentation on `SlidesPage.jsx`.
- **Centralized Documentation Hub**: Established a structured `docs/` repository directory containing `project_design/` (proposals and system diagrams) and `syllabus_resources/chapter_1_matrices/` (curated study materials) indexed by `docs/README.md`.

### Changed
- **Dynamic Progress Analytics**: Updated `client/src/pages/Dashboard.jsx` progress bar calculation to dynamically compute completion percentage relative to total topics instead of using a hardcoded multiplier.
- **Professional README Overhaul**: Completely updated `README.md` with system architecture diagrams, module relationship flows, folder trees, tech stack specifications, and step-by-step setup commands.

### Chores & Hygiene
- **Repository Hygiene**: Updated `.gitignore` to exclude build artifacts (`dist/`, `client/dist/`), environment files, and logs.
- **Cleanup**: Purged scratch scripts and temporary build artifacts from the workspace root.
