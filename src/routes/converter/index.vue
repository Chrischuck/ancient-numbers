<template>
  <div id='not-found-content'>
    <h1 id='header'>CONVERTER {{this.$store.state.counter}}</h1>
    <button v-on:click='this.increment'>click</button>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    methods: {
      increment() {
        this.$store.commit('increment')
      }
    }
  }
</script>

<style>
  #not-found-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    align-content: center;
    margin-top: 5rem;
  }

  #header {
    font-size: 60px;
  }

  #button {
    display: inline-block;
    padding: 6px 12px;
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
    border-color: #9a9999;
    color: #9a9999;
    transition: .5s;
  }

</style>