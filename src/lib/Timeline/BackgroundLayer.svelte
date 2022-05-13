<script lang="ts">    
    import { Layer } from 'svelte-canvas';
    import type TimeRuler from './TimeRuler';

    export let timeRuler: TimeRuler;

    $: render = ({ context, width, height}) => {        
        timeRuler.render(context, width, height);
}

</script>

<Layer {render}/>