<template>
  <div class="wrapper">
    <div class='half'>
      <div class='word-wrapper'>
        <h2>Some other cool fact.</h2>
      </div>
    </div>
    <div class='half'>
      <img class='img' src='http://originalpeople.org/wp-content/uploads/2013/08/ishango_bone.jpg' />
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
  background-color: #f9f9f9;
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