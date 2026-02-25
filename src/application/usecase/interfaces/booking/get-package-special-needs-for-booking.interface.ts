export interface ClientSpecialNeedOptionDTO {
  id: string;
  specialNeedId: string;
  name: string;
  unit: "per_day" | "per_trip";
  price: number;
}

export interface IGetPackageSpecialNeedsForBookingUseCase {
  execute(packageId: string): Promise<ClientSpecialNeedOptionDTO[]>;
}
