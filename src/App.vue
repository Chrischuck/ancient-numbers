<template>
  <div id="content">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'ancient-numbers'
  }
</script>

<style>
#content {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 50px;
}

.wrapper {
  height: 100vh;
	width: 100vw;
	background-color: #FAEBD7;
	position: absolute;
	left: 0;
	top: 0;
	transition: .5s;
}
</style>