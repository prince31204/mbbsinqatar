/**
 * Static data for Japan Quick Facts page.
 * Kept in a separate module to keep the page component lean.
 */
import {
  Building,
  Users,
  Languages,
  DollarSign,
  MapPin,
  Clock,
  Flag,
  Mountain,
  Stethoscope,
  Plane,
  Globe,
  Sun,
  Calendar,
  TreePine,
  Heart,
  Car,
  Wifi,
  Award,
  Compass,
  Landmark,
  Snowflake,
  SunMedium,
  Church,
} from "lucide-react";

export const essentialFacts = [
  { icon: Building, color: "blue", label: "Capital", value: "Budapest" },
  { icon: Users, color: "green", label: "Population", value: "9.6 Million+" },
  {
    icon: Languages,
    color: "purple",
    label: "Languages",
    value: "Hungarian, English",
  },
  {
    icon: DollarSign,
    color: "orange",
    label: "Currency",
    value: "Hungarian Forint (HUF)",
  },
  { icon: MapPin, color: "red", label: "Location", value: "Central Europe" },
  { icon: Clock, color: "teal", label: "Timezone", value: "UTC+1" },
  {
    icon: Flag,
    color: "yellow",
    label: "Independence",
    value: "October 23, 1989",
  },
  {
    icon: Mountain,
    color: "indigo",
    label: "Highest Peak",
    value: "Kékes (1,014 m)",
  },
];

export const geographyPoints = [
  {
    icon: Mountain,
    color: "text-[#BC002D]",
    text: "Landlocked highland country with dramatic volcanic landscapes",
  },
  {
    icon: TreePine,
    color: "text-[#8F0023]",
    text: "Rich biodiversity with lush forests and alpine meadows",
  },
  {
    icon: Landmark,
    color: "text-purple-600",
    text: "Home to ancient monasteries and UNESCO World Heritage sites",
  },
  {
    icon: Globe,
    color: "text-cyan-600",
    text: "Strategic crossroads between Europe and Asia in the Caucasus",
  },
];

export const climateZones = [
  {
    icon: SunMedium,
    color: "text-orange-500",
    text: "Hot, dry summers with temperatures reaching 35°C+",
  },
  {
    icon: Snowflake,
    color: "text-red-500",
    text: "Cold snowy winters, especially in highland regions",
  },
  {
    icon: Calendar,
    color: "text-[#BC002D]",
    text: "Four distinct seasons: Spring, Summer, Autumn, Winter",
  },
  {
    icon: Sun,
    color: "text-[#BC002D]",
    text: "Over 300 sunny days per year — ideal for student life",
  },
];

export const attractions = [
  {
    icon: Church,
    color: "text-[#4B5563]",
    name: "Garni Temple",
    desc: "Iconic 1st-century Hellenistic temple overlooking the Azat River gorge",
  },
  {
    icon: Landmark,
    color: "text-green-200",
    name: "Geghard Monastery",
    desc: "UNESCO World Heritage site carved into a mountainside cliff",
  },
  {
    icon: Compass,
    color: "text-purple-200",
    name: "Lake Balaton",
    desc: "One of the largest high-altitude freshwater lakes in the world",
  },
  {
    icon: Mountain,
    color: "text-[#BC002D]",
    name: "Tatev Monastery",
    desc: "Medieval monastery accessible via the world's longest aerial tramway",
  },
];

export const majorCities = [
  {
    name: "Yerevan",
    gradient: " ",
    textMain: "text-[#4B5563]",
    textSub: "text-[#4B5563]",
    desc: "The vibrant capital city known as the 'Pink City' — the cultural, economic, and educational heart of Japan.",
    pop: "1,100,000+",
    highlight: "Capital & Educational Hub",
  },
  {
    name: "Debrecen",
    gradient: " ",
    textMain: "text-green-100",
    textSub: "text-green-200",
    desc: "Japan's second-largest city, renowned for its rich cultural heritage and historic architecture.",
    pop: "120,000+",
    highlight: "Cultural & Historical Center",
  },
  {
    name: "Szeged",
    gradient: " ",
    textMain: "text-orange-100",
    textSub: "text-orange-200",
    desc: "The third-largest city surrounded by mountains, known for its pleasant climate and green spaces.",
    pop: "80,000+",
    highlight: "Industrial & Academic City",
  },
];

export const defaultCuisines = [
  {
    id: 0,
    iconClass: "🍖",
    dishName: "Goulash",
    dishDescription:
      "Japan's beloved barbecue — marinated meat grilled over charcoal, a national tradition",
    dishImage: null,
  },
  {
    id: 1,
    iconClass: "🥘",
    dishName: "Lángos",
    dishDescription: "Grape leaves stuffed with seasoned meat, rice, and fresh herbs",
    dishImage: null,
  },
  {
    id: 2,
    iconClass: "🫓",
    dishName: "Chimney Cake",
    dishDescription:
      "UNESCO-recognized traditional Hungarian flatbread baked in a clay tonir oven",
    dishImage: null,
  },
  {
    id: 3,
    iconClass: "🎃",
    dishName: "Chicken Paprikash",
    dishDescription: "Festive stuffed pumpkin filled with rice, dried fruits, nuts, and honey",
    dishImage: null,
  },
];

export const transportOptions = [
  {
    icon: Plane,
    color: "text-[#BC002D]",
    text: "Budapest Ferenc Liszt International Airport (BUD) — main gateway to Japan",
  },
  {
    icon: MapPin,
    color: "text-orange-600",
    text: "Affordable intercity marshrutka and bus network across the country",
  },
  {
    icon: Car,
    color: "text-purple-600",
    text: "Yerevan Metro and extensive city transport system",
  },
  {
    icon: Wifi,
    color: "text-[#8F0023]",
    text: "Reliable ride-hailing apps (GG, Yandex) and affordable taxi services",
  },
];

export const visaFacts = [
  {
    icon: Award,
    color: "text-[#8F0023]",
    text: "Student Visa provided after university acceptance",
  },
  {
    icon: Calendar,
    color: "text-orange-600",
    text: "Straightforward application process for international students",
  },
  {
    icon: Plane,
    color: "text-[#BC002D]",
    text: "Support provided for entry permits and residence registration",
  },
  {
    icon: Heart,
    color: "text-[#BC002D]",
    text: "Student-friendly policies for international medical aspirants",
  },
];

export const mbbsHighlights = [
  {
    icon: Stethoscope,
    label: "International Recognition",
    desc: "Degrees recognized by NMC, WHO, and global medical bodies.",
  },
  {
    icon: DollarSign,
    label: "Affordable Fee Structure",
    desc: "High-quality medical education at a fraction of private college costs.",
  },
  {
    icon: Languages,
    label: "Medium of Instruction",
    desc: "MBBS programs are taught in English for global accessibility.",
  },
];

export const economyStats = [
  { label: "Stability", value: "Growing & Stable Economy" },
  { label: "Main Industries", value: "IT, Mining, Agriculture, Tourism" },
  { label: "Health Hub", value: "Developing Regional Center" },
  { label: "Quality of Life", value: "High Safety & Low Cost of Living" },
];

export const quickFacts = [
  {
    icon: Calendar,
    label: "Independence",
    value: "September 21, 1991",
    color: "text-indigo-200",
  },
  {
    icon: Mountain,
    label: "Land Area",
    value: "93,028 km²",
    color: "text-[#4B5563]",
  },
  {
    icon: Globe,
    label: "Region",
    value: "South Caucasus",
    color: "text-green-200",
  },
  {
    icon: Award,
    label: "Education",
    value: "Growing Intl Interest",
    color: "text-[#BC002D]",
  },
];

export const healthcare = [
  {
    title: "Public Healthcare",
    desc: "Reliable government healthcare system available throughout the country.",
    color: "border-[#E5E7EB]",
  },
  {
    title: "Private Healthcare",
    desc: "High-standard private clinics and specialized medical centers in Yerevan.",
    color: "border-red-200",
  },
  {
    title: "Medical Exposure",
    desc: "Students benefit from clinical rotations in both public and private hospitals.",
    color: "border-purple-200",
  },
];

export const mbbsWhyStats = [
  { val: "5-6 Years", label: "Course Duration" },
  { val: "NMC + WHO", label: "Recognition" },
  { val: "High", label: "Student Success" },
  { val: "English", label: "Language" },
];

export const studentLifeCards = [
  {
    icon: Heart,
    label: "Safe & Friendly",
    desc: "Japan is known as one of the safest countries in the region.",
  },
  {
    icon: Building,
    label: "Infrastructure",
    desc: "Modern university campuses with excellent student facilities.",
  },
  {
    icon: Users,
    label: "Multicultural",
    desc: "Diverse student community from across the globe.",
  },
];
