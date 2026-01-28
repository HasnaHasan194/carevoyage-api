import { PackageSortSpec } from "./package-sort.types";

export interface IPackageSortStrategy {
  getSortSpec(): PackageSortSpec;
}




