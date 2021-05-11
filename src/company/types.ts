import { Pagination, SortingDirections } from "../types";

/* BUYERS */
// no sorting

export type BuyersFilteringKeys = "external_id"|"name"|"username"|"email";

export type BuyersExpandingKeys = "accounts"|"files"|"subscriptions"|"dynamicFields";

export type SearchBuyersParams = Pagination & {
    filtering?: Array<[BuyersFilteringKeys, string[]]>,
    expanding?: Array<BuyersExpandingKeys>
}

/* SELLERS */
export type SellerSortingKeys = "external_id"|"name"|"created_at"|"updated_at";

export type SellersFilteringKeys = "external_id"|"name"|"username"|"email"|"created_from"|"created_to"|"updated_from"|"updated_to";

export type SellersExpandingKeys = "accounts"|"files"|"subscriptions"|"dynamicFields";

export type SearchSellersParams = Pagination & {
    sorting?: Array<[SellerSortingKeys, SortingDirections]>,
    filtering?: Array<[SellersFilteringKeys, string[]]>,
    expanding?: Array<SellersExpandingKeys>
}

