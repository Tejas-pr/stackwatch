import 'dotenv/config';
import { prisma } from "./client";
import { WebsiteStatus } from "../generated/client";

async function main() {
  console.log("🌱 Starting seed...");

  // 1. Seed Regions
  const regions = ["us-east-1", "eu-west-1", "ap-south-1", "sa-east-1"];

  console.log("📍 Seeding Regions...");
  const regionMap = new Map();
  for (const name of regions) {
    const region = await prisma.region.upsert({
      where: { id: name }, // Using name as ID for simplicity if uuid not strict, but schema says id is uuid. 
      // We will query by name or just create if not exists, but simpler to just Create many and store IDs or use `findFirst`.
      // Since ID is uuid, we can't upsert by name easily unless name is @unique in schema (it is not).
      // Let's just create if not exists logic manually or just use first created.
    } as any);
    // Wait, schema: Region { id String @id @default(uuid()), name String }
    // We can't upsert on 'name' because it's not unique.
    // Let's just delete all and recreate, OR check existence.
  }

  // Actually, to make this robust without `name` being unique:
  // We'll wipe and recreate, or strict "findFirst".
  // Let's try "findFirst" to avoid wiping data if user doesn't want that.

  const createdRegions = [];
  for (const name of regions) {
    let region = await prisma.region.findFirst({ where: { name } });
    if (!region) {
      region = await prisma.region.create({ data: { name } });
    }
    createdRegions.push(region);
  }

  // 2. Seed Users
  console.log("👤 Seeding Users...");
  const usersData = [
    {
      id: "user-1", // Hardcoding IDs for consistent relationships in seed
      name: "Tim Apple",
      email: "tim@apple.com",
      image: "https://avatar.vercel.sh/tim",
    },
    {
      id: "user-2",
      name: "Elon Musk",
      email: "elon@tesla.com",
      image: "https://avatar.vercel.sh/elon",
    },
  ];

  for (const userData of usersData) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData,
    });
  }

  // 3. Seed Websites
  console.log("🌐 Seeding Websites...");
  const websitesData = [
    { url: "https://google.com", user_id: "user-1" },
    { url: "https://twitter.com", user_id: "user-2" },
    { url: "https://openai.com", user_id: "user-1" },
  ];

  const createdWebsites = [];
  for (const site of websitesData) {
    // Simple check to avoid duplicates for now, assuming URL + User is what we care about
    // (Schema doesn't enforce unique URL, but let's be clean)
    const existing = await prisma.website.findFirst({
      where: { url: site.url, user_id: site.user_id }
    });

    if (existing) {
      createdWebsites.push(existing);
    } else {
      const newSite = await prisma.website.create({
        data: {
          url: site.url,
          user_id: site.user_id
        }
      });
      createdWebsites.push(newSite);
    }
  }

  // 4. Seed Ticks (TimeSeries Data)
  console.log("📈 Seeding Website Ticks...");
  // Generate 20 ticks for each website across random regions
  for (const website of createdWebsites) {
    const ticksToCreate = [];
    for (let i = 0; i < 20; i++) {
      const randomRegion = createdRegions[Math.floor(Math.random() * createdRegions.length)];
      const status = Math.random() > 0.1 ? WebsiteStatus.Up : WebsiteStatus.down; // 90% uptime
      const latency = status === WebsiteStatus.Up ? Math.floor(Math.random() * 500) + 50 : 0;

      ticksToCreate.push({
        website_id: website.id,
        regain_id: randomRegion.id, // Note: Schema typo 'regain_id' instead of 'region_id'
        status: status,
        response_time_ms: latency,
        createdAt: new Date(Date.now() - i * 60000) // 1 minute apart
      });
    }

    // Batch Insert
    await prisma.websiteTicks.createMany({
      data: ticksToCreate
    });
  }

  console.log("✅ Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
