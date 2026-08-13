import "dotenv/config";
import { prisma } from './src/lib/prisma';

async function main() {
  console.log("Starting DB cleanup...");
  
  // 1. Find all barangays that do NOT have any users associated
  console.log("Finding unused barangays...");
  const unusedBarangays = await prisma.barangay.findMany({
    where: {
      users: {
        none: {}
      },
      ordinances: {
        none: {}
      }
    }
  });
  console.log(`Found ${unusedBarangays.length} unused barangays.`);

  if (unusedBarangays.length > 0) {
    const ids = unusedBarangays.map(b => b.id);
    const deletedBarangays = await prisma.barangay.deleteMany({
      where: {
        id: { in: ids }
      }
    });
    console.log(`Deleted ${deletedBarangays.count} unused barangays.`);
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })
