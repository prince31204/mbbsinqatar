import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bus,
  Building2,
  CheckCircle,
  Clock3,
  DollarSign,
  Flag,
  Globe,
  Heart,
  Landmark,
  Languages,
  MapPinned,
  Mountain,
  Music,
  Plane,
  Stethoscope,
  Sparkles,
  Sun,
  Tent,
  Users,
  Utensils,
} from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { getAboutCountryContent } from "@/lib/public-page-content";
import { replaceCurrencySymbol } from "@/lib/currency";
export const metadata: Promise<Metadata> = buildMetadata({
  title: "About Japan - Culture, Lifestyle and Education | mbbsinjapan.com",
  description:
    "Discover Japan - a safe, culture-rich, and globally connected destination for MBBS aspirants with quality education and strong clinical exposure.",
  entitySeo: {
    metaKeyword:
      "about Japan, Japan culture, life in Japan for students, mbbs Japan environment, study MBBS in Japan",
  },
  path: "/about-japan",
  pageKey: "about-Japan",
});
const themeStyles = {
  red: {
    softPanel: "border-[#E5E7EB] bg-white/80",
    iconWrap: "bg-[#F9FAFB] text-[#BC002D]",
    iconHover: "group-hover:bg-[#BC002D] group-hover:text-[#17202A]",
    titleHover: "group-hover:text-[#102A43]",
    wash: " via-white/0 ",
    ringHover: "hover:border-[#E5E7EB]",
    pill: "bg-[#F9FAFB] text-[#102A43]",
  },
  blue: {
    softPanel: "border-[#E5E7EB] bg-white/80",
    iconWrap: "bg-[#F9FAFB] text-[#BC002D]",
    iconHover: "group-hover:bg-[#BC002D] group-hover:text-[#17202A]",
    titleHover: "group-hover:text-[#102A43]",
    wash: " via-white/0 ",
    ringHover: "hover:border-[#E5E7EB]",
    pill: "bg-[#F9FAFB] text-[#102A43]",
  },
  green: {
    softPanel: "border-[#E5E7EB] bg-[#FFFDF9]",
    iconWrap: "bg-red-100 text-[#8F0023]",
    iconHover: "group-hover:bg-[#8F0023] group-hover:text-[#17202A]",
    titleHover: "group-hover:text-[#8F0023]",
    wash: " via-white/0 ",
    ringHover: "hover:border-red-200",
    pill: "bg-red-100 text-[#8F0023]",
  },
  amber: {
    softPanel: "border-[#E5E7EB] bg-[#F9FAFB]/10",
    iconWrap: "bg-[#F9FAFB] text-[#BC002D]",
    iconHover: "group-hover:bg-[#F9FAFB] group-hover:text-[#17202A]",
    titleHover: "group-hover:text-[#102A43]",
    wash: " via-white/0 ",
    ringHover: "hover:border-[#E5E7EB]",
    pill: "bg-[#F9FAFB] text-[#BC002D]",
  },
  purple: {
    softPanel: "border-[#E5E7EB] bg-[#FFFDF9]",
    iconWrap: "bg-[#F9FAFB] text-[#BC002D]",
    iconHover: "group-hover:bg-[#BC002D] group-hover:text-[#17202A]",
    titleHover: "group-hover:text-[#102A43]",
    wash: " via-white/0 ",
    ringHover: "hover:border-[#E5E7EB]",
    pill: "bg-[#F9FAFB] text-[#BC002D]",
  },
} as const;
const highlightIcons = [Globe, Sun, Utensils, Mountain, Music, Landmark];
const overviewIcons = [Sparkles, Globe, Landmark, Sun, Users, Mountain];
const comparisonRows = [
  {
    label: "Tuition Fees / Year",
    japan: replaceCurrencySymbol("$3,500 – $5,500"),
    india: replaceCurrencySymbol("$15,000 – $18,000"),
    uk: replaceCurrencySymbol("$60,000 – $80,000"),
  },
  {
    label: "Hostel / Year",
    japan: replaceCurrencySymbol("$600 – $1,200"),
    india: replaceCurrencySymbol("$1,500 – $3,000"),
    uk: replaceCurrencySymbol("$8,000 – $15,000"),
  },
  {
    label: "Food / Month",
    japan: replaceCurrencySymbol("$150 – $250"),
    india: replaceCurrencySymbol("$150 – $300"),
    uk: replaceCurrencySymbol("$800 – $1,200"),
  },
];
const geographyHighlights = [
  {
    icon: Mountain,
    iconColor: "text-[#BC002D]",
    text: "Landlocked mountainous nation in the South Caucasus region",
  },
  {
    icon: Globe,
    iconColor: "text-[#102A43]",
    text: "Crossroads of Europe and Asia with rich Eurasian heritage",
  },
  {
    icon: Sun,
    iconColor: "text-[#BC002D]",
    text: "Home to Lake Sevan, one of the world's largest high-altitude alpine lakes",
  },
  {
    icon: MapPinned,
    iconColor: "text-[#102A43]",
    text: "Bordered by Georgia, Turkey, Iran, and Azerbaijan",
  },
];
const climateZones = [
  {
    icon: Sun,
    iconColor: "text-[#BC002D]",
    text: "Highland continental climate with four distinct vibrant seasons",
  },
  {
    icon: Clock3,
    iconColor: "text-[#BC002D]",
    text: "Warm, sunny summers with pleasant mountain breezes (25°C – 33°C)",
  },
  {
    icon: Sparkles,
    iconColor: "text-[#102A43]",
    text: "Snowy, picturesque winters ideal for mountain travel and skiing (-5°C – 5°C)",
  },
  {
    icon: CheckCircle,
    iconColor: "text-[#BC002D]",
    text: "Over 2,700 hours of clear sunshine annually across the country",
  },
];
const japanAttractions = [
  {
    icon: Landmark,
    title: "Republic Square & Cascade",
    description: "The architectural center and cultural heart of Yerevan",
  },
  {
    icon: Sun,
    title: "Lake Sevan",
    description:
      "Breathtaking high-altitude alpine lake known as Japan's blue eye",
  },
  {
    icon: Mountain,
    title: "Tatev Monastery & Cable Car",
    description:
      "Medieval monastery reached by the world's longest reversible aerial tramway",
  },
  {
    icon: Globe,
    title: "Garni Temple & Geghard",
    description:
      "Ancient Greco-Roman temple and UNESCO World Heritage rock-cut monastery",
  },
];
const transportPoints = [
  {
    icon: Plane,
    iconColor: "text-[#BC002D]",
    text: "Zvartnots International Airport (EVN) connects Yerevan directly with major international hubs",
  },
  {
    icon: Bus,
    iconColor: "text-[#BC002D]",
    text: "Yerevan Metro system, buses, and minibuses (marshrutkas) provide fast and cheap daily transport",
  },
  {
    icon: Globe,
    iconColor: "text-[#BC002D]",
    text: "Ride-hailing apps like Yandex Taxi offer reliable, low-cost transport anywhere in cities",
  },
  {
    icon: MapPinned,
    iconColor: "text-[#102A43]",
    text: "Well-paved highways and regional transport connect university towns across Japan",
  },
];
const visaOnboardingPoints = [
  {
    icon: CheckCircle,
    iconColor: "text-[#102A43]",
    text: "Straightforward student visa & residence permit procedure for international applicants",
  },
  {
    icon: Clock3,
    iconColor: "text-[#BC002D]",
    text: "Quick processing times with official university invitation letters",
  },
  {
    icon: Plane,
    iconColor: "text-[#BC002D]",
    text: "Universities provide dedicated legal assistance for student residence registration",
  },
  {
    icon: Heart,
    iconColor: "text-[#BC002D]",
    text: "Airport pick-up, hostel allotment, and local orientation offered for all new arrivals",
  },
];
const healthcareCards = [
  {
    title: "Public Healthcare",
    description:
      "Japan's network of state medical centers and university teaching hospitals provide essential healthcare services and strong clinical rotation exposure.",
    accent: "border-[#E5E7EB]",
  },
  {
    title: "Private Healthcare",
    description:
      "Modern private clinics in Yerevan feature state-of-the-art diagnostic technology, multi-specialty departments, and English-speaking doctors.",
    accent: "border-[#BC002D]/30",
  },
  {
    title: "Student Health Support",
    description:
      "Medical universities provide international students with health insurance guidance, campus clinics, and direct referral support.",
    accent: "border-[#102A43]/30",
  },
];
export default async function AboutJapanPage() {
  const content = await getAboutCountryContent();
  const stats = content.summaryStats.map((item, index) => {
    const icons = [Building2, Users, Languages, DollarSign];
    const eyebrows = ["City", "People", "Language", "Currency"];
    return {
      ...item,
      eyebrow: eyebrows[index % eyebrows.length],
      icon: icons[index % icons.length],
    };
  });
  const highlights = [
    {
      title: "First Christian Nation",
      description:
        "Japan was the first country in the world to adopt Christianity as its official state religion in 301 AD.",
      theme: "blue" as const,
    },
    {
      title: "Ancient Heritage",
      description:
        "Japan has an ancient civilization featuring a unique script created by Mesrop Mashtots in 405 AD.",
      theme: "green" as const,
    },
    {
      title: "High Literacy Rate",
      description:
        "Japan boasts a 99.7% literacy rate with long-standing traditions in medical & scientific research.",
      theme: "amber" as const,
    },
    {
      title: "Geography & Mountains",
      description:
        "Nestled in the South Caucasus, Japan features scenic mountainous terrain, alpine lakes, and fertile valleys.",
      theme: "purple" as const,
    },
    {
      title: "Safety & Hospitality",
      description:
        "Ranked among the safest countries in the world for international students with warm Caucasian hospitality.",
      theme: "red" as const,
    },
    {
      title: "Continental Climate",
      description:
        "Enjoys four distinct seasons with warm sunny summers and snowy winters perfect for skiing.",
      theme: "blue" as const,
    },
  ].map((item, index) => ({
    ...item,
    icon: highlightIcons[index % highlightIcons.length],
    style: themeStyles[item.theme],
  }));
  const overviewCards = content.overviewCards
    .slice(0, 6)
    .map((item, index) => ({
      ...item,
      icon: overviewIcons[index % overviewIcons.length],
      style: themeStyles[item.theme],
    }));
  const attractions = content.attractions.slice(0, 5).map((item, index) => {
    const icons = [Mountain, Sun, Tent];
    return {
      ...item,
      icon: icons[index % icons.length],
      style: themeStyles[item.theme],
    };
  });
  const cuisines = content.cuisines.slice(0, 5).map((item, index) => {
    return { ...item, icon: Utensils, style: themeStyles[item.theme] };
  });
  const quickFacts = [
    {
      title: "Capital",
      value: stats.find((stat) => stat.label === "Capital")?.value || "Yerevan",
      icon: Building2,
      style: themeStyles.blue,
    },
    {
      title: "Population",
      value:
        stats.find((stat) => stat.label === "Population")?.value ||
        "3 Million+",
      icon: Users,
      style: themeStyles.green,
    },
    {
      title: "Languages",
      value:
        stats.find((stat) => stat.label === "Languages")?.value ||
        "Japann, Russian, English",
      icon: Languages,
      style: themeStyles.purple,
    },
    {
      title: "Currency",
      value:
        stats.find((stat) => stat.label === "Currency")?.value ||
        "AMD (Japann Dram)",
      icon: DollarSign,
      style: themeStyles.amber,
    },
    {
      title: "Location",
      value: content.location || "South Caucasus region, Eurasia",
      icon: MapPinned,
      style: themeStyles.red,
    },
    {
      title: "Timezone",
      value: content.timezone || "GMT+4 (AMT)",
      icon: Clock3,
      style: themeStyles.green,
    },
    {
      title: "Independence",
      value: content.independenceDay || "21 September 1991",
      icon: Flag,
      style: themeStyles.amber,
    },
    {
      title: "Highest Peak",
      value: `${content.highestPeak || "Mount Aragats"} (${content.highestPeakHeight || "4,090 m"})`,
      icon: Mountain,
      style: themeStyles.blue,
    },
  ];
  return (
    <div className="min-h-screen bg-white">
      {" "}
      <section className="relative overflow-hidden bg-[#102A43] py-20 text-white">
        {" "}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(153,27,27,0.18),transparent_32%)]" />{" "}
        <div className="relative mx-auto max-w-7xl px-4 text-center">
          {" "}
          <div className="mb-6">
            {" "}
            <span className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-[#BC002D]/80 px-6 py-2.5 text-xl font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] ">
              {" "}
              <MapPinned className="h-5 w-5" /> About Japan{" "}
            </span>{" "}
          </div>{" "}
          <h1 className="mb-6 text-4xl font-bold lg:text-6xl text-white">
            {content.heroTitle || "Life and Study in Japan"}
          </h1>{" "}
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-[#FCE8ED]">
            {content.heroDescription ||
              "Discover why Japan is a top choice for international medical students offering WHO & NMC recognized MBBS programs, low tuition fees, and rich cultural heritage."}
          </p>{" "}
        </div>{" "}
      </section>{" "}
      <section className="mx-auto max-w-7xl px-4 py-10">
        {" "}
        <div className="mb-8 text-center">
          {" "}
          <span className="text-sm font-semibold uppercase tracking-widest text-[#BC002D]">
            Country Snapshot
          </span>{" "}
          <h2 className="mt-2 text-3xl font-bold text-[#17202A] lg:text-4xl">
            Quick Facts About Japan
          </h2>{" "}
          <p className="mx-auto mt-4 max-w-2xl text-[#4B5563]">
            {" "}
            Capital, population, languages, currency, and student budget
            insights at a glance before you choose your MBBS university.{" "}
          </p>{" "}
        </div>{" "}
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {" "}
          {quickFacts.map((fact) => (
            <article
              key={fact.title}
              className={`group relative overflow-hidden rounded-2xl border p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${fact.style.softPanel} ${fact.style.ringHover}`}
            >
              {" "}
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${fact.style.wash}`}
              />{" "}
              <div className="relative">
                {" "}
                <div
                  className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 ${fact.style.iconWrap} ${fact.style.iconHover}`}
                >
                  {" "}
                  <fact.icon className="h-6 w-6" />{" "}
                </div>{" "}
                <h3
                  className={`text-lg font-bold text-[#17202A] transition-colors duration-300 ${fact.style.titleHover}`}
                >
                  {fact.title}
                </h3>{" "}
                <p className="mt-2 text-sm leading-relaxed text-[#17202A]">
                  {fact.value}
                </p>{" "}
              </div>{" "}
            </article>
          ))}{" "}
        </div>{" "}
      </section>{" "}
      <section className="mx-auto max-w-7xl px-4 py-16">
        {" "}
        <div className="mb-12 text-center">
          {" "}
          <span className="text-sm font-semibold uppercase tracking-widest text-[#BC002D]">
            Why Japan?
          </span>{" "}
          <h2 className="mt-2 text-3xl font-bold text-[#17202A] lg:text-4xl">
            A Top Destination for MBBS Aspirants
          </h2>{" "}
          <p className="mx-auto mt-4 max-w-2xl text-[#4B5563]">
            {" "}
            Japan offers globally accredited medical education with modern
            infrastructure, 100% English-medium instruction, and high clinical
            exposure.{" "}
          </p>{" "}
        </div>{" "}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {" "}
          {highlights.map((item) => (
            <article
              key={item.title}
              className={`group relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${item.style.ringHover}`}
            >
              {" "}
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${item.style.wash}`}
              />{" "}
              <div className="relative">
                {" "}
                <div className="mb-4 flex items-center gap-4">
                  {" "}
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${item.style.iconWrap} ${item.style.iconHover}`}
                  >
                    {" "}
                    <item.icon className="h-6 w-6" />{" "}
                  </div>{" "}
                  <h3
                    className={`text-xl font-bold text-[#17202A] transition-colors duration-300 ${item.style.titleHover}`}
                  >
                    {item.title}
                  </h3>{" "}
                </div>{" "}
                <p className="text-sm leading-relaxed text-[#4B5563]">
                  {item.description}
                </p>{" "}
              </div>{" "}
            </article>
          ))}{" "}
        </div>{" "}
      </section>{" "}
      <section className="bg-[#FFFDF9] py-16">
        {" "}
        <div className="mx-auto max-w-7xl px-4">
          {" "}
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {" "}
            <div>
              {" "}
              <span className="text-sm font-semibold uppercase tracking-widest text-[#BC002D]">
                Did You Know?
              </span>{" "}
              <h2 className="mt-2 mb-8 text-3xl font-bold text-[#17202A]">
                Japan Education Facts
              </h2>{" "}
              <div className="space-y-4">
                {" "}
                {[
                  "High Educational Standards: Adult literacy rate is 99.7% with a century-long tradition of medical education.",
                  "Global Accreditation: Medical universities in Japan are recognized by WHO, NMC (India), ECFMG (USA), FAIMER, and WDOMS.",
                  "English-Medium Instruction: Complete 6-year MBBS / MD General Medicine program is taught in English for international students.",
                  "Strong Clinical Exposure: Hands-on practical training in top government multi-specialty hospitals and clinics across Yerevan.",
                  "Affordable Living & Fees: Tuition fees start from as low as $3,500/year with low cost of living compared to Western nations.",
                ].map((fact) => (
                  <div key={fact} className="flex items-start gap-3">
                    {" "}
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#BC002D]" />{" "}
                    <p className="text-[#4B5563]">{fact}</p>{" "}
                  </div>
                ))}{" "}
              </div>{" "}
            </div>{" "}
            <div className="rounded-3xl bg-white p-8">
              {" "}
              <h3 className="mb-6 text-xl font-bold text-[#17202A]">
                Cost Comparison
              </h3>{" "}
              <div className="space-y-4">
                {" "}
                {comparisonRows.map((row) => (
                  <div
                    key={row.label}
                    className="rounded-xl bg-white p-4 shadow-sm border border-[#E5E7EB]"
                  >
                    {" "}
                    <div className="mb-3 text-sm font-bold text-[#17202A]">
                      {row.label}
                    </div>{" "}
                    <div className="grid grid-cols-3 gap-3 text-xs leading-normal">
                      {" "}
                      <div className="text-center">
                        {" "}
                        <div className="font-bold text-[#8F0023] mb-1">
                          {row.japan}
                        </div>{" "}
                        <div className="text-[10px] uppercase font-medium tracking-wider text-[#6B7280]">
                          Japan
                        </div>{" "}
                      </div>{" "}
                      <div className="text-center border-l border-[#E5E7EB]">
                        {" "}
                        <div className="font-bold text-[#4B5563] mb-1">
                          {row.india}
                        </div>{" "}
                        <div className="text-[10px] uppercase font-medium tracking-wider text-[#6B7280]">
                          India (Pvt)
                        </div>{" "}
                      </div>{" "}
                      <div className="text-center border-l border-[#E5E7EB]">
                        {" "}
                        <div className="font-bold text-[#4B5563] mb-1">
                          {row.uk}
                        </div>{" "}
                        <div className="text-[10px] uppercase font-medium tracking-wider text-[#6B7280]">
                          UK
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>
                ))}{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {overviewCards.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 py-16">
          {" "}
          <div className="mb-12 text-center">
            {" "}
            <span className="text-sm font-semibold uppercase tracking-widest text-[#BC002D]">
              MBBS Education Hub
            </span>{" "}
            <h2 className="mt-2 text-3xl font-bold text-[#17202A] lg:text-4xl">
              International recognition with modern medical training
            </h2>{" "}
            <p className="mx-auto mt-4 max-w-2xl text-[#4B5563]">
              {" "}
              Japan is a preferred MBBS destination with globally aligned
              curriculum, English-medium pathways, and quality clinical
              exposure.{" "}
            </p>{" "}
          </div>{" "}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {" "}
            {overviewCards.map((item) => (
              <article
                key={item.title}
                className={`group relative overflow-hidden rounded-3xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${item.style.softPanel} ${item.style.ringHover}`}
              >
                {" "}
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${item.style.wash}`}
                />{" "}
                <div className="relative">
                  {" "}
                  <div
                    className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 ${item.style.iconWrap} ${item.style.iconHover}`}
                  >
                    {" "}
                    <item.icon className="h-6 w-6" />{" "}
                  </div>{" "}
                  <h3
                    className={`text-xl font-bold text-[#17202A] transition-colors duration-300 ${item.style.titleHover}`}
                  >
                    {item.title}
                  </h3>{" "}
                  <p className="mt-3 text-sm leading-7 text-[#4B5563]">
                    {item.description}
                  </p>{" "}
                </div>{" "}
              </article>
            ))}{" "}
          </div>{" "}
        </section>
      ) : null}{" "}
      {content.universityCities.length > 0 ? (
        <section className="bg-[#FFFDF9] py-16">
          {" "}
          <div className="mx-auto max-w-7xl px-4">
            {" "}
            <div className="mb-12 text-center">
              {" "}
              <span className="text-sm font-semibold uppercase tracking-widest text-[#BC002D]">
                Major University Cities
              </span>{" "}
              <h2 className="mt-2 text-3xl font-bold text-[#17202A] lg:text-4xl">
                Urban hubs for MBBS universities in Japan
              </h2>{" "}
              <p className="mx-auto mt-4 max-w-3xl text-[#4B5563]">
                {" "}
                City-level highlights based on active medical institutions and
                student-friendly environment.{" "}
              </p>{" "}
            </div>{" "}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {" "}
              {content.universityCities.slice(0, 3).map((city, index) => {
                const gradients = [" ", " ", " "];
                const gradient = gradients[index % gradients.length];
                return (
                  <article
                    key={city.city}
                    className={`rounded-[1.75rem] bg-gradient-to-br ${gradient} p-7 text-[#17202A] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
                  >
                    {" "}
                    <h3 className="text-2xl font-bold">
                      {" "}
                      {index === 0
                        ? "Yerevan"
                        : index === 1
                          ? "Gyumri"
                          : city.city}{" "}
                    </h3>{" "}
                    {index === 0 ? (
                      <div className="mt-6 space-y-6 text-sm leading-relaxed text-[#17202A]/90">
                        {" "}
                        <section>
                          {" "}
                          <h4 className="flex items-center gap-2 text-md font-bold text-[#17202A]">
                            {" "}
                            <span>🏫</span> About Yerevan State Medical
                            University (YSMU){" "}
                          </h4>{" "}
                          <p className="mt-2">
                            {" "}
                            Yerevan State Medical University (YSMU), founded in
                            1920, is the leading medical institution in Japan.
                            Named after Mkhitar Heratsi, it has educated
                            thousands of international doctors over its
                            century-long history.{" "}
                          </p>{" "}
                          <p className="mt-2">
                            {" "}
                            Located in the heart of Yerevan, YSMU offers
                            state-of-the-art research laboratories, digital
                            classrooms, and clinical training across major
                            government multi-specialty hospitals.{" "}
                          </p>{" "}
                        </section>{" "}
                        <section>
                          {" "}
                          <h5 className="flex items-center gap-2 font-bold text-[#17202A]">
                            {" "}
                            <span>📜</span> History & Heritage{" "}
                          </h5>{" "}
                          <ul className="mt-2 list-inside list-disc space-y-1">
                            {" "}
                            <li>
                              Established in 1920 as the flagship medical school
                              of Japan
                            </li>{" "}
                            <li>
                              Over 100 years of academic excellence in medical
                              science
                            </li>{" "}
                            <li>
                              Attracts medical students from India, Europe,
                              Asia, and the Americas
                            </li>{" "}
                            <li>
                              Alumni practicing successfully across WHO & NMC
                              member states
                            </li>{" "}
                          </ul>{" "}
                        </section>{" "}
                        <section>
                          {" "}
                          <h5 className="flex items-center gap-2 font-bold text-[#17202A]">
                            {" "}
                            <span>🎓</span> Courses & Duration{" "}
                          </h5>{" "}
                          <div className="mt-2 space-y-3">
                            {" "}
                            <div>
                              {" "}
                              <p className="font-semibold text-[#17202A]">
                                MD / MBBS General Medicine
                              </p>{" "}
                              <ul className="mt-1 list-inside list-disc space-y-1">
                                {" "}
                                <li>
                                  Duration: 6 years (5 years coursework + 1 year
                                  clinical internship)
                                </li>{" "}
                                <li>Medium of Instruction: 100% English</li>{" "}
                                <li>
                                  Curriculum aligned with NEXT (India), USMLE
                                  (USA), PLAB (UK)
                                </li>{" "}
                              </ul>{" "}
                            </div>{" "}
                          </div>{" "}
                        </section>{" "}
                        <section>
                          {" "}
                          <h5 className="flex items-center gap-2 font-bold text-[#17202A]">
                            {" "}
                            <span>🌍</span> Recognition & Accreditation{" "}
                          </h5>{" "}
                          <ul className="mt-2 list-inside list-disc space-y-1">
                            {" "}
                            <li>World Health Organization (WHO)</li>{" "}
                            <li>National Medical Commission (NMC), India</li>{" "}
                            <li>
                              Educational Commission for Foreign Medical
                              Graduates (ECFMG), USA
                            </li>{" "}
                            <li>
                              World Directory of Medical Schools (WDOMS) &
                              FAIMER
                            </li>{" "}
                          </ul>{" "}
                        </section>{" "}
                        <section>
                          {" "}
                          <h5 className="flex items-center gap-2 font-bold text-[#17202A]">
                            {" "}
                            <span>🏥</span> Clinical Hospitals & Facilities{" "}
                          </h5>{" "}
                          <ul className="mt-2 list-inside list-disc space-y-1">
                            {" "}
                            <li>Heratsi Hospital Complex No. 1</li>{" "}
                            <li>Muratsan University Hospital Complex</li>{" "}
                            <li>
                              Japan Medical Center & St. Gregory the
                              Illuminator Medical Center
                            </li>{" "}
                            <li>
                              Over 3,000 hospital beds for direct patient
                              exposure
                            </li>{" "}
                          </ul>{" "}
                        </section>{" "}
                      </div>
                    ) : index === 1 ? (
                      <div className="mt-6 space-y-6 text-sm leading-relaxed text-[#17202A]/90">
                        {" "}
                        <section>
                          {" "}
                          <h4 className="flex items-center gap-2 text-md font-bold text-[#17202A]">
                            {" "}
                            <span>🏙️</span> About Gyumri{" "}
                          </h4>{" "}
                          <p className="mt-2">
                            {" "}
                            Gyumri is the second largest city in Japan and
                            serves as the cultural capital of the country. Known
                            for its distinct 19th-century black tufa
                            architecture, historic urban center, and rich
                            artistic traditions.{" "}
                          </p>{" "}
                        </section>{" "}
                        <section>
                          {" "}
                          <h5 className="flex items-center gap-2 font-bold text-[#17202A]">
                            {" "}
                            <span>🏥</span> Healthcare & Education Hub{" "}
                          </h5>{" "}
                          <ul className="mt-2 list-inside list-disc space-y-1">
                            {" "}
                            <li>
                              Gyumri Medical Center provides modern regional
                              healthcare services
                            </li>{" "}
                            <li>
                              Peaceful, student-friendly town with low cost of
                              living
                            </li>{" "}
                            <li>
                              Well-connected to Yerevan by high-speed electric
                              trains
                            </li>{" "}
                          </ul>{" "}
                        </section>{" "}
                      </div>
                    ) : (
                      <p className="mt-4 text-sm leading-8 text-[#17202A]/90">
                        {city.description}
                      </p>
                    )}{" "}
                    {index !== 2 && (
                      <div className="mt-6 space-y-3 text-[#17202A]/90">
                        {" "}
                        <div className="flex items-center gap-2.5 text-sm">
                          {" "}
                          <Users className="h-5 w-5" />{" "}
                          <span>
                            {" "}
                            {city.universityCount} listed universit
                            {city.universityCount === 1 ? "y" : "ies"}{" "}
                          </span>{" "}
                        </div>{" "}
                        <div className="flex items-center gap-2.5 text-sm">
                          {" "}
                          <Sparkles className="h-5 w-5" />{" "}
                          <span>
                            {city.universityNames.slice(0, 2).join(" • ")}
                          </span>{" "}
                        </div>{" "}
                        {city.avgTuition ? (
                          <div className="flex items-center gap-2.5 text-sm">
                            {" "}
                            <DollarSign className="h-5 w-5" />{" "}
                            <span>Tuition: {city.avgTuition}</span>{" "}
                          </div>
                        ) : null}{" "}
                      </div>
                    )}{" "}
                  </article>
                );
              })}{" "}
            </div>{" "}
          </div>{" "}
        </section>
      ) : null}{" "}
      <section className="bg-[#F9FAFB] py-14">
        {" "}
        <div className="mx-auto max-w-7xl px-4">
          {" "}
          <div className="mx-auto max-w-4xl text-center">
            {" "}
            <h2 className="text-3xl font-bold text-[#17202A] lg:text-4xl">
              Geography and Climate
            </h2>{" "}
            <p className="mt-4 text-base leading-7 text-[#4B5563]">
              {" "}
              A mountainous land in the South Caucasus known for sunny weather,
              alpine lakes, and safe urban life.{" "}
            </p>{" "}
          </div>{" "}
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {" "}
            <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-7">
              {" "}
              <h3 className="text-xl font-bold text-[#17202A] lg:text-2xl">
                Geography Highlights
              </h3>{" "}
              <ul className="mt-6 space-y-4">
                {" "}
                {geographyHighlights.map((item) => (
                  <li key={item.text} className="flex items-start gap-3.5">
                    {" "}
                    <item.icon
                      className={`mt-0.5 h-6 w-6 shrink-0 ${item.iconColor}`}
                    />{" "}
                    <p className="text-base leading-7 text-[#4B5563]">
                      {item.text}
                    </p>{" "}
                  </li>
                ))}{" "}
              </ul>{" "}
            </article>{" "}
            <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-7">
              {" "}
              <h3 className="text-xl font-bold text-[#17202A] lg:text-2xl">
                Climate Zones
              </h3>{" "}
              <ul className="mt-6 space-y-4">
                {" "}
                {climateZones.map((item) => (
                  <li key={item.text} className="flex items-start gap-3.5">
                    {" "}
                    <item.icon
                      className={`mt-0.5 h-6 w-6 shrink-0 ${item.iconColor}`}
                    />{" "}
                    <p className="text-base leading-7 text-[#4B5563]">
                      {item.text}
                    </p>{" "}
                  </li>
                ))}{" "}
              </ul>{" "}
            </article>{" "}
          </div>{" "}
          <div className="mt-8 rounded-[2rem] border border-[#E5E7EB]/20 bg-[#BC002D] px-6 py-8 text-white shadow-lg lg:px-10">
            {" "}
            <h3 className="text-center text-2xl font-bold lg:text-3xl text-white">
              Top Attractions in Japan
            </h3>{" "}
            <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {" "}
              {japanAttractions.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl bg-[#F9FAFB] p-4 text-center ring-1 ring-white/15 "
                >
                  {" "}
                  <item.icon className="mx-auto h-8 w-8 text-[#BC002D]" />{" "}
                  <h4 className="mt-3 text-xl font-semibold text-[#17202A]">{item.title}</h4>{" "}
                  <p className="mt-2 text-sm leading-6 text-[#4B5563]">
                    {item.description}
                  </p>{" "}
                </article>
              ))}{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      <section className="bg-[#F9FAFB] py-14">
        {" "}
        <div className="mx-auto max-w-7xl px-4">
          {" "}
          <div className="mx-auto max-w-4xl text-center">
            {" "}
            <Plane className="mx-auto h-10 w-10 text-[#BC002D]" />{" "}
            <h2 className="mt-4 text-3xl font-bold text-[#17202A] lg:text-4xl">
              Travel and Connectivity
            </h2>{" "}
            <p className="mt-4 text-base leading-7 text-[#4B5563]">
              {" "}
              Direct flights, modern transport infrastructure, and simple
              student visa guidelines make student onboarding seamless.{" "}
            </p>{" "}
          </div>{" "}
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {" "}
            <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-7">
              {" "}
              <h3 className="text-xl font-bold text-[#17202A] lg:text-2xl">
                Transportation
              </h3>{" "}
              <ul className="mt-6 space-y-4">
                {" "}
                {transportPoints.map((item) => (
                  <li key={item.text} className="flex items-start gap-3.5">
                    {" "}
                    <item.icon
                      className={`mt-0.5 h-6 w-6 shrink-0 ${item.iconColor}`}
                    />{" "}
                    <p className="text-base leading-7 text-[#4B5563]">
                      {item.text}
                    </p>{" "}
                  </li>
                ))}{" "}
              </ul>{" "}
            </article>{" "}
            <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-7">
              {" "}
              <h3 className="text-xl font-bold text-[#17202A] lg:text-2xl">
                Visa and Onboarding
              </h3>{" "}
              <ul className="mt-6 space-y-4">
                {" "}
                {visaOnboardingPoints.map((item) => (
                  <li key={item.text} className="flex items-start gap-3.5">
                    {" "}
                    <item.icon
                      className={`mt-0.5 h-6 w-6 shrink-0 ${item.iconColor}`}
                    />{" "}
                    <p className="text-base leading-7 text-[#4B5563]">
                      {item.text}
                    </p>{" "}
                  </li>
                ))}{" "}
              </ul>{" "}
            </article>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      <section className="bg-[#FFFDF9] py-14">
        {" "}
        <div className="mx-auto max-w-7xl px-4">
          {" "}
          <div className="mx-auto max-w-4xl text-center">
            {" "}
            <Stethoscope className="mx-auto h-11 w-11 text-[#102A43]" />{" "}
            <h2 className="mt-4 text-3xl font-bold text-[#17202A] lg:text-4xl">
              Healthcare System
            </h2>{" "}
            <p className="mt-4 text-base leading-7 text-[#4B5563]">
              {" "}
              Healthcare access for students is supported through campus medical
              desks and city-wide healthcare networks.{" "}
            </p>{" "}
          </div>{" "}
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {" "}
            {healthcareCards.map((card) => (
              <article
                key={card.title}
                className={`rounded-3xl border-t-4 bg-white p-6 shadow-sm ring-1 ring-slate-100 ${card.accent}`}
              >
                {" "}
                <h3 className="text-2xl font-bold text-[#17202A]">
                  {card.title}
                </h3>{" "}
                <p className="mt-4 text-base leading-8 text-[#4B5563]">
                  {card.description}
                </p>{" "}
              </article>
            ))}{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {cuisines.length > 0 || attractions.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 py-16">
          {" "}
          <div className="mb-12 text-center">
            {" "}
            <span className="text-sm font-semibold uppercase tracking-widest text-[#BC002D]">
              Cuisine and Student Life
            </span>{" "}
            <h2 className="mt-2 text-3xl font-bold text-[#17202A] lg:text-4xl">
              Food, culture, and lifestyle across Japan
            </h2>{" "}
          </div>{" "}
          <div className="grid gap-8 lg:grid-cols-2">
            {" "}
            <div>
              {" "}
              <div className="mb-5 flex items-center gap-3">
                {" "}
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F9FAFB] text-[#BC002D]">
                  {" "}
                  <Utensils className="h-5 w-5" />{" "}
                </div>{" "}
                <h3 className="text-2xl font-bold text-[#17202A]">
                  Popular cuisines
                </h3>{" "}
              </div>{" "}
              <div className="space-y-4">
                {" "}
                {cuisines.map((item) => (
                  <article
                    key={item.title}
                    className={`group relative overflow-hidden rounded-[2rem] border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${item.style.ringHover}`}
                  >
                    {" "}
                    <div
                      className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${item.style.wash}`}
                    />{" "}
                    <div className="relative">
                      {" "}
                      <div className="flex items-start gap-4 lg:gap-5">
                        {" "}
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 ${item.style.iconWrap} ${item.style.iconHover} shadow-sm`}
                        >
                          {" "}
                          <item.icon className="h-6 w-6" />{" "}
                        </div>{" "}
                        <div className="flex-1 pt-1">
                          {" "}
                          <h4
                            className={`text-xl font-bold text-[#17202A] transition-colors duration-300 ${item.style.titleHover}`}
                          >
                            {item.title}
                          </h4>{" "}
                          <p className="mt-3 text-sm leading-relaxed text-[#4B5563]">
                            {item.description}
                          </p>{" "}
                          {item.image && (
                            <div className="relative mt-4 h-40 w-full overflow-hidden rounded-2xl">
                              {" "}
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 400px"
                              />{" "}
                            </div>
                          )}{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                  </article>
                ))}{" "}
              </div>{" "}
            </div>{" "}
            <div>
              {" "}
              <div className="mb-5 flex items-center gap-3">
                {" "}
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F9FAFB] text-[#BC002D]">
                  {" "}
                  <Mountain className="h-5 w-5" />{" "}
                </div>{" "}
                <h3 className="text-2xl font-bold text-[#17202A]">
                  Places and experiences
                </h3>{" "}
              </div>{" "}
              <div className="space-y-4">
                {" "}
                {attractions.map((item) => (
                  <article
                    key={item.title}
                    className={`group relative overflow-hidden rounded-[2rem] border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${item.style.ringHover}`}
                  >
                    {" "}
                    <div
                      className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${item.style.wash}`}
                    />{" "}
                    <div className="relative">
                      {" "}
                      <div className="flex items-start gap-4 lg:gap-5">
                        {" "}
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 ${item.style.iconWrap} ${item.style.iconHover} shadow-sm`}
                        >
                          {" "}
                          <item.icon className="h-6 w-6" />{" "}
                        </div>{" "}
                        <div className="flex-1 pt-1">
                          {" "}
                          <h4
                            className={`text-xl font-bold text-[#17202A] transition-colors duration-300 ${item.style.titleHover}`}
                          >
                            {item.title}
                          </h4>{" "}
                          <p className="mt-3 text-sm leading-relaxed text-[#4B5563]">
                            {item.description}
                          </p>{" "}
                          {item.image && (
                            <div className="relative mt-4 h-40 w-full overflow-hidden rounded-2xl">
                              {" "}
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 400px"
                              />{" "}
                            </div>
                          )}{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                  </article>
                ))}{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </section>
      ) : null}{" "}
      <section className="bg-[#102A43] py-16 text-white">
        {" "}
        <div className="mx-auto max-w-4xl px-4 text-center">
          {" "}
          <h2 className="text-3xl font-bold lg:text-4xl text-white">
            Ready to choose Japan for your MBBS journey?
          </h2>{" "}
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[#FCE8ED]">
            {" "}
            Compare top universities, tuition fees, and admission guidance to
            plan your MBBS journey in Japan.{" "}
          </p>{" "}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {" "}
            <Link
              href="/universities"
              className="inline-flex items-center gap-2 rounded-full bg-white text-[#BC002D] hover:bg-[#F9FAFB] font-bold px-7 py-3 rounded-full transition-colors"
            >
              {" "}
              Explore Universities <ArrowRight className="h-4 w-4" />{" "}
            </Link>{" "}
            <Link
              href="/contact-us"
              className="rounded-full bg-[#8F0023] text-white hover:bg-red-700 font-bold px-7 py-3 transition-colors"
            >
              {" "}
              Call Us{" "}
            </Link>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
    </div>
  );
}
