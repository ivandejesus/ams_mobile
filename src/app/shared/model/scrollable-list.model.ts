export interface PaginationResponse {
  total: number;
  total_filtered: number;
  limit: number;
  page: number;
}

export class Pagination {
  total: number;
  totalFiltered: number;
  limit: number;
  page: number;

  static fromResponse(response: PaginationResponse): Pagination {
    const pagination = new Pagination();

    pagination.total = response.total;
    pagination.totalFiltered = response.total_filtered;
    pagination.limit = response.limit;
    pagination.page = response.page;

    return pagination;
  }
}

/**
 * Model implementation for Infinite Scrollable List
 */
export class InifiniteScrollableList<T> {
  pagination: Pagination;
  items: Array<T>;

  constructor(paginationResponse: PaginationResponse, items: Array<T>) {
    this.pagination = Pagination.fromResponse(paginationResponse);
    this.items = items;
  }

  nextPage(): number {
    return ++this.pagination.page;
  }

  addItems(items: Array<T>): void {
    this.items.push(...items);
  }
}
