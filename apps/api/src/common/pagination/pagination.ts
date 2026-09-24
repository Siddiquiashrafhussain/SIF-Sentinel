import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.preprocess((a) => parseInt(a as string, 10), z.number().int().min(1).default(1)),
  pageSize: z.preprocess((a) => parseInt(a as string, 10), z.number().int().min(1).max(100).default(25)),
});

export type PaginationDto = z.infer<typeof paginationSchema>;

export function createPaginatedResponse<T>(data: T[], total: number, page: number, pageSize: number) {
  return {
    data,
    meta: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}
