<script lang="ts">
    import {Orientation} from "./orientation";
    import move from "./move";
    import scale from "./scale";



</script>

<div class="button2" use:scale use:move  />
<div class="button" use:scale use:move />

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