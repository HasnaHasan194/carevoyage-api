import { PreviewBookingPriceResponseDTO } from "../../../dto/response/preview-booking-price-response.dto";

export interface IPreviewBookingPriceUseCase {
  execute(data: {
    packageId: string;
    specialNeedIds?: string[];
    caretakerId?: string;
  }): Promise<PreviewBookingPriceResponseDTO>;
}
