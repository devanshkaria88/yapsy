import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { AdminUser } from '../../modules/users/entities/admin-user.entity';
import { SubscriptionPlan } from '../../modules/subscriptions/entities/subscription-plan.entity';
import { PromoCode } from '../../modules/promo-codes/entities/promo-code.entity';
import { AdminRole } from '../../common/enums';
import { PlanInterval } from '../../common/enums';
import { PromoType } from '../../common/enums';

dotenv.config();

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME ?? 'yapsy',
    password: process.env.DB_PASSWORD ?? 'yapsy_secret',
    database: process.env.DB_DATABASE ?? 'yapsy_dev',
    entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    migrationsRun: true,
    synchronize: false,
  });

  await dataSource.initialize();
  console.log('Database connected for seeding...');

  // 1. Default admin user (firebase_uid will be linked on first Firebase login)
  const adminRepo = dataSource.getRepository(AdminUser);
  const adminEmail = process.env.ADMIN_DEFAULT_EMAIL ?? 'admin@yapsy.app';

  const existingAdmin = await adminRepo.findOne({
    where: { email: adminEmail },
  });
  if (!existingAdmin) {
    const admin = adminRepo.create({
      email: adminEmail,
      name: 'Yapsy Admin',
      role: AdminRole.SUPER_ADMIN,
      // firebase_uid is null — will be set on first Firebase login
    });
    await adminRepo.save(admin);
    console.log(
      `Created admin user: ${adminEmail} (login via Firebase to link UID)`,
    );
  } else {
    console.log(`Admin user already exists: ${adminEmail}`);
  }

  // 2. Default subscription plans
  const planRepo = dataSource.getRepository(SubscriptionPlan);

  const plans = [
    {
      name: 'Yapsy Pro Monthly',
      price_amount: 24900, // ₹249 in paise
      currency: 'INR',
      interval: PlanInterval.MONTHLY,
      features: {
        unlimited_check_ins: true,
        weekly_insights: true,
        journal_search: true,
        advanced_analytics: true,
        full_history: true,
      },
      is_active: true,
    },
    {
      name: 'Yapsy Pro Yearly',
      price_amount: 249900, // ₹2,499 in paise
      currency: 'INR',
      interval: PlanInterval.YEARLY,
      features: {
        unlimited_check_ins: true,
        weekly_insights: true,
        journal_search: true,
        advanced_analytics: true,
        full_history: true,
      },
      is_active: true,
    },
  ];

  for (const planData of plans) {
    const existing = await planRepo.findOne({ where: { name: planData.name } });
    if (!existing) {
      const plan = planRepo.create(planData);
      await planRepo.save(plan);
      console.log(
        `Created plan: ${planData.name} (₹${planData.price_amount / 100})`,
      );
    } else {
      console.log(`Plan already exists: ${planData.name}`);
    }
  }

  // 3. Sample promo codes
  const promoRepo = dataSource.getRepository(PromoCode);

  const promos = [
    {
      code: 'EARLYBIRD',
      type: PromoType.PERCENTAGE,
      value: 50, // 50% off
      duration_months: 3,
      max_uses: 100,
      current_uses: 0,
      valid_from: new Date(),
      valid_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      is_active: true,
    },
    {
      code: 'FRIEND',
      type: PromoType.SET_PRICE,
      value: 9900, // ₹99/month in paise
      duration_months: 1,
      max_uses: 500,
      current_uses: 0,
      valid_from: new Date(),
      valid_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      is_active: true,
    },
  ];

  for (const promoData of promos) {
    const existing = await promoRepo.findOne({
      where: { code: promoData.code },
    });
    if (!existing) {
      const promo = promoRepo.create(promoData);
      await promoRepo.save(promo);
      console.log(
        `Created promo: ${promoData.code} (${promoData.type}: ${promoData.value})`,
      );
    } else {
      console.log(`Promo already exists: ${promoData.code}`);
    }
  }

  console.log('\nSeeding complete!');
  await dataSource.destroy();
}

seed().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
