export type SDKConfig = {
    clientID: string,
    clientSecret: string,
    baseURL: string,
    maxItemsPerPage: number,
    basicAuth?: { username:string, password:string },
    debug?: 0|1|2 // 0 = debug off, 1 = debug on, 2 = debug on + expand response
}

export type Pagination = {
    page?: number,
    perPage?: number,
}

export type SortingDirections = 'asc'|'desc';