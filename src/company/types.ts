import { Pagination, SortingDirections } from "../types";

export type CompanySortingKeys = "id"|"type"|"state"|"buyer"|"seller"|"payment_state"|"shipping_state"|"cart_confirmed_at"|"confirmed_at"|"total";

export type CompanysFilteringKeys = "type"|"state"|"buyer"|"seller"|"payment_state"|"shipping_state"|"cart_confirmed_from"|"cart_confirmed_to"|"confirmed_from"|"confirmed_to"|"external_id"|"token";

export type CompanysExpandingKeys = "buyer"|"seller"|"buyer_user"|"seller_user"|"items"|"shipments"|"variant";

export type SearchCompanysParams = Pagination & {
    sorting?: Array<[CompanySortingKeys, SortingDirections]>,
    filtering?: Array<[CompanysFilteringKeys, string[]]>,
    expanding?: Array<CompanysExpandingKeys>
}