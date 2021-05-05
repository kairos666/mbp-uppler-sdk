export function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            Object.defineProperty(
                derivedCtor.prototype,
                name,
                (Object.getOwnPropertyDescriptor(baseCtor.prototype, name) as any)
            );
        });
    });
}

function sortingQueryBuiler(sortingParams:Array<[string, string]>):string[] {
    return sortingParams.map(sortingKey => `sorting[${ sortingKey[0] }]=${ sortingKey[1] }`);
}

function filteringQueryBuiler(filteringParams:Array<[string, string[]]>):string[] {
    return filteringParams.map(filteringKey => {
        const isMonoFilter = filteringKey[1].length === 1;
        return isMonoFilter
            ? [`criteria[${ filteringKey[0] }]=${ filteringKey[1] }`]
            : filteringKey[1].map(filterValue => `criteria[${ filteringKey[0] }][]=${ filterValue }`)
    }).reduce((flattened, arr) => flattened.concat(arr), []);
}

function expandingQueryBuiler(expandingParams:string[]):string[] {
    return expandingParams.map(expandKey => `expand[${ expandKey }]=${ expandKey }`);
}

export function queryParamsStringifier(params:any):string {
    // Uppler params custom stringifier
    const paramsPreQueryString:string[] = Object.keys(params)
        .map(key => {
            // pre format property value pairs depending on use case
            switch(true) {
                case key === 'sorting': return sortingQueryBuiler(params[key]);
                case key === 'filtering': return filteringQueryBuiler(params[key]);
                case key === 'expanding': return expandingQueryBuiler(params[key]);

                default: return [`${ key }=${ params[key] }`];
            }
        })
        .reduce((flattened, arr) => flattened.concat(arr), []);

    // concat and stringify query string
    return `?${ paramsPreQueryString.join('&') }`;
}