export type SDKConfig = {
    clientID: string,
    clientSecret: string,
    baseURL: string,
    basicAuth?: { username:string, password:string }
    debug?: boolean
}

export type Pagination = {
    page?: number,
    perPage?: number,
}

export type SortingDirections = 'asc'|'desc';