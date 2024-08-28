// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Str {
    static title = (str: string): string =>
        str.toLowerCase().replace(/(^|\s)\S/g,  (firstLetter) => firstLetter.toUpperCase());
}
