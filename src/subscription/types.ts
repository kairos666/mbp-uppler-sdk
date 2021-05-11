import { Pagination, SortingDirections } from "../types";

export type SubscriptionSortingKeys = "id"|"type"|"state"|"buyer"|"seller"|"payment_state"|"shipping_state"|"cart_confirmed_at"|"confirmed_at"|"total";

export type SubscriptionsFilteringKeys = "type"|"state"|"buyer"|"seller"|"payment_state"|"shipping_state"|"cart_confirmed_from"|"cart_confirmed_to"|"confirmed_from"|"confirmed_to"|"external_id"|"token";

export type SubscriptionsExpandingKeys = "buyer"|"seller"|"buyer_user"|"seller_user"|"items"|"shipments"|"variant";

export type SearchSubscriptionsParams = Pagination & {
    sorting?: Array<[SubscriptionSortingKeys, SortingDirections]>,
    filtering?: Array<[SubscriptionsFilteringKeys, string[]]>,
    expanding?: Array<SubscriptionsExpandingKeys>
}