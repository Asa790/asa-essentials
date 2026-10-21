# 🌸 Asa's Essentials Dashboard

A botanical stationery & coquette desk productivity dashboard built with a Node.js/Express backend, Sharp image processing, and full interactive persistence.

## ✨ Features

- **Real Image Converter Engine**:
  - Powered by `sharp` and `multer`.
  - Supports converting to **WEBP**, **PNG**, **JPG**, **AVIF**, and **TIFF**.
  - Drag-and-drop or file picker upload.
  - Live file size and compression percentage metrics with one-click download & link copy.
- **Persistent To-Do List**:
  - Add tasks with priority tags.
  - Complete, undo, and delete tasks.
  - Filter by All, Active, and Done with live progress bar and task counters.
  - Backed by persistent JSON storage (`data/db.json`).
- **Schedule & Timeline**:
  - Dynamic daily agenda with real-time hour indicators.
  - Add and delete scheduled events.
- **Quick Links & Desk Vault**:
  - Add custom bookmarks with title, url, tags, and status.
  - Delete or navigate to saved studio links.
- **Live Clock & Date Sync**:
  - Real-time digital clock in header synced with your system time.

## 🚀 Running the Project

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the live server:
   ```bash
   npm start
   ```

3. Open your browser at:
   [http://localhost:3000](http://localhost:3000)

