import { Document } from "mongoose";
import { ISpecialNeedsMasterEntity } from "../../../../domain/entities/special-needs-master.entity";

export interface ISpecialNeedsMasterModel
  extends Omit<ISpecialNeedsMasterEntity, "_id">,
    Document {}
