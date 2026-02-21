import type { TPackageStatus } from "../entities/package.entity";

export const PACKAGE_CATEGORIES = [
  "Sightseeing",
  "Adventure",
  "Cultural",
  "Spiritual",
  "Wellness",
  "Family",
  "Honeymoon",
  "Nature",
  "Heritage",
  "belief"
] as const;

export type PackageCategory = (typeof PACKAGE_CATEGORIES)[number];

export const normalizePackageCategory = (
  value: string
): PackageCategory | null => {
  const trimmed = value.trim();
  const match = PACKAGE_CATEGORIES.find(
    (c) => c.toLowerCase() === trimmed.toLowerCase()
  );
  return match ?? null;
};

// Statuses that allow package editing 
export const EDITABLE_PACKAGE_STATUSES: TPackageStatus[] = ["draft", "published"];

// Helper function to check if a package can be edited based on => status
export const isPackageEditable = (status: TPackageStatus): boolean => {
  return EDITABLE_PACKAGE_STATUSES.includes(status);
};

