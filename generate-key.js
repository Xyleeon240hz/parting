const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function generateLicenseKey() {
  const key = `CRYL-${crypto.randomBytes(2).toString('hex').toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

  const license = await prisma.licenseKey.create({
    data: {
      key: key,
      maxUses: 1,
      isActive: true,
      isUsed: false,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      metadata: {}
    }
  });

  console.log('✅ License Key Generated:');
  console.log('Key:', license.key);
  console.log('Expires:', license.expiresAt);

  await prisma.$disconnect();
}

generateLicenseKey().catch(console.error);
