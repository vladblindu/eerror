// Type definitions for eerror package

export as namespace EError

interface opts {
    internalList?: string[]
    externalList?: string[]
    path?: string
}

export function registerErrorClasses(opts?: opts): object

