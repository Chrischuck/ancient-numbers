<template>
  <div class="wrapper">
    <div class='section'>
      <div class='word-wrapper'>
        <p>pic</p>
        <h2>Name one</h2>
        <p>words about</p>
      </div>
    </div>
    <div class='section'>
      <div class='word-wrapper'>
        <p>pic</p>
        <h2>Name one</h2>
        <p>words about</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
  }
</script>

<style scoped>

.wrapper {
  height: 550px;
  display: flex;
  flex-direction: row;
}

.section {
  padding: 10px;
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  flex-direction: column;
}
.img {
  width: 86%;
}
.word-wrapper {
  padding-left: 5%;
  padding-right: 5%;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  flex-direction: column;
}

</style>