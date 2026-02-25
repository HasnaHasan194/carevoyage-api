import { injectable } from "tsyringe";
import { ICaretakerRequestEntity } from "../../../domain/entities/caretaker-request.entity";
import { ICaretakerRequestRepository } from "../../../domain/repositoryInterfaces/CaretakerRequest/caretaker-request.repository.interface";
import { caretakerRequestDB } from "../../database/models/caretaker-request.model";
import { ICaretakerRequestModel } from "../../database/schemas/caretaker-request.schema";
import { BaseRepository } from "../baseRepository";
import { CaretakerRequestMapper } from "../../../application/mapper/caretaker-request.mapper";

@injectable()
export class CaretakerRequestRepository
  extends BaseRepository<ICaretakerRequestModel, ICaretakerRequestEntity>
  implements ICaretakerRequestRepository
{
  constructor() {
    super(caretakerRequestDB, CaretakerRequestMapper.toEntity);
  }

  async findPendingByClientAndPackage(
    clientId: string,
    packageId: string
  ): Promise<ICaretakerRequestEntity | null> {
    const doc = await caretakerRequestDB
      .findOne({ clientId, packageId, status: "pending" })
      .exec();
    if (!doc) return null;
    return CaretakerRequestMapper.toEntity(doc);
  }

  async findByAgencyId(agencyId: string): Promise<ICaretakerRequestEntity[]> {
    const docs = await caretakerRequestDB
      .find({ agencyId })
      .sort({ requestedAt: -1 })
      .exec();
    return docs.map((d) => CaretakerRequestMapper.toEntity(d));
  }
}
