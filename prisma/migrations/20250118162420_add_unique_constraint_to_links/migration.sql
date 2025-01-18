/*
  Warnings:

  - A unique constraint covering the columns `[userId,name]` on the table `Links` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Links_userId_name_key` ON `Links`(`userId`, `name`);