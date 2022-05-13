<script lang="ts">
    import type TimeRuler from "./TimeRuler";    
    import {now} from "./timeStore";

    export let timeRuler: TimeRuler;
    export let width: number;
    export let height: number;

    let pos: number;
    let isLeft: boolean;
    let isRight: boolean;    

    $: {                                    
        pos = timeRuler?.getX($now.getTime(), width);     
        isLeft = pos < timeRuler.leftMargin - 30;
        isRight = pos > width + 30;
    }
</script>

{#if (!isLeft && !isRight)}
    <div class=line style={`left:${pos}px;height:${height-5}px`}/>
    <div class=overlay style={`left:${pos}px`}>
        {$now.toLocaleTimeString("nb-no", {
            hour: '2-digit',
            minute:'2-digit',
            second:'2-digit',
            hour12: false
        })}
    </div>
{:else if isLeft}
    <div class=overlayLeft style={`left:${timeRuler.leftMargin - 30}px`}></div>
{:else if isRight}
    <div class=overlayRight style={`left:${width-60}px;right:${width}px`}></div>
{/if}

<style>
    .overlay {
        position: absolute;
        transform: translate(-50%, 0);
        top: 3px;
        padding: 3px 0 0 0;
        height: 16px;
        width: 60px;
        background: rgb(235, 126, 18);        
        color: white;
        font: bold 12px Arial;
        text-align: center;        
        border-radius: 4px;        
    }

    .overlayLeft {
        position: absolute;
        top: 3px;        
        height: 19px;
        width: 75px;
        background-image: linear-gradient(to left, rgba(235,126,18,0), rgba(235,126,18,1));
    }

    .overlayRight {
        position: absolute;        
        top: 3px;        
        height: 19px;
        width: 75px;
        background-image: linear-gradient(to right, rgba(235,126,18,0), rgba(235,126,18,1));
    }

    .line {
        position: absolute;
        top: 3px;
        bottom: 0;
        width: 2px;
        transform: translate(-50%, 0);
        background: rgb(235, 126, 18);
        opacity: 0.6;
    }
</style>