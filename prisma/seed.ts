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
      "Campo Tinio",
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

  // ─── Users ──────────────────────────────────────────────────────────────
  const passwordHash = await hash("password123", 12);

  const lguAdmin = await prisma.user.upsert({
    where: { email: "admin@cabanatuan.gov.ph" },
    update: {},
    create: {
      email: "admin@cabanatuan.gov.ph",
      passwordHash,
      name: "LGU Super Admin",
      role: UserRole.LGU_ADMIN,
    },
  });

  const captain = await prisma.user.upsert({
    where: { email: "captain.garcia@cabanatuan.gov.ph" },
    update: {},
    create: {
      email: "captain.garcia@cabanatuan.gov.ph",
      passwordHash,
      name: "Kap. Juan Garcia",
      role: UserRole.CAPTAIN,
      barangayId: dsGarcia.id,
    },
  });

  const secretary = await prisma.user.upsert({
    where: { email: "secretary.garcia@cabanatuan.gov.ph" },
    update: {},
    create: {
      email: "secretary.garcia@cabanatuan.gov.ph",
      passwordHash,
      name: "Sec. Maria Santos",
      role: UserRole.SECRETARY,
      barangayId: dsGarcia.id,
    },
  });

  const kagawad = await prisma.user.upsert({
    where: { email: "kagawad.garcia@cabanatuan.gov.ph" },
    update: {},
    create: {
      email: "kagawad.garcia@cabanatuan.gov.ph",
      passwordHash,
      name: "Kag. Pedro Reyes",
      role: UserRole.KAGAWAD,
      barangayId: dsGarcia.id,
    },
  });

  // ─── Ordinances (Reference: Brgy D.S. Garcia Ordinance No. 003, S. 2024) ─
  await prisma.ordinance.upsert({
    where: { id: "seed-ord-001" },
    update: {},
    create: {
      id: "seed-ord-001",
      title: "Ordinansang Nagbabawal sa Pagsusunog ng Basura sa Loob ng Barangay Dionisio S. Garcia",
      resolutionNumber: "003",
      series: "S. 2024",
      type: OrdinanceType.BARANGAY,
      status: OrdinanceStatus.APPROVED,
      content:
        "Isang ordinansa na nagbabawal sa pagsusunog ng anumang uri ng basura, plastik, goma, dahon, at iba pang materyales sa loob ng nasasakupan ng Barangay Dionisio S. Garcia, Lungsod ng Kabanatuan, upang mapanatili ang malinis na hangin at maiwasan ang polusyon sa kapaligiran.\n\nSeksyon 1. Layunin — Layunin ng ordinansang ito na ipagbawal ang pagsusunog ng basura sa lahat ng lugar sa loob ng barangay.\n\nSeksyon 2. Sakop — Ang ordinansang ito ay sumasakop sa lahat ng residente, negosyante, at iba pang indibidwal na naninirahan o nagtatrabaho sa Barangay D.S. Garcia.\n\nSeksyon 3. Ipinagbabawal — Ang pagsusunog ng anumang uri ng basura sa tabi ng kalsada, bakanteng lote, bakuran, at iba pang pampublikong lugar ay mahigpit na ipinagbabawal.",
      penalties:
        "Unang Paglabag: Babala at pagpapayo\nPangalawang Paglabag: Multa na ₱500.00\nPangatlong Paglabag: Multa na ₱1,000.00 at community service ng 8 oras\nPang-apat na Paglabag pataas: Multa na ₱2,500.00 at irereklamo sa tanggapan ng City Environment and Natural Resources Office (CENRO)",
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
    update: {},
    create: {
      id: "seed-ord-002",
      title: "Ordinansa para sa Tamang Pagtatapon ng Basura at Segregation sa Barangay D.S. Garcia",
      resolutionNumber: "005",
      series: "S. 2024",
      type: OrdinanceType.BARANGAY,
      status: OrdinanceStatus.APPROVED,
      content:
        "Isang ordinansa na nag-aatas ng tamang pagtatapon at paghihiwalay ng basura (waste segregation) sa lahat ng kabahayan at establisyemento sa Barangay Dionisio S. Garcia.\n\nSeksyon 1. Nararapat na ihiwalay ang basura sa tatlong kategorya: nabubulok (biodegradable), hindi nabubulok (non-biodegradable), at mapanganib (hazardous).\n\nSeksyon 2. Ang bawat kabahayan ay kinakailangang gumamit ng hiwalay na lalagyan para sa bawat uri ng basura.",
      penalties:
        "Unang Paglabag: Babala\nPangalawang Paglabag: Multa na ₱300.00\nPangatlong Paglabag: Multa na ₱1,000.00",
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
    update: {},
    create: {
      id: "seed-ord-003",
      title: "City Ordinance Establishing Curfew Hours for Minors in Cabanatuan City",
      resolutionNumber: "2024-012",
      series: "S. 2024",
      type: OrdinanceType.CITY,
      status: OrdinanceStatus.APPROVED,
      content:
        "An ordinance establishing curfew hours for minors aged 17 and below within the territorial jurisdiction of Cabanatuan City from 10:00 PM to 4:00 AM.\n\nSection 1. Coverage — All minors aged 17 years old and below.\n\nSection 2. Curfew Hours — 10:00 PM to 4:00 AM daily.\n\nSection 3. Exceptions — Minors accompanied by parents/guardians, those engaged in legitimate work, and emergencies.",
      penalties:
        "First Offense: Warning and counseling of minor and parent/guardian\nSecond Offense: Community service of 4 hours\nThird Offense: Fine of ₱1,000 for parent/guardian",
      signatories: "Hon. Mayor — City Mayor\nSangguniang Panlungsod Members",
      submittedById: lguAdmin.id,
      reviewedById: lguAdmin.id,
      approvedAt: new Date("2024-06-01"),
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
  console.log("   • 4 users (admin, captain, secretary, kagawad)");
  console.log("   • 3 ordinances");
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
