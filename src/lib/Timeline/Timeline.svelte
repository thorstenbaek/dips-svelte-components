<script lang="ts">
    import {Canvas} from "svelte-canvas";
    import TimeRuler from './TimeRuler';
    import Overlay from "./Overlay.svelte";
    import BackgroundLayer from "./BackgroundLayer.svelte";
    import Slider from "./Slider.svelte";
    import SpanDisplay from "./SpanDisplay.svelte";
    import {range, selection, myRange} from "./timeStore";    

    let width: number;
    let height: number;

    let timeRuler: TimeRuler;
    $: {
        timeRuler = new TimeRuler($selection, 200);
    }
</script>

{#if timeRuler}
    <!-- <div class="timeline" bind:clientWidth={width} bind:clientHeight={height}>
        <Canvas width={width} height={height}>            
            <BackgroundLayer {timeRuler} />
        </Canvas>                
        <Overlay {timeRuler} {width} {height}/>                        
    </div> -->
    <Slider bind:value={$myRange} max={100} min={0} />    
    <input type="text" bind:value={$myRange} max={100} min={0} />
{/if}


<style>
    .timeline {        
        overflow-y: auto;   
        overflow-x: hidden;
        height: calc(100% - 40px);
    }   

    /*.content {
        position: absolute;
        top: 35px;
        left: 5px;
        right: 0;        
    }*/
</style>