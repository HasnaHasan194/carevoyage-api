export class SpecialNeedLineItemDTO {
  id!: string;
  name!: string;
  unit!: "per_day" | "per_trip";
  unitPrice!: number;
  total!: number;
}

export class CaretakerLineItemDTO {
  id!: string;
  name!: string;
  profileImage?: string;
  pricePerDay!: number;
  total!: number;
}

export class PreviewBookingPriceResponseDTO {
  basePrice!: number;
  tripDays!: number;
  specialNeeds!: SpecialNeedLineItemDTO[];
  specialNeedsTotal!: number;
  caretaker?: CaretakerLineItemDTO;
  caretakerTotal!: number;
  totalAmount!: number;
  currency!: string;
}
