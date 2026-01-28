import { IPackageSortStrategy } from "../package-sort-strategy.interface";
import { PackageSortSpec } from "../package-sort.types";

export class DurationAscSortStrategy implements IPackageSortStrategy {
  getSortSpec(): PackageSortSpec {
   
    return { sortBy: "duration", sortOrder: "asc" };
  }
}




