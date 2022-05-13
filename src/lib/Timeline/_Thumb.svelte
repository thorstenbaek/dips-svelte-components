<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import transformation from "../transformation";
    import tracking from "../tracking";
    import { Orientation } from "../orientation";
    import {selection} from "./timeStore";        
    import Span from "./Span";
    
    export let width: number;
    
    const dispatch = createEventDispatcher();

    let knobLeft: number;
    let knobWidth: number;

    function onTrack(event: CustomEvent){        
        const totalWidth =  $selection.max.getTime() - $selection.min.getTime();
        var start = $selection.min.getTime() + (event.detail.rect.x*totalWidth)/width;
        var span = $selection.min.getTime() + (event.detail.rect.width*totalWidth)/width;
        
        //dispatch("input", { new Span(start, span });
    }

    $: {
        const totalWidth =  $selection.max.getTime() - $selection.min.getTime();
        const selectionStart = $selection.start.getTime() - $selection.min.getTime();
        const selectionWidth = $selection.end.getTime() - $selection.start.getTime();
        knobWidth = (width*selectionWidth)/totalWidth;
        knobLeft = (width*selectionStart)/totalWidth;
    }

</script>


<!-- <div class="button" use:transformation use:tracking on:track={onTrack}/>    
<div class="button2" use:transformation use:tracking on:track={onTrack}/> -->

<div class="button" use:transformation={Orientation.Horizontal} use:tracking on:track={onTrack}
    style="left:{knobLeft}px;width:{knobWidth}px"/>    

<style>
    .button {    
        position: absolute;
        left: 250px;        
        top: 2px;
        height: 36px;
        width: 75px;
        background-color: blue;
    }
</style>