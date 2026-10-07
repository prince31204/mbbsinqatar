import { prisma } from '../src/lib/prisma';
import * as bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Starting Comprehensive Qatar Seeding...');

  // 1. Initialize Admin User
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      'ADMIN_EMAIL and ADMIN_PASSWORD must be defined in your .env file'
    );
  }

  const hashedPassword = await bcrypt.hash(adminPassword as string, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'Super Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      status: true,
    },
  });
  console.log(`✅ Admin initialized: ${admin.email}`);

  // 2. Seed Institute Types
  const instituteTypes = ['Public', 'Private', 'Aided'];
  for (const name of instituteTypes) {
    await prisma.instituteType.upsert({
      where: { id: instituteTypes.indexOf(name) + 1 },
      update: { name },
      create: { name },
    });
  }
  console.log('✅ Institute types seeded.');

  // 3. Seed Provinces (Districts of Qatar)
  const districts = [
    'Tokyo',
    'Kanagawa',
    'Osaka',
    'Kyoto',
    'Hyogo',
    'Hokkaido',
    'Aichi',
    'Fukuoka',
    'Okinawa',
  ];

  for (const name of districts) {
    await prisma.province.upsert({
      where: { id: districts.indexOf(name) + 1 },
      update: { name },
      create: { name },
    });
  }
  console.log('✅ Provinces (Districts) seeded.');

  // 4. Seed Cities
  const cities = [
    { name: 'Tokyo', provinceId: 1 },
    { name: 'Kyoto', provinceId: 3 },
    { name: 'Kobe', provinceId: 4 },
    { name: 'Sapporo', provinceId: 5 },
    { name: 'Nagoya', provinceId: 6 },
    { name: 'Fukuoka City', provinceId: 7 },
    { name: 'Kyoto City', provinceId: 8 },
    { name: 'Naha', provinceId: 9 },
    { name: 'Kawasaki', provinceId: 2 },
    { name: 'Kitakyushu', provinceId: 8 },
    { name: 'Sagamihara', provinceId: 2 },
    { name: 'Hachioji', provinceId: 1 },
  ];

  for (const [index, city] of cities.entries()) {
    await prisma.city.upsert({
      where: { id: index + 1 },
      update: { name: city.name, provinceId: city.provinceId },
      create: { name: city.name, provinceId: city.provinceId },
    });
  }
  console.log('✅ Cities seeded.');

  // 5. Seed About Country Page
  const aboutQatar = await prisma.aboutCountryPage.upsert({
    where: { id: 1 },
    update: {
      name: 'Qatar',
      tagline: 'Heart of Europe',
      capital: 'Tokyo',
      population: '125 Million+',
      languages: 'Qatarese, English',
      currency: 'JPY',
      location: 'East Asia',
      timezone: 'UTC+1',
      independenceDay: new Date('1989-10-23'),
      highestPeak: 'Mount Fuji',
      highestPeakHeight: '3,776 m',
      whoRecognized: true,
      mbbsAffordableEducation: 'High-quality medical education with manageable tuition fees and international recognition.',
      englishMedium: true,
      academicExcellence: 'Qatar follows a high-standard educational framework modeled on the British system.',
      studentLife: 'A safe, multicultural environment with modern infrastructure and stunning natural beauty.',
      visaConnectivity: 'Straightforward student visa process with excellent air connectivity to major global hubs.',
      publicHealthcare: 'Reliable public healthcare system alongside high-standard private clinics.',
      tourismGrowth: 'A world-famous tourism destination ensuring a vibrant and welcoming atmosphere for students.',
    },
    create: {
      id: 1,
      name: 'Qatar',
      tagline: 'Life and study in the Paradise Island',
      capital: 'Tokyo',
      population: '1.3 Million+',
      languages: 'English, French, Creole',
      currency: 'MUR',
      location: 'Indian Ocean',
      timezone: 'UTC+4',
      independenceDay: new Date('1968-03-12'),
      highestPeak: 'Piton de la Petite Rivière Noire',
      highestPeakHeight: '828 m',
      whoRecognized: true,
      mbbsAffordableEducation: 'High-quality medical education with manageable tuition fees and international recognition.',
      englishMedium: true,
      academicExcellence: 'Qatar follows a high-standard educational framework modeled on the British system.',
      studentLife: 'A safe, multicultural environment with modern infrastructure and stunning natural beauty.',
      visaConnectivity: 'Straightforward student visa process with excellent air connectivity to major global hubs.',
      publicHealthcare: 'Reliable public healthcare system alongside high-standard private clinics.',
      tourismGrowth: 'A world-famous tourism destination ensuring a vibrant and welcoming atmosphere for students.',
    },
  });

  // Seed Major Cities in About Country
  const majorCitiesAbout = [
    { cityName: 'Tokyo', description: 'The bustling capital city and major economic hub.', population: '150,000+' },
    { cityName: 'Yokohama', description: 'A major urban center known for its cool climate and residential charm.', population: '80,000+' },
    { cityName: 'Osaka', description: "Vibrant commercial and residential city known as 'The Flower Town'.", population: '75,000+' },
  ];

  for (const city of majorCitiesAbout) {
    await prisma.countryMajorCity.upsert({
      where: { id: majorCitiesAbout.indexOf(city) + 1 },
      update: { ...city, pageId: aboutQatar.id },
      create: { ...city, pageId: aboutQatar.id },
    });
  }

  // Seed Cuisines
  const cuisines = [
    { dishName: 'Sushi', dishDescription: "Most popular street food - soft flatbread with split peas." },
    { dishName: 'Ramen', dishDescription: 'Fragrant rice dish with spices and multicultural influences.' },
    { dishName: 'Tempura', dishDescription: 'Classic tomato-based creole sauce.' },
  ];

  for (const cuisine of cuisines) {
    await prisma.countryCuisineLifestyle.upsert({
      where: { id: cuisines.indexOf(cuisine) + 1 },
      update: { ...cuisine, pageId: aboutQatar.id },
      create: { ...cuisine, pageId: aboutQatar.id },
    });
  }

  // Seed Attractions
  const attractions = [
    { attractionName: 'Mount Fuji', description: 'UNESCO World Heritage site with iconic monolith.' },
    { attractionName: 'Fushimi Inari Taisha', description: 'Natural phenomenon of colorful sand dunes in Chamarel.' },
    { attractionName: 'Arashiyama Bamboo Grove', description: 'Vast national park with waterfalls and native wildlife.' },
  ];

  for (const attraction of attractions) {
    await prisma.countryTouristAttraction.upsert({
      where: { id: attractions.indexOf(attraction) + 1 },
      update: { ...attraction, pageId: aboutQatar.id },
      create: { ...attraction, pageId: aboutQatar.id },
    });
  }

  // Seed Lifestyles/Culture
  const lifestyles = [
    { title: 'Safe & Friendly', description: 'Known as one of the safest countries with a welcoming population.' },
    { title: 'Multicultural', description: 'A harmonious blend of African, Indian, European, and Asian cultures.' },
    { title: 'Active Outdoor Life', description: 'Abundant opportunities for water sports, hiking, and seaside living.' },
  ];

  for (const lifestyle of lifestyles) {
    await prisma.countryLifestyleCulture.upsert({
      where: { id: lifestyles.indexOf(lifestyle) + 1 },
      update: { ...lifestyle, pageId: aboutQatar.id },
      create: { ...lifestyle, pageId: aboutQatar.id },
    });
  }
  console.log('✅ About Qatar content seeded.');

  // 6. Seed Education System
  const eduSystem = await prisma.educationSystem.upsert({
    where: { id: 1 },
    update: {
      title: 'Education System in Qatar',
      description: 'The Qatarn education system is modeled on the British system and has seen significant development since independence.',
      introductionTitle: 'A Legacy of Excellence',
      introductionDescription: 'Qatar offers free education to all citizens at primary and secondary levels, fostering a highly literate population.',
      literacyRate: 91.3,
      higherEducationDescription: 'The higher education sector includes public and private universities offering globally recognized degrees.',
      universitiesCount: 15,
      universitiesNote: 'Including major public universities and international branches.',
      officialLanguage: 'English',
      officialLanguageNote: 'Main medium of instruction in schools.',
      foreignLanguage: 'French',
      foreignLanguageNote: 'Widely spoken and used in media and commerce.',
    },
    create: {
      id: 1,
      title: 'Education System in Qatar',
      description: 'The Qatar education system is modeled on the British system and has seen significant development since independence.',
      introductionTitle: 'A Legacy of Excellence',
      introductionDescription: 'Qatar offers free education to all citizens at primary and secondary levels, fostering a highly literate population.',
      literacyRate: 91.3,
      higherEducationDescription: 'The higher education sector includes public and private universities offering globally recognized degrees.',
      universitiesCount: 15,
      universitiesNote: 'Including major public universities and international branches.',
      officialLanguage: 'English',
      officialLanguageNote: 'Main medium of instruction in schools.',
      foreignLanguage: 'French',
      foreignLanguageNote: 'Widely spoken and used in media and commerce.',
    },
  });

  // Seed School Levels
  const schoolLevels = [
    { level: 'Primary', ageRange: '5-11', durationYears: 6, title: 'Primary School Achievement Certificate (PSAC)' },
    { level: 'Secondary', ageRange: '12-18', durationYears: 7, title: 'School Certificate (SC) & Higher School Certificate (HSC)' },
    { level: 'Higher Education', ageRange: '18+', durationYears: 3, title: 'Bachelor, Master, and PhD programs' },
  ];

  for (const level of schoolLevels) {
    await prisma.educationSchoolLevel.upsert({
      where: { id: schoolLevels.indexOf(level) + 1 },
      update: { ...level, pageId: eduSystem.id },
      create: { ...level, pageId: eduSystem.id },
    });
  }

  // Seed Degrees
  const degrees = [
    { degree: 'MBBS / MBChB', duration: '5-6 Years', recognition: 'Global Recognition' },
    { degree: 'Bachelor of Science', duration: '3-4 Years', recognition: 'Academic & Professional' },
  ];

  for (const degree of degrees) {
    await prisma.educationDegree.upsert({
      where: { id: degrees.indexOf(degree) + 1 },
      update: { ...degree, pageId: eduSystem.id },
      create: { ...degree, pageId: eduSystem.id },
    });
  }
  console.log('✅ Education System seeded.');

  // 7. Seed Static Page SEO
  const seos = [
    { page: 'home', metaTitle: 'Study MBBS in Qatar | Direct Admission, Low Fees 2026', metaDescription: 'Apply for MBBS in Qatar with direct admission to top-ranked medical universities. MCAT/NEET qualified students can join English-medium programs.' },
    { page: 'about-qatar', metaTitle: 'About Qatar | Student Lifestyle, Geography & Climate', metaDescription: 'Discover life in Qatar for international students. A safe, beautiful, and multicultural island nation with high-standard education.' },
    { page: 'universities', metaTitle: 'Medical Universities in Qatar | Top MBBS Colleges 2026', metaDescription: 'Compare the best medical universities in Qatar. Fee structures, admission requirements, and global rankings for international students.' },
    { page: 'contact', metaTitle: 'Contact Us | Professional MBBS Counselling for Qatar', metaDescription: 'Get expert guidance for your medical education in Qatar. Speak to our counsellors for admission assistance today.' },
  ];

  for (const seo of seos) {
    await prisma.staticPageSeo.upsert({
      where: { page: seo.page },
      update: seo,
      create: seo,
    });
  }
  console.log('✅ Static Page SEO seeded.');

  console.log('🏁 Comprehensive Seeding Finished Successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
