import type { CaretakerDashboardResponseDTO } from "../../../dto/response/caretaker-dashboard-response.dto";

export interface IGetCaretakerDashboardUseCase {
  execute(userId: string): Promise<CaretakerDashboardResponseDTO>;
}
