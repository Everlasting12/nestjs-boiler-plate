export interface IResponse<T> {
  skip?: number;
  limit?: number;
  data: T;
  total: number;
}
