import { IPackageSortStrategy } from "../package-sort-strategy.interface";
import { PackageSortSpec } from "../package-sort.types";

export class PriceAscSortStrategy implements IPackageSortStrategy {
  getSortSpec(): PackageSortSpec {
    return { sortBy: "basePrice", sortOrder: "asc" };
  }
}




