-- CreateTable
CREATE TABLE "Pages" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "projectid" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pages" ADD CONSTRAINT "Pages_projectid_fkey" FOREIGN KEY ("projectid") REFERENCES "Projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
