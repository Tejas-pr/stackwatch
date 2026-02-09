import { prisma, WebsiteStatus } from "./client";
require("dotenv").config();

async function main() {
  const connectionString = process.env.DATABASE_URL;

  console.log("connectionString", connectionString);
  console.log("🌱 Seeding database...");

  const user = await prisma.user.upsert({
    where: { id: "user_tejas" },
    update: {},
    create: {
      id: "user_tejas",
      name: "Tejas",
      email: "tejas@example.com",
      emailVerified: true
    }
  });

  const usa = await prisma.region.upsert({
    where: { id: "region_usa" },
    update: {},
    create: { id: "region_usa", name: "USA" }
  });

  const india = await prisma.region.upsert({
    where: { id: "region_india" },
    update: {},
    create: { id: "region_india", name: "INDIA" }
  });

  const google = await prisma.website.upsert({
    where: { id: "site_google" },
    update: {},
    create: {
      id: "site_google",
      url: "https://google.com",
      user_id: user.id
    }
  });

  await prisma.websiteTicks.create({
    data: {
      website_id: google.id,
      regain_id: usa.id,
      response_time_ms: 120,
      status: WebsiteStatus.Up
    }
  });

  console.log("✅ Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
