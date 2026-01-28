import { inject, injectable } from "tsyringe";
import { IResetPasswordUsecase } from "../../interfaces/auth/reset-password.interface";
import { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";
import { IAdminRepository } from "../../../../domain/repositoryInterfaces/Admin/admin.repository.interface";
import { ITokenService } from "../../../../domain/service-interfaces/token-service-interfaces";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";
import { hashPassword } from "../../../../shared/utils/bcryptHelper";
import { redisClient } from "../../../../infrastructure/config/redis.config";
import { JwtPayload } from "jsonwebtoken";

@injectable()
export class ResetPasswordUsecase implements IResetPasswordUsecase {
  constructor(
    @inject("IUserRepository")
    private _userRepository: IUserRepository,

    @inject("IAdminRepository")
    private _adminRepository: IAdminRepository,

    @inject("ITokenService")
    private _tokenService: ITokenService
  ) {}

  async execute(token: string, newPassword: string): Promise<void> {
    // Verify reset token
    const decoded = this._tokenService.verifyResetToken(token);

    if (!decoded || !decoded.id || !decoded.email || !decoded.role) {
      throw new ValidationError(ERROR_MESSAGE.AUTHENTICATION.INVALID_OR_EXPIRED_RESET_TOKEN_REQUEST_NEW);
    }

    const payload = decoded as JwtPayload & { id: string; email: string; role: string };

    // Check if token exists in Redis (single-use token)
    const tokenKey = `reset_token:${token}`;
    const storedUserId = await redisClient.get(tokenKey);

    if (!storedUserId) {
      throw new ValidationError(ERROR_MESSAGE.AUTHENTICATION.RESET_TOKEN_USED_OR_EXPIRED_REQUEST_NEW);
    }

    // Verify token belongs to the user
    if (storedUserId !== payload.id) {
      throw new ValidationError(ERROR_MESSAGE.AUTHENTICATION.INVALID_RESET_TOKEN);
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password based on role
    if (payload.role === "admin") {
      const admin = await this._adminRepository.findById(payload.id);
      if (!admin) {
        throw new NotFoundError(ERROR_MESSAGE.ADMIN.NOT_FOUND);
      }
      await this._adminRepository.updatePassword(payload.id, hashedPassword);
    } else {
      // For client, caretaker, agency_owner - all in users collection
      const user = await this._userRepository.findById(payload.id);
      if (!user) {
        throw new NotFoundError(ERROR_MESSAGE.USER.NOT_FOUND);
      }
      await this._userRepository.updatePassword(payload.id, hashedPassword);
    }

    // Delete token from Redis (single-use)
    await redisClient.del(tokenKey);
  }
}

