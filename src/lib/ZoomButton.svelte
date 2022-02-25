<script lang="ts">
    import transformation from "./transformation";
    import tracking from "./tracking";
import { Orientation } from "./orientation";

    function onTrack(event: CustomEvent){        
        event.detail.target.innerText = Math.round(event.detail.rect.x) + ", " + Math.round(event.detail.rect.y);
    };
    

</script>


<!-- <div class="button" use:transformation use:tracking on:track={onTrack}/>    
<div class="button2" use:transformation use:tracking on:track={onTrack}/> -->

<div class="button" use:transformation />    


<style>
    .button {    
        position: absolute;
        left: 250px;
        top: 150px;
        height: 75px;
        width: 75px;
        padding: 0;
        margin: 0;
        border: 0;
        background-color: white;
    }
</style>