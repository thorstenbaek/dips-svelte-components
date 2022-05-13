import type { Writable, Readable } from "svelte/store";
import { writable, derived, readable } from "svelte/store";
import Span from "./Span";

export const now = readable(new Date(), function start(set) {
	const interval = setInterval(() => {
		set(new Date());
	}, 1000);

	return function stop() {
		clearInterval(interval);
	};
});

function createRange() {
    var today = new Date();
    var span = new Span(
		new Date(today.getTime() - 1*3600000), 
		new Date(today.getTime() + 1*3600000),
		new Date(today.getTime() - 5*3600000),
		new Date(today.getTime() + 5*3600000));

    const {subscribe, set, update} = writable([span.start.getTime(), span.end.getTime(), span.min.getTime(), span.max.getTime()]);

    return {
        subscribe,
        set,
        update,
        setSpan: span => {
            set([span.start.getTime(), span.end.getTime(), span.min.getTime(), span.max.getTime()])
        }
    };
}

export const range: Writable<number[]> = createRange();
export const selection: Readable<Span> = derived(range, r => {
    return new Span(new Date(r[0]), new Date(r[1]), new Date(r[2]), new Date(r[3]));
});

export const myRange: Writable<number[]> = writable([45, 55]);