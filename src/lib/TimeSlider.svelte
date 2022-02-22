<script>
    import ZoomButton from "./ZoomButton.svelte";
</script>

<div class="slider">
    <!-- <button class="time" id="min"/> -->
    <ZoomButton time={new Date().getTime()}/>
    <!-- <button class="time" id="max"/> -->
</div>

<style>
    .slider {
        position: relative;
        width: 100%;
        height: 1000px;
        background: red;
    }

    .time {
        position: absolute;
        top: 0;
        width: 100px;
        height: 100px;
        color: #fff;
        cursor: arrow;
    }

    #min {
        left: 0;
        background-color: #ff3e00;
    }

    #max {
        right: 0;
        background-color: #003eff;

    }
</style>