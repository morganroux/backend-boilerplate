-- CreateTable
CREATE TABLE "test_1" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "test_1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_2" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "test1Id" TEXT,

    CONSTRAINT "test_2_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "test_2" ADD CONSTRAINT "test_2_test1Id_fkey" FOREIGN KEY ("test1Id") REFERENCES "test_1"("id") ON DELETE SET NULL ON UPDATE CASCADE;
