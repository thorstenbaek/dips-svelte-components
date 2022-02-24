<script lang="ts">
    import transformation from "./transformation";
    import tracking from "./tracking";

    function onTrack(event: CustomEvent){        
        event.detail.target.innerText = Math.round(event.detail.rect.x) + ", " + Math.round(event.detail.rect.y);
    };
    

</script>


<div class="button" use:transformation use:tracking on:track={onTrack}/>    
<div class="button2" use:transformation use:tracking on:track={onTrack}/>

<style>
    .button {    
        position: absolute;
        left: 250px;
        top: 150px;
        height: 100px;
        width: 100px;
        padding: 0;
        margin: 0;
        border: 0;
        background-color: blue;
    }

    .button2 {            
        position: absolute;
        left: 350px;
        top: 150px;
        height: 100px;
        width: 100px;
        padding: 0;
        margin: 0;
        border: 0;
        background-color: white;
    }
</style>