/*
  Warnings:

  - You are about to drop the column `email2` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[omg]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `omg` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_email2_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "email2",
ADD COLUMN     "omg" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_omg_key" ON "users"("omg");
