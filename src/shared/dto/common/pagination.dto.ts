export class PaginationDto {
    page: number = 1;
    pageSize: number = 10;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
