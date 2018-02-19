<template>
  <div class="wrapper">
    <div class='half'>
      <img class='img' src='http://originalpeople.org/wp-content/uploads/2013/08/ishango_bone.jpg' />
    </div>
    <div class='half'>
      <div class='word-wrapper'>
        <h1>Another cool fact.</h1>
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
.half {
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