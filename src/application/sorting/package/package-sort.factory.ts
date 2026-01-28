import { PackageSortKey, SortOrder } from "../../dto/request/browse-packages-request.dto";
import { IPackageSortStrategy } from "./package-sort-strategy.interface";
import { PackageSortSpec } from "./package-sort.types";
import { DurationAscSortStrategy } from "./strategies/duration-asc.strategy";
import { DurationDescSortStrategy } from "./strategies/duration-desc.strategy";
import { NewestPackagesSortStrategy } from "./strategies/newest.strategy";
import { OldestPackagesSortStrategy } from "./strategies/oldest.strategy";
import { PriceAscSortStrategy } from "./strategies/price-asc.strategy";
import { PriceDescSortStrategy } from "./strategies/price-desc.strategy";

/**
 * Centralized sorting mechanism (Strategy + Factory).
 * OCP: Add new sort strategies without touching the use case/repository.
 */
export class PackageSortFactory {
  static fromSortKey(sortKey: PackageSortKey): IPackageSortStrategy {
    switch (sortKey) {
      case PackageSortKey.PRICE_ASC:
        return new PriceAscSortStrategy();
      case PackageSortKey.PRICE_DESC:
        return new PriceDescSortStrategy();
      case PackageSortKey.NEWEST:
        return new NewestPackagesSortStrategy();
      case PackageSortKey.OLDEST:
        return new OldestPackagesSortStrategy();
      case PackageSortKey.DURATION_ASC:
        return new DurationAscSortStrategy();
      case PackageSortKey.DURATION_DESC:
        return new DurationDescSortStrategy();
      default:
        return new PriceAscSortStrategy();
    }
  }

  /**
   * Backward compatibility: if sortKey is absent, fall back to sortBy/sortOrder.
   */
  static resolve(params: {
    sortKey?: PackageSortKey;
    sortBy?: string;
    sortOrder?: SortOrder;
  }): PackageSortSpec {
    if (params.sortKey) {
      return this.fromSortKey(params.sortKey).getSortSpec();
    }

    return {
      sortBy: params.sortBy || "basePrice",
      sortOrder: (params.sortOrder || SortOrder.ASC) as "asc" | "desc",
    };
  }
}




