# MBBS in Hungary — Testing Checklist

> **Last Updated:** 2026-04-18
> **Status:** 🔴 Not Started
> Mark items as `[x]` when tested and passing. Mark `[!]` for bugs found.

---

## PART A: API TESTING (Postman / cURL)

> Base URL: `http://localhost:3000`

---

### A1. Authentication APIs

- [ ] `POST /api/auth/register` — Register new student (valid data → 201)
- [ ] `POST /api/auth/register` — Duplicate email → 409 error
- [ ] `POST /api/auth/register` — Missing fields → 400 validation error
- [ ] `POST /api/auth/verify-otp` — Correct OTP → 200 success
- [ ] `POST /api/auth/verify-otp` — Wrong / expired OTP → 400 error
- [ ] `POST /api/auth/resend-otp` — Resend to valid email → 200
- [ ] `POST /api/auth/forgot-password` — Valid email → 200 sends reset link
- [ ] `POST /api/auth/reset-password` — Valid token + new password → 200
- [ ] `POST /api/auth/reset-password` — Invalid token → 400 error
- [ ] `POST /api/auth/[...nextauth]` — Login with correct credentials → session created
- [ ] `POST /api/auth/[...nextauth]` — Wrong password → error response

---

### A2. Admin — Blogs

- [ ] `GET /api/admin/blogs` — List blogs (paginated)
- [ ] `POST /api/admin/blogs` — Create blog with title, slug, content, category, OG image
- [ ] `GET /api/admin/blogs/[id]` — Fetch single blog by ID
- [ ] `PATCH /api/admin/blogs/[id]` — Update blog fields
- [ ] `DELETE /api/admin/blogs/[id]` — Delete blog → 200
- [ ] `GET /api/admin/blog-categories` — List categories
- [ ] `POST /api/admin/blog-categories` — Create category
- [ ] `GET /api/admin/blog-categories/[id]` — Fetch single
- [ ] `PATCH /api/admin/blog-categories/[id]` — Update
- [ ] `DELETE /api/admin/blog-categories/[id]` — Delete

---

### A3. Admin — Articles

- [ ] `GET /api/admin/articles` — List articles
- [ ] `POST /api/admin/articles` — Create article
- [ ] `GET /api/admin/articles/[id]` — Fetch single
- [ ] `PATCH /api/admin/articles/[id]` — Update
- [ ] `DELETE /api/admin/articles/[id]` — Delete
- [ ] `GET /api/admin/article-categories` — List categories
- [ ] `POST /api/admin/article-categories` — Create
- [ ] `GET /api/admin/article-categories/[id]` — Fetch
- [ ] `PATCH /api/admin/article-categories/[id]` — Update
- [ ] `DELETE /api/admin/article-categories/[id]` — Delete

---

### A4. Admin — News

- [ ] `GET /api/admin/news` — List news
- [ ] `POST /api/admin/news` — Create news item
- [ ] `GET /api/admin/news/[id]` — Fetch single
- [ ] `PATCH /api/admin/news/[id]` — Update
- [ ] `DELETE /api/admin/news/[id]` — Delete
- [ ] `GET /api/admin/news/[id]/contents` — List content sections
- [ ] `POST /api/admin/news/[id]/contents` — Add content section
- [ ] `PATCH /api/admin/news/[id]/contents/[cid]` — Update content section
- [ ] `DELETE /api/admin/news/[id]/contents/[cid]` — Delete content section
- [ ] `GET /api/admin/news/[id]/faqs` — List news FAQs
- [ ] `POST /api/admin/news/[id]/faqs` — Add FAQ
- [ ] `PATCH /api/admin/news/[id]/faqs/[fid]` — Update FAQ
- [ ] `DELETE /api/admin/news/[id]/faqs/[fid]` — Delete FAQ
- [ ] `GET /api/admin/news-categories` — List
- [ ] `POST /api/admin/news-categories` — Create
- [ ] `GET /api/admin/news-categories/[id]` — Fetch
- [ ] `PATCH /api/admin/news-categories/[id]` — Update
- [ ] `DELETE /api/admin/news-categories/[id]` — Delete

---

### A5. Admin — Scholarships

- [ ] `GET /api/admin/scholarships` — List scholarships
- [ ] `POST /api/admin/scholarships` — Create scholarship
- [ ] `GET /api/admin/scholarships/[id]` — Fetch single
- [ ] `PATCH /api/admin/scholarships/[id]` — Update
- [ ] `DELETE /api/admin/scholarships/[id]` — Delete
- [ ] `GET /api/admin/scholarships/[id]/faqs` — List FAQs
- [ ] `POST /api/admin/scholarships/[id]/faqs` — Add FAQ
- [ ] `PATCH /api/admin/scholarships/[id]/faqs/[fid]` — Update FAQ
- [ ] `DELETE /api/admin/scholarships/[id]/faqs/[fid]` — Delete FAQ

---

### A6. Admin — FAQs (Global)

- [ ] `GET /api/admin/faqs` — List FAQs
- [ ] `POST /api/admin/faqs` — Create FAQ
- [ ] `GET /api/admin/faqs/[id]` — Fetch single
- [ ] `PATCH /api/admin/faqs/[id]` — Update
- [ ] `DELETE /api/admin/faqs/[id]` — Delete
- [ ] `GET /api/admin/faq-categories` — List categories
- [ ] `POST /api/admin/faq-categories` — Create
- [ ] `GET /api/admin/faq-categories/[id]` — Fetch
- [ ] `PATCH /api/admin/faq-categories/[id]` — Update
- [ ] `DELETE /api/admin/faq-categories/[id]` — Delete

---

### A7. Admin — Testimonials

- [ ] `GET /api/admin/testimonials` — List testimonials
- [ ] `POST /api/admin/testimonials` — Create testimonial
- [ ] `GET /api/admin/testimonials/[id]` — Fetch single
- [ ] `PATCH /api/admin/testimonials/[id]` — Update
- [ ] `DELETE /api/admin/testimonials/[id]` — Delete

---

### A8. Admin — Leads & Inquiries

- [ ] `GET /api/admin/leads` — List leads (paginated)
- [ ] `POST /api/admin/leads` — Create lead
- [ ] `GET /api/admin/leads/[id]` — Fetch single
- [ ] `PATCH /api/admin/leads/[id]` — Update lead status
- [ ] `DELETE /api/admin/leads/[id]` — Delete lead
- [ ] `PATCH /api/admin/inquiries/[id]` — Update inquiry status
- [ ] `GET /api/admin/partner-inquiries` — List partner inquiries
- [ ] `POST /api/admin/partner-inquiries` — Create
- [ ] `GET /api/admin/partner-inquiries/[id]` — Fetch
- [ ] `PATCH /api/admin/partner-inquiries/[id]` — Update
- [ ] `DELETE /api/admin/partner-inquiries/[id]` — Delete

---

### A9. Admin — Applications

- [ ] `PATCH /api/admin/applications/[id]` — Update application status

---

### A10. Admin — Users

- [ ] `GET /api/admin/users` — List users (paginated)
- [ ] `POST /api/admin/users` — Create user (admin/agent/student)
- [ ] `GET /api/admin/users/[id]` — Fetch single
- [ ] `PATCH /api/admin/users/[id]` — Update user
- [ ] `DELETE /api/admin/users/[id]` — Delete user

---

### A11. Admin — Universities (Main)

- [ ] `GET /api/admin/universities` — List all universities
- [ ] `POST /api/admin/universities` — Create university
- [ ] `GET /api/admin/universities/[id]` — Fetch single with relations
- [ ] `PATCH /api/admin/universities/[id]` — Update university
- [ ] `DELETE /api/admin/universities/[id]` — Delete university
- [ ] `GET /api/admin/universities/bulk-template` — Download Excel template
- [ ] `POST /api/admin/universities/bulk-upload` — Bulk upload via Excel

---

### A12. Admin — University Sub-Resources

> All scoped under `/api/admin/universities/[id]/...`

**Programs:**
- [ ] `GET .../[id]/programs` — List programs
- [ ] `POST .../[id]/programs` — Add program
- [ ] `PATCH .../[id]/programs/[pid]` — Update program
- [ ] `DELETE .../[id]/programs/[pid]` — Delete program

**Facilities:**
- [ ] `GET .../[id]/facilities` — List facilities
- [ ] `POST .../[id]/facilities` — Add facility
- [ ] `PATCH .../[id]/facilities/[fid]` — Update
- [ ] `DELETE .../[id]/facilities/[fid]` — Delete

**FAQs:**
- [ ] `GET .../[id]/faqs` — List FAQs
- [ ] `POST .../[id]/faqs` — Add FAQ
- [ ] `PATCH .../[id]/faqs/[fid]` — Update
- [ ] `DELETE .../[id]/faqs/[fid]` — Delete

**FMGE Rates:**
- [ ] `GET .../[id]/fmge-rates` — List rates
- [ ] `POST .../[id]/fmge-rates` — Add rate
- [ ] `PATCH .../[id]/fmge-rates/[rid]` — Update
- [ ] `DELETE .../[id]/fmge-rates/[rid]` — Delete

**Hospitals:**
- [ ] `GET .../[id]/hospitals` — List hospitals
- [ ] `POST .../[id]/hospitals` — Attach hospital
- [ ] `PATCH .../[id]/hospitals/[hid]` — Update
- [ ] `DELETE .../[id]/hospitals/[hid]` — Detach

**Intakes:**
- [ ] `GET .../[id]/intakes` — List intakes
- [ ] `POST .../[id]/intakes` — Add intake
- [ ] `PATCH .../[id]/intakes/[iid]` — Update
- [ ] `DELETE .../[id]/intakes/[iid]` — Delete

**Links:**
- [ ] `GET .../[id]/links` — List links
- [ ] `POST .../[id]/links` — Add link
- [ ] `PATCH .../[id]/links/[lid]` — Update
- [ ] `DELETE .../[id]/links/[lid]` — Delete

**Photos:**
- [ ] `GET .../[id]/photos` — List photos
- [ ] `POST .../[id]/photos` — Upload photo
- [ ] `PATCH .../[id]/photos/[pid]` — Update
- [ ] `DELETE .../[id]/photos/[pid]` — Delete

**Rankings:**
- [ ] `GET .../[id]/rankings` — List rankings
- [ ] `POST .../[id]/rankings` — Add ranking
- [ ] `PATCH .../[id]/rankings/[rid]` — Update
- [ ] `DELETE .../[id]/rankings/[rid]` — Delete

**Reviews:**
- [ ] `GET .../[id]/reviews` — List reviews
- [ ] `POST .../[id]/reviews` — Add review
- [ ] `PATCH .../[id]/reviews/[rid]` — Update
- [ ] `DELETE .../[id]/reviews/[rid]` — Delete

**Students:**
- [ ] `GET .../[id]/students` — List students
- [ ] `POST .../[id]/students` — Add student
- [ ] `PATCH .../[id]/students/[sid]` — Update
- [ ] `DELETE .../[id]/students/[sid]` — Delete

**Testimonials:**
- [ ] `GET .../[id]/testimonials` — List testimonials
- [ ] `POST .../[id]/testimonials` — Add testimonial
- [ ] `PATCH .../[id]/testimonials/[tid]` — Update
- [ ] `DELETE .../[id]/testimonials/[tid]` — Delete

---

### A13. Admin — Geography

- [ ] `GET /api/admin/provinces` — List provinces
- [ ] `POST /api/admin/provinces` — Create province
- [ ] `GET /api/admin/provinces/[id]` — Fetch
- [ ] `PATCH /api/admin/provinces/[id]` — Update
- [ ] `DELETE /api/admin/provinces/[id]` — Delete
- [ ] `GET /api/admin/cities` — List cities
- [ ] `POST /api/admin/cities` — Create city
- [ ] `GET /api/admin/cities/[id]` — Fetch
- [ ] `PATCH /api/admin/cities/[id]` — Update
- [ ] `DELETE /api/admin/cities/[id]` — Delete

---

### A14. Admin — Lookup Tables

**Facilities:**
- [ ] `GET /api/admin/facilities` — List
- [ ] `POST /api/admin/facilities` — Create
- [ ] `GET /api/admin/facilities/[id]` — Fetch
- [ ] `PATCH /api/admin/facilities/[id]` — Update
- [ ] `DELETE /api/admin/facilities/[id]` — Delete

**Hospitals:**
- [ ] `GET /api/admin/hospitals` — List
- [ ] `POST /api/admin/hospitals` — Create
- [ ] `GET /api/admin/hospitals/[id]` — Fetch
- [ ] `PATCH /api/admin/hospitals/[id]` — Update
- [ ] `DELETE /api/admin/hospitals/[id]` — Delete

**Levels:**
- [ ] `GET /api/admin/levels` — List
- [ ] `POST /api/admin/levels` — Create
- [ ] `GET /api/admin/levels/[id]` — Fetch
- [ ] `PATCH /api/admin/levels/[id]` — Update
- [ ] `DELETE /api/admin/levels/[id]` — Delete

**Institute Types:**
- [ ] `GET /api/admin/institute-types` — List
- [ ] `POST /api/admin/institute-types` — Create
- [ ] `GET /api/admin/institute-types/[id]` — Fetch
- [ ] `PATCH /api/admin/institute-types/[id]` — Update
- [ ] `DELETE /api/admin/institute-types/[id]` — Delete

**Study Modes:**
- [ ] `GET /api/admin/study-modes` — List
- [ ] `POST /api/admin/study-modes` — Create
- [ ] `GET /api/admin/study-modes/[id]` — Fetch
- [ ] `PATCH /api/admin/study-modes/[id]` — Update
- [ ] `DELETE /api/admin/study-modes/[id]` — Delete

**Government Links:**
- [ ] `GET /api/admin/government-links` — List
- [ ] `POST /api/admin/government-links` — Create
- [ ] `GET /api/admin/government-links/[id]` — Fetch
- [ ] `PATCH /api/admin/government-links/[id]` — Update
- [ ] `DELETE /api/admin/government-links/[id]` — Delete

---

### A15. Admin — Expert Team & Offices

- [ ] `GET /api/admin/expert-team` — List team members
- [ ] `POST /api/admin/expert-team` — Create member
- [ ] `GET /api/admin/expert-team/[id]` — Fetch
- [ ] `PATCH /api/admin/expert-team/[id]` — Update
- [ ] `DELETE /api/admin/expert-team/[id]` — Delete
- [ ] `GET /api/admin/offices` — List offices
- [ ] `POST /api/admin/offices` — Create office
- [ ] `GET /api/admin/offices/[id]` — Fetch
- [ ] `PATCH /api/admin/offices/[id]` — Update
- [ ] `DELETE /api/admin/offices/[id]` — Delete

---

### A16. Admin — Content Pages

- [ ] `GET /api/admin/about-country` — Fetch about country
- [ ] `PATCH /api/admin/about-country` — Update
- [ ] `GET /api/admin/about-us` — Fetch about us
- [ ] `PATCH /api/admin/about-us` — Update
- [ ] `GET /api/admin/education-system` — Fetch education system
- [ ] `PATCH /api/admin/education-system` — Update
- [ ] `GET /api/admin/settings` — Fetch settings
- [ ] `PATCH /api/admin/settings` — Update settings
- [ ] `GET /api/admin/profile` — Fetch admin profile
- [ ] `PATCH /api/admin/profile` — Update profile

---

### A17. Admin — SEO

- [ ] `GET /api/admin/seo/static` — List static SEO entries
- [ ] `POST /api/admin/seo/static` — Create
- [ ] `GET /api/admin/seo/static/[id]` — Fetch
- [ ] `PATCH /api/admin/seo/static/[id]` — Update
- [ ] `DELETE /api/admin/seo/static/[id]` — Delete
- [ ] `GET /api/admin/seo/dynamic` — List dynamic SEO entries
- [ ] `POST /api/admin/seo/dynamic` — Create
- [ ] `GET /api/admin/seo/dynamic/[id]` — Fetch
- [ ] `PATCH /api/admin/seo/dynamic/[id]` — Update
- [ ] `DELETE /api/admin/seo/dynamic/[id]` — Delete
- [ ] `GET /api/admin/seo/og-images` — List OG images
- [ ] `POST /api/admin/seo/og-images` — Upload OG image
- [ ] `GET /api/admin/seo/og-images/[id]` — Fetch
- [ ] `PATCH /api/admin/seo/og-images/[id]` — Update
- [ ] `DELETE /api/admin/seo/og-images/[id]` — Delete

---

### A18. Admin — FMGE & Bulk

- [ ] `GET /api/admin/fmge-rates` — List FMGE rates
- [ ] `POST /api/admin/fmge-rates` — Create rate
- [ ] `GET /api/admin/fmge-rates/[id]` — Fetch
- [ ] `PATCH /api/admin/fmge-rates/[id]` — Update
- [ ] `DELETE /api/admin/fmge-rates/[id]` — Delete
- [ ] `POST /api/admin/bulk/fmge-rates` — Bulk upload FMGE rates

---

### A19. Admin — Gallery & Upload

- [ ] `GET /api/admin/gallery` — List gallery images
- [ ] `POST /api/admin/gallery` — Upload image to gallery
- [ ] `DELETE /api/admin/gallery/[id]` — Delete gallery image
- [ ] `POST /api/upload` — Upload file (image/doc) → returns URL

---

### A20. Public APIs (No Auth)

- [ ] `GET /api/public/expert-team` — Fetch team for public page
- [ ] `GET /api/public/offices` — Fetch office locations
- [ ] `GET /api/expert-team` — Fetch team (alternate endpoint)
- [ ] `GET /api/universities` — List all public universities
- [ ] `GET /api/universities/[id]/programs` — Fetch programs for a university
- [ ] `POST /api/leads` — Submit lead/inquiry form
- [ ] `POST /api/partner-inquiry` — Submit partner inquiry
- [ ] `GET /api/applications` — List applications
- [ ] `POST /api/applications` — Submit application

---

### A21. Student APIs (Student Auth Required)

- [ ] `GET /api/student/profile` — Fetch student profile
- [ ] `PATCH /api/student/profile` — Update profile
- [ ] `DELETE /api/student/profile` — Delete account
- [ ] `POST /api/student/change-password` — Change password
- [ ] `GET /api/student/applications` — List student's applications
- [ ] `POST /api/student/applications` — Submit application

---

### A22. Agent APIs (Agent Auth Required)

- [ ] `GET /api/agent/leads` — List agent's leads
- [ ] `POST /api/agent/leads` — Create new lead

---

### A23. Security & Edge Cases

- [ ] Hit any `/api/admin/*` route without auth token → 401 Unauthorized
- [ ] Hit any `/api/student/*` route without auth token → 401 Unauthorized
- [ ] Hit any `/api/agent/*` route without auth token → 401 Unauthorized
- [ ] Use student token on admin route → 403 Forbidden
- [ ] Use agent token on admin route → 403 Forbidden
- [ ] `GET /api/admin/blogs/999999` → 404 Not Found
- [ ] `POST /api/admin/blogs` with empty body → 400 Bad Request
- [ ] Upload `.exe` file via `/api/upload` → rejected
- [ ] Upload oversized file → rejected
- [ ] Send SQL injection string in search query → no error / safe
- [ ] Test pagination: `?page=1&limit=10` → correct count & pages
- [ ] Test search: `?search=keyword` → filtered results

---

---

## PART B: UI / PAGES TESTING

---

### B1. Public-Facing Pages

- [ ] **Homepage** (`/`) — Hero loads, CTA buttons work, university cards render, testimonials carousel, lead form submits
- [ ] **About Hungary** (`/about-Hungary`) — Content renders, images load, meta tags present
- [ ] **About Us** (`/about-us`) — Team section, company info
- [ ] **Universities List** (`/universities`) — Cards display, search/filter works, links to detail
- [ ] **University Detail** (`/universities/[slug]`) — Overview, programs, facilities, rankings, FAQs, photos, reviews, FMGE rates tabs all load
- [ ] **Compare Universities** (`/compare`) — Select 2+ universities, comparison table works
- [ ] **Blog Listing** (`/blog`) — Cards render, category filter, pagination
- [ ] **Blog Detail** (`/blog/[slug]`) — CKEditor HTML renders (images, tables, embeds), related posts, SEO meta
- [ ] **Articles Listing** (`/articles`) — Cards, category filter
- [ ] **Article Detail** (`/articles/[slug]`) — Content renders properly
- [ ] **News Listing** (`/news`) — Cards, category filter, pagination
- [ ] **News Detail** (`/news/[slug]`) — Content sections, FAQs accordion
- [ ] **Scholarships** (`/scholarships`) — Cards render, filter
- [ ] **Scholarship Detail** (`/scholarships/[slug]`) — Eligibility, coverage, FAQs, apply CTA
- [ ] **FMGE Pass Rates** (`/fmge-rates`) — Data table renders correctly
- [ ] **Education System** (`/education-system`) — Content renders
- [ ] **Apply Page** (`/apply`) — Form loads, dropdowns populate, submission works
- [ ] **Contact Us** (`/contact-us`) — Form, office locations, validation
- [ ] **Our Partners** (`/our-partners`) — Partner info displays
- [ ] **Counselling** (`/counselling`) — Lead form, info section
- [ ] **Privacy Policy** (`/privacy-policy`) — Content renders
- [ ] **Terms of Service** (`/terms-of-service`) — Content renders
- [ ] **Cookie Policy** (`/cookie-policy`) — Content renders

---

### B2. Auth Pages

- [ ] **Login** (`/login`) — Form validation, success→redirect, wrong creds→error message
- [ ] **Register** (`/register`) — All fields, success triggers OTP flow
- [ ] **OTP Verification** (`/otp-verification`) — OTP input, resend button, success→redirect
- [ ] **Forgot Password** (`/forgot-password`) — Email input, submit, success message
- [ ] **Reset Password** (`/reset-password`) — New password + confirm, mismatch error, success
- [ ] **Admin Login** (`/admin/login`) — Admin login flow, redirect to dashboard

---

### B3. Admin — Dashboard & Profile

- [ ] **Dashboard** (`/admin`) — Stats cards load, charts render, recent activities
- [ ] **Profile** (`/admin/profile`) — Edit name/email/avatar, save works

---

### B4. Admin — Blog Management

- [ ] **Blogs List** (`/admin/blogs`) — Table loads, pagination, search, delete confirmation dialog
- [ ] **Create Blog** (`/admin/blogs/create`) — CKEditor 5 loads, category dropdown, image upload, OG image picker, slug auto-generates, save
- [ ] **Edit Blog** (`/admin/blogs/[id]/edit`) — Pre-filled data, CKEditor content loads correctly, update saves
- [ ] **Blog Categories List** (`/admin/blog-categories`) — Table, CRUD
- [ ] **Create Blog Category** (`/admin/blog-categories/create`) — Form, slug, save
- [ ] **Edit Blog Category** (`/admin/blog-categories/[id]/edit`) — Pre-filled, update

---

### B5. Admin — Articles Management

- [ ] **Articles List** (`/admin/articles`) — Table, pagination, search
- [ ] **Create Article** (`/admin/articles/create`) — CKEditor, category, OG image, slug, save
- [ ] **Edit Article** (`/admin/articles/[id]/edit`) — Pre-filled, update
- [ ] **Article Categories** (`/admin/article-categories`) — Table, CRUD

---

### B6. Admin — News Management

- [ ] **News List** (`/admin/news`) — Table, CRUD
- [ ] **Create News** (`/admin/news/create`) — Content sections, FAQs, category, OG image, save
- [ ] **Edit News** (`/admin/news/[id]/edit`) — Pre-filled, update
- [ ] **News Categories** (`/admin/news-categories`) — CRUD

---

### B7. Admin — University Management

- [ ] **Universities List** (`/admin/universities`) — Table, search, filter, pagination
- [ ] **Create University** (`/admin/universities/create`) — All fields (name, slug, desc, fees, city, province, image), save
- [ ] **Edit University** (`/admin/universities/[id]/edit`) — Pre-filled, OG image picker, update
- [ ] **Programs** (`/admin/universities/[id]/programs`) — List, add, edit, delete
- [ ] **Facilities** (`/admin/universities/[id]/facilities`) — Assign/remove
- [ ] **FAQs** (`/admin/universities/[id]/faqs`) — CRUD
- [ ] **FMGE Rates** (`/admin/universities/[id]/fmge-rates`) — Add year/percentage, bulk upload
- [ ] **Hospitals** (`/admin/universities/[id]/hospitals`) — Attach/detach
- [ ] **Intakes** (`/admin/universities/[id]/intakes`) — CRUD
- [ ] **Links** (`/admin/universities/[id]/links`) — CRUD
- [ ] **Photos** (`/admin/universities/[id]/photos`) — Upload/delete gallery
- [ ] **Rankings** (`/admin/universities/[id]/rankings`) — CRUD
- [ ] **Reviews** (`/admin/universities/[id]/reviews`) — CRUD
- [ ] **Students** (`/admin/universities/[id]/students`) — CRUD
- [ ] **Testimonials** (`/admin/universities/[id]/testimonials`) — CRUD

---

### B8. Admin — Scholarships

- [ ] **List** (`/admin/scholarships`) — Table, CRUD
- [ ] **Create** (`/admin/scholarships/create`) — Eligibility, coverage, OG image, save
- [ ] **Edit** (`/admin/scholarships/[id]/edit`) — Pre-filled, update
- [ ] **FAQs** (`/admin/scholarships/[id]/faqs`) — CRUD

---

### B9. Admin — FAQs

- [ ] **FAQs List** (`/admin/faqs`) — Table, CRUD
- [ ] **Create FAQ** (`/admin/faqs/create`) — Category selection, save
- [ ] **Edit FAQ** (`/admin/faqs/[id]/edit`) — Pre-filled, update
- [ ] **FAQ Categories** (`/admin/faq-categories`) — CRUD

---

### B10. Admin — Testimonials

- [ ] **List** (`/admin/testimonials`) — Table, CRUD
- [ ] **Create** (`/admin/testimonials/create`) — Image upload, save
- [ ] **Edit** (`/admin/testimonials/[id]/edit`) — Pre-filled, update

---

### B11. Admin — Leads & Inquiries

- [ ] **Leads List** (`/admin/leads`) — Table, status filter, pagination
- [ ] **Create Lead** (`/admin/leads/create`) — Form, validation
- [ ] **Edit Lead** (`/admin/leads/[id]/edit`) — Status update, pre-filled
- [ ] **Applications** (`/admin/applications`) — Table, status update dropdown
- [ ] **Partner Inquiries** (`/admin/partner-inquiries`) — Table, CRUD
- [ ] **Create Partner Inquiry** (`/admin/partner-inquiries/create`) — Form
- [ ] **Edit Partner Inquiry** (`/admin/partner-inquiries/[id]/edit`) — Update

---

### B12. Admin — Reference Data Pages

- [ ] **Provinces** (`/admin/provinces`) — List, create/edit pages
- [ ] **Cities** (`/admin/cities`) — List, province dropdown, create/edit
- [ ] **Hospitals** (`/admin/hospitals`) — List, create/edit pages
- [ ] **Facilities** (`/admin/facilities`) — CRUD via table/modal
- [ ] **Institute Types** (`/admin/institute-types`) — CRUD
- [ ] **Levels** (`/admin/levels`) — CRUD
- [ ] **Study Modes** (`/admin/study-modes`) — CRUD
- [ ] **Government Links** (`/admin/government-links`) — CRUD
- [ ] **FMGE Rates** (`/admin/fmge-rates`) — Table, bulk upload

---

### B13. Admin — Other Modules

- [ ] **Expert Team** (`/admin/expert-team`) — Add/edit/remove members
- [ ] **Offices** (`/admin/offices`) — CRUD
- [ ] **About Country** (`/admin/about-country`) — Edit rich text
- [ ] **About Us** (`/admin/about-us`) — Edit rich text
- [ ] **Education System** (`/admin/education-system`) — Edit rich text
- [ ] **Settings** (`/admin/settings`) — Update site-wide settings
- [ ] **Page Contents** (`/admin/page-contents`) — Edit static page content
- [ ] **Gallery** (`/admin/gallery`) — Upload/delete images
- [ ] **Uploads** (`/admin/uploads`) — View uploaded files
- [ ] **Registered Users** (`/admin/registered-users`) — View registered students

---

### B14. Admin — Users

- [ ] **Users List** (`/admin/users`) — Table, CRUD
- [ ] **Create User** (`/admin/users/create`) — Role selection (admin/agent/student)
- [ ] **Edit User** (`/admin/users/[id]/edit`) — Pre-filled, update

---

### B15. Admin — SEO

- [ ] **Static SEO** (`/admin/seo/static`) — CRUD entries
- [ ] **Dynamic SEO** (`/admin/seo/dynamic`) — CRUD entries
- [ ] **OG Images** (`/admin/seo/og-images`) — Upload, select, delete images

---

### B16. Student Dashboard

- [ ] **Dashboard** (`/student`) — Welcome message, quick stats
- [ ] **Applications** (`/student/applications`) — List with status badges
- [ ] **Applied Colleges** (`/student/applied-colleges`) — University list
- [ ] **Account Settings** (`/student/account-settings`) — Edit profile
- [ ] **Change Password** (`/student/change-password`) — Old/new fields, validation
- [ ] **Settings** (`/student/settings`) — Preferences
- [ ] **Notifications** (`/student/notifications`) — Notification list

---

### B17. Agent Portal

- [ ] **Dashboard** (`/agent`) — Stats, recent leads
- [ ] **Login** (`/agent/login`) — Agent login flow
- [ ] **Leads** (`/agent/leads`) — View leads table
- [ ] **Add Lead** (`/agent/add-lead`) — Lead creation form
- [ ] **Commission** (`/agent/commission`) — Commission tracking view

---

### B18. Cross-Cutting UI Checks

- [ ] **Responsive — Mobile** — All public pages render on 375px width
- [ ] **Responsive — Tablet** — All public pages render on 768px width
- [ ] **Responsive — Desktop** — Full layout on 1440px width
- [ ] **Header Navigation** — All links work, active state highlights
- [ ] **Mobile Menu** — Hamburger opens/closes, links navigate
- [ ] **Footer Links** — All footer links navigate correctly
- [ ] **404 Page** — Invalid URL → custom 404 renders
- [ ] **Error Page** — Server error → custom error boundary renders
- [ ] **Loading States** — Skeletons/spinners show while data loads
- [ ] **Toast Notifications** — Success/error toasts on form actions
- [ ] **Modal Dialogs** — Delete confirmations open/close, cancel works
- [ ] **Form Validation** — Required fields, email format, phone format
- [ ] **Image Loading** — No broken images (check Network tab for 404s)
- [ ] **CKEditor 5** — Loads in create/edit, toolbar works, paste from Word works
- [ ] **OG Image Picker** — Gallery opens, image selects, URL populates field
- [ ] **SEO Meta Tags** — Each public page has `<title>`, `<meta description>`, OG tags
- [ ] **Sitemap** — `/sitemap.xml` generates with all public URLs
- [ ] **Robots.txt** — `/robots.txt` has correct rules
- [ ] **Auth Guards** — Unauthenticated `/admin/*` → redirect to login
- [ ] **Auth Guards** — Unauthenticated `/student/*` → redirect to login
- [ ] **Auth Guards** — Unauthenticated `/agent/*` → redirect to login
- [ ] **Session Expiry** — Expired session → redirect to login
- [ ] **Admin Sidebar** — All menu items navigate correctly
- [ ] **Breadcrumbs** — Sub-pages show correct breadcrumb trail
- [ ] **Accessibility** — Keyboard navigation, focus indicators, alt text

---

## Bug Tracker

| # | Page/API | Bug Description | Severity | Status |
|---|----------|----------------|----------|--------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

---

> **Total Items:** ~260 API tests + ~140 UI tests = **~400 test scenarios**
