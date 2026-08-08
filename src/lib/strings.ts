export const stringIsBlank = (value:unknown) =>{
    return typeof value !== 'string' || value.trim() === ""
}