export class Announcement {
    public _key: string;
    public _text: string;
    public _date: Date;
    public _group: string;

    constructor(key: string, text: string, date: Date, group: string) {
        this._key = key;
        this._text = text;
        this._date = date;
        this._group = group;
    }


    /**
     * Getter key
     * @return {string}
     */
    public get key(): string {
        return this._key;
    }

    /**
     * Getter text
     * @return {string}
     */
    public get text(): string {
        return this._text;
    }

    /**
     * Getter date
     * @return {Date}
     */
    public get date(): Date {
        return this._date;
    }

    /**
     * Getter group
     * @return {string}
     */
    public get group(): string {
        return this._group;
    }

    /**
     * Setter key
     * @param {string} value
     */
    public set key(value: string) {
        this._key = value;
    }

    /**
     * Setter text
     * @param {string} value
     */
    public set text(value: string) {
        this._text = value;
    }

    /**
     * Setter date
     * @param {Date} value
     */
    public set date(value: Date) {
        this._date = value;
    }

    /**
     * Setter group
     * @param {string} value
     */
    public set group(value: string) {
        this._group = value;
    }

}