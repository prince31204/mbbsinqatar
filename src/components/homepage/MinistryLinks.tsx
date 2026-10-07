import { Prisma } from "@prisma/client";
import {
  ExternalLink,
  Building2,
  Globe,
  FileText,
  Phone,
  Mail,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

type OfficialGovernmentLink = Prisma.OfficialGovernmentLinkGetPayload<{}>;

type MinistryCard = {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  website: string;
  phone?: string;
  email?: string;
  services: string[];
};

const EMBASSY_INFO = {
  name: "Embassy of Qatar in India",
  address: "Plot No. 4 & 5, 50-G Shantipath, Chanakyapuri, New Delhi – 110021, India",
  phone: "+91-11-4610-4610",
  email: "jpembjic@nd.mofa.go.jp",
  website: "https://www.in.emb-qatar.go.jp/itprtop_en/index.html",
  consular:
    "Consular appointments are handled through official mission channels",
  hours: "Monday to Friday: 9:00 AM - 4:00 PM",
};

const DB_FALLBACK_SERVICES = [
  "Official updates",
  "Policy notices",
  "Compliance information",
  "Reference links",
];

const IMPORTANT_NOTES = [
  "Confirm university recognition from official regulators",
  "Use embassy websites for visa process updates",
  "Cross-check exam and licensing notices from NMC",
];

function normalizeCountryText(value: string): string {
  return value;
}

function normalizeWebsite(url: string): string {
  return url;
}

const FALLBACK_MINISTRIES: MinistryCard[] = [
  {
    id: 1,
    name: "Ministry of Health and Wellness Qatar",
    subtitle: "National Regulator",
    description:
      "Primary public authority overseeing healthcare services, medical education standards, and national health policies in Qatar.",
    website: "https://health.govmu.org",
    services: [
      "Medical education oversight",
      "Healthcare regulation",
      "Public health policy",
      "Quality and standards",
    ],
  },
  {
    id: 2,
    name: "National Medical Commission India",
    subtitle: "NMC India",
    description:
      "Indian authority for recognition, screening, and licensing pathways for foreign medical graduates.",
    website: "https://www.nmc.org.in",
    phone: "+91-11-4560-9900",
    email: "secretary@nmc.org.in",
    services: [
      "FMGE/NExT pathways",
      "Recognition guidance",
      "Licensing framework",
      "Regulatory advisories",
    ],
  },
  {
    id: 3,
    name: "World Health Organization",
    subtitle: "WHO",
    description:
      "Global public health authority relevant to international medical education reference standards.",
    website: "https://www.who.int",
    phone: "+41-22-791-2111",
    email: "info@who.int",
    services: [
      "Global health standards",
      "Policy frameworks",
      "International collaboration",
      "Public health guidance",
    ],
  },
  {
    id: 4,
    name: "ECFMG (USA)",
    subtitle: "ECFMG",
    description:
      "Certification and pathway authority for international medical graduates in the United States.",
    website: "https://www.ecfmg.org",
    phone: "+1-215-386-5900",
    email: "info@ecfmg.org",
    services: [
      "Certification pathways",
      "Eligibility guidance",
      "Credential verification",
      "US residency screening",
    ],
  },
];

function parseDbServices(value: string | null | undefined): string[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.map((item) => String(item).trim()).filter(Boolean);
  } catch {
    return [];
  }
}

function mapOfficialLinkToCard(link: OfficialGovernmentLink): MinistryCard {
  const rawDescription = (link.description || "").trim();
  const parsedServices = parseDbServices(rawDescription);
  const displayDescription =
    parsedServices.length > 0
      ? "Official government resource for student and institutional guidance."
      : rawDescription ||
      "Official government resource for student and institutional guidance.";

  return {
    id: link.id,
    name: normalizeCountryText(link.name),
    subtitle: normalizeCountryText(link.category || "Official Source"),
    description: normalizeCountryText(displayDescription),
    website: normalizeWebsite(link.url),
    services: (parsedServices.length > 0
      ? parsedServices
      : DB_FALLBACK_SERVICES
    ).map(normalizeCountryText),
  };
}

async function loadMinistryCards(): Promise<MinistryCard[]> {
  try {
    const links = await prisma.officialGovernmentLink.findMany({
      where: { status: true },
      orderBy: { position: "asc" },
    });

    if (links.length === 0) {
      return FALLBACK_MINISTRIES;
    }

    return links.map(mapOfficialLinkToCard);
  } catch {
    return FALLBACK_MINISTRIES;
  }
}

export default async function MinistryLinks() {
  const ministries = await loadMinistryCards();

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-[#1F2937] mb-4">
            Official Government Links
          </h2>
          <p className="text-xl text-[#4B5563] max-w-3xl mx-auto">
            Direct access to official organizations that matter for MBBS
            admissions, compliance, and student support.
          </p>
        </div>

        <div className="bg-[#5B0F26] rounded-3xl p-8 mb-8 text-white">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">{EMBASSY_INFO.name}</h3>
              <p className="text-[#F7E9EE] mb-6">
                Contact the embassy for official visa, documentation, and
                consular guidance before your travel.
              </p>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Building2 className="w-5 h-5 mt-1 flex-shrink-0" />
                  <span className="text-[#F7E9EE]">{EMBASSY_INFO.address}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 flex-shrink-0" />
                  <span className="text-[#F7E9EE]">{EMBASSY_INFO.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 flex-shrink-0" />
                  <span className="text-[#F7E9EE]">{EMBASSY_INFO.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 flex-shrink-0" />
                  <a
                    href={EMBASSY_INFO.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#F7E9EE] transition-colors"
                  >
                    {EMBASSY_INFO.website}
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-[#F9FAFB] rounded-2xl p-6">
              <h4 className="text-xl font-semibold mb-4 text-[#1F2937]">Office Hours</h4>
              <p className="text-[#4B5563] mb-4">{EMBASSY_INFO.hours}</p>
              <h4 className="text-xl font-semibold mb-2 text-[#1F2937]">Consular Services</h4>
              <p className="text-[#4B5563] mb-4">{EMBASSY_INFO.consular}</p>
              <a
                href={EMBASSY_INFO.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white text-[#8A1538] px-6 py-3 rounded-lg font-semibold hover:bg-white transition-colors text-center"
              >
                Contact Embassy
              </a>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {ministries.map((ministry) => (
            <div
              key={ministry.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-lg transition-all duration-500 hover:-translate-y-1 hover:border-[#E5E7EB] hover:shadow-2xl"
            >
              <div className="border-b bg-[#FAF8F7] p-6 transition-colors duration-300">
                <div className="flex items-start space-x-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-[#F9FAFB] text-[#8A1538] transition-all duration-300 group-hover:bg-[#8A1538] group-hover:text-white">
                    <Building2 className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1 text-xl font-bold text-[#1F2937] transition-colors duration-300 group-hover:text-[#5B0F26]">
                      {ministry.name}
                    </h3>
                    <p className="text-sm text-[#6B7280] mb-2">
                      {ministry.subtitle}
                    </p>
                    <p className="text-[#4B5563]">{ministry.description}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="mb-6">
                  <h4 className="font-semibold text-[#1F2937] mb-3">
                    Contact Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <Globe className="w-4 h-4 text-[#8A1538] flex-shrink-0" />
                      <a
                        href={ministry.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#8A1538] hover:text-[#5B0F26] transition-colors text-sm"
                      >
                        {ministry.website}
                      </a>
                      <ExternalLink className="w-3 h-3 text-[#6B7280]" />
                    </div>
                    {ministry.phone ? (
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-[#8A1538] flex-shrink-0" />
                        <span className="text-[#4B5563] text-sm">
                          {ministry.phone}
                        </span>
                      </div>
                    ) : null}
                    {ministry.email ? (
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-[#8A1538] flex-shrink-0" />
                        <span className="text-[#4B5563] text-sm">
                          {ministry.email}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="mb-6 flex-grow">
                  <h4 className="font-semibold text-[#1F2937] mb-3">
                    Key Services
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {ministry.services.map((service) => (
                      <div
                        key={service}
                        className="flex items-center space-x-2"
                      >
                        <div className="w-2 h-2 bg-[#8A1538] rounded-full flex-shrink-0" />
                        <span className="text-[#4B5563] text-sm">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-auto">
                  <a
                    href={ministry.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center space-x-2 rounded-lg bg-[#8A1538] py-3 font-medium text-white transition-all duration-300"
                  >
                    <span>Visit Official Website</span>
                    <ExternalLink className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-8">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-white border border-[#E5E7EB] rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
              <FileText className="w-5 h-5 text-[#8A1538]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1F2937] mb-3">
                Important Notice
              </h3>
              <p className="text-[#4B5563] mb-4">
                Always verify requirements directly on official government
                portals before filing applications, visas, or equivalency
                documents.
              </p>
              <ul className="space-y-2">
                {IMPORTANT_NOTES.map((item) => (
                  <li key={item} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-[#8A1538] rounded-full mt-2 flex-shrink-0" />
                    <span className="text-[#4B5563]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
