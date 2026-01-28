import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IAgencyActivityController } from "../../interfaces/controllers/agency/agency-activity.controller.interface";
import { ICreateActivityUsecase } from "../../../application/usecase/interfaces/activity/create-activity.interface";
import { IGetAllActivitiesUsecase } from "../../../application/usecase/interfaces/activity/get-all-activities.interface";
import { CreateActivityRequestDTO } from "../../../application/dto/request/create-activity-request.dto";
import { ResponseHelper } from "../../../infrastructure/config/helper/response.helper";
import { HTTP_STATUS } from "../../../shared/constants/constants";

@injectable()
export class AgencyActivityController implements IAgencyActivityController {
  constructor(
    @inject("ICreateActivityUsecase")
    private _createActivityUsecase: ICreateActivityUsecase,
    @inject("IGetAllActivitiesUsecase")
    private _getAllActivitiesUsecase: IGetAllActivitiesUsecase
  ) {}

  async createActivity(req: Request, res: Response): Promise<void> {
    const activityData = req.body as CreateActivityRequestDTO;

    const activity = await this._createActivityUsecase.execute(activityData);

    ResponseHelper.success(
      res,
      HTTP_STATUS.CREATED,
      "Activity created successfully",
      activity
    );
  }

  async getAllActivities(req: Request, res: Response): Promise<void> {
    const category = req.query.category as string | undefined;

    const activities = await this._getAllActivitiesUsecase.execute(category);

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      "Activities retrieved successfully",
      activities
    );
  }
}





