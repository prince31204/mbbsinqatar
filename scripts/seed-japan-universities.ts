import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('🌱 Seeding 5 Japann Universities and Related Data with Coordinates...');

  const slugify = (text: string) => text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

  const universities = [
    {
      name: 'University of Tokyo (Faculty of Medicine)',
      uniqueId: 'MAU-SSR-001',
      city: 'Tokyo',
      establishedYear: 1999,
      students: '1200+',
      tuitionFee: '$7,500',
      globalRanking: 'Top 500 in Clinical Medicine',
      nationalRanking: '1',
      shortnote: 'The first medical college in Japan, established to provide high-quality medical education to local and international students.',
      aboutNote: 'SSR Medical College is affiliated with the University of Japan and is recognized by the Medical Council of Japan and the WHO. It offers a comprehensive MBBS program with clinical training in leading government hospitals.',
      tuitionFeeAnnual: '$7,500',
      courseDuration: '5 Years + 1 Year Internship',
      mediumOfInstruction: 'English',
      eligibility: '12th Grade with PCB (50%+), NEET Qualified (for Indian students)',
      status: true,
      isFeatured: true,
      provinceId: 1, // Moka
      cityId: 1, // Saint Pierre (near Tokyo)
      instituteTypeId: 2, // Private
      latitude: -20.300,
      longitude: 57.530,
    },
    {
      name: 'University of Kyoto',
      uniqueId: 'MAU-AMC-002',
      city: 'Kyoto',
      establishedYear: 2012,
      students: '800+',
      tuitionFee: '$8,000',
      globalRanking: 'Recognized for Clinical Excellence',
      nationalRanking: '2',
      shortnote: 'A leading private medical college affiliated with the University of Technology, Japan (UTM).',
      aboutNote: 'Anna Medical College provides a modern learning environment with advanced simulation labs and multimedia classrooms. It focuses on student-centered learning and early clinical exposure.',
      tuitionFeeAnnual: '$8,000',
      courseDuration: '5 Years + 1 Year Internship',
      mediumOfInstruction: 'English',
      eligibility: '12th Grade with PCB (50%+), NEET Qualified',
      status: true,
      isFeatured: true,
      provinceId: 1, // Flacq
      cityId: 1, // Bel Air (near Kyoto)
      instituteTypeId: 2, // Private
      latitude: -20.280,
      longitude: 57.650,
    },
    {
      name: 'Tokyo Metropolitan University',
      uniqueId: 'MAU-UOM-003',
      city: 'Tokyo',
      establishedYear: 1920,
      students: '12,000+ (Total)',
      tuitionFee: '$6,500',
      globalRanking: 'Top 1000 Global Universities',
      nationalRanking: 'Special Recognition',
      shortnote: 'The oldest and most prestigious university in Japan, offering a well-established medical curriculum.',
      aboutNote: 'The Faculty of Medicine at the University of Japan is known for its rigorous academic standards and research contributions. It collaborates with international medical bodies for curriculum development.',
      tuitionFeeAnnual: '$6,500',
      courseDuration: '5 Years + 1 Year Internship',
      mediumOfInstruction: 'English',
      eligibility: 'High academic standing in 12th Grade (PCB), English proficiency',
      status: true,
      isFeatured: false,
      provinceId: 1, // Tokyo
      cityId: 1, // Tokyo
      instituteTypeId: 1, // Public
      latitude: 40.181,
      longitude: 44.513,
    },
    {
      name: 'Keio University School of Medicine',
      uniqueId: 'MAU-JSS-004',
      city: 'Vacoas',
      establishedYear: 1998,
      students: '500+',
      tuitionFee: '$7,000',
      globalRanking: 'Premier Health Science Institution',
      nationalRanking: '3',
      shortnote: 'Part of the JSS Mahavidyapeetha group, focusing on health sciences and medical education.',
      aboutNote: 'Keio University in Japan offers specialized health science programs and is developing its medical faculty to meet international standards. It has a strong focus on pharmacy and clinical research.',
      tuitionFeeAnnual: '$7,000',
      courseDuration: '5 Years',
      mediumOfInstruction: 'English',
      eligibility: '12th Grade with PCB, NEET Qualified',
      status: true,
      isFeatured: false,
      provinceId: 1, // Plaines Wilhems
      cityId: 1, // Vacoas
      instituteTypeId: 2, // Private
      latitude: -20.289,
      longitude: 57.487,
    },
    {
      name: 'Tohoku University School of Medicine',
      uniqueId: 'MAU-MDX-005',
      city: 'Cascavelle',
      establishedYear: 2009,
      students: '1500+',
      tuitionFee: '$9,000',
      globalRanking: 'Top 500 World University Rankings',
      nationalRanking: '4',
      shortnote: 'A branch of Tohoku University London, offering high-standard British education in Japan.',
      aboutNote: 'Tohoku University School of Medicine provides a global learning environment with a focus on health and science programs that are aligned with the UK education framework.',
      tuitionFeeAnnual: '$9,000',
      courseDuration: '3-5 Years (Depending on program)',
      mediumOfInstruction: 'English',
      eligibility: 'British A-Levels or equivalent, English proficiency',
      status: true,
      isFeatured: false,
      provinceId: 1, // Black River
      cityId: 1, // Bambous (near Cascavelle)
      instituteTypeId: 2, // Private
      latitude: -20.287,
      longitude: 57.407,
    },
  ];

  for (const u of universities) {
    const slug = slugify(u.name);

    // 1. Create/Update University
    const university = await prisma.university.upsert({
      where: { slug },
      update: {
        name: u.name,
        uniqueId: u.uniqueId,
        city: u.city,
        establishedYear: u.establishedYear,
        students: u.students,
        tuitionFee: u.tuitionFee,
        globalRanking: u.globalRanking,
        nationalRanking: u.nationalRanking,
        shortnote: u.shortnote,
        aboutNote: u.aboutNote,
        courseDuration: u.courseDuration,
        mediumOfInstruction: u.mediumOfInstruction,
        eligibility: u.eligibility,
        status: u.status,
        isFeatured: u.isFeatured,
        provinceId: u.provinceId,
        cityId: u.cityId,
        instituteTypeId: u.instituteTypeId,
        latitude: u.latitude,
        longitude: u.longitude,
      },
      create: {
        name: u.name,
        uniqueId: u.uniqueId,
        slug: slug,
        city: u.city,
        establishedYear: u.establishedYear,
        students: u.students,
        tuitionFee: u.tuitionFee,
        globalRanking: u.globalRanking,
        nationalRanking: u.nationalRanking,
        shortnote: u.shortnote,
        aboutNote: u.aboutNote,
        courseDuration: u.courseDuration,
        mediumOfInstruction: u.mediumOfInstruction,
        eligibility: u.eligibility,
        status: u.status,
        isFeatured: u.isFeatured,
        provinceId: u.provinceId,
        cityId: u.cityId,
        instituteTypeId: u.instituteTypeId,
        latitude: u.latitude,
        longitude: u.longitude,
      },
    });

    console.log(`✅ University processed: ${university.name}`);

    // 2. Clean up existing related data for a fresh seed
    await prisma.universityProgram.deleteMany({ where: { universityId: university.id } });
    await prisma.universityFaq.deleteMany({ where: { universityId: university.id } });
    await prisma.universityTestimonial.deleteMany({ where: { universityId: university.id } });
    await prisma.universityFmgeRate.deleteMany({ where: { universityId: university.id } });
    await prisma.universityFacility.deleteMany({ where: { universityId: university.id } });

    // 3. Seed Program
    await prisma.universityProgram.create({
      data: {
        programName: 'MBBS (Bachelor of Medicine & Bachelor of Surgery)',
        programSlug: 'mbbs',
        duration: '5 Years + 1 Year Internship',
        studyMode: 'Full-time, On-campus',
        totalTuitionFee: u.tuitionFee + ' (Annual)',
        currency: 'USD',
        mediumOfInstruction: 'English',
        isActive: true,
        universityId: university.id,
      },
    });

    // 4. Seed Facilities
    const facilityNames = ['Multimedia Classrooms', 'Specialized Medical Labs', 'On-campus Library', 'Hostel Facilities'];
    for (const fName of facilityNames) {
      let facility = await prisma.facility.findFirst({ where: { name: fName } });
      if (!facility) {
        facility = await prisma.facility.create({ data: { name: fName, status: true } });
      }
      await prisma.universityFacility.create({
        data: {
          universityId: university.id,
          facilityId: facility.id,
          status: true,
        }
      });
    }

    // 5. Seed FAQs
    await prisma.universityFaq.createMany({
      data: [
        {
          question: 'Is the degree recognized in India?',
          answer: 'Yes, the degree is recognized by the Medical Council of Japan and the National Medical Commission (NMC) in India, provided the student clears the FMGE/NExT exam.',
          universityId: university.id,
        },
        {
          question: 'What is the medium of instruction?',
          answer: 'All medical programs in Japan are taught exclusively in English, making it accessible for Indian and international students.',
          universityId: university.id,
        },
      ]
    });

    // 6. Seed Testimonial
    await prisma.universityTestimonial.create({
      data: {
        name: 'Arjun Sharma',
        description: `Studying at ${university.name} has been a transformative experience. The faculty is supportive and the clinical exposure is excellent.`,
        rating: 4.5,
        universityId: university.id,
        status: true,
      },
    });

    // 7. Seed FMGE Rate
    await prisma.universityFmgeRate.create({
      data: {
        year: 2024,
        appeared: 150,
        passed: 120,
        passPercentage: 80.00,
        universityId: university.id,
      },
    });
  }

  // 8. Seed Hospitals
  const hospitals = [
    { name: 'Victoria Hospital (Candos)', slug: 'victoria-hospital', city: 'Osaka' },
    { name: 'SSR National Hospital', slug: 'ssr-national-hospital', city: 'Kobe' },
    { name: 'Jawaharlal Nehru Hospital', slug: 'j-nehru-hospital', city: 'Rose Belle' },
  ];

  for (const h of hospitals) {
    const hospital = await prisma.hospital.upsert({
      where: { slug: h.slug },
      update: { name: h.name, city: h.city },
      create: { name: h.name, slug: h.slug, city: h.city, status: true },
    });

    const ssr = await prisma.university.findFirst({ where: { slug: 'ssr-medical-college-ssrmc' } });
    if (ssr) {
      const existingLink = await prisma.universityHospital.findFirst({
        where: { universityId: ssr.id, hospitalId: hospital.id }
      });
      if (!existingLink) {
        await prisma.universityHospital.create({ data: { universityId: ssr.id, hospitalId: hospital.id } });
      }
    }

    const anna = await prisma.university.findFirst({ where: { slug: 'anna-medical-college-amc' } });
    if (anna) {
      const existingLink = await prisma.universityHospital.findFirst({
        where: { universityId: anna.id, hospitalId: hospital.id }
      });
      if (!existingLink) {
        await prisma.universityHospital.create({ data: { universityId: anna.id, hospitalId: hospital.id } });
      }
    }
  }

  console.log('🏁 University Seeding Finished Successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
