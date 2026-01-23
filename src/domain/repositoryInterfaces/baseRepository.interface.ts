import { ClientSession } from "mongoose";

export interface IBaseRepository<TEntity> {
  findById(id: string, session?: ClientSession): Promise<TEntity | null>;
  save(data: Partial<TEntity>, session?: ClientSession): Promise<TEntity>;
  updateById(
    id: string,
    data: Partial<TEntity>,
    session?: ClientSession
  ): Promise<TEntity | null>;
  deleteById(id: string, session?: ClientSession): Promise<TEntity | null>;
}
