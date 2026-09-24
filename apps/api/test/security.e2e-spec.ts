import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import helmet from 'helmet';

describe('Security Headers (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.use(helmet());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/health (GET) - Should return Helmet security headers', async () => {
    const response = await request(app.getHttpServer()).get('/api/v1/health');
    
    // Check for some common helmet headers
    expect(response.headers['x-dns-prefetch-control']).toBeDefined();
    expect(response.headers['x-frame-options']).toBe('SAMEORIGIN'); // or DENY
    expect(response.headers['x-content-type-options']).toBe('nosniff');
  });

  it('/api/v1/auth/me (GET) - Unauthorized', () => {
    return request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .expect(401);
  });
});
