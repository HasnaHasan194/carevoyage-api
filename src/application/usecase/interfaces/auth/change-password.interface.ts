export interface IChangePasswordUseCase {
  execute(userId: string, newPassword: string): Promise<void>;
}

