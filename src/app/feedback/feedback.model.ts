export class Feedback {
    private _feedbackId: number;

    private _oefeningId: number;
    private _beschrijving: string;
    private _score: number;

    constructor(beschrijving: string, score: number, oefeningId: number) {
        this._beschrijving = beschrijving;
        this._score = score;
        this._oefeningId = oefeningId;
    }

    get feedbackId(): number {
        return this._feedbackId;
    }

    get oefeningId(): number {
        return this._oefeningId;
    }

    get beschrijving(): string {
        return this._beschrijving;
    }

    get score(): number {
        return this._score;
    }

    set oefeningId(oefeningId: number) {
        this._oefeningId = oefeningId;
    }

    set beschrijving(beschrijving: string) {
        this._beschrijving = beschrijving;
    }

    set score(score: number) {
        this._score = score;
    }
}
