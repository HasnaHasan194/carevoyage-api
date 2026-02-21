import { ISpecialNeedsMasterEntity } from "../../entities/special-needs-master.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface ISpecialNeedsMasterRepository
  extends IBaseRepository<ISpecialNeedsMasterEntity> {
  findActive(): Promise<ISpecialNeedsMasterEntity[]>;
  findById(id: string): Promise<ISpecialNeedsMasterEntity | null>;
  findByCategory(category: string): Promise<ISpecialNeedsMasterEntity[]>;
}
