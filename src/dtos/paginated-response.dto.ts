export class PaginatedResponseDto<T> {
  items!: T[];
  nextCursor?: string;
}

export class PaginatedPageResponseDto<T> extends PaginatedResponseDto<T> {
  page!: number;
  totalPages!: number;
}
