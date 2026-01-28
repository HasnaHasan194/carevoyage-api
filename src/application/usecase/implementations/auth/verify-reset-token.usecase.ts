import { inject, injectable } from "tsyringe";
import { IVerifyResetTokenUsecase } from "../../interfaces/auth/verify-reset-token.interface";
import { ITokenService } from "../../../../domain/service-interfaces/token-service-interfaces";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";
import { JwtPayload } from "jsonwebtoken";
import { redisClient } from "../../../../infrastructure/config/redis.config";

@injectable()
export class VerifyResetTokenUsecase implements IVerifyResetTokenUsecase {
  constructor(
    @inject("ITokenService")
    private _tokenService: ITokenService
  ) {}

  async execute(token: string): Promise<{ email: string; role: string }> {
    // Verify reset token
    const decoded = this._tokenService.verifyResetToken(token);

    if (!decoded || !decoded.id || !decoded.email || !decoded.role) {
      throw new ValidationError(ERROR_MESSAGE.AUTHENTICATION.INVALID_OR_EXPIRED_RESET_TOKEN);
    }

    const payload = decoded as JwtPayload & { id: string; email: string; role: string };

    // Check if token exists in Redis (single-use token)
    const tokenKey = `reset_token:${token}`;
    const storedUserId = await redisClient.get(tokenKey);

    if (!storedUserId) {
      throw new ValidationError(ERROR_MESSAGE.AUTHENTICATION.RESET_TOKEN_USED_OR_EXPIRED);
    }

    // Verify token belongs to the user
    if (storedUserId !== payload.id) {
      throw new ValidationError(ERROR_MESSAGE.AUTHENTICATION.INVALID_RESET_TOKEN);
    }

    return {
      email: payload.email,
      role: payload.role,
    };
  }
}








