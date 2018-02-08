<template>
  <div class="wrapper">
    <div class="logo">
      <p id="anc">ANCIENT <span id="norm">NUMBER</span></p>
      <p id="norm2">CONVERTER</p>
    </div>  
    <h3>(for millenials)</h3>
    <h2>A simple and graceful ancient number converter made with love.</h2>
    
    <div id="button-wrapper">
      <router-link id='cbutton' v-bind:to="'/convert'">Converter</router-link>
    </div>
    
  </div>
</template>

<script>
  export default {
  }
</script>

<style scoped>

.wrapper {
  height: 750px;
  background-color: #FAEBD7;
}
#button-wrapper {
  text-align: center;
}

.logo {
  margin-top: 6%;
  word-spacing: -10px;
}

#anc {
  font-size: 71px;
  color: #FFCC99;
  font-family: MarketDeco;
  margin-bottom: 0px;
  text-align: center;
}

#norm {
  font-size: 52px;
  color: #282828;
  font-family: MarketDeco;
  margin-bottom: 0px;
  text-align: center;
}

#norm2 {
  font-size: 85px;
  color: #282828;
  font-family: MarketDeco;
  margin-top: 0px;
  margin: 0;
  line-height: 70%;
  text-align: center;
}

h1, h2 {
  font-weight: normal;
  margin-bottom: 0px;
  text-align: center;
}

h3 {
  font-weight: normal;
  margin-top: 0px;
  text-align: center;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

#cbutton {
    display: inline-block;
    padding: 6px 12px;
    margin-top: 10px;
    margin-bottom: 0;
    font-size: 28px;
    font-weight: normal;
    line-height: 1.428571429;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    cursor: pointer;
    background-image: none;
    border: 1px solid;
    border-radius: 4px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
    text-decoration: none;
    border-color: #4d403a;
    border-radius: 50px;
    color: #FFCC99;
    font-family: MarketDeco;
    transition: .5s;
    background-color: #4d403a;
    }
</style>