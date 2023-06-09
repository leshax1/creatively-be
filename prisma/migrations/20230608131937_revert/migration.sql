/*
  Warnings:

  - You are about to drop the column `nan` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `omg` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `un` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_omg_key";

-- DropIndex
DROP INDEX "users_un_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "nan",
DROP COLUMN "omg",
DROP COLUMN "un",
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT;
