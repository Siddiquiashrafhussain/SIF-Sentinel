import { PrismaClient, UserRole, ReportType, SifClass, ReportStatus, BarrierClass, BarrierTier, ReviewDecision } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

const DATA_DIR = path.resolve(__dirname, '../../../data');

function loadJson(filename: string) {
  const filepath = path.join(DATA_DIR, filename);
  return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

function loadJsonl(filename: string) {
  const filepath = path.join(DATA_DIR, filename);
  const data: any[] = [];
  const lines = fs.readFileSync(filepath, 'utf8').split('\n');
  for (const line of lines) {
    if (line.trim()) {
      data.push(JSON.parse(line));
    }
  }
  return data;
}

async function main() {
  console.log('===============================================');
  console.log('SIF-SENTINEL SYNTHETIC DATABASE SEED');
  console.log('===============================================');
  console.log('DEMO DATA, NOT OIL PRODUCTION DATA');

  const lsrs = loadJson('lsr.json');
  const sites = loadJson('sites.json');
  const assets = loadJson('assets.json');
  const activities = loadJson('activities.json');
  const barriers = loadJson('barriers.json');
  const reports = loadJsonl('reports.jsonl');

  // Load Reference Data
  for (const s of sites) {
    await prisma.site.upsert({
      where: { name: s.name },
      update: {},
      create: { id: s.code, name: s.name }, // using code as id for easier mapping
    });
  }

  for (const a of activities) {
    await prisma.activity.upsert({
      where: { name: a.name },
      update: { description: a.description },
      create: { name: a.name, description: a.description },
    });
  }

  for (const lsr of lsrs) {
    await prisma.lifeSavingRule.upsert({
      where: { code: lsr.code },
      update: { name: lsr.name, area: lsr.area },
      create: { code: lsr.code, name: lsr.name, area: lsr.area },
    });
  }

  for (const b of barriers) {
    await prisma.barrier.upsert({
      where: { code: b.code },
      update: { name: b.name, class: b.class as BarrierClass, tier: b.tier as BarrierTier },
      create: { code: b.code, name: b.name, class: b.class as BarrierClass, tier: b.tier as BarrierTier },
    });
  }

  // Load Assets
  for (const ast of assets) {
    // site code corresponds to the id we set for site
    await prisma.asset.upsert({
      where: { id: ast.code }, // Assumes Asset has a generated ID, wait we didn't specify code as unique. Let's find first or create
      create: { id: ast.code, name: ast.name, siteId: ast.siteCode, lat: ast.lat, lng: ast.lng },
      update: { name: ast.name, siteId: ast.siteCode, lat: ast.lat, lng: ast.lng }
    }).catch(async () => {
      // If Asset.id is generated and we can't upsert by id easily, just create it if not exists
      const existing = await prisma.asset.findFirst({ where: { name: ast.name } });
      if (!existing) {
        await prisma.asset.create({ data: { id: ast.code, name: ast.name, siteId: ast.siteCode, lat: ast.lat, lng: ast.lng }});
      }
    });
  }

  // Load Users
  const defaultPassword = await argon2.hash('password123');
  
  const user1 = await prisma.user.create({
    data: { name: 'Demo HSE Officer', email: 'hse@example.com', passwordHash: defaultPassword, role: UserRole.HSE_OFFICER, siteId: sites[0].code }
  });
  const user2 = await prisma.user.create({
    data: { name: 'Demo Field Supervisor', email: 'supervisor@example.com', passwordHash: defaultPassword, role: UserRole.FIELD_SUPERVISOR, siteId: sites[0].code }
  });
  const user3 = await prisma.user.create({
    data: { name: 'Demo Admin', email: 'admin@example.com', passwordHash: defaultPassword, role: UserRole.ADMIN, siteId: sites[0].code }
  });

  // Pre-load reference maps
  const activityMap = new Map((await prisma.activity.findMany()).map(a => [a.name, a.id]));
  const lsrMap = new Map((await prisma.lifeSavingRule.findMany()).map(l => [l.code, l.id]));
  const barrierMap = new Map((await prisma.barrier.findMany()).map(b => [b.code, b.id]));

  console.log('Inserting reports...');
  let lsrMappingCount = 0;
  let barrierMappingCount = 0;
  let reviewCount = 0;

  // Insert Reports in batches
  for (let i = 0; i < reports.length; i++) {
    const r = reports[i];
    const isVerified = Math.random() < 0.25;
    const status = isVerified ? ReportStatus.VERIFIED : ReportStatus.PENDING;

    // Use a transaction or sequential create to handle relationships
    // To handle vector embeddings natively, we can use prisma executeRawUnsafe
    
    // Create Report
    const dbReport = await prisma.report.create({
      data: {
        reportCode: r.reportCode,
        type: r.type as ReportType,
        shift: r.shift,
        occurredAt: new Date(r.occurredAt),
        freeText: r.freeText,
        source: r.source,
        assetId: r.assetCode,
        activityId: activityMap.get(r.activityName)!,
        status: status,
      }
    });

    const gt = r.groundTruth;

    // Map LSRs
    for (const lsrCode of gt.lifeSavingRules) {
      await prisma.reportLsr.create({
        data: { reportId: dbReport.id, lifeSavingRuleId: lsrMap.get(lsrCode)! }
      });
      lsrMappingCount++;
    }

    // Map Barriers
    for (const bCode of gt.barrierGaps) {
      await prisma.reportBarrierGap.create({
        data: { reportId: dbReport.id, barrierId: barrierMap.get(bCode)! }
      });
      barrierMappingCount++;
    }

    // Generate AI Inference
    const dummyVector = '[' + new Array(768).fill(0.01).join(',') + ']';
    const topDrivers = JSON.stringify({ drivers: gt.evidenceSpans.map((span: string) => ({ feature: span, importance: 0.9 })) });
    await prisma.$executeRawUnsafe(`
      INSERT INTO "AiInference" ("id", "reportId", "sifClass", "confidence", "modelVersion", "topDrivers", "embedding", "updatedAt")
      VALUES (
        gen_random_uuid(), 
        '${dbReport.id}', 
        '${gt.sifClass}', 
        0.9500, 
        'v1.0.0-synthetic', 
        '${topDrivers.replace(/'/g, "''")}'::jsonb, 
        '${dummyVector}'::vector,
        NOW()
      )
    `);

    // Generate Review if Verified
    if (isVerified) {
      await prisma.review.create({
        data: {
          reportId: dbReport.id,
          reviewerId: user1.id,
          decision: Math.random() < 0.9 ? ReviewDecision.CONFIRMED : ReviewDecision.OVERRIDDEN,
          note: "Human review confirmed."
        }
      });
      reviewCount++;
    }
  }

  // Generate Pattern Cluster
  const cluster = await prisma.patternCluster.create({
    data: {
      clusterCode: 'CL-DEMO-01',
      title: 'Energy Isolation Bypasses',
      severity: 'High',
      trend: 'Stable',
      whereSummary: 'Identified automatically from synthetic data'
    }
  });

  // Assign the first 50 reports to this cluster for demo purposes
  const dbReports = await prisma.report.findMany({ take: 50 });
  for (const r of dbReports) {
    await prisma.clusterReport.create({
      data: { clusterId: cluster.id, reportId: r.id }
    });
  }

  console.log('Calculating final counts...');

  const cSites = await prisma.site.count();
  const cAssets = await prisma.asset.count();
  const cActs = await prisma.activity.count();
  const cLSRs = await prisma.lifeSavingRule.count();
  const cBars = await prisma.barrier.count();
  const cReps = await prisma.report.count();
  const cRev = await prisma.review.count();

  const cNonSif = await prisma.aiInference.count({ where: { sifClass: SifClass.NON_SIF } });
  const cSifPot = await prisma.aiInference.count({ where: { sifClass: SifClass.SIF_POTENTIAL } });
  const cHighSif = await prisma.aiInference.count({ where: { sifClass: SifClass.HIGH_SIF } });
  const cCritSif = await prisma.aiInference.count({ where: { sifClass: SifClass.CRITICAL_SIF } });

  const cPending = await prisma.report.count({ where: { status: ReportStatus.PENDING } });
  const cVerified = await prisma.report.count({ where: { status: ReportStatus.VERIFIED } });

  console.log(`
===============================================
SIF-SENTINEL SYNTHETIC DATABASE SEED
===============================================

Sites                  : ${cSites}
Assets                 : ${cAssets}
Activities             : ${cActs}
Life-Saving Rules      : ${cLSRs}
Barriers               : ${cBars}
Reports                : ${cReps}
Report-LSR mappings    : ${lsrMappingCount}
Barrier-gap mappings   : ${barrierMappingCount}
Reviews                : ${cRev}

SIF CLASS
-----------------------------------------------
NON_SIF                : ${cNonSif}
SIF_POTENTIAL          : ${cSifPot}
HIGH_SIF               : ${cHighSif}
CRITICAL_SIF           : ${cCritSif}

REVIEW STATUS
-----------------------------------------------
PENDING                : ${cPending}
VERIFIED               : ${cVerified}

DATA STATUS
-----------------------------------------------
SYNTHETIC DEMO DATA
NOT OIL PRODUCTION DATA
===============================================
`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
