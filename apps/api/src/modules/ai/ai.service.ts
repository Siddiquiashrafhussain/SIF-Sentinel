import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly baseUrl: string;
  private readonly timeoutMs: number;

  constructor(private configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('ML_BASE_URL') || 'http://localhost:8000';
    this.timeoutMs = parseInt(this.configService.get<string>('ML_REQUEST_TIMEOUT_MS') || '10000', 10);
  }

  async predict(data: any): Promise<any> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

      const response = await fetch(`${this.baseUrl}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`ML service returned status ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      this.logger.error(`Error calling ML /predict: ${error.message}`);
      throw new HttpException(
        'ML Service Unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async cluster(data: any): Promise<any> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.timeoutMs * 5); // Clusters might take longer

      const response = await fetch(`${this.baseUrl}/cluster`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`ML service returned status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      this.logger.error(`Error calling ML /cluster: ${error.message}`);
      throw new HttpException(
        'ML Service Unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
