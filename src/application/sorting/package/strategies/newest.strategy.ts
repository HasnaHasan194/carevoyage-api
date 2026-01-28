import { IPackageSortStrategy } from "../package-sort-strategy.interface";
import { PackageSortSpec } from "../package-sort.types";

export class NewestPackagesSortStrategy implements IPackageSortStrategy {
  getSortSpec(): PackageSortSpec {
    return { sortBy: "createdAt", sortOrder: "desc" };
  }
}




