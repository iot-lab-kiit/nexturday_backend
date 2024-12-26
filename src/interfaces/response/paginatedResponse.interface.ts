export interface IPaginatedData<T> {
  data: {
    currentPage: number;
    nextPage: number | null;
    totalPages: number;
    totalItems: number;
    data: T[];
  };
}
