/*
  Warnings:

  - The values [RENDER] on the enum `RepresentationUsage` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
ALTER TYPE "RepresentationFormat" ADD VALUE 'UNITY';

-- AlterEnum
ALTER TYPE "RepresentationType" ADD VALUE 'GAME_ASSET';

-- AlterEnum
BEGIN;
CREATE TYPE "RepresentationUsage_new" AS ENUM ('THUMBNAIL', 'PREVIEW', 'DOWNLOAD', 'DETAIL_BG');
ALTER TABLE "Representation" ALTER COLUMN "usage" TYPE "RepresentationUsage_new" USING ("usage"::text::"RepresentationUsage_new");
ALTER TYPE "RepresentationUsage" RENAME TO "RepresentationUsage_old";
ALTER TYPE "RepresentationUsage_new" RENAME TO "RepresentationUsage";
DROP TYPE "RepresentationUsage_old";
COMMIT;
