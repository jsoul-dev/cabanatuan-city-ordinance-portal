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
      ordinanceLabel: "ORDINANCE NO. 009 S. 2024",
      title: "Ordinansang nag-aatas sa mga residente na may sariling backyard na magkaroon o gumawa ng 'Backyard Composting'",
      resolutionNumber: "572-2024",
      category: "Environment & Cleanliness",
      year: 2024,
      dateEnacted: new Date("2024-10-09"),
      coverage: "Barangay Bitas",
      tags: ["backyard composting", "basura", "pataba", "segregation", "environment"],
      description: "Ordinansang nag-aatas sa mga residente na may sariling backyard na magkaroon o gumawa ng 'Backyard Composting' sa kanilang lugar upang mabawasan ang bulto ng basurang itinatapon, mapanatili ang pagbubukod-bukod ng basura at upang makapag produce ng pataba na magagamit sa mga halaman at gulayan.",
      articles: "SEKSYON 1: TITULO (Title)\nAng ordinansang ito ay tatawaging \"Ordinansang nag-aatas sa mga residente na may sariling backyard na magkaroon o gumawa ng 'Backyard Composting' sa kanilang lugar upang mabawasan ang bulto ng basurang itinatapon, mapanatili ang pagbubukod-bukod ng basura at upang makapag produce ng pataba na magagamit sa mga halaman at gulayan.\"\n\nSEKSYON 2: SAKOP NG KAPANGYARIHAN / MGA TAONG MAY PANANAGUTAN (Coverage / Persons Liable)\nAng ordinansang ito ay ukol sa lahat ng mga sumusunod:\n2.1 Para sa lahat ng residente ng barangay - Mga lehitimong naninirahan sa barangay.\n2.2 Mga residente na may sariling backyard - Mga naninirahan na may bakuran.\n2.3 Mga boarders/boarding house na may backyard - Mga nangungupahan sa bahay na may bakuran.\n\nSEKSYON 3: BASEHANG LIGAL (Legal Basis)\nAng ordinansang ito ay pinagtibay alinsunod sa batas ng Republika ng Pilipinas R.A. 9003 Ecological Solid Waste Management Act of 2000, ang Sangguniang Barangay ay tumatalima upang ipagtibay sa barangay na nasasakupan ang mga alintuntuning at sumunod sa anumang mga parusa na nakasaad dito.\n\nSEKSYON 4: LAYUNIN (Purpose)\nAng pangunahing layunin ng pagsasabatas ng kautusang ito ay ang mga sumusunod:\n4.1 Nilalayon ng barangay na mapanatili ang wastong pamamahala ng basura,\n4.2 Mapagbukod-bukod ang mga nabubulok sa di-nabubulok\n4.3 Makapag produce ng maraming pataba sa pamamagitan ng composting\n4.4 Makatulong sa mga nag-aalaga ng halaman at gulay na makabawas sa pagbili ng pataba.\n4.5 Protektahan ang kalusugan, panlipunan at moral na kapakanan ng mga naninirahan dito.\n\nSEKSYON 5: KAHULUGAN NG MGA SALITA (Defenition of Terms)\n5.1 Backyard - Sariling bakuran sa likod-bahay.\n5.2 Composting - Pag convert ng organic material patungo sa matabang lupa\n\nSEKSYON 6: MGA IPINAGBABAWAL NA GAWAIN (Prohibited Acts)\nItinakda ang kautusang ito na ipagbawal/ipag-utos sa lahat ng mga tao residente man o hindi na nasa lugar na nasasakupan ng Barangay Bitas ang mga sumusunod na Gawain:\n6.1 Pagtatapon ng basura na hindi magkakabukod.\n6.2 Paglalabas ng mga basura sa hindi oras at araw ng pagkolekta\n6.3 Ilabas lamang ang basurang nakabukod ayon sa araw ng kolekta (Lunes-Nabubulok, Biyernes-Di-Nabubulok at Sabado-Recyclable Materials)\n6.4 Kung meron nang backyard composting, ilagay ang nabubulok sa backyard composting.",
      penalties: "UNANG PAGLABAG:\nWarning o Pagsasabihan\n\nPANGALAWANG PAGLABAG:\nMulta ng halagang hindi bababa sa ₱300.00 na may kasamang isang araw na Community Service o Linis Barangay.\n\nIKATLONG PAGLABAG:\nMulta ng halagang hindi bababa sa ₱500.00 na may kasamang tatlong araw na Community Service o Linis Barangay.",
      enforcement: "Chairman Committee on Environment, SK Chairperson, Mga Barangay Tanod",
    },
    create: {
      id: "seed-ord-001",
      slug: "572-2024",
      ordinanceLabel: "ORDINANCE NO. 009 S. 2024",
      title: "Ordinansang nag-aatas sa mga residente na may sariling backyard na magkaroon o gumawa ng 'Backyard Composting'",
      resolutionNumber: "572-2024",
      series: "S. 2024",
      type: OrdinanceType.BARANGAY,
      status: OrdinanceStatus.APPROVED,
      category: "Environment & Cleanliness",
      year: 2024,
      dateEnacted: new Date("2024-10-09"),
      coverage: "Barangay Bitas",
      tags: ["backyard composting", "basura", "pataba", "segregation", "environment"],
      description: "Ordinansang nag-aatas sa mga residente na may sariling backyard na magkaroon o gumawa ng 'Backyard Composting' sa kanilang lugar upang mabawasan ang bulto ng basurang itinatapon, mapanatili ang pagbubukod-bukod ng basura at upang makapag produce ng pataba na magagamit sa mga halaman at gulayan.",
      content:
        "Isang ordinansa na nag-aatas sa mga residente na may sariling backyard na magkaroon o gumawa ng 'Backyard Composting' sa kanilang lugar upang mabawasan ang bulto ng basurang itinatapon, mapanatili ang pagbubukod-bukod ng basura at upang makapag produce ng pataba na magagamit sa mga halaman at gulayan.",
      articles: "SEKSYON 1: TITULO (Title)\nAng ordinansang ito ay tatawaging \"Ordinansang nag-aatas sa mga residente na may sariling backyard na magkaroon o gumawa ng 'Backyard Composting' sa kanilang lugar upang mabawasan ang bulto ng basurang itinatapon, mapanatili ang pagbubukod-bukod ng basura at upang makapag produce ng pataba na magagamit sa mga halaman at gulayan.\"\n\nSEKSYON 2: SAKOP NG KAPANGYARIHAN / MGA TAONG MAY PANANAGUTAN (Coverage / Persons Liable)\nAng ordinansang ito ay ukol sa lahat ng mga sumusunod:\n2.1 Para sa lahat ng residente ng barangay - Mga lehitimong naninirahan sa barangay.\n2.2 Mga residente na may sariling backyard - Mga naninirahan na may bakuran.\n2.3 Mga boarders/boarding house na may backyard - Mga nangungupahan sa bahay na may bakuran.\n\nSEKSYON 3: BASEHANG LIGAL (Legal Basis)\nAng ordinansang ito ay pinagtibay alinsunod sa batas ng Republika ng Pilipinas R.A. 9003 Ecological Solid Waste Management Act of 2000, ang Sangguniang Barangay ay tumatalima upang ipagtibay sa barangay na nasasakupan ang mga alintuntuning at sumunod sa anumang mga parusa na nakasaad dito.\n\nSEKSYON 4: LAYUNIN (Purpose)\nAng pangunahing layunin ng pagsasabatas ng kautusang ito ay ang mga sumusunod:\n4.1 Nilalayon ng barangay na mapanatili ang wastong pamamahala ng basura,\n4.2 Mapagbukod-bukod ang mga nabubulok sa di-nabubulok\n4.3 Makapag produce ng maraming pataba sa pamamagitan ng composting\n4.4 Makatulong sa mga nag-aalaga ng halaman at gulay na makabawas sa pagbili ng pataba.\n4.5 Protektahan ang kalusugan, panlipunan at moral na kapakanan ng mga naninirahan dito.\n\nSEKSYON 5: KAHULUGAN NG MGA SALITA (Defenition of Terms)\n5.1 Backyard - Sariling bakuran sa likod-bahay.\n5.2 Composting - Pag convert ng organic material patungo sa matabang lupa\n\nSEKSYON 6: MGA IPINAGBABAWAL NA GAWAIN (Prohibited Acts)\nItinakda ang kautusang ito na ipagbawal/ipag-utos sa lahat ng mga tao residente man o hindi na nasa lugar na nasasakupan ng Barangay Bitas ang mga sumusunod na Gawain:\n6.1 Pagtatapon ng basura na hindi magkakabukod.\n6.2 Paglalabas ng mga basura sa hindi oras at araw ng pagkolekta\n6.3 Ilabas lamang ang basurang nakabukod ayon sa araw ng kolekta (Lunes-Nabubulok, Biyernes-Di-Nabubulok at Sabado-Recyclable Materials)\n6.4 Kung meron nang backyard composting, ilagay ang nabubulok sa backyard composting.",
      penalties: "UNANG PAGLABAG:\nWarning o Pagsasabihan\n\nPANGALAWANG PAGLABAG:\nMulta ng halagang hindi bababa sa ₱300.00 na may kasamang isang araw na Community Service o Linis Barangay.\n\nIKATLONG PAGLABAG:\nMulta ng halagang hindi bababa sa ₱500.00 na may kasamang tatlong araw na Community Service o Linis Barangay.",
      enforcement: "Chairman Committee on Environment, SK Chairperson, Mga Barangay Tanod",
      signatories:
        "Joseph E. Sanggalang, Rodel V. Ferrer, Dhonna Mae Y. Matias, Jeffrey S. Reyes, Jason G. Arcillo, Harrey A. Francisco, Charina M. Salenga, Edward M. Pascual, Crizar Joyce V. Basila, Eduardo C. Acuña Jr.",
      barangayId: barangays.find(b => b.name === "Bitas")!.id,
      submittedById: captain.id,
      reviewedById: lguAdmin.id,
      approvedAt: new Date("2024-10-09"),
    },
  });

  await prisma.ordinance.upsert({
    where: { id: "seed-ord-002" },
    update: {
      ordinanceLabel: "ORDINANSA BLG. 05 S. 2024",
      title: "Tamang Pagtatapon ng Basura at Segregation",
      resolutionNumber: "310-2024",
      category: "Environment & Cleanliness",
      year: 2024,
      dateEnacted: new Date("2024-05-20"),
      coverage: "Barangay Dionisio S. Garcia",
      tags: ["basura", "segregation", "biodegradable", "non-biodegradable", "hazardous", "waste"],
      description: "Isang ordinansa na nag-aatas ng tamang pagtatapon at paghihiwalay ng basura (waste segregation) sa lahat ng kabahayan at establisyemento.",
      articles: "Seksyon 1: Kategorisasyon ng Basura\nNararapat na ihiwalay ang basura sa tatlong kategorya: nabubulok (biodegradable), hindi nabubulok (non-biodegradable), at mapanganib (hazardous).\n\nSeksyon 2: Lalagyan ng Basura\nAng bawat kabahayan ay kinakailangang gumamit ng hiwalay na lalagyan para sa bawat uri ng basura.",
      penalties: "UNANG PAGLABAG:\nBabala\n\nPANGALAWANG PAGLABAG:\nMulta na ₱300.00\n\nPANGATLONG PAGLABAG:\nMulta na ₱1,000.00",
      enforcement: "Barangay Waste Management Committee, Bantay Bayan",
    },
    create: {
      id: "seed-ord-002",
      slug: "310-2024",
      ordinanceLabel: "ORDINANSA BLG. 05 S. 2024",
      title: "Tamang Pagtatapon ng Basura at Segregation",
      resolutionNumber: "310-2024",
      series: "S. 2024",
      type: OrdinanceType.BARANGAY,
      status: OrdinanceStatus.APPROVED,
      category: "Environment & Cleanliness",
      year: 2024,
      dateEnacted: new Date("2024-05-20"),
      coverage: "Barangay Dionisio S. Garcia",
      tags: ["basura", "segregation", "biodegradable", "non-biodegradable", "hazardous", "waste"],
      description: "Isang ordinansa na nag-aatas ng tamang pagtatapon at paghihiwalay ng basura (waste segregation) sa lahat ng kabahayan at establisyemento.",
      content:
        "Isang ordinansa na nag-aatas ng tamang pagtatapon at paghihiwalay ng basura (waste segregation) sa lahat ng kabahayan at establisyemento sa Barangay Dionisio S. Garcia.\n\nSeksyon 1. Nararapat na ihiwalay ang basura sa tatlong kategorya: nabubulok (biodegradable), hindi nabubulok (non-biodegradable), at mapanganib (hazardous).\n\nSeksyon 2. Ang bawat kabahayan ay kinakailangang gumamit ng hiwalay na lalagyan para sa bawat uri ng basura.",
      articles: "Seksyon 1: Kategorisasyon ng Basura\nNararapat na ihiwalay ang basura sa tatlong kategorya: nabubulok (biodegradable), hindi nabubulok (non-biodegradable), at mapanganib (hazardous).\n\nSeksyon 2: Lalagyan ng Basura\nAng bawat kabahayan ay kinakailangang gumamit ng hiwalay na lalagyan para sa bawat uri ng basura.",
      penalties: "UNANG PAGLABAG:\nBabala\n\nPANGALAWANG PAGLABAG:\nMulta na ₱300.00\n\nPANGATLONG PAGLABAG:\nMulta na ₱1,000.00",
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
      ordinanceLabel: "ORDINANCE NO. 012 S. 2024",
      title: "Establishing Curfew Hours for Minors",
      resolutionNumber: "450-2024",
      category: "Youth & Education",
      year: 2024,
      dateEnacted: new Date("2024-06-01"),
      coverage: "Lungsod ng Cabanatuan",
      tags: ["curfew", "minors", "kabataan", "17 and below", "security", "peace"],
      description: "An ordinance establishing curfew hours for minors aged 17 and below within the territorial jurisdiction of Cabanatuan City from 10:00 PM to 4:00 AM.",
      articles: "Section 1: Coverage\nAll minors aged 17 years old and below.\n\nSection 2: Curfew Hours\n10:00 PM to 4:00 AM daily.\n\nSection 3: Exceptions\nMinors accompanied by parents/guardians, those engaged in legitimate work, and emergencies.",
      penalties: "FIRST OFFENSE:\nWarning and counseling of minor and parent/guardian\n\nSECOND OFFENSE:\nCommunity service of 4 hours\n\nTHIRD OFFENSE:\nFine of ₱1,000 for parent/guardian",
      enforcement: "PNP Cabanatuan, Barangay Bantay Bayan, CSWDO",
    },
    create: {
      id: "seed-ord-003",
      slug: "450-2024",
      ordinanceLabel: "ORDINANCE NO. 012 S. 2024",
      title: "Establishing Curfew Hours for Minors",
      resolutionNumber: "450-2024",
      series: "S. 2024",
      type: OrdinanceType.CITY,
      status: OrdinanceStatus.APPROVED,
      category: "Youth & Education",
      year: 2024,
      dateEnacted: new Date("2024-06-01"),
      coverage: "Lungsod ng Cabanatuan",
      tags: ["curfew", "minors", "kabataan", "17 and below", "security", "peace"],
      description: "An ordinance establishing curfew hours for minors aged 17 and below within the territorial jurisdiction of Cabanatuan City from 10:00 PM to 4:00 AM.",
      content:
        "An ordinance establishing curfew hours for minors aged 17 and below within the territorial jurisdiction of Cabanatuan City from 10:00 PM to 4:00 AM.\n\nSection 1. Coverage — All minors aged 17 years old and below.\n\nSection 2. Curfew Hours — 10:00 PM to 4:00 AM daily.\n\nSection 3. Exceptions — Minors accompanied by parents/guardians, those engaged in legitimate work, and emergencies.",
      articles: "Section 1: Coverage\nAll minors aged 17 years old and below.\n\nSection 2: Curfew Hours\n10:00 PM to 4:00 AM daily.\n\nSection 3: Exceptions\nMinors accompanied by parents/guardians, those engaged in legitimate work, and emergencies.",
      penalties: "FIRST OFFENSE:\nWarning and counseling of minor and parent/guardian\n\nSECOND OFFENSE:\nCommunity service of 4 hours\n\nTHIRD OFFENSE:\nFine of ₱1,000 for parent/guardian",
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
      ordinanceLabel: "ORDINANSA BLG. 02 S. 2024",
      title: "Pagbabawal ng Maiingay na Muffler at Modified na Tambutso ng mga Sasakyan Lalo na ang mga Motorsiklo",
      resolutionNumber: "681-2024",
      series: "S. 2024",
      category: "Peace & Order",
      year: 2024,
      dateEnacted: new Date("2024-08-26"),
      coverage: "Barangay Camp Tinio",
      tags: ["muffler", "maingay", "tambutso", "motorsiklo", "open pipe", "modified", "noise pollution", "80 decibels"],
      description: "Ordinansang nagbabawal ng maiingay na muffler o modified na tambutso ng mga sasakyan na naglilikha ng tunog higit sa 80 decibels, lalo na sa mga motorsiklo sa Barangay Camp Tinio.",
      articles: "SEKSYON 1: PANGKALAHATANG TUNTUNIN\nAng lahat ng uri ng sasakyan na bumibiyahe sa loob ng nasasakupan ng barangay ay ipinagbabawal na gumamit ng muffler na nagdudulot ng labis na ingay. Higit lalo na sa mga pangunahing mga lugar;\n- Paaralan\n- Pribadong Establisyemento\n- Barangay Hall\n- Simbahan\n- Pagamutan\n\nSEKSYON 2: DEPINISYON NG MAINGAY NA MUFFLER\nAng 'maingay na muffler' ay tinutukoy bilang anumang bahagi ng Sistema ng tambutso ng sasakyan na nagiging sanhi ng tunog na higit sa 80 decibels.\n- Chicken Pipe\n- Mga tambutso na iminodified\n- Improvised muffler\n\nSEKSYON 3: KALAKIP NA PARUSA\n1. Ang sinumang lalabag sa ordinansang ito ay maaaring ;\n- Ipaalis sa kaniya ang nasabing muffler ora mismo - Unang Paglabag\n- Pagmumultahin ng halagang P 500 piso - Pangalawang Paglabag\n- Kukumpiskahin ng Tanggapan ang nasabing Muffler - Pangatlong Paglabag\n2. Ang mga paulit-ulit na paglabag ay maaring magresulta sa mas mataas na multa o di kaya naman ay maaaring ireport sa tanggapan ng Land Transportation Office (LTO) kasama ang Blotter sa barangay upang mabigyan ng mas mataas na parusa ang mga violators nito.\n3. Sa mga pagawaan at tindahan ng mga piyesa, lalo na ang mga nagsasagawa ng pag-iimprovised, maaari ring mapadalhan ng palibot-liham o di kaya naman a warning dahil sa kasama rin sila sa nilalaman ng ipinasang ordinansa.\n\nSEKSYON 4: MGA TUNGKULIN NG ALAGAD NG BARANGAY\nAng mga alagad ng barangay ay may karapatang humingi ng kopya ng papel may-ari ng motor (OR & CR) na pagkikilanlan ng nasabing sasakyan para nasabing blotter.\n\nAng mga alagad ng barangay (Bantay Bayan) at mga awtoridad (Kapulisan) may tungkulin na magsagawa ng mga inspeksyon at magpatupad ng ordinansang ito.\n\nMaaaring maglagay ng Check Point ang mga alagad ng barangay (Bantay Bayan) sa loob ng nasasakupan ng Barangay.\n\nMaaari parahin o patigilin ng mga alagad ng barangay (Bantay Bayan) ang sinomang aktong lumalabag sa nasabing Ordinansa.\n\nTungkulin ng mga alagad ng Barangay (Bantay Bayan) ang mag bigay ng sipi o kopya ng Ordinansa sa mga establisyemento at mga tindahan ng mga piyesa ng motor lalo na sa mga pwesto ng pagawaan ng mga naturang motor.\n\nSEKSYON 5: PAGPAPATUPAD\nAng ordinansang ito ay magkakaroon ng bisa isang linggo matapos ang opisyal na pag-anunsyo.\n\nSEKSYON 6: PANG WAKAS NA TUNTUNIN\nAng mga nakaraang ordinansa na salungat sa ordinansang ito ay masususpinde.\n\nInaprubahan ng Sangguniang Barangay ng Camp Tinio noong AGOSTO 26, 2024 kasabay ng regular na pagpupulong na ginanap sa bulwagan ng pamahalaang barangay ng Camp Tinio, Lungsod ng Kabanatuan, Lalawigan ng Nuweba Eciha.",
      enforcement: "Alagad ng Barangay (Bantay Bayan), PNP (Kapulisan), LTO",
    },
    create: {
      id: "seed-ord-004",
      slug: "681-2024",
      ordinanceLabel: "ORDINANSA BLG. 02 S. 2024",
      title: "Pagbabawal ng Maiingay na Muffler at Modified na Tambutso ng mga Sasakyan Lalo na ang mga Motorsiklo",
      resolutionNumber: "681-2024",
      series: "S. 2024",
      type: OrdinanceType.BARANGAY,
      status: OrdinanceStatus.APPROVED,
      category: "Peace & Order",
      year: 2024,
      dateEnacted: new Date("2024-08-26"),
      coverage: "Barangay Camp Tinio",
      tags: ["muffler", "maingay", "tambutso", "motorsiklo", "open pipe", "modified", "noise pollution", "80 decibels"],
      description: "Ordinansang nagbabawal ng maiingay na muffler o modified na tambutso ng mga sasakyan na naglilikha ng tunog higit sa 80 decibels, lalo na sa mga motorsiklo sa Barangay Camp Tinio.",
      content:
        "Isang ordinansa tungkol sa pagbabawal ng maiingay na muffler o pagmodified ng mga tambutso ng mga sasakyan na naglilikha ng malakas at maingay na tunog higit sa 80 decibels, lalo na ang mga motorsiklo (single na motor at tricycle), sa loob ng nasasakupan ng Barangay Camp Tinio.\n\nSEKSYON 1: PANGKALAHATANG TUNTUNIN\nAng lahat ng uri ng sasakyan na bumibiyahe sa loob ng nasasakupan ng barangay ay ipinagbabawal na gumamit ng muffler na nagdudulot ng labis na ingay. Higit lalo na sa mga pangunahing mga lugar;\n- Paaralan\n- Pribadong Establisyemento\n- Barangay Hall\n- Simbahan\n- Pagamutan\n\nSEKSYON 2: DEPINISYON NG MAINGAY NA MUFFLER\nAng 'maingay na muffler' ay tinutukoy bilang anumang bahagi ng Sistema ng tambutso ng sasakyan na nagiging sanhi ng tunog na higit sa 80 decibels.\n- Chicken Pipe\n- Mga tambutso na iminodified\n- Improvised muffler\n\nSEKSYON 4: MGA TUNGKULIN NG ALAGAD NG BARANGAY\nAng mga alagad ng barangay ay may karapatang humingi ng kopya ng papel may-ari ng motor (OR & CR) na pagkikilanlan ng nasabing sasakyan para nasabing blotter.\n\nAng mga alagad ng barangay (Bantay Bayan) at mga awtoridad (Kapulisan) may tungkulin na magsagawa ng mga inspeksyon at magpatupad ng ordinansang ito.\n\nMaaaring maglagay ng Check Point ang mga alagad ng barangay (Bantay Bayan) sa loob ng nasasakupan ng Barangay.\n\nMaaari parahin o patigilin ng mga alagad ng barangay (Bantay Bayan) ang sinomang aktong lumalabag sa nasabing Ordinansa.\n\nTungkulin ng mga alagad ng Barangay (Bantay Bayan) ang mag bigay ng sipi o kopya ng Ordinansa sa mga establisyemento at mga tindahan ng mga piyesa ng motor lalo na sa mga pwesto ng pagawaan ng mga naturang motor.\n\nSEKSYON 5: PAGPAPATUPAD\nAng ordinansang ito ay magkakaroon ng bisa isang linggo matapos ang opisyal na pag-anunsyo.\n\nSEKSYON 6: PANG WAKAS NA TUNTUNIN\nAng mga nakaraang ordinansa na salungat sa ordinansang ito ay masususpinde.\n\nInaprubahan ng Sangguniang Barangay ng Camp Tinio noong AGOSTO 26, 2024 kasabay ng regular na pagpupulong na ginanap sa bulwagan ng pamahalaang barangay ng Camp Tinio, Lungsod ng Kabanatuan, Lalawigan ng Nuweba Eciha.",
      articles: "SEKSYON 1: PANGKALAHATANG TUNTUNIN\nAng lahat ng uri ng sasakyan na bumibiyahe sa loob ng nasasakupan ng barangay ay ipinagbabawal na gumamit ng muffler na nagdudulot ng labis na ingay. Higit lalo na sa mga pangunahing mga lugar;\n- Paaralan\n- Pribadong Establisyemento\n- Barangay Hall\n- Simbahan\n- Pagamutan\n\nSEKSYON 2: DEPINISYON NG MAINGAY NA MUFFLER\nAng 'maingay na muffler' ay tinutukoy bilang anumang bahagi ng Sistema ng tambutso ng sasakyan na nagiging sanhi ng tunog na higit sa 80 decibels.\n- Chicken Pipe\n- Mga tambutso na iminodified\n- Improvised muffler\n\nSEKSYON 3: KALAKIP NA PARUSA\n1. Ang sinumang lalabag sa ordinansang ito ay maaaring ;\n- Ipaalis sa kaniya ang nasabing muffler ora mismo - Unang Paglabag\n- Pagmumultahin ng halagang P 500 piso - Pangalawang Paglabag\n- Kukumpiskahin ng Tanggapan ang nasabing Muffler - Pangatlong Paglabag\n2. Ang mga paulit-ulit na paglabag ay maaring magresulta sa mas mataas na multa o di kaya naman ay maaaring ireport sa tanggapan ng Land Transportation Office (LTO) kasama ang Blotter sa barangay upang mabigyan ng mas mataas na parusa ang mga violators nito.\n3. Sa mga pagawaan at tindahan ng mga piyesa, lalo na ang mga nagsasagawa ng pag-iimprovised, maaari ring mapadalhan ng palibot-liham o di kaya naman a warning dahil sa kasama rin sila sa nilalaman ng ipinasang ordinansa.\n\nSEKSYON 4: MGA TUNGKULIN NG ALAGAD NG BARANGAY\nAng mga alagad ng barangay ay may karapatang humingi ng kopya ng papel may-ari ng motor (OR & CR) na pagkikilanlan ng nasabing sasakyan para nasabing blotter.\n\nAng mga alagad ng barangay (Bantay Bayan) at mga awtoridad (Kapulisan) may tungkulin na magsagawa ng mga inspeksyon at magpatupad ng ordinansang ito.\n\nMaaaring maglagay ng Check Point ang mga alagad ng barangay (Bantay Bayan) sa loob ng nasasakupan ng Barangay.\n\nMaaari parahin o patigilin ng mga alagad ng barangay (Bantay Bayan) ang sinomang aktong lumalabag sa nasabing Ordinansa.\n\nTungkulin ng mga alagad ng Barangay (Bantay Bayan) ang mag bigay ng sipi o kopya ng Ordinansa sa mga establisyemento at mga tindahan ng mga piyesa ng motor lalo na sa mga pwesto ng pagawaan ng mga naturang motor.\n\nSEKSYON 5: PAGPAPATUPAD\nAng ordinansang ito ay magkakaroon ng bisa isang linggo matapos ang opisyal na pag-anunsyo.\n\nSEKSYON 6: PANG WAKAS NA TUNTUNIN\nAng mga nakaraang ordinansa na salungat sa ordinansang ito ay masususpinde.\n\nInaprubahan ng Sangguniang Barangay ng Camp Tinio noong AGOSTO 26, 2024 kasabay ng regular na pagpupulong na ginanap sa bulwagan ng pamahalaang barangay ng Camp Tinio, Lungsod ng Kabanatuan, Lalawigan ng Nuweba Eciha.",
      enforcement: "Alagad ng Barangay (Bantay Bayan), PNP (Kapulisan), LTO",
      signatories:
        "Punong Barangay Anita S. Pascual, Kagawad Estrella P. Lucido, Kagawad Eduardo P. Langag, Kagawad Rodolfo SP. Baldava, Kagawad Jerome Y. Cajucom, Kagawad Jenny C. Javier, Kagawad Isidro A. Gayla, Kagawad Marcelo R. Pacun, SK Chairman Mark Lester O. Yee",
      pdfUrl: "data:application/pdf;base64,JVBERi0xLjEKJcKlwrHDqwoKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCgoyIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2VzCiAgICAgL0tpZHMgWzMgMCBSXQogICAgIC9Db3VudCAxCiAgICAgL01lZGlhQm94IFswIDAgMzAwIDE0NF0KICA+PgplbmRvYmoKCjMgMCBvYmoKICA8PCAgL1R5cGUgL1BhZ2UKICAgICAgL1BhcmVudCAyIDAgUgogICAgICAvUmVzb3VyY2VzCiAgICAgICA8PCAvRm9udAogICAgICAgICAgIDw8IC9GMQogICAgICAgICAgICAgICA8PCAvVHlwZSAvRm9udAogICAgICAgICAgICAgICAgICAvU3VidHlwZSAvVHlwZTEKICAgICAgICAgICAgICAgICAgL0Jhc2VGb250IC9UaW1lcy1Sb21hbgogICAgICAgICAgICAgICA+PgogICAgICAgICAgID4+CiAgICAgICA+PgogICAgICAvQ29udGVudHMgNCAwIFIKICA+PgplbmRvYmoKCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDU1ID4+CnN0cmVhbQogIEJUCiAgICAvRjEgMTggVGYKICAgIDAgMCAwIHJnCiAgICA1MCA1MCBUZAogICAgKEhlbGxvIFdvcmxkKSBUagogIEVUCmVuZHN0cmVhbQplbmRvYmoKCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxOCAwMDAwMCBuIAowMDAwMDAwMDc3IDAwMDAwIG4gCjAwMDAwMDAxNzggMDAwMDAgbiAKMDAwMDAwMDQ1NyAwMDAwMCBuIAp0cmFpbGVyCiAgPDwgIC9Sb290IDEgMCBSCiAgICAgIC9TaXplIDUKICA+PgpzdGFydHhyZWYKNTY1CiUlRU9GCg==",
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
