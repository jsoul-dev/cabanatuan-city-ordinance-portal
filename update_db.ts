import { prisma } from "./src/lib/prisma";

async function main() {
  const ords = await prisma.ordinance.findMany({
    where: { resolutionNumber: "681-2024" }
  });

  if (ords.length === 0) {
    console.log("Ordinance 681-2024 not found");
  }

  for (const ord of ords) {
    let articles = ord.articles || "";
    
    // Check if SEKSYON 4 is incomplete
    if (!articles.includes("Tungkulin ng mga alagad ng Barangay (Bantay Bayan) ang mag bigay ng sipi")) {
      console.log(`Fixing SEKSYON 4 for ${ord.id}`);
      
      const toAppend = `
SEKSYON 4: MGA TUNGKULIN NG ALAGAD NG BARANGAY
Ang mga alagad ng barangay ay may karapatang humingi ng kopya ng papel may-ari ng motor (OR & CR) na pagkikilanlan ng nasabing sasakyan para nasabing blotter.

Ang mga alagad ng barangay (Bantay Bayan) at mga awtoridad (Kapulisan) may tungkulin na magsagawa ng mga inspeksyon at magpatupad ng ordinansang ito.

Maaaring maglagay ng Check Point ang mga alagad ng barangay (Bantay Bayan) sa loob ng nasasakupan ng Barangay.

Maaari parahin o patigilin ng mga alagad ng barangay (Bantay Bayan) ang sinomang aktong lumalabag sa nasabing Ordinansa.

Tungkulin ng mga alagad ng Barangay (Bantay Bayan) ang mag bigay ng sipi o kopya ng Ordinansa sa mga establisyemento at mga tindahan ng mga piyesa ng motor lalo na sa mga pwesto ng pagawaan ng mga naturang motor.

SEKSYON 5: PAGPAPATUPAD
Ang ordinansang ito ay magkakaroon ng bisa isang linggo matapos ang opisyal na pag-anunsyo.

SEKSYON 6: PANG WAKAS NA TUNTUNIN
Ang mga nakaraang ordinansa na salungat sa ordinansang ito ay masususpinde.

Inaprubahan ng Sangguniang Barangay ng Camp Tinio noong AGOSTO 26, 2024 kasabay ng regular na pagpupulong na ginanap sa bulwagan ng pamahalaang barangay ng Camp Tinio, Lungsod ng Kabanatuan, Lalawigan ng Nuweba Eciha.`;

      const s4Index = articles.indexOf("SEKSYON 4");
      if (s4Index !== -1) {
        articles = articles.substring(0, s4Index) + toAppend;
      } else {
        articles += toAppend;
      }

      await prisma.ordinance.update({
        where: { id: ord.id },
        data: { articles }
      });
      console.log(`Updated articles for ${ord.id}`);
    } else {
        console.log(`SEKSYON 4 already complete for ${ord.id}`);
    }
  }

  // Also fix 005-2024 url slug if it exists
  const wrongSlugOrd = await prisma.ordinance.findFirst({
    where: { slug: "005-2024" }
  });

  if (wrongSlugOrd && wrongSlugOrd.resolutionNumber === "310-2024") {
    await prisma.ordinance.update({
      where: { id: wrongSlugOrd.id },
      data: { slug: "310-2024" }
    });
    console.log("Updated slug 005-2024 to 310-2024");
  } else {
    console.log("Slug 005-2024 not found or resolutionNumber is not 310-2024");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
