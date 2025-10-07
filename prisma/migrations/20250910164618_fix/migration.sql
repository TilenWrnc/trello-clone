-- CreateTable
CREATE TABLE "public"."_WorkspaceMember" (
    "A" TEXT NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_WorkspaceMember_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_WorkspaceMember_B_index" ON "public"."_WorkspaceMember"("B");

-- AddForeignKey
ALTER TABLE "public"."_WorkspaceMember" ADD CONSTRAINT "_WorkspaceMember_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_WorkspaceMember" ADD CONSTRAINT "_WorkspaceMember_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
