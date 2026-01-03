import { inject, injectable } from "tsyringe";
import { Response } from "express";
import { HTTP_STATUS } from "../../../shared/constants/constants";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { IGetUserProfileUsecase } from "../../../application/usecase/interfaces/user/get-user-profile-usecase.interface";
import { UserProfileMapper } from "../../../application/mapper/user-profile.mapper";

@injectable()
export class UserController {
  constructor(
    @inject("IGetUserProfileUsecase")
    private readonly getUserProfileUsecase: IGetUserProfileUsecase
  ) {}

  async getProfile(req: CustomRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const userEntity = await this.getUserProfileUsecase.execute(req.user.id);

    const profileDTO = UserProfileMapper.toDTO(userEntity);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: profileDTO,
    });
  }
}
