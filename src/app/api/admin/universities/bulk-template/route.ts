import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import * as XLSX from "xlsx";
import AdmZip from "adm-zip";

export async function GET(req: NextRequest) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  try {
    const columns = [
      "Name",
      "Unique ID",
      "City",
      "State",
      "Why Choose this University",
      "Thumbnail Filename",
      "Banner Filename",
      "Gallery Image 1 Filename",
      "Gallery Image 2 Filename",
      "Gallery Image 3 Filename",
      "Established Year",
      "Students",
      "Total International Students",
      "Campus Area",
      "About Note",
      "FMGE Pass Rate",
      "Students by Country",
      "University Brochure Filename",
      "University License Filename",
      "Aggregation Letter Filename",
      "Available Courses",
      "Tuition Fee",
      "Seats Available",
      "Course Duration",
      "Medium of Instruction",
      "Year 1 Syllabus",
      "Year 2 Syllabus",
      "Year 3 Syllabus",
      "Year 4 Syllabus",
      "Year 5 Syllabus",
      "Year 6 Syllabus",
      "Hospital Affiliations",
      "Eligibility",
      "Intake",
      "Program Overview",
      "Hostel Buildings",
      "NEET Requirement",
      "Embassy Verified",
      "WHO Listed",
      "NMC Approved",
      "Ministry Licensed",
      "FAIMER Listed",
      "MCI Recognition",
      "ECFMG Eligible",
      "QS World University Rankings",
      "Times Higher Education (THE)",
      "Webometrics Ranking",
      "SCImago Institutions Rankings",
      "URAP World Ranking",
      "Global Ranking",
      "National Ranking",
      "Number of Labs",
      "Number of Lecture Halls",
      "Years of Excellence",
      "Latitude",
      "Longitude",
      "WHO Listed Link",
      "WFME Recognized",
      "Globally Accredited",
    ];

    // Sample row for guidance
    const sampleRow = [
      "Example University",
      "example-university",
      "Curepipe",
      "Curepipe Region",
      "Top medical education with low fees",
      "thumb.jpg",
      "banner.jpg",
      "gallery1.jpg",
      "gallery2.jpg",
      "gallery3.jpg",
      "1990",
      "5000",
      "1500",
      "50 Acres",
      "A comprehensive note about the university.",
      "85.5",
      "India, Pakistan, Bangladesh",
      "brochure.pdf",
      "license.pdf",
      "aggregation.pdf",
      "MBBS, Nursing",
      "4500",
      "200",
      "6 Years",
      "English",
      "Syllabus 1...",
      "Syllabus 2...",
      "Syllabus 3...",
      "Syllabus 4...",
      "Syllabus 5...",
      "Syllabus 6...",
      "Curepipe City Hospital",
      "12th Pass with 50%",
      "September, February",
      "The MBBS programme provides high-quality medical education.",
      "5",
      "Required",
      "TRUE",
      "TRUE",
      "TRUE",
      "TRUE",
      "TRUE",
      "TRUE",
      "TRUE",
      "1201+",
      "801-1000",
      "3450",
      "2800",
      "1500",
      "1000+",
      "45",
      "12",
      "8",
      "76",
      "41.311081",
      "69.240562",
      "https://who.int/listing",
      "TRUE",
      "TRUE",
    ];

    const worksheet = XLSX.utils.aoa_to_sheet([columns, sampleRow]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Universities");

    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    const zip = new AdmZip();
    zip.addFile("universities-template.xlsx", excelBuffer);
    zip.addFile("assets/1/", Buffer.alloc(0));
    zip.addFile("assets/2/", Buffer.alloc(0));

    const zipBuffer = zip.toBuffer();

    return new NextResponse(zipBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition":
          'attachment; filename="universities-template-kit.zip"',
      },
    });
  } catch (err) {
    console.error("Template generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate template" },
      { status: 500 },
    );
  }
}
