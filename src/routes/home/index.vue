<template>
  <div class='landing-wrapper'>
    <Banner />
    <SectionOne />
    <SectionTwo />
    <SectionThree />
    <SectionFour />
    <About />
  </div>
</template>

<script>
  import Banner from './components/banner.vue'
  import SectionOne from './components/sectionOne.vue'
  import SectionTwo from './components/sectionTwo.vue'
  import SectionThree from './components/sectionThree.vue'
  import SectionFour from './components/sectionFour.vue'
  import About from './components/about.vue'

  export default {
    components: {
      Banner,
      SectionOne,
      SectionTwo,
      SectionThree,
      SectionFour,
      About
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  @font-face {
    font-family: MarketDeco;
    src: url('../../assets/fonts/Market_Deco.ttf');
  }
  .landing-wrapper {
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
  }
 
</style>