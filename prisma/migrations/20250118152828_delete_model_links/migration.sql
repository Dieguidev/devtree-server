/*
  Warnings:

  - You are about to drop the `links` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `links` DROP FOREIGN KEY `Links_userId_fkey`;

-- AlterTable
ALTER TABLE `user` ALTER COLUMN `links` DROP DEFAULT;

-- DropTable
DROP TABLE `links`;
