import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL'] });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear existing data (child first to respect FK constraint)
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  // Seed users
  const alice = await prisma.user.create({
    data: { name: 'Alice Johnson', email: 'alice@example.com' },
  });
  const bob = await prisma.user.create({
    data: { name: 'Bob Smith', email: 'bob@example.com' },
  });

  // Seed tasks
  await prisma.task.createMany({
    data: [
      { title: 'Set up CI/CD pipeline', description: 'Configure GitHub Actions for automated testing and deployment', status: 'DONE', userId: alice.id },
      { title: 'Design database schema', description: 'Define models and relationships for the task management app', status: 'DONE', userId: alice.id },
      { title: 'Build REST API', description: 'Implement CRUD endpoints using NestJS and Prisma', status: 'IN_PROGRESS', userId: alice.id },
      { title: 'Write unit tests', description: 'Cover service and controller layers with Jest', status: 'OPEN', userId: alice.id },
      { title: 'Add authentication', description: 'Implement JWT-based auth with refresh tokens', status: 'OPEN', userId: alice.id },
      { title: 'Review pull requests', description: 'Review team PRs and leave feedback', status: 'IN_PROGRESS', userId: bob.id },
      { title: 'Fix pagination bug', description: 'Off-by-one error on the last page of results', status: 'DONE', userId: bob.id },
      { title: 'Update API documentation', description: 'Keep Swagger docs in sync with latest endpoint changes', status: 'OPEN', userId: bob.id },
      { title: 'Optimize slow queries', description: 'Profile and add indexes for the most expensive DB queries', status: 'OPEN', userId: bob.id },
      { title: 'Deploy to staging', description: 'Push latest release to the staging environment for QA', status: 'IN_PROGRESS', userId: bob.id },
      { title: 'Set up monitoring', description: 'Integrate Datadog for error tracking and performance monitoring', status: 'OPEN', userId: alice.id },
      { title: 'Refactor auth module', description: 'Split monolithic auth service into smaller focused modules', status: 'OPEN', userId: alice.id },
      { title: 'Write E2E tests', description: 'Cover critical user flows with Playwright end-to-end tests', status: 'OPEN', userId: bob.id },
      { title: 'Migrate to PostgreSQL', description: 'Move from SQLite to PostgreSQL for production readiness', status: 'DONE', userId: bob.id },
      { title: 'Add rate limiting', description: 'Protect API endpoints from abuse with request throttling', status: 'OPEN', userId: alice.id },
      { title: 'Code review session', description: 'Schedule and run weekly architecture review with the team', status: 'IN_PROGRESS', userId: bob.id },
    ],
  });

  console.log('Seeded: 2 users, 16 tasks');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());