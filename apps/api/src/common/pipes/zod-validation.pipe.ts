import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema?: ZodSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    // If a schema is passed directly, use it
    if (this.schema) {
      try {
        return this.schema.parse(value);
      } catch (error) {
        if (error instanceof ZodError) {
          throw new BadRequestException({
            statusCode: 400,
            message: 'Validation failed',
            errors: error.errors,
          });
        }
        throw new BadRequestException('Validation failed');
      }
    }
    return value; // Fallback if no schema is bound globally
  }
}
