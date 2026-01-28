import { IPackageSortStrategy } from "../package-sort-strategy.interface";
import { PackageSortSpec } from "../package-sort.types";

export class DurationDescSortStrategy implements IPackageSortStrategy {
  getSortSpec(): PackageSortSpec {
  
    return { sortBy: "duration", sortOrder: "desc" };
  }
}




