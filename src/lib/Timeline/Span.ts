import type TimeRuler from "./TimeRuler";

export default class Span {
    start: Date;
    end: Date;
    min: Date;
    max: Date;

    constructor(start: Date, end: Date, min: Date, max: Date) {
        this.start = start;
        this.end = end;
        this.min = min;
        this.max = max;
    }

    getLeft(timeRuler: TimeRuler, w: number): number {
        return timeRuler.getX(this.start.getTime(), w, false, 0);
    }

    getWidth(timeRuler: TimeRuler, w: number): number {
        return timeRuler.getX(this.end.getTime(), w, false, 0) - this.getLeft(timeRuler, w);
    }

    getMin(timeRuler: TimeRuler, w: number): number {
        return timeRuler.getX(this.min.getTime(), w, false, 0);
    }

    getTotalWidth(timeRuler: TimeRuler, w: number): number {
        return timeRuler.getX(this.max.getTime(), w, false, 0) - this.getMin(timeRuler, w);
    }
}