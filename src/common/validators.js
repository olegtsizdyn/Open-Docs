export const required = value => {
    if (value) {
        return undefined;
    } else {
        return "Required";
    }
}