import { Pagination, SortingDirections } from "../types";

export type PaymentSortingKeys = "number"|"state"|"type"|"amount"|"created_at"|"payment_date"|"invoice_date"|"due_date";

export type PaymentsFilteringKeys = "query"|"method"|"state"|"type"|"min_amount"|"max_amount"|"date_from"|"date_to"|"external_id";

// no expandable properties

export type SearchPaymentsParams = Pagination & {
    sorting?: Array<[PaymentSortingKeys, SortingDirections]>,
    filtering?: Array<[PaymentsFilteringKeys, string[]]>
}