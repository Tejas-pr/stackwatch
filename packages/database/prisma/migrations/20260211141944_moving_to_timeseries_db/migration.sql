/*
  Warnings:

  - You are about to drop the `WebsiteTicks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WebsiteTicks" DROP CONSTRAINT "WebsiteTicks_regain_id_fkey";

-- DropForeignKey
ALTER TABLE "WebsiteTicks" DROP CONSTRAINT "WebsiteTicks_website_id_fkey";

-- DropTable
DROP TABLE "WebsiteTicks";

-- DropEnum
DROP TYPE "WebsiteStatus";
