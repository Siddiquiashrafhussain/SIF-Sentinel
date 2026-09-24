import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('ReportsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/reports (POST) - Valid payload without token yields 401', () => {
    return request(app.getHttpServer())
      .post('/api/v1/reports')
      .send({
        freeText: 'Test free text',
        activityId: '1',
        assetId: '1',
        type: 'NEAR_MISS',
        occurredAt: new Date().toISOString()
      })
      .expect(401);
  });

  it('/api/v1/reports (GET) - Valid request without token yields 401', () => {
    return request(app.getHttpServer())
      .get('/api/v1/reports')
      .expect(401);
  });
});
