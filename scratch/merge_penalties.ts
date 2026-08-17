import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const ordinances = await prisma.ordinance.findMany({
    where: {
      penalties: {
        not: null
      }
    }
  });

  for (const ord of ordinances) {
    if (ord.penalties && ord.penalties.trim().length > 0) {
      const isTagalog = ord.articles?.toLowerCase().includes('seksyon') || ord.content?.toLowerCase().includes('seksyon');
      
      // Attempt to find the last section number to increment it.
      let nextSection = 1;
      if (ord.articles) {
        const matches = [...ord.articles.matchAll(/Seksyon\s+(\d+)|Section\s+(\d+)|SEKSYON\s+(\d+)|SECTION\s+(\d+)/gi)];
        if (matches.length > 0) {
          const lastMatch = matches[matches.length - 1];
          const num = parseInt(lastMatch[1] || lastMatch[2] || lastMatch[3] || lastMatch[4]);
          if (!isNaN(num)) {
            nextSection = num + 1;
          }
        }
      }

      const sectionTitle = isTagalog 
        ? `\n\nSEKSYON ${nextSection}: MGA PARUSA (Penalties)\n` 
        : `\n\nSection ${nextSection}: Penalties\n`;
      
      const updatedArticles = (ord.articles || "") + sectionTitle + ord.penalties;

      await prisma.ordinance.update({
        where: { id: ord.id },
        data: {
          articles: updatedArticles,
          penalties: null,
        }
      });
      console.log(`Updated ordinance ${ord.slug}`);
    }
  }

  console.log("Done updating penalties.");
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
