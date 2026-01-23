export interface IActivityEntity {
  _id: string;
  packageId: string; 
  name: string;
  description: string;
  duration: number; // in minutes
  category: string;
  priceIncluded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

