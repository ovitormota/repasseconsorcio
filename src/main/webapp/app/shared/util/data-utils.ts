// function that returns a boolean checking if an object is empty
export function isEmptyObject(obj: any) {
    return !!Object.keys(obj).length;
}
