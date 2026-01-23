import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IAgencyPackageController } from "../../interfaces/controllers/agency/agency-package.controller.interface";
import { ICreatePackageUsecase } from "../../../application/usecase/interfaces/package/create-package.interface";
import { IUpdatePackageUsecase } from "../../../application/usecase/interfaces/package/update-package.interface";
import { IPublishPackageUsecase } from "../../../application/usecase/interfaces/package/publish-package.interface";
import { IGetAgencyPackagesUsecase } from "../../../application/usecase/interfaces/package/get-agency-packages.interface";
import { IGetPackageByIdUsecase } from "../../../application/usecase/interfaces/package/get-package-by-id.interface";
import { IUpdatePackageBasicUsecase } from "../../../application/usecase/interfaces/package/update-package-basic.interface";
import { IUpdatePackageImagesUsecase } from "../../../application/usecase/interfaces/package/update-package-images.interface";
import { IUpdatePackageItineraryUsecase } from "../../../application/usecase/interfaces/package/update-package-itinerary.interface";
import { IDeletePackageUsecase } from "../../../application/usecase/interfaces/package/delete-package.interface";
import { ICompletePackageUsecase } from "../../../application/usecase/interfaces/package/complete-package.interface";
import { ICancelPackageUsecase } from "../../../application/usecase/interfaces/package/cancel-package.interface";
import { CreatePackageRequestDTO } from "../../../application/dto/request/create-package-request.dto";
import { UpdatePackageRequestDTO } from "../../../application/dto/request/update-package-request.dto";
import { UpdatePackageBasicDTO } from "../../../application/dto/request/update-package-basic.dto";
import { UpdatePackageImagesDTO } from "../../../application/dto/request/update-package-images.dto";
import { UpdatePackageItineraryDTO } from "../../../application/dto/request/update-package-itinerary.dto";
import { ResponseHelper } from "../../../infrastructure/config/helper/response.helper";
import { HTTP_STATUS } from "../../../shared/constants/constants";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { IAgencyRepository } from "../../../domain/repositoryInterfaces/Agency/ageny.repository.interface";
import { NotFoundError } from "../../../domain/errors/notFoundError";

@injectable()
export class AgencyPackageController implements IAgencyPackageController {
  constructor(
    @inject("ICreatePackageUsecase")
    private _createPackageUsecase: ICreatePackageUsecase,
    @inject("IUpdatePackageUsecase")
    private _updatePackageUsecase: IUpdatePackageUsecase,
    @inject("IPublishPackageUsecase")
    private _publishPackageUsecase: IPublishPackageUsecase,
    @inject("IGetAgencyPackagesUsecase")
    private _getAgencyPackagesUsecase: IGetAgencyPackagesUsecase,
    @inject("IGetPackageByIdUsecase")
    private _getPackageByIdUsecase: IGetPackageByIdUsecase,
    @inject("IUpdatePackageBasicUsecase")
    private _updatePackageBasicUsecase: IUpdatePackageBasicUsecase,
    @inject("IUpdatePackageImagesUsecase")
    private _updatePackageImagesUsecase: IUpdatePackageImagesUsecase,
    @inject("IUpdatePackageItineraryUsecase")
    private _updatePackageItineraryUsecase: IUpdatePackageItineraryUsecase,
    @inject("IDeletePackageUsecase")
    private _deletePackageUsecase: IDeletePackageUsecase,
    @inject("ICompletePackageUsecase")
    private _completePackageUsecase: ICompletePackageUsecase,
    @inject("ICancelPackageUsecase")
    private _cancelPackageUsecase: ICancelPackageUsecase,
    @inject("IAgencyRepository")
    private _agencyRepository: IAgencyRepository
  ) {}

  private async getAgencyId(req: CustomRequest): Promise<string> {
    if (!req.user) {
      throw new NotFoundError("User not authenticated");
    }
    const agency = await this._agencyRepository.findByUserId(req.user.id);
    if (!agency) {
      throw new NotFoundError("Agency not found");
    }
    return agency._id;
  }

  async createPackage(req: CustomRequest, res: Response): Promise<void> {
    const agencyId = await this.getAgencyId(req);
    const packageData = req.body as CreatePackageRequestDTO;

    const createdPackage = await this._createPackageUsecase.execute(
      agencyId,
      packageData
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.CREATED,
      "Package created successfully",
      createdPackage
    );
  }

  async updatePackage(req: CustomRequest, res: Response): Promise<void> {
    const agencyId = await this.getAgencyId(req);
    const { packageId } = req.params;
    const updateData = req.body as UpdatePackageRequestDTO;

    const updatedPackage = await this._updatePackageUsecase.execute(
      packageId,
      agencyId,
      updateData
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      "Package updated successfully",
      updatedPackage
    );
  }

  async publishPackage(req: CustomRequest, res: Response): Promise<void> {
    const agencyId = await this.getAgencyId(req);
    const { packageId } = req.params;

    const publishedPackage = await this._publishPackageUsecase.execute(
      packageId,
      agencyId
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      "Package published successfully",
      publishedPackage
    );
  }

  async getPackages(req: CustomRequest, res: Response): Promise<void> {
    const agencyId = await this.getAgencyId(req);
    const status = (req.query.status as
      | "draft"
      | "published"
      | "completed"
      | "cancelled"
      | "all") || "all";

    const packages = await this._getAgencyPackagesUsecase.execute(
      agencyId,
      status
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      "Packages retrieved successfully",
      packages
    );
  }

  async getPackageById(req: CustomRequest, res: Response): Promise<void> {
    const agencyId = await this.getAgencyId(req);
    const { packageId } = req.params;

    const packageData = await this._getPackageByIdUsecase.execute(
      packageId,
      agencyId
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      "Package retrieved successfully",
      packageData
    );
  }

  async updatePackageBasic(req: CustomRequest, res: Response): Promise<void> {
    const agencyId = await this.getAgencyId(req);
    const { packageId } = req.params;
    const updateData = req.body as UpdatePackageBasicDTO;

    const updatedPackage = await this._updatePackageBasicUsecase.execute(
      packageId,
      agencyId,
      updateData
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      "Package basic details updated successfully",
      updatedPackage
    );
  }

  async updatePackageImages(req: CustomRequest, res: Response): Promise<void> {
    const agencyId = await this.getAgencyId(req);
    const { packageId } = req.params;
    const updateData = req.body as UpdatePackageImagesDTO;

    const updatedPackage = await this._updatePackageImagesUsecase.execute(
      packageId,
      agencyId,
      updateData
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      "Package images updated successfully",
      updatedPackage
    );
  }

  async updatePackageItinerary(
    req: CustomRequest,
    res: Response
  ): Promise<void> {
    const agencyId = await this.getAgencyId(req);
    const { packageId } = req.params;
    const updateData = req.body as UpdatePackageItineraryDTO;

    const updatedPackage = await this._updatePackageItineraryUsecase.execute(
      packageId,
      agencyId,
      updateData
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      "Package itinerary updated successfully",
      updatedPackage
    );
  }

  async deletePackage(req: CustomRequest, res: Response): Promise<void> {
    const agencyId = await this.getAgencyId(req);
    const { packageId } = req.params;

    await this._deletePackageUsecase.execute(packageId, agencyId);

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      "Package deleted successfully"
    );
  }

  async completePackage(req: CustomRequest, res: Response): Promise<void> {
    const agencyId = await this.getAgencyId(req);
    const { packageId } = req.params;

    const completedPackage = await this._completePackageUsecase.execute(
      packageId,
      agencyId
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      "Package marked as completed",
      completedPackage
    );
  }

  async cancelPackage(req: CustomRequest, res: Response): Promise<void> {
    const agencyId = await this.getAgencyId(req);
    const { packageId } = req.params;

    const cancelledPackage = await this._cancelPackageUsecase.execute(
      packageId,
      agencyId
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      "Package cancelled successfully",
      cancelledPackage
    );
  }
}

