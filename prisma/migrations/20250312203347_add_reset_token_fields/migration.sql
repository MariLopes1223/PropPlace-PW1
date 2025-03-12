-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN "resetToken" TEXT;
ALTER TABLE "usuarios" ADD COLUMN "resetTokenExpiry" DATETIME;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_imagens" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nomeImagem" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "imovelId" TEXT,
    "userId" TEXT,
    CONSTRAINT "imagens_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imoveis" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "imagens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_imagens" ("createdAt", "id", "imovelId", "nomeImagem", "updatedAt", "userId") SELECT "createdAt", "id", "imovelId", "nomeImagem", "updatedAt", "userId" FROM "imagens";
DROP TABLE "imagens";
ALTER TABLE "new_imagens" RENAME TO "imagens";
CREATE UNIQUE INDEX "imagens_nomeImagem_key" ON "imagens"("nomeImagem");
CREATE UNIQUE INDEX "imagens_userId_key" ON "imagens"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
