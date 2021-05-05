import { Pagination, SortingDirections } from "../base";

export type OrderSortingKeys = "id"|"type"|"state"|"buyer"|"seller"|"payment_state"|"shipping_state"|"cart_confirmed_at"|"confirmed_at"|"total";

export type OrdersFilteringKeys = "type"|"state"|"buyer"|"seller"|"payment_state"|"shipping_state"|"cart_confirmed_from"|"cart_confirmed_to"|"confirmed_from"|"confirmed_to"|"external_id"|"token";

export type OrdersExpandingKeys = "buyer"|"seller"|"buyer_user"|"seller_user"|"items"|"shipments"|"variant";

export type SearchOrdersParams = Pagination & {
    sorting?: Array<[OrderSortingKeys, SortingDirections]>,
    filtering?: Array<[OrdersFilteringKeys, string[]]>,
    expanding?: Array<OrdersExpandingKeys>
}