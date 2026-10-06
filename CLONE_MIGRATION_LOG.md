# Cloning & Migration Log

Use this file to track and replicate features, fixes, and schema changes across all 12 cloned repositories.

---

## [2026-04-15] Blog Metadata: Reading Time & Admin Cleanup

### 1. Database Schema
Added `readingTime` to the `Blog` model to allow manual control over estimated read times.

```prisma
// prisma/schema.prisma

model Blog {
  // ... existing fields
  readingTime     Int?         @map("reading_time")
}
```
**Action**: Run `npx prisma db push` followed by `npx prisma generate`.

> [!CAUTION]
> **Environment Issue**: If the IDE or build process doesn't recognize the new field immediately, you may need to restart your development server (`npm run dev`) to clear the Prisma Client cache.

### 2. API Updates
Updated the `POST` and `PATCH` handlers to support the new field.

**File**: `src/app/api/admin/blogs/route.ts`
```typescript
// Inside create/update data object
readingTime: body.readingTime ? parseInt(body.readingTime) : 5,
```

### 3. Admin UI Improvements
Cleaned up the Blog Create/Edit forms for better usability.

**Files**: 
- `src/app/admin/blogs/create/page.tsx`
- `src/app/admin/blogs/[id]/edit/page.tsx`

**Key Changes**:
- Title is now full-width.
- Category, Author, and Reading Time are arranged in a clean grid.
- All dropdowns (`SelectTrigger`) now use `w-full` for consistent alignment.
- Removed redundant toolbar placeholders.

### 4. Dynamic Display (Frontend)
Modified the public blog post page to use the database value if set, otherwise fallback to auto-calculation.

**File**: `src/app/(public)/blog/[categorySlug]/[blogSlug]/page.tsx`
```typescript
const wordCount = (blog.description ?? "").replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
const readingTime = blog.readingTime || Math.max(1, Math.round(wordCount / 200));
```

---

## [2026-04-16] SEO & OG Image Workflow Improvements
Implemented a professional gallery-based workflow for managing Open Graph images.

### 1. Robust URL Resolution
Updated the SEO utility to safely handle relative paths (missing or extra slashes) when building the absolute `og:image` URL.

**File**: `src/lib/seo.ts`
```typescript
const resolvedImage = imageUrl.startsWith("http")
    ? imageUrl
    : `${SITE_URL.replace(/\/$/, "")}/${imageUrl.replace(/^\//, "")}`;
```

### 2. OG Image Picker Component [NEW]
Created a reusable component for selecting images from the gallery.

**File**: `src/components/admin/OgImagePicker.tsx`
- Fetches images from `/api/admin/seo/og-images`.
- Provides a dropdown selection.
- Allows manual override.
- Shows a live preview of the selected image.

### 3. Static SEO Integration
Integrated the `OgImagePicker` into the static page SEO management.

**File**: `src/app/admin/seo/static/page.tsx`
```tsx
<div className="col-span-2 border-t pt-3">
    <OgImagePicker 
        value={newEntry.ogImagePath} 
        onChange={(v) => setNewEntry({ ...newEntry, ogImagePath: v })} 
        label="OG Image (1200×630 recommended)"
    />
</div>
```

### 4. "Copy Path" Utility
Added a one-click copy button to the OG Images list to help when manual paths are still needed elsewhere.

**File**: `src/app/admin/seo/og-images/page.tsx`
- **Action**: Add a copy icon button that triggers `navigator.clipboard.writeText(img.imagePath)`.

---

## [2026-04-16] Rich Text Editor Migration: Jodit to CKEditor 5

The rich text editor in the admin panel (`jodit-react`) has been replaced with CKEditor 5 for better stability, SSR handling, and plugin support.

### 1. Dependency Update
Run the following commands to swap out the dependencies:
```bash
npm uninstall jodit-react
npm install ckeditor5 @ckeditor/ckeditor5-react
```

### 2. Implementation Files
**New File:** `src/components/admin/CKEditorWrapper.tsx`
Provides a dynamically-imported wrapper strictly on the client side to configure `ClassicEditor` with features (bold, lists, tables, image, source editing, etc.).

**Updated File:** `src/components/admin/RichTextEditor.tsx`
- Dropped `JoditEditor` import and dynamic logic.
- Implemented `CKEditorWrapper`.
- Adapted the `EmojiPicker` integration. Because CKEditor uses a model-based API, emoji insertion is handled via `editor.model.change`.

> [!NOTE]
> Make sure `onEditorReady` is used to expose the editor instance back to `RichTextEditor.tsx` so the emoji picker works correctly.

### 3. MS Word Style Layout
To achieve the full "Document Editor" experience, the `CKEditorWrapper.tsx` has been configured with:
- **Extended Plugins**: Highlighting, Find/Replace, Table Properties, Sub/Super scripts, Blockquotes, Checklists, etc.
- **Wrapped Ribbon Toolbar**: The configuration `shouldNotGroupWhenFull: true` is enabled, allowing the toolbar to spread across multiple rows.
- **A4 Document Canvas**: The editor canvas has been styled inline to resemble a physical page (box shadows, max-width, grey outer container).

### 4. Full Screen Mode & Two-Row Toolbar
- **Forced Two Rows**: Enabled `shouldNotGroupWhenFull: true` and used the `-` separator to force the toolbar to wrap into two rows instead of using an overflow menu.
- **Full Screen Mode**: Implemented a custom state in `RichTextEditor.tsx` that toggles a `fixed inset-0` layout. Added a "Full Screen" / "Reduce" button in the footer bar.
- **Dynamic Sizing**: Added a `fullScreen` prop to `CKEditorWrapper` to adjust the internal editor height when maximized.

### 5. Layout & Workspace Restructure
- **Full-Width Workspace**: Increased container width to `max-w-6xl` and removed the sidebar to provide a massive, immersive writing area for the "A4 Paper" editor.
- **Top Row Settings**: Moved "Publish Settings" and "Thumbnail Image" into a 2-column grid at the top of the page, keeping them accessible but out of the way.
- **Sticky Action Bar**: Integrated a floating bottom bar for the "Save" and "Cancel" buttons, ensuring they are always reachable regardless of content length.
- **Refined Toggles**: Replaced standard switch rows with styled "status cards" (blue for Home, orange for Trending) to improve scannability.

### 6. Data Integrity Fixes
- **FMGE Rate Percentage Bug**: Fixed an issue where uploading "36%" in Excel resulted in "0.36%" on the site. Updated the bulk uploader to use `raw: false` mode, ensuring formatted strings are read and parsed correctly as whole numbers.
- **File**: `src/app/api/admin/fmge-rates/bulk-upload/route.ts`
```typescript
const data = XLSX.utils.sheet_to_json(sheet, { raw: false, defval: "" }) as Record<string, unknown>[];
```

### 7. Image Upload & Statistics
- **Local Image Uploads**: Integrated `SimpleUploadAdapter`. **Critical**: Configured `uploadName: 'file'` (manually handled in API) to match the existing upload route expectations.
- **Word Count Status Bar**: Integrated the `WordCount` plugin correctly. Added words/characters stats to the editor footer.
- **Office 365 Ribbon Styling**: Grouped toolbar items with separators and applied realistic 3D shadows to the editor canvas.

---

## [2026-04-20] CKEditor in News & Articles, HTML Shortnote Rendering, Data Integrity & Cleanup

### 1. RichTextEditor Integration — News Admin (Create & Edit)
Replaced plain `<Textarea>` fields with the CKEditor-based `RichTextEditor` for both **Short Note** and **Full Description** in the News admin pages.

**Files**:
- `src/app/admin/news/create/page.tsx`
- `src/app/admin/news/[id]/edit/page.tsx`

**Changes**:
- Added import: `import { RichTextEditor } from "@/components/admin/RichTextEditor";`
- Replaced `<Textarea>` for `shortnote` with: `<RichTextEditor value={form.shortnote} onChange={(val) => set("shortnote", val)} placeholder="Brief summary..." />`
- Replaced `<Textarea>` for `description` with: `<RichTextEditor value={form.description} onChange={(val) => set("description", val)} placeholder="Write your news content..." />`
- Wrapped editors in `min-h-[120px]` (shortnote) and `min-h-[400px]` (description) containers.

### 2. RichTextEditor Integration — Articles Admin (Create & Edit)
Same pattern applied to Articles admin pages.

**Files**:
- `src/app/admin/articles/create/page.tsx`
- `src/app/admin/articles/[id]/edit/page.tsx`

**Changes**: Identical to News above — import `RichTextEditor`, replace both `<Textarea>` fields, wrap in min-height containers.

### 3. Public Pages — HTML Rendering for Shortnotes
Since shortnotes now contain HTML from CKEditor, all public-facing pages were updated to render HTML instead of plain text.

**Pattern**: Changed from:
```tsx
{item.shortnote && <p className="...">{item.shortnote}</p>}
```
To:
```tsx
{item.shortnote && <div className="... prose prose-sm max-w-none prose-p:my-0" dangerouslySetInnerHTML={{ __html: item.shortnote }} />}
```

**Files Updated**:
| File | Context |
|---|---|
| `src/app/(public)/articles/page.tsx` | Article listing cards |
| `src/app/(public)/articles/[categorySlug]/page.tsx` | Category-filtered article cards |
| `src/app/(public)/articles/[categorySlug]/[slug]/page.tsx` | Article detail — border-l-4 blockquote style |
| `src/app/(public)/news/page.tsx` | News listing cards |
| `src/app/(public)/news/[categorySlug]/page.tsx` | Category-filtered news cards |
| `src/app/(public)/news/[categorySlug]/[slug]/page.tsx` | News detail — border-l-4 blockquote style |

### 4. Image & OG Removal Fix — `null` Instead of `undefined`
Fixed a critical bug where removing an image or OG image in admin forms would send `undefined`, causing Prisma to **skip** the field update (keeping the old value). Changed to send `null` so the database field is actually cleared.

**Files & Fields**:
| File | Fields Fixed |
|---|---|
| `src/app/admin/blogs/[id]/edit/page.tsx` | `thumbnailName`, `thumbnailPath`, `ogImagePath` |
| `src/app/admin/scholarships/[id]/edit/page.tsx` | `ogImagePath` |
| `src/app/admin/testimonials/[id]/edit/page.tsx` | `imageName`, `imagePath` |

**Pattern**:
```typescript
// Before (broken — Prisma ignores undefined)
thumbnailName: form.thumbnailName || undefined,

// After (works — Prisma sets field to NULL)
thumbnailName: form.thumbnailName || null,
```

### 5. Blog Edit — Button Label Fix
Changed the save button label from "Save Article Changes" to "Save Changes" since this is the **Blog** edit page.

**File**: `src/app/admin/blogs/[id]/edit/page.tsx`

### 6. About Hungary — Display More Items
Increased the `slice` limit for attractions and cuisines from 3 to 5 items.

**File**: `src/app/(public)/about-Hungary/page.tsx`
```typescript
// Before
const attractions = content.attractions.slice(0, 3).map(...)
const cuisines = content.cuisines.slice(0, 3).map(...)

// After
const attractions = content.attractions.slice(0, 5).map(...)
const cuisines = content.cuisines.slice(0, 5).map(...)
```

### 7. Our Partners — Decimal Serialization Fix
Fixed a Next.js serialization error where Prisma `Decimal` fields cannot be passed to Client Components. Added explicit `Number()` conversion.

**File**: `src/app/(public)/our-partners/page.tsx`
```typescript
const convertedPartners = partners.map((p) => ({
    ...p,
    rating: p.rating ? Number(p.rating) : null,
}));
```

### 8. Scholarships — Total Aid Display Fix
Simplified the total aid display calculation to always show the computed value in `k+` format.

**File**: `src/app/(public)/scholarships/page.tsx`
```typescript
const totalAidDisplay = totalAidCalculated > 0 
    ? withCurrencySymbol(`${Math.round(totalAidCalculated / 1000)}k+`)
    : withCurrencySymbol("2000k+");
```

### 9. Test Infrastructure Cleanup
Removed unused testing files (vitest was never in production dependencies):

**Deleted**:
- `vitest.config.ts`
- `src/lib/__tests__/seo.test.ts`
- `src/test/setup.ts`

**Retained**: `TESTING_CHECKLIST.md` — manual QA checklist (keep in all clones).

### 10. Testing Dependencies Added to `package.json`
The following dev dependencies were added (may be removed if test infrastructure is not needed):

```json
"devDependencies": {
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@testing-library/user-event": "^14.6.1",
    "@vitejs/plugin-react": "^6.0.1",
    "jsdom": "^29.0.2",
    "vitest": "^4.1.4"
}
```

**Scripts added**:
```json
"test": "vitest run",
"test:watch": "vitest"
```

> [!NOTE]
> If clones don't need automated testing, skip this section entirely. If they do, run `npm install` after pulling.
