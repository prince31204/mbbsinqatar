export interface ExpertProfile {
  id: number;
  name: string;
  designation: string;
  bio: string;
  photoPath?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  expertise: string[];
}

export const expertProfiles: Record<number, ExpertProfile> = {
  13: {
    id: 13,
    name: "Dr. Amitabh Sharma",
    designation: "Senior Medical Education Consultant",
    bio: "With over 12 years of experience in international medical admissions, Dr. Amitabh has helped 1,500+ Indian students secure seats in top-tier medical universities in Qatar and Central Asia. He specializes in NMC (National Medical Commission) regulations and NEXT exam preparation roadmaps.",
    linkedinUrl: "https://www.linkedin.com/in/expert-medical-consultant",
    expertise: [
      "NMC Regulations",
      "FMGE Preparation",
      "Qatar Education System",
      "Student Visa Support",
    ],
  },
  2: {
    id: 2,
    name: "Priyanka Verma",
    designation: "Legal & Visa Counselor",
    bio: "Priyanka is a specialist in the documentation and legal processes for Indian students studying abroad. She manages the entire visa cycle, from Apostille to residence permit approvals in Curepipe and Port Louis.",
    linkedinUrl: "https://www.linkedin.com/in/vista-counselor",
    expertise: [
      "Visa Processing",
      "Legal Documentation",
      "Student Accommodation",
      "Pre-Departure Briefing",
    ],
  },
};

export function getExpertProfile(userId: number): ExpertProfile | undefined {
  return expertProfiles[userId];
}
