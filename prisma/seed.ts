import "dotenv/config";
import { PrismaClient, UserRole, OrdinanceType, OrdinanceStatus, NewsCategory } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

const connectionString = `${process.env.DIRECT_URL || process.env.DATABASE_URL!}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding Cabanatuan City Ordinance Hub...");

  // ─── Barangays (Real Cabanatuan City Barangays) ──────────────────────────
  const barangays = await Promise.all(
    [
      "Adatag",
      "Bakero",
      "Bakod Bayan",
      "Bangad",
      "Bantug Bulalo",
      "Bantug Norte",
      "Barlis",
      "Barrera District",
      "Bernardo",
      "Bitas",
      "Bonifacio District",
      "Buliran",
      "Caalibangbangan",
      "Cabu",
      "Camp Tinio",
      "Capitol Site",
      "Castellano",
      "Communal",
      "Cruz Roja",
      "Daang Sarile",
      "Dalampang",
      "Dicarma",
      "Dimasalang",
      "Dionisio S. Garcia",
      "Hermogenes C. Concepcion",
      "Imelda District",
      "Isla",
      "Kalikid Norte",
      "Kalikid Sur",
      "Kapitan Pepe",
      "Lagare",
      "Lourdes",
      "M. S. Garcia",
      "Mabini Extension",
      "Mabini Homesite",
      "Macatbong",
      "Magsaysay District",
      "Magsaysay Sur",
      "Mahipon",
      "Malasin",
      "Matadero",
      "Melojavilla",
      "Nabao",
      "Obrero",
      "Padre Burgos",
      "Padre Crisostomo",
      "Pagas",
      "Palagay",
      "Pamaldan",
      "Pangatian",
      "Pantoc",
      "Pula",
      "Quezon District",
      "Rizdelis",
      "San Isidro",
      "San Josef Norte",
      "San Josef Sur",
      "San Juan Accfa",
      "San Roque Norte",
      "San Roque Sur",
      "Sangitan",
      "Santa Arcadia",
      "Samon",
      "Sanbermicristi",
      "Santo Niño",
      "Sapang",
      "Sumacab Este",
      "Sumacab Norte",
      "Sumacab Sur",
      "Talipapa",
      "Valdefuente",
      "Valle Cruz",
      "Vijandre District",
      "Villa Ofelia",
      "Zulueta District",
    ].map((name) =>
      prisma.barangay.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  const dsGarcia = barangays.find((b) => b.name === "Dionisio S. Garcia")!;
  const capitalSite = barangays.find((b) => b.name === "Capitol Site")!;
  const campTinio = barangays.find((b) => b.name === "Camp Tinio")!;

  // ─── Users ──────────────────────────────────────────────────────────────
  const passwordHash = await hash("password123", 12);

  const lguAdmin = await prisma.user.upsert({
    where: { email: "lgu.admin.cabanatuan@gmail.com" },
    update: {},
    create: {
      email: "lgu.admin.cabanatuan@gmail.com",
      passwordHash,
      name: "LGU Super Admin",
      role: UserRole.LGU_ADMIN,
    },
  });

  const captain = await prisma.user.upsert({
    where: { email: "captain.garcia.cabanatuan@gmail.com" },
    update: {},
    create: {
      email: "captain.garcia.cabanatuan@gmail.com",
      passwordHash,
      name: "Kap. Juan Garcia",
      role: UserRole.CAPTAIN,
      barangayId: dsGarcia.id,
    },
  });

  const captainAlias = await prisma.user.upsert({
    where: { email: "captain.kapitan.cabanatuan@gmail.com" },
    update: {},
    create: {
      email: "captain.kapitan.cabanatuan@gmail.com",
      passwordHash,
      name: "Kap. Juan Garcia (Alias)",
      role: UserRole.CAPTAIN,
      barangayId: dsGarcia.id,
    },
  });

  const captainCampTinio = await prisma.user.upsert({
    where: { email: "captain.camptinio.cabanatuan@gmail.com" },
    update: {},
    create: {
      email: "captain.camptinio.cabanatuan@gmail.com",
      passwordHash,
      name: "Kap. Anita S. Pascual",
      role: UserRole.CAPTAIN,
      barangayId: campTinio.id,
    },
  });

  const secretary = await prisma.user.upsert({
    where: { email: "secretary.garcia.cabanatuan@gmail.com" },
    update: {},
    create: {
      email: "secretary.garcia.cabanatuan@gmail.com",
      passwordHash,
      name: "Sec. Maria Santos",
      role: UserRole.SECRETARY,
      barangayId: dsGarcia.id,
    },
  });

  const secretaryAlias = await prisma.user.upsert({
    where: { email: "secretary.kalihim.cabanatuan@gmail.com" },
    update: {},
    create: {
      email: "secretary.kalihim.cabanatuan@gmail.com",
      passwordHash,
      name: "Sec. Maria Santos (Alias)",
      role: UserRole.SECRETARY,
      barangayId: dsGarcia.id,
    },
  });

  const kagawad = await prisma.user.upsert({
    where: { email: "kagawad.garcia.cabanatuan@gmail.com" },
    update: {},
    create: {
      email: "kagawad.garcia.cabanatuan@gmail.com",
      passwordHash,
      name: "Kag. Pedro Reyes",
      role: UserRole.KAGAWAD,
      barangayId: dsGarcia.id,
    },
  });

  // ─── Ordinances ────────────────────────────────────────────────────────
  await prisma.ordinance.upsert({
    where: { id: "seed-ord-001" },
    update: {
      title: "Nagbabawal sa Pagsusunog ng Basura",
      resolutionNumber: "2024-003",
      category: "Environment & Cleanliness",
      year: 2024,
      dateEnacted: new Date("2024-03-15"),
      coverage: "Barangay Dionisio S. Garcia, Lungsod ng Cabanatuan",
      tags: ["basura", "pagsusunog", "environment", "clean air", "smoke", "polusyon"],
      description: "Isang ordinansa na nagbabawal sa pagsusunog ng anumang uri ng basura sa loob ng nasasakupan ng Barangay Dionisio S. Garcia upang mapanatili ang malinis na hangin.",
      articles: "Seksyon 1. Layunin — Layunin ng ordinansang ito na ipagbawal ang pagsusunog ng basura sa lahat ng lugar sa loob ng barangay.\n\nSeksyon 2. Sakop — Ang ordinansang ito ay sumasakop sa lahat ng residente, negosyante, at iba pang indibidwal na naninirahan o nagtatrabaho sa Barangay D.S. Garcia.\n\nSeksyon 3. Ipinagbabawal — Ang pagsusunog ng anumang uri ng basura sa tabi ng kalsada, bakanteng lote, bakuran, at iba pang pampublikong lugar ay mahigpit na ipinagbabawal.",
      enforcement: "Alagad ng Barangay / Bantay Bayan, CENRO",
    },
    create: {
      id: "seed-ord-001",
      title: "Nagbabawal sa Pagsusunog ng Basura",
      resolutionNumber: "2024-003",
      series: "S. 2024",
      type: OrdinanceType.BARANGAY,
      status: OrdinanceStatus.APPROVED,
      category: "Environment & Cleanliness",
      year: 2024,
      dateEnacted: new Date("2024-03-15"),
      coverage: "Barangay Dionisio S. Garcia, Lungsod ng Cabanatuan",
      tags: ["basura", "pagsusunog", "environment", "clean air", "smoke", "polusyon"],
      description: "Isang ordinansa na nagbabawal sa pagsusunog ng anumang uri ng basura sa loob ng nasasakupan ng Barangay Dionisio S. Garcia upang mapanatili ang malinis na hangin.",
      content:
        "Isang ordinansa na nagbabawal sa pagsusunog ng anumang uri ng basura, plastik, goma, dahon, at iba pang materyales sa loob ng nasasakupan ng Barangay Dionisio S. Garcia, Lungsod ng Cabanatuan, upang mapanatili ang malinis na hangin at maiwasan ang polusyon sa kapaligiran.\n\nSeksyon 1. Layunin — Layunin ng ordinansang ito na ipagbawal ang pagsusunog ng basura sa lahat ng lugar sa loob ng barangay.\n\nSeksyon 2. Sakop — Ang ordinansang ito ay sumasakop sa lahat ng residente, negosyante, at iba pang indibidwal na naninirahan o nagtatrabaho sa Barangay D.S. Garcia.\n\nSeksyon 3. Ipinagbabawal — Ang pagsusunog ng anumang uri ng basura sa tabi ng kalsada, bakanteng lote, bakuran, at iba pang pampublikong lugar ay mahigpit na ipinagbabawal.",
      articles: "Seksyon 1. Layunin — Layunin ng ordinansang ito na ipagbawal ang pagsusunog ng basura sa lahat ng lugar sa loob ng barangay.\n\nSeksyon 2. Sakop — Ang ordinansang ito ay sumasakop sa lahat ng residente, negosyante, at iba pang indibidwal na naninirahan o nagtatrabaho sa Barangay D.S. Garcia.\n\nSeksyon 3. Ipinagbabawal — Ang pagsusunog ng anumang uri ng basura sa tabi ng kalsada, bakanteng lote, bakuran, at iba pang pampublikong lugar ay mahigpit na ipinagbabawal.",
      penalties:
        "Unang Paglabag: Babala at pagpapayo\nPangalawang Paglabag: Multa na ₱500.00\nPangatlong Paglabag: Multa na ₱1,000.00 at community service ng 8 oras\nPang-apat na Paglabag pataas: Multa na ₱2,500.00 at irereklamo sa tanggapan ng City Environment and Natural Resources Office (CENRO)",
      enforcement: "Alagad ng Barangay / Bantay Bayan, CENRO",
      signatories:
        "Kap. Juan Garcia — Punong Barangay\nSec. Maria Santos — Kalihim ng Sangguniang Barangay\nKag. Pedro Reyes — Kagawad\nKag. Ana Cruz — Kagawad\nKag. Roberto Mendoza — Kagawad\nKag. Lorna Villanueva — Kagawad\nKag. Fernando Aquino — Kagawad",
      barangayId: dsGarcia.id,
      submittedById: captain.id,
      reviewedById: lguAdmin.id,
      approvedAt: new Date("2024-03-15"),
    },
  });

  await prisma.ordinance.upsert({
    where: { id: "seed-ord-002" },
    update: {
      title: "Tamang Pagtatapon ng Basura at Segregation sa Barangay D.S. Garcia",
      resolutionNumber: "2024-005",
      category: "Environment & Cleanliness",
      year: 2024,
      dateEnacted: new Date("2024-05-20"),
      coverage: "Barangay Dionisio S. Garcia, Lungsod ng Cabanatuan",
      tags: ["basura", "segregation", "biodegradable", "non-biodegradable", "hazardous", "waste"],
      description: "Isang ordinansa na nag-aatas ng tamang pagtatapon at paghihiwalay ng basura (waste segregation) sa lahat ng kabahayan at establisyemento.",
      articles: "Seksyon 1. Nararapat na ihiwalay ang basura sa tatlong kategorya: nabubulok (biodegradable), hindi nabubulok (non-biodegradable), at mapanganib (hazardous).\n\nSeksyon 2. Ang bawat kabahayan ay kinakailangang gumamit ng hiwalay na lalagyan para sa bawat uri ng basura.",
      enforcement: "Barangay Waste Management Committee, Bantay Bayan",
    },
    create: {
      id: "seed-ord-002",
      title: "Tamang Pagtatapon ng Basura at Segregation sa Barangay D.S. Garcia",
      resolutionNumber: "2024-005",
      series: "S. 2024",
      type: OrdinanceType.BARANGAY,
      status: OrdinanceStatus.APPROVED,
      category: "Environment & Cleanliness",
      year: 2024,
      dateEnacted: new Date("2024-05-20"),
      coverage: "Barangay Dionisio S. Garcia, Lungsod ng Cabanatuan",
      tags: ["basura", "segregation", "biodegradable", "non-biodegradable", "hazardous", "waste"],
      description: "Isang ordinansa na nag-aatas ng tamang pagtatapon at paghihiwalay ng basura (waste segregation) sa lahat ng kabahayan at establisyemento.",
      content:
        "Isang ordinansa na nag-aatas ng tamang pagtatapon at paghihiwalay ng basura (waste segregation) sa lahat ng kabahayan at establisyemento sa Barangay Dionisio S. Garcia.\n\nSeksyon 1. Nararapat na ihiwalay ang basura sa tatlong kategorya: nabubulok (biodegradable), hindi nabubulok (non-biodegradable), at mapanganib (hazardous).\n\nSeksyon 2. Ang bawat kabahayan ay kinakailangang gumamit ng hiwalay na lalagyan para sa bawat uri ng basura.",
      articles: "Seksyon 1. Nararapat na ihiwalay ang basura sa tatlong kategorya: nabubulok (biodegradable), hindi nabubulok (non-biodegradable), at mapanganib (hazardous).\n\nSeksyon 2. Ang bawat kabahayan ay kinakailangang gumamit ng hiwalay na lalagyan para sa bawat uri ng basura.",
      penalties:
        "Unang Paglabag: Babala\nPangalawang Paglabag: Multa na ₱300.00\nPangatlong Paglabag: Multa na ₱1,000.00",
      enforcement: "Barangay Waste Management Committee, Bantay Bayan",
      signatories:
        "Kap. Juan Garcia — Punong Barangay\nSec. Maria Santos — Kalihim ng Sangguniang Barangay",
      barangayId: dsGarcia.id,
      submittedById: captain.id,
      reviewedById: lguAdmin.id,
      approvedAt: new Date("2024-05-20"),
    },
  });

  await prisma.ordinance.upsert({
    where: { id: "seed-ord-003" },
    update: {
      title: "Establishing Curfew Hours for Minors in Cabanatuan City",
      resolutionNumber: "2024-012",
      category: "Youth & Education",
      year: 2024,
      dateEnacted: new Date("2024-06-01"),
      coverage: "Lungsod ng Cabanatuan (All 75 Barangays)",
      tags: ["curfew", "minors", "kabataan", "17 and below", "security", "peace"],
      description: "An ordinance establishing curfew hours for minors aged 17 and below within the territorial jurisdiction of Cabanatuan City from 10:00 PM to 4:00 AM.",
      articles: "Section 1. Coverage — All minors aged 17 years old and below.\n\nSection 2. Curfew Hours — 10:00 PM to 4:00 AM daily.\n\nSection 3. Exceptions — Minors accompanied by parents/guardians, those engaged in legitimate work, and emergencies.",
      enforcement: "PNP Cabanatuan, Barangay Bantay Bayan, CSWDO",
    },
    create: {
      id: "seed-ord-003",
      title: "Establishing Curfew Hours for Minors in Cabanatuan City",
      resolutionNumber: "2024-012",
      series: "S. 2024",
      type: OrdinanceType.CITY,
      status: OrdinanceStatus.APPROVED,
      category: "Youth & Education",
      year: 2024,
      dateEnacted: new Date("2024-06-01"),
      coverage: "Lungsod ng Cabanatuan (All 75 Barangays)",
      tags: ["curfew", "minors", "kabataan", "17 and below", "security", "peace"],
      description: "An ordinance establishing curfew hours for minors aged 17 and below within the territorial jurisdiction of Cabanatuan City from 10:00 PM to 4:00 AM.",
      content:
        "An ordinance establishing curfew hours for minors aged 17 and below within the territorial jurisdiction of Cabanatuan City from 10:00 PM to 4:00 AM.\n\nSection 1. Coverage — All minors aged 17 years old and below.\n\nSection 2. Curfew Hours — 10:00 PM to 4:00 AM daily.\n\nSection 3. Exceptions — Minors accompanied by parents/guardians, those engaged in legitimate work, and emergencies.",
      articles: "Section 1. Coverage — All minors aged 17 years old and below.\n\nSection 2. Curfew Hours — 10:00 PM to 4:00 AM daily.\n\nSection 3. Exceptions — Minors accompanied by parents/guardians, those engaged in legitimate work, and emergencies.",
      penalties:
        "First Offense: Warning and counseling of minor and parent/guardian\nSecond Offense: Community service of 4 hours\nThird Offense: Fine of ₱1,000 for parent/guardian",
      enforcement: "PNP Cabanatuan, Barangay Bantay Bayan, CSWDO",
      signatories: "Hon. Mayor — City Mayor\nSangguniang Panlungsod Members",
      submittedById: lguAdmin.id,
      reviewedById: lguAdmin.id,
      approvedAt: new Date("2024-06-01"),
    },
  });

  await prisma.ordinance.upsert({
    where: { id: "seed-ord-004" },
    update: {
      title: "Pagbabawal ng Maiingay na Muffler at Modified na Tambutso ng mga Sasakyan Lalo na ang mga Motorsiklo",
      resolutionNumber: "681-2024",
      series: "S. 2024",
      category: "Peace & Order",
      year: 2024,
      dateEnacted: new Date("2024-08-26"),
      coverage: "Barangay Camp Tinio, Lungsod ng Cabanatuan",
      tags: ["muffler", "maingay", "tambutso", "motorsiklo", "open pipe", "modified", "noise pollution", "80 decibels"],
      description: "Ordinansang nagbabawal ng maiingay na muffler o modified na tambutso ng mga sasakyan na naglilikha ng tunog higit sa 80 decibels, lalo na sa mga motorsiklo sa Barangay Camp Tinio.",
      articles: "Seksyon 1: Pangkalahatang Tuntunin — Ang lahat ng uri ng sasakyan na bumibiyahe sa loob ng nasasakupan ng barangay ay ipinagbabawal na gumamit ng muffler na nagdudulot ng labis na ingay higit lalo sa mga pangunahing mga lugar: Paaralan, Pribadong Establisyemento, Barangay Hall, Simbahan, at Pagamutan.\n\nSeksyon 2: Depinisyon ng Maingay na Muffler — Ang 'maingay na muffler' ay tinutukoy bilang anumang bahagi ng Sistema ng tambutso ng sasakyan na nagiging sanhi ng tunog na higit sa 80 decibels (Chicken Pipe, Mga tambutso na iminodified, Improvised muffler).\n\nSeksyon 4: Mga Tungkulin ng Alagad ng Barangay — Ang mga alagad ng barangay ay may karapatang humingi ng kopya ng papel may-ari ng motor (OR & CR) na pagkikilanlan ng nasabing sasakyan para nasabing blotter. Maaaring maglagay ng Check Point ang mga alagad ng barangay (Bantay Bayan) sa loob ng nasasakupan ng Barangay.\n\nSeksyon 5: Pagpapatupad — Ang ordinansang ito ay magkakaroon ng bisa isang linggo matapos ang opisyal na pag-anunsyo.",
      enforcement: "Alagad ng Barangay (Bantay Bayan), PNP (Kapulisan), LTO",
    },
    create: {
      id: "seed-ord-004",
      title: "Pagbabawal ng Maiingay na Muffler at Modified na Tambutso ng mga Sasakyan Lalo na ang mga Motorsiklo",
      resolutionNumber: "681-2024",
      series: "S. 2024",
      type: OrdinanceType.BARANGAY,
      status: OrdinanceStatus.APPROVED,
      category: "Peace & Order",
      year: 2024,
      dateEnacted: new Date("2024-08-26"),
      coverage: "Barangay Camp Tinio, Lungsod ng Cabanatuan",
      tags: ["muffler", "maingay", "tambutso", "motorsiklo", "open pipe", "modified", "noise pollution", "80 decibels"],
      description: "Ordinansang nagbabawal ng maiingay na muffler o modified na tambutso ng mga sasakyan na naglilikha ng tunog higit sa 80 decibels, lalo na sa mga motorsiklo sa Barangay Camp Tinio.",
      content:
        "Isang ordinansa tungkol sa pagbabawal ng maiingay na muffler o pagmodified ng mga tambutso ng mga sasakyan na naglilikha ng malakas at maingay na tunog higit sa 80 decibels, lalo na ang mga motorsiklo (single na motor at tricycle), sa loob ng nasasakupan ng Barangay Camp Tinio.\n\nSeksyon 1: Pangkalahatang Tuntunin — Ang lahat ng uri ng sasakyan na bumibiyahe sa loob ng nasasakupan ng barangay ay ipinagbabawal na gumamit ng muffler na nagdudulot ng labis na ingay higit lalo sa mga pangunahing mga lugar: Paaralan, Pribadong Establisyemento, Barangay Hall, Simbahan, at Pagamutan.\n\nSeksyon 2: Depinisyon ng Maingay na Muffler — Ang 'maingay na muffler' ay tinutukoy bilang anumang bahagi ng Sistema ng tambutso ng sasakyan na nagiging sanhi ng tunog na higit sa 80 decibels (Chicken Pipe, Mga tambutso na iminodified, Improvised muffler).\n\nSeksyon 4: Mga Tungkulin ng Alagad ng Barangay — Ang mga alagad ng barangay ay may karapatang humingi ng kopya ng papel may-ari ng motor (OR & CR) na pagkikilanlan ng nasabing sasakyan para nasabing blotter. Maaaring maglagay ng Check Point ang mga alagad ng barangay (Bantay Bayan) sa loob ng nasasakupan ng Barangay.\n\nSeksyon 5: Pagpapatupad — Ang ordinansang ito ay magkakaroon ng bisa isang linggo matapos ang opisyal na pag-anunsyo.",
      articles: "Seksyon 1: Pangkalahatang Tuntunin — Ang lahat ng uri ng sasakyan na bumibiyahe sa loob ng nasasakupan ng barangay ay ipinagbabawal na gumamit ng muffler na nagdudulot ng labis na ingay higit lalo sa mga pangunahing mga lugar: Paaralan, Pribadong Establisyemento, Barangay Hall, Simbahan, at Pagamutan.\n\nSeksyon 2: Depinisyon ng Maingay na Muffler — Ang 'maingay na muffler' ay tinutukoy bilang anumang bahagi ng Sistema ng tambutso ng sasakyan na nagiging sanhi ng tunog na higit sa 80 decibels (Chicken Pipe, Mga tambutso na iminodified, Improvised muffler).\n\nSeksyon 4: Mga Tungkulin ng Alagad ng Barangay — Ang mga alagad ng barangay ay may karapatang humingi ng kopya ng papel may-ari ng motor (OR & CR) na pagkikilanlan ng nasabing sasakyan para nasabing blotter. Maaaring maglagay ng Check Point ang mga alagad ng barangay (Bantay Bayan) sa loob ng nasasakupan ng Barangay.\n\nSeksyon 5: Pagpapatupad — Ang ordinansang ito ay magkakaroon ng bisa isang linggo matapos ang opisyal na pag-anunsyo.",
      penalties:
        "Unang Paglabag: Ipaalis sa kaniya ang nasabing muffler ora mismo / Pagmumultahin ng halagang P500 piso\nPangalawang Paglabag: Pagmumultahin ng halagang P1,000 piso\nPangatlong Paglabag: Kukumpiskahin ng Tanggapan ang nasabing Muffler\n\nAng mga paulit-ulit na paglabag ay maaring magresulta sa mas mataas na multa o di kaya naman ay maaaring ireport sa tanggapan ng Land Transportation Office (LTO) kasama ang Blotter sa barangay.",
      enforcement: "Alagad ng Barangay (Bantay Bayan), PNP (Kapulisan), LTO",
      signatories:
        "Punong Barangay Anita S. Pascual, Kagawad Estrella P. Lucido, Kagawad Eduardo P. Langag, Kagawad Rodolfo SP. Baldava, Kagawad Jerome Y. Cajucom, Kagawad Jenny C. Javier, Kagawad Isidro A. Gayla, Kagawad Marcelo R. Pacun, SK Chairman Mark Lester O. Yee",
      barangayId: campTinio.id,
      submittedById: captainCampTinio.id,
      reviewedById: lguAdmin.id,
      approvedAt: new Date("2024-12-04"),
    },
  });

  // ─── News Items ────────────────────────────────────────────────────────────
  await prisma.newsItem.upsert({
    where: { id: "seed-news-001" },
    update: {},
    create: {
      id: "seed-news-001",
      title: "Bagong Ordinansa Laban sa Pagsusunog ng Basura, Inaprubahan",
      content:
        "Ang Barangay Dionisio S. Garcia ay opisyal nang nag-apruba ng Ordinance No. 003, S. 2024, na nagbabawal sa pagsusunog ng basura sa buong nasasakupan ng barangay. Ang mga lumalabag ay papatawan ng multa mula ₱500 hanggang ₱2,500.",
      category: NewsCategory.BARANGAY,
      isPinned: true,
    },
  });

  await prisma.newsItem.upsert({
    where: { id: "seed-news-002" },
    update: {},
    create: {
      id: "seed-news-002",
      title: "Cabanatuan City Ordinance Hub Officially Launched",
      content:
        "The City Government of Cabanatuan proudly launches the Cabanatuan City Ordinance Information System & AI Citizen Hub — a digital platform making local laws transparent, accessible, and queryable in both Tagalog and English.",
      category: NewsCategory.CITY,
      isPinned: true,
    },
  });

  console.log("✅ Seed completed successfully!");
  console.log(`   • ${barangays.length} barangays`);
  console.log("   • 8 users (admin, captains, secretary, kagawad, and aliases)");
  console.log("   • 4 ordinances");
  console.log("   • 2 news items");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
