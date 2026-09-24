-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('HSE_OFFICER', 'FIELD_SUPERVISOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('NEAR_MISS', 'UNSAFE_ACT', 'UNSAFE_CONDITION', 'INCIDENT');

-- CreateEnum
CREATE TYPE "SifClass" AS ENUM ('NON_SIF', 'SIF_POTENTIAL', 'HIGH_SIF', 'CRITICAL_SIF');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'VERIFIED');

-- CreateEnum
CREATE TYPE "ReviewDecision" AS ENUM ('CONFIRMED', 'OVERRIDDEN');

-- CreateEnum
CREATE TYPE "BarrierClass" AS ENUM ('HARDWARE', 'ADMINISTRATIVE', 'BEHAVIORAL');

-- CreateEnum
CREATE TYPE "BarrierTier" AS ENUM ('L1', 'L2', 'L3');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "siteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Site" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Site_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "lat" DECIMAL(10,7),
    "lng" DECIMAL(10,7),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "reportCode" TEXT NOT NULL,
    "type" "ReportType" NOT NULL,
    "shift" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "freeText" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LifeSavingRule" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "area" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LifeSavingRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportLsr" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "lifeSavingRuleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReportLsr_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Barrier" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "class" "BarrierClass" NOT NULL,
    "tier" "BarrierTier" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Barrier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportBarrierGap" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "barrierId" TEXT NOT NULL,
    "evidence" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReportBarrierGap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiInference" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "sifClass" "SifClass" NOT NULL,
    "confidence" DECIMAL(5,4) NOT NULL,
    "modelVersion" TEXT NOT NULL,
    "topDrivers" JSONB NOT NULL,
    "embedding" vector(768),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiInference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatternCluster" (
    "id" TEXT NOT NULL,
    "clusterCode" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "trend" TEXT NOT NULL,
    "whereSummary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatternCluster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClusterReport" (
    "id" TEXT NOT NULL,
    "clusterId" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClusterReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "decision" "ReviewDecision" NOT NULL,
    "note" TEXT,
    "reviewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Site_name_key" ON "Site"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Activity_name_key" ON "Activity"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Report_reportCode_key" ON "Report"("reportCode");

-- CreateIndex
CREATE INDEX "Report_occurredAt_idx" ON "Report"("occurredAt");

-- CreateIndex
CREATE INDEX "Report_assetId_idx" ON "Report"("assetId");

-- CreateIndex
CREATE INDEX "Report_status_idx" ON "Report"("status");

-- CreateIndex
CREATE UNIQUE INDEX "LifeSavingRule_code_key" ON "LifeSavingRule"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ReportLsr_reportId_lifeSavingRuleId_key" ON "ReportLsr"("reportId", "lifeSavingRuleId");

-- CreateIndex
CREATE UNIQUE INDEX "Barrier_code_key" ON "Barrier"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ReportBarrierGap_reportId_barrierId_key" ON "ReportBarrierGap"("reportId", "barrierId");

-- CreateIndex
CREATE INDEX "AiInference_sifClass_idx" ON "AiInference"("sifClass");

-- CreateIndex
CREATE UNIQUE INDEX "PatternCluster_clusterCode_key" ON "PatternCluster"("clusterCode");

-- CreateIndex
CREATE UNIQUE INDEX "ClusterReport_clusterId_reportId_key" ON "ClusterReport"("clusterId", "reportId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportLsr" ADD CONSTRAINT "ReportLsr_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportLsr" ADD CONSTRAINT "ReportLsr_lifeSavingRuleId_fkey" FOREIGN KEY ("lifeSavingRuleId") REFERENCES "LifeSavingRule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportBarrierGap" ADD CONSTRAINT "ReportBarrierGap_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportBarrierGap" ADD CONSTRAINT "ReportBarrierGap_barrierId_fkey" FOREIGN KEY ("barrierId") REFERENCES "Barrier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiInference" ADD CONSTRAINT "AiInference_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClusterReport" ADD CONSTRAINT "ClusterReport_clusterId_fkey" FOREIGN KEY ("clusterId") REFERENCES "PatternCluster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClusterReport" ADD CONSTRAINT "ClusterReport_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE INDEX report_freetext_idx ON "Report" USING GIN (to_tsvector('english', "freeText"));

