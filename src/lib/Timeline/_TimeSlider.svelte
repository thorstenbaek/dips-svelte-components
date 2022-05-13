<script lang="ts">
    import Thumb from "./_Thumb.svelte";
    import type TimeRuler from "./TimeRuler";
    import { selection } from "./timeStore";

    export let timeRuler: TimeRuler;    
    let width: number;
</script>

<div class="track" bind:clientWidth="{width}">
    <!-- <button class="time" id="min"/> -->
    <Thumb {width} bind:value={$selection}/>
    <!-- time={new Date().getTime()}/> -->
    <!-- <button class="time" id="max"/> -->
</div>

<style>
    .track {
        height: 40px;
        background: lightgray;
    }    
</style>