<script lang="ts">
    import Thumb from './Thumb.svelte';

    export let min: number = 0;
    export let max: number = 100;
    export let value: number[] = [45, 55];

    let width: number;

    function onTrack(detail) {
        console.log("slider ", detail);
    }
</script>

<div class="track" bind:clientWidth={width}>
    <Thumb bind:pos={value} min={min} max={max} width={width} on:track={onTrack} />
</div>

<style>
    .track{
        margin: 10px;
        width: calc(100% - 20px);
        height: 5px;
        background: darkgray;
    }
</style>