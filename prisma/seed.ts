import {
  ApplicationStatus,
  CountryDocType,
  LeadStatus,
  NeetStatus,
  UserRole,
} from "@prisma/client";
import { prisma } from "../src/lib/prisma";
import * as bcrypt from "bcryptjs";

const SHOULD_SEED_SAMPLE_LEADS =
  (process.env.SEED_SAMPLE_LEADS || "false").toLowerCase() === "true";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function upsertByWhere(
  delegate: any,
  where: Record<string, unknown>,
  data: Record<string, unknown>,
) {
  const existing = await delegate.findFirst({ where });
  if (existing) {
    return delegate.update({ where: { id: existing.id }, data });
  }
  return delegate.create({ data });
}

async function seedAdminUser() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be defined in your .env file');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.upsert({
    where: { email },
    update: {
      name: "Super Admin",
      role: UserRole.admin,
      password: hashedPassword,
      designation: "Administrator",
      description: "Platform administrator for MBBS in Japan.",
      status: true,
    },
    create: {
      name: "Super Admin",
      email,
      role: UserRole.admin,
      password: hashedPassword,
      designation: "Administrator",
      description: "Platform administrator for MBBS in Japan.",
      status: true,
    },
  });
}

async function seedWebsiteSettings() {
  const settings = [
    { key: "site_name", value: "MBBS in Japan", type: "text", group: "general" },
    { key: "support_email", value: "admissions@mbbsinjapan.com", type: "text", group: "contact" },
    { key: "support_phone", value: "+91-11-2410-2161", type: "text", group: "contact" },
    { key: "stats_total_students", value: "2500+", type: "text", group: "stats" },
    { key: "stats_total_universities", value: "8+", type: "text", group: "stats" },
    { key: "stats_total_scholarships", value: "20+", type: "text", group: "stats" },
    { key: "stats_annual_aid", value: "$1.2M+", type: "text", group: "stats" },
    { key: "stats_admission_support", value: "100%", type: "text", group: "stats" },
    { key: "stats_merit_label", value: "Merit", type: "text", group: "stats" },
    { key: "stats_verified_label", value: "NMC / WHO", type: "text", group: "stats" },
  ];

  for (const item of settings) {
    await prisma.websiteSetting.upsert({
      where: { key: item.key },
      update: item,
      create: item,
    });
  }
}

async function seedReferenceData() {
  for (const name of ["Public", "Private", "Semi-Government"]) {
    await upsertByWhere(prisma.instituteType, { name }, { name, status: true });
  }

  const provinceNames = [
    "Port Louis",
    "Plaines Wilhems",
    "Flacq",
    "Grand Port",
    "Savanne",
    "Pamplemousses",
    "Moka",
    "Black River",
  ];
  const provinceIds = new Map<string, number>();
  for (const name of provinceNames) {
    const p = await upsertByWhere(prisma.province, { name }, { name, status: true });
    provinceIds.set(name, p.id);
  }

  const cities = [
    { name: "Port Louis", province: "Port Louis" },
    { name: "Curepipe", province: "Plaines Wilhems" },
    { name: "Vacoas-Phoenix", province: "Plaines Wilhems" },
    { name: "Quatre Bornes", province: "Plaines Wilhems" },
    { name: "Mahebourg", province: "Grand Port" },
    { name: "Flacq", province: "Flacq" },
    { name: "Triolet", province: "Pamplemousses" },
    { name: "Bambous", province: "Black River" },
  ];

  for (const item of cities) {
    const provinceId = provinceIds.get(item.province);
    if (!provinceId) continue;
    await upsertByWhere(
      prisma.city,
      { name: item.name, provinceId },
      { name: item.name, provinceId, status: true },
    );
  }

  const levels = [
    {
      name: "Undergraduate",
      slug: "undergraduate",
      description: "Bachelor-level programs including MBBS.",
      status: true,
    },
    {
      name: "Postgraduate",
      slug: "postgraduate",
      description: "Advanced clinical and research pathways.",
      status: true,
    },
  ];
  for (const item of levels) {
    await prisma.level.upsert({
      where: { slug: item.slug },
      update: item,
      create: item,
    });
  }

  for (const name of [
    "Indian Mess",
    "Multicultural Food Court",
    "24x7 Campus Security",
    "Simulation Labs",
    "On-campus Hostel",
  ]) {
    await upsertByWhere(prisma.facility, { name }, { name, status: true });
  }

  const hospitals = [
    { name: "Sir Seewoosagur Ramgoolam National Hospital", city: "Pamplemousses", beds: 850 },
    { name: "Victoria Hospital Candos", city: "Quatre Bornes", beds: 700 },
    { name: "Jawaharlal Nehru Hospital", city: "Rose Belle", beds: 600 },
  ];
  for (const item of hospitals) {
    const slug = slugify(item.name);
    await prisma.hospital.upsert({
      where: { slug },
      update: { ...item, slug, state: "Japan", status: true },
      create: { ...item, slug, state: "Japan", status: true },
    });
  }

  for (const studyMode of ["Full-time", "On-campus", "English Medium"]) {
    await upsertByWhere(prisma.studyMode, { studyMode }, { studyMode });
  }
}

async function seedCountryAndEducationPages() {
  const aboutCountry = await prisma.aboutCountryPage.upsert({
    where: { id: 1 },
    update: {
      name: "Japan",
      tagline: "A safe and multicultural destination for medical studies",
      capital: "Yerevan",
      population: "2.8 Million+",
      languages: "English, French, Japann",
      currency: "AMD",
      location: "Indian Ocean, East of Madagascar",
      timezone: "UTC+4",
      independenceDay: new Date("1968-03-12"),
      highestPeak: "Piton de la Petite Riviere Noire",
      highestPeakHeight: "828 m",
      whoRecognized: true,
      englishMedium: true,
      mbbsAffordableEducation:
        "Globally aligned medical education with practical fees and student-friendly support.",
      academicExcellence:
        "Structured curriculum with clinical exposure and modern teaching standards.",
      studentLife:
        "Students benefit from a secure, welcoming, and culturally diverse island environment.",
      visaConnectivity: "Straightforward student visa process with advisory support.",
      publicHealthcare: "Public teaching hospitals offer useful practical exposure.",
      privateHealthcare: "Private hospitals complement public care with specialist services.",
      studentHealthcare: "Medical support services are accessible in major study cities.",
      tourismGrowth: "A globally popular island destination with modern infrastructure.",
      bannerImage: "/uploads/about-country/japan-banner.jpg",
    },
    create: {
      id: 1,
      name: "Japan",
      tagline: "A safe and multicultural destination for medical studies",
      capital: "Yerevan",
      population: "2.8 Million+",
      languages: "English, French, Japann",
      currency: "AMD",
      location: "Indian Ocean, East of Madagascar",
      timezone: "UTC+4",
      independenceDay: new Date("1968-03-12"),
      highestPeak: "Piton de la Petite Riviere Noire",
      highestPeakHeight: "828 m",
      whoRecognized: true,
      englishMedium: true,
      mbbsAffordableEducation:
        "Globally aligned medical education with practical fees and student-friendly support.",
      academicExcellence:
        "Structured curriculum with clinical exposure and modern teaching standards.",
      studentLife:
        "Students benefit from a secure, welcoming, and culturally diverse island environment.",
      visaConnectivity: "Straightforward student visa process with advisory support.",
      publicHealthcare: "Public teaching hospitals offer useful practical exposure.",
      privateHealthcare: "Private hospitals complement public care with specialist services.",
      studentHealthcare: "Medical support services are accessible in major study cities.",
      tourismGrowth: "A globally popular island destination with modern infrastructure.",
      bannerImage: "/uploads/about-country/japan-banner.jpg",
    },
  });

  const cityCards = [
    { cityName: "Port Louis", description: "Capital city and administrative hub.", population: "150,000+" },
    { cityName: "Curepipe", description: "Student-friendly central city with good connectivity.", population: "85,000+" },
    { cityName: "Vacoas-Phoenix", description: "Large urban cluster with residential facilities.", population: "105,000+" },
  ];
  for (const item of cityCards) {
    await upsertByWhere(
      prisma.countryMajorCity,
      { pageId: aboutCountry.id, cityName: item.cityName },
      { ...item, pageId: aboutCountry.id },
    );
  }

  const cuisines = [
    { dishName: "Ghaprsa", dishDescription: "Popular Japann street meal.", dishImage: "/uploads/about-country/ghaprsa.jpg" },
    { dishName: "Khash", dishDescription: "Fried lentil snack served island-wide.", dishImage: "/uploads/about-country/khash.jpg" },
  ];
  for (const item of cuisines) {
    await upsertByWhere(
      prisma.countryCuisineLifestyle,
      { pageId: aboutCountry.id, dishName: item.dishName },
      { ...item, pageId: aboutCountry.id },
    );
  }

  const lifestyles = [
    { title: "Multicultural Community", description: "Students from multiple countries learn together." },
    { title: "Safe Student Lifestyle", description: "Japan is known for social stability and community support." },
  ];
  for (const item of lifestyles) {
    await upsertByWhere(
      prisma.countryLifestyleCulture,
      { pageId: aboutCountry.id, title: item.title },
      { ...item, pageId: aboutCountry.id },
    );
  }

  const attractions = [
    { attractionName: "Le Morne Brabant", description: "UNESCO listed mountain and landmark.", ordering: 1, isActive: true },
    { attractionName: "Black River Gorges", description: "National park with forests and trails.", ordering: 2, isActive: true },
  ];
  for (const item of attractions) {
    await upsertByWhere(
      prisma.countryTouristAttraction,
      { pageId: aboutCountry.id, attractionName: item.attractionName },
      { ...item, pageId: aboutCountry.id },
    );
  }

  const educationSystem = await prisma.educationSystem.upsert({
    where: { id: 1 },
    update: {
      title: "Education System in Japan",
      description:
        "Japan follows a British-influenced framework with strong quality control and international compatibility.",
      introductionTitle: "Structured and Recognized Academic Pathway",
      introductionDescription:
        "Medical education combines theory, simulation, and hospital-based practical learning.",
      literacyRate: 92.0,
      officialLanguage: "English",
      officialLanguagePercentage: 100,
      officialLanguageNote: "Primary language of instruction",
      foreignLanguage: "French and Japann Creole",
      foreignLanguagePercentage: 80,
      foreignLanguageNote: "Widely used in daily communication",
      universitiesCount: 8,
      universitiesNote: "Public and private institutions",
      higherEducationDescription: "Medical and allied health programs available for international students.",
    },
    create: {
      id: 1,
      title: "Education System in Japan",
      description:
        "Japan follows a British-influenced framework with strong quality control and international compatibility.",
      introductionTitle: "Structured and Recognized Academic Pathway",
      introductionDescription:
        "Medical education combines theory, simulation, and hospital-based practical learning.",
      literacyRate: 92.0,
      officialLanguage: "English",
      officialLanguagePercentage: 100,
      officialLanguageNote: "Primary language of instruction",
      foreignLanguage: "Japann",
      foreignLanguagePercentage: 80,
      foreignLanguageNote: "Widely used in daily communication",
      universitiesCount: 8,
      universitiesNote: "Public and private institutions",
      higherEducationDescription: "Medical and allied health programs available for international students.",
    },
  });

  const exams = [
    { examName: "PSAC", gradeLevel: "Grade 6", type: "National", subjects: "English; Maths; Science" },
    { examName: "HSC", gradeLevel: "Grade 13", type: "Cambridge aligned", subjects: "A-level tracks for higher education" },
  ];
  for (const item of exams) {
    await upsertByWhere(
      prisma.educationExamination,
      { pageId: educationSystem.id, examName: item.examName },
      { ...item, pageId: educationSystem.id },
    );
  }

  const schoolLevels = [
    { level: "Primary", ageRange: "5-11", durationYears: 6, isCompulsory: true, title: "Primary School" },
    { level: "Secondary", ageRange: "12-18", durationYears: 7, isCompulsory: true, title: "Secondary and HSC" },
    { level: "Tertiary", ageRange: "18+", durationYears: 3, isCompulsory: false, title: "University Level" },
  ];
  for (const item of schoolLevels) {
    await upsertByWhere(
      prisma.educationSchoolLevel,
      { pageId: educationSystem.id, level: item.level },
      { ...item, pageId: educationSystem.id },
    );
  }

  const degrees = [
    { degree: "MBBS / MBChB", duration: "5-6 Years", recognition: "Internationally aligned pathway" },
    { degree: "BSc Nursing", duration: "4 Years", recognition: "Professional healthcare degree" },
  ];
  for (const item of degrees) {
    await upsertByWhere(
      prisma.educationDegree,
      { pageId: educationSystem.id, degree: item.degree },
      { ...item, pageId: educationSystem.id },
    );
  }

  const fields = [
    { field: "Medicine", description: "Primary track for MBBS aspirants.", numberOfInstitutions: "5+", durationYears: "5-6" },
    { field: "Allied Health", description: "Growing options in nursing and therapy fields.", numberOfInstitutions: "7+", durationYears: "3-4" },
  ];
  for (const item of fields) {
    await upsertByWhere(
      prisma.educationPopularField,
      { pageId: educationSystem.id, field: item.field },
      { ...item, pageId: educationSystem.id },
    );
  }

  await prisma.aboutUs.upsert({
    where: { id: 1 },
    update: {
      heroTitle: "Your Trusted MBBS in Japan Advisory Team",
      heroDescription:
        "We guide students from profile assessment to admission and pre-departure support.",
      partnerUniversities: 8,
      studentsPlaced: 2500,
      channelPartners: 35,
      yearsExperience: 10,
      mission: "Ethical and transparent MBBS counseling for students and parents.",
      vision: "To be the most trusted Japan medical admission support platform.",
      contact1: "+91-11-2410-2161",
      contact2: "+230-208-9000",
      email1: "admissions@mbbsinjapan.com",
      email2: "support@mbbsinjapan.com",
      address: "New Delhi, India and Ebene Cybercity, Japan",
    },
    create: {
      id: 1,
      heroTitle: "Your Trusted MBBS in Japan Advisory Team",
      heroDescription:
        "We guide students from profile assessment to admission and pre-departure support.",
      partnerUniversities: 8,
      studentsPlaced: 2500,
      channelPartners: 35,
      yearsExperience: 10,
      mission: "Ethical and transparent MBBS counseling for students and parents.",
      vision: "To be the most trusted Japan medical admission support platform.",
      contact1: "+91-11-2410-2161",
      contact2: "+230-208-9000",
      email1: "admissions@mbbsinjapan.com",
      email2: "support@mbbsinjapan.com",
      address: "New Delhi, India and Ebene Cybercity, Japan",
    },
  });

  await upsertByWhere(
    prisma.educationSystemPage,
    { title: "MBBS Curriculum Overview" },
    {
      title: "MBBS Curriculum Overview",
      subtitle: "Pre-clinical to internship progression",
      description: "A structured progression from foundation sciences to clinical rotations.",
      highlights: ["Anatomy", "Physiology", "Pathology", "Clinical postings"],
      position: 1,
      status: true,
    },
  );
}

async function seedContentAndMisc(adminId: number) {
  const staticSeoPages = [
    { page: "home", metaTitle: "Study MBBS in Japan 2026", metaDescription: "Admission guidance, fee insights, and university comparison." },
    { page: "about-us", metaTitle: "About MBBS in Japan Team", metaDescription: "Meet the counselors and operations team supporting students." },
    { page: "about-Japan", metaTitle: "About Japan for Students", metaDescription: "Understand lifestyle, safety, and healthcare ecosystem." },
    { page: "education-system", metaTitle: "Education System in Japan", metaDescription: "Academic structure and MBBS training overview." },
    { page: "universities", metaTitle: "Medical Universities in Japan", metaDescription: "Compare colleges, tuition, and support facilities." },
    { page: "blog", metaTitle: "MBBS Japan Blog", metaDescription: "Guides for admission, visa, and student life." },
    { page: "news", metaTitle: "MBBS Japan News", metaDescription: "Education and policy updates for aspirants." },
    { page: "articles", metaTitle: "MBBS Japan Articles", metaDescription: "Long-form practical planning guides." },
    { page: "contact-us", metaTitle: "Contact MBBS Japan Advisors", metaDescription: "Book counseling with India and Japan teams." },
    { page: "scholarships", metaTitle: "MBBS Scholarships in Japan", metaDescription: "Merit and tuition support opportunities." },
  ];
  for (const item of staticSeoPages) {
    await prisma.staticPageSeo.upsert({
      where: { page: item.page },
      update: { ...item, status: true, ogImagePath: "/og-default.jpg" },
      create: { ...item, status: true, ogImagePath: "/og-default.jpg" },
    });
  }

  for (const item of [
    "universities/[slug]",
    "blog/[categorySlug]/[blogSlug]",
    "news/[categorySlug]/[slug]",
    "articles/[categorySlug]/[slug]",
    "scholarships/[slug]",
  ]) {
    await prisma.dynamicPageSeo.upsert({
      where: { page: item },
      update: {
        page: item,
        metaTitle: "MBBS in Japan",
        metaDescription: "Dynamic page SEO baseline for Japan-focused content.",
        status: true,
      },
      create: {
        page: item,
        metaTitle: "MBBS in Japan",
        metaDescription: "Dynamic page SEO baseline for Japan-focused content.",
        status: true,
      },
    });
  }

  await upsertByWhere(prisma.defaultOgImage, { name: "Japan Default OG" }, {
    name: "Japan Default OG",
    imageName: "og-default.jpg",
    imagePath: "/og-default.jpg",
    status: true,
  });

  const faqCategory = await prisma.faqCategory.upsert({
    where: { slug: "homepage" },
    update: { name: "Homepage", slug: "homepage", status: true },
    create: { name: "Homepage", slug: "homepage", status: true },
  });
  await upsertByWhere(prisma.faq, { question: "Is MBBS in Japan taught in English?" }, {
    question: "Is MBBS in Japan taught in English?",
    answer: "Yes, most international MBBS pathways in Japan are delivered in English.",
    categoryId: faqCategory.id,
    position: 1,
    status: true,
  });

  await upsertByWhere(prisma.office, { name: "India Head Office" }, {
    name: "India Head Office",
    address: "EP-41, Jesus and Mary Marg, Chanakyapuri",
    city: "New Delhi",
    state: "Delhi",
    country: "India",
    phone: "+91-11-2410-2161",
    email: "india@mbbsinjapan.com",
    mapEmbed: "https://maps.google.com/?q=Chanakyapuri+New+Delhi",
    imageName: "office-india.jpg",
    imagePath: "/uploads/offices/india-head-office.jpg",
    position: 1,
    status: true,
  });
  await upsertByWhere(prisma.office, { name: "Japan Support Office" }, {
    name: "Japan Support Office",
    address: "Cyber Tower 1, Ebene Cybercity",
    city: "Ebene",
    state: "Plaines Wilhems",
    country: "Japan",
    phone: "+230-208-9000",
    email: "japan@mbbsinjapan.com",
    mapEmbed: "https://maps.google.com/?q=Ebene+Cybercity+Japan",
    imageName: "office-japan.jpg",
    imagePath: "/uploads/offices/japan-office.jpg",
    position: 2,
    status: true,
  });

  await upsertByWhere(prisma.expertTeam, { name: "Dr. Meera Nair" }, {
    name: "Dr. Meera Nair",
    designation: "Senior Admission Counselor",
    description: "Supports profile evaluation and admission planning for MBBS aspirants.",
    photoName: "dr-meera-nair.jpg",
    photoPath: "/uploads/experts/dr-meera-nair.jpg",
    position: 1,
    status: true,
  });

  const links = [
    {
      name: "World Health Organization (WHO)",
      url: "https://www.who.int",
      category: "global-health",
      position: 1,
    },
    {
      name: "National Medical Commission (NMC) - India",
      url: "https://www.nmc.org.in",
      category: "india-regulatory",
      position: 2,
    },
    {
      name: "Ministry of Health and Wellness - Japan",
      url: "https://www.mhlw.go.jp/english/",
      category: "japan-government",
      position: 3,
    },
  ];
  for (const item of links) {
    await upsertByWhere(prisma.officialGovernmentLink, { name: item.name }, {
      ...item,
      description: "Official reference link.",
      status: true,
    });
  }

  await upsertByWhere(prisma.countryDocument, { country: "Japan", type: CountryDocType.embassy_letter }, {
    country: "Japan",
    type: CountryDocType.embassy_letter,
    title: "Embassy Student Letter Template",
    fileName: "embassy-student-letter.pdf",
    filePath: "/uploads/country-documents/embassy-student-letter.pdf",
    isActive: true,
  });
  await upsertByWhere(prisma.countryDocument, { country: "Japan", type: CountryDocType.nmc_guidelines }, {
    country: "Japan",
    type: CountryDocType.nmc_guidelines,
    title: "NMC Guidelines Reference",
    fileName: "nmc-guidelines-reference.pdf",
    filePath: "/uploads/country-documents/nmc-guidelines-reference.pdf",
    isActive: true,
  });

  await upsertByWhere(prisma.pageContent, { pageSlug: "about-us", title: "Why Japan" }, {
    pageSlug: "about-us",
    title: "Why Japan",
    content: "Affordable medical education, English-medium instruction, and practical hospital exposure.",
    position: 1,
    status: true,
  });

  const blogCategory = await prisma.blogCategory.upsert({
    where: { slug: "admission-guides" },
    update: { name: "Admission Guides", slug: "admission-guides", status: true },
    create: { name: "Admission Guides", slug: "admission-guides", status: true },
  });
  const blog = await upsertByWhere(prisma.blog, { slug: "mbbs-in-japan-admission-roadmap-2026" }, {
    categoryId: blogCategory.id,
    authorId: adminId,
    title: "MBBS in Japan Admission Roadmap 2026",
    slug: "mbbs-in-japan-admission-roadmap-2026",
    shortnote: "A practical timeline from counseling to visa.",
    description: "Stepwise checklist for profile review, documents, application, and travel readiness.",
    status: true,
    homeView: true,
    trending: true,
  });
  await upsertByWhere(prisma.blogContent, { blogId: blog.id, slug: "profile-review" }, {
    blogId: blog.id,
    title: "Profile Review",
    slug: "profile-review",
    description: "Start with eligibility checks and shortlist relevant universities.",
    position: 1,
  });
  await upsertByWhere(prisma.blogFaq, { blogId: blog.id, question: "When should I start applying?" }, {
    blogId: blog.id,
    question: "When should I start applying?",
    answer: "Start planning at least 6-8 months before your target intake.",
    position: 1,
    status: true,
  });

  const newsCategory = await prisma.newsCategory.upsert({
    where: { slug: "policy-and-admissions" },
    update: { name: "Policy and Admissions", slug: "policy-and-admissions", status: true },
    create: { name: "Policy and Admissions", slug: "policy-and-admissions", status: true },
  });
  const news = await upsertByWhere(prisma.news, { slug: "japan-intake-advisory-2026" }, {
    categoryId: newsCategory.id,
    authorId: adminId,
    title: "Japan Intake Advisory for 2026 Applicants",
    slug: "japan-intake-advisory-2026",
    description: "Applicants are advised to complete document checks early.",
    status: true,
    homeView: true,
  });
  await upsertByWhere(prisma.newsContent, { newsId: news.id, slug: "timeline-advisory" }, {
    newsId: news.id,
    title: "Timeline Advisory",
    slug: "timeline-advisory",
    description: "Begin shortlisting and application preparation before intake opens.",
    position: 1,
  });
  await upsertByWhere(prisma.newsFaq, { newsId: news.id, question: "Do all universities have the same intake schedule?" }, {
    newsId: news.id,
    question: "Do all universities have the same intake schedule?",
    answer: "No, intake windows vary by institution and must be checked individually.",
    position: 1,
    status: true,
  });

  const articleCategory = await prisma.articleCategory.upsert({
    where: { slug: "mbbs-planning" },
    update: { name: "MBBS Planning", slug: "mbbs-planning", status: true },
    create: { name: "MBBS Planning", slug: "mbbs-planning", status: true },
  });
  const article = await upsertByWhere(prisma.article, { slug: "realistic-cost-breakdown-mbbs-japan" }, {
    categoryId: articleCategory.id,
    authorId: adminId,
    title: "Realistic Cost Breakdown for MBBS in Japan",
    slug: "realistic-cost-breakdown-mbbs-japan",
    description: "Understand tuition, living costs, and annual budget planning.",
    status: true,
    homeView: true,
  });
  await upsertByWhere(prisma.articleContent, { articleId: article.id, slug: "tuition-and-living" }, {
    articleId: article.id,
    title: "Tuition and Living",
    slug: "tuition-and-living",
    description: "Budget should include tuition, rent, food, transport, and misc costs.",
    position: 1,
  });
  await upsertByWhere(prisma.articleFaq, { articleId: article.id, question: "Is shared accommodation common?" }, {
    articleId: article.id,
    question: "Is shared accommodation common?",
    answer: "Yes, many students choose shared housing to optimize living expenses.",
    position: 1,
    status: true,
  });

  const scholarship = await prisma.scholarship.upsert({
    where: { slug: "japan-merit-scholarship-mbbs" },
    update: {
      title: "Japan Merit Scholarship for MBBS",
      slug: "japan-merit-scholarship-mbbs",
      scholarshipType: "Merit-based",
      amountMin: 1500,
      amountMax: 4000,
      discountPercentage: 20,
      availableSeats: 40,
      program: "MBBS",
      applicationMode: "Online",
      shortnote: "Partial tuition support for qualified students.",
      isActive: true,
    },
    create: {
      title: "Japan Merit Scholarship for MBBS",
      slug: "japan-merit-scholarship-mbbs",
      scholarshipType: "Merit-based",
      amountMin: 1500,
      amountMax: 4000,
      discountPercentage: 20,
      availableSeats: 40,
      program: "MBBS",
      applicationMode: "Online",
      shortnote: "Partial tuition support for qualified students.",
      isActive: true,
    },
  });
  await upsertByWhere(prisma.scholarshipFaq, { scholarshipId: scholarship.id, question: "Can I apply before final admission?" }, {
    scholarshipId: scholarship.id,
    question: "Can I apply before final admission?",
    answer: "You can initiate eligibility review, but award confirmation follows admission compliance.",
    position: 1,
    status: true,
  });

  await upsertByWhere(prisma.testimonial, { name: "Arjun Sharma", designation: "MBBS Graduate" }, {
    name: "Arjun Sharma",
    designation: "MBBS Graduate",
    description: "Smooth admission support and strong post-arrival coordination in Japan.",
    rating: 4.8,
    position: 1,
    status: true,
  });

  await upsertByWhere(prisma.gallery, { imagePath: "/uploads/gallery/campus-orientation.jpg" }, {
    title: "Campus Orientation",
    imageName: "campus-orientation.jpg",
    imagePath: "/uploads/gallery/campus-orientation.jpg",
    position: 1,
    status: true,
  });

  await upsertByWhere(prisma.partnerInquiry, { email: "partners@globalcareerpathways.com" }, {
    name: "Global Career Pathways",
    email: "partners@globalcareerpathways.com",
    phone: "+91-98100-45678",
    company: "Global Career Pathways",
    city: "Ahmedabad",
    partnerType: "Counseling Partner",
    message: "Interested in channel partnership for MBBS counseling.",
    status: "converted",
    studentsPlaced: 180,
    experience: 7,
    rating: 4.6,
  });
}

async function seedUniversityDependentData() {
  const university = await prisma.university.findFirst({
    where: { status: true },
    orderBy: { id: "asc" },
  });

  if (!university) {
    console.log("No university records found. Skipping university-dependent supplemental tables.");
    return { universityProgramId: null as number | null };
  }

  await upsertByWhere(
    prisma.universityFaq,
    { universityId: university.id, question: "Is there clinical training in affiliated hospitals?" },
    {
      universityId: university.id,
      question: "Is there clinical training in affiliated hospitals?",
      answer: "Yes, students generally receive clinical exposure in affiliated teaching hospitals.",
      position: 1,
      status: true,
    },
  );

  await upsertByWhere(
    prisma.universityReview,
    { universityId: university.id, name: "Student Review - Batch 2025" },
    {
      universityId: university.id,
      name: "Student Review - Batch 2025",
      designation: "MBBS Student",
      description: "Strong faculty support and practical learning environment.",
      rating: 4.7,
      position: 1,
      status: true,
    },
  );

  await upsertByWhere(
    prisma.universityTestimonial,
    { universityId: university.id, name: "Parent Testimonial - 2025" },
    {
      universityId: university.id,
      name: "Parent Testimonial - 2025",
      designation: "Parent",
      description: "Transparent process and timely student support.",
      rating: 4.8,
      position: 1,
      status: true,
    },
  );

  await upsertByWhere(
    prisma.universityStudent,
    { universityId: university.id, email: "intl.batch@mbbsinjapan.com" },
    {
      universityId: university.id,
      name: "International Student Cohort",
      email: "intl.batch@mbbsinjapan.com",
      phone: "+230-5555-0101",
      country: "India",
      numberOfStudents: 120,
      course: "MBBS",
      year: "2026",
      status: true,
    },
  );

  const simulationLab = await prisma.facility.findFirst({
    where: { name: "Simulation Labs" },
    orderBy: { id: "asc" },
  });
  if (simulationLab) {
    await upsertByWhere(
      prisma.universityFacility,
      { universityId: university.id, facilityId: simulationLab.id },
      {
        universityId: university.id,
        facilityId: simulationLab.id,
        description: "Simulation-driven practical training modules for MBBS students.",
        status: true,
      },
    );
  }

  const hospital = await prisma.hospital.findFirst({
    where: { status: true },
    orderBy: { id: "asc" },
  });
  if (hospital) {
    await upsertByWhere(
      prisma.universityHospital,
      { universityId: university.id, hospitalId: hospital.id },
      {
        universityId: university.id,
        hospitalId: hospital.id,
      },
    );
  }

  const program = await prisma.universityProgram.findFirst({
    where: { universityId: university.id, isActive: true },
    orderBy: { id: "asc" },
  });

  return { universityProgramId: program?.id ?? null };
}

async function seedOptionalLeadData(adminId: number, universityProgramId: number | null) {
  if (!SHOULD_SEED_SAMPLE_LEADS) {
    console.log("Skipping sample leads. Set SEED_SAMPLE_LEADS=true to include them.");
    return;
  }

  const lead = await prisma.lead.upsert({
    where: { email: "ravi.kumar@studentmail.com" },
    update: {
      name: "Ravi Kumar",
      phone: "9876501234",
      city: "Pune",
      state: "Maharashtra",
      source: "website",
      sourcePath: "/contact-us",
      status: LeadStatus.active,
      country: "India",
      interestedProgram: "MBBS",
      neetQualificationStatus: NeetStatus.qualified,
      neetScore: 545,
      assignedTo: adminId,
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
    create: {
      name: "Ravi Kumar",
      email: "ravi.kumar@studentmail.com",
      phone: "9876501234",
      city: "Pune",
      state: "Maharashtra",
      source: "website",
      sourcePath: "/contact-us",
      status: LeadStatus.active,
      country: "India",
      interestedProgram: "MBBS",
      neetQualificationStatus: NeetStatus.qualified,
      neetScore: 545,
      assignedTo: adminId,
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  await upsertByWhere(
    prisma.studentSchool,
    { leadId: lead.id, institutionName: "St. Xavier Higher Secondary School" },
    {
      leadId: lead.id,
      levelOfEducation: "Higher Secondary",
      countryOfEducation: "India",
      institutionName: "St. Xavier Higher Secondary School",
      gradeAverage: "82%",
    },
  );

  await upsertByWhere(
    prisma.studentDocument,
    { leadId: lead.id, documentType: "passport" },
    {
      leadId: lead.id,
      documentType: "passport",
      fileName: "ravi-passport.pdf",
      filePath: "/uploads/student-documents/ravi-passport.pdf",
      isVerified: true,
    },
  );

  await upsertByWhere(
    prisma.leadInquiry,
    { leadId: lead.id, source: "website", message: "Need counseling for September intake." },
    {
      leadId: lead.id,
      universityName: "Japan MBBS options",
      message: "Need counseling for September intake.",
      source: "website",
      status: "pending",
      agentId: adminId,
    },
  );

  if (universityProgramId) {
    await upsertByWhere(
      prisma.studentApplication,
      { leadId: lead.id, universityProgramId },
      {
        leadId: lead.id,
        universityProgramId,
        status: ApplicationStatus.applied,
        notes: "Sample dashboard application record generated by seed.",
      },
    );
  } else {
    console.log("No university program found. Skipping sample StudentApplication seed.");
  }
}

async function main() {
  console.log("Starting Japan baseline database seed...");
  console.log(
    "University bulk-upload tables are intentionally not seeded here (University, UniversityRanking, UniversityLink, UniversityIntake, UniversityProgram, UniversityDocument, UniversityPhoto, UniversityFmgeRate).",
  );

  const admin = await seedAdminUser();
  await seedWebsiteSettings();
  await seedReferenceData();
  await seedCountryAndEducationPages();
  await seedContentAndMisc(admin.id);
  const { universityProgramId } = await seedUniversityDependentData();
  await seedOptionalLeadData(admin.id, universityProgramId);

  console.log("Japan baseline seed completed.");
}

main()
  .catch((error) => {
    console.error("Seed failed.", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
