-- CreateEnum
CREATE TYPE "public"."TokenScope" AS ENUM ('read', 'write');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "tokenVersion" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Chat" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "chatname" VARCHAR(200) NOT NULL,
    "chatlog" JSONB NOT NULL,
    "model" VARCHAR(100),
    "sourceUrl" VARCHAR(2000),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "tokenPrefix" VARCHAR(12) NOT NULL,
    "scopes" "public"."TokenScope"[] DEFAULT ARRAY['read', 'write']::"public"."TokenScope"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "lastUsedAt" TIMESTAMP(3),
    "revoked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "public"."User"("username");

-- CreateIndex
CREATE INDEX "Chat_userId_createdAt_idx" ON "public"."Chat"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Chat_createdAt_idx" ON "public"."Chat"("createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "UserToken_tokenHash_key" ON "public"."UserToken"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "UserToken_tokenPrefix_key" ON "public"."UserToken"("tokenPrefix");

-- CreateIndex
CREATE INDEX "UserToken_userId_idx" ON "public"."UserToken"("userId");

-- CreateIndex
CREATE INDEX "UserToken_revoked_expiresAt_idx" ON "public"."UserToken"("revoked", "expiresAt");

-- AddForeignKey
ALTER TABLE "public"."Chat" ADD CONSTRAINT "Chat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserToken" ADD CONSTRAINT "UserToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
