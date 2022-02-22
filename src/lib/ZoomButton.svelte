<script lang="ts">
    import {Orientation} from "./orientation";
    import move from "./move";
    import scale from "./scale";



</script>

<div class="button2" use:move />
<div class="button" use:move use:scale />

<style>
    .button {    
        position: absolute;
        left: 250px;
        height: 100px;
        width: 100px;
        background-color: blue;
    }

    .button2 {    
        position: absolute;
        left: 350px;
        height: 100px;
        width: 100px;
        background-color: white;
    }
</style>