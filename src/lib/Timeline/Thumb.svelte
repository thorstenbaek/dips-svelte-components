<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';        
	import { Orientation } from './../orientation';
    import transformation from "../transformation";

    export var min: number = 0;
    export var max: number = 100;
    export var pos: number[] = [0, 10];
    export var parent: HTMLElement;
    export let width: number;

    const dispatch = createEventDispatcher;
    let _active = false;

    function toScreen(pos: number) {
        console.log(pos);
        var scr =  (pos - min)*width/(max - min);
        console.log(width);
        return scr;
    }

    function toPos(screen: number[]): number[] {
        return screen.map(s => s*(max - min)/width + min);
    }

    function onTrack(r: CustomEvent) {
        if (_active) {
            const rect = r.detail;
            const x = toPos([rect.left, rect.width]);
            console.log(x);
        }
            
    }

    $: screen = pos.map(p => toScreen(p));
</script>

<div class="thumb" 
    style="left:{screen[0]}px;width:{screen[1] - screen[0]}px"
    use:transformation={Orientation.Horizontal} 
    on:active={a => _active = a.detail}
    on:track={onTrack} />

<style>
    .thumb {
        position: absolute;
        top:-5px;        
        width: 25px;
        height: 15px;
        background: darkred;
    }
</style>