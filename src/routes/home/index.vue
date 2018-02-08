<template>
  <div class='landing-wrapper'>
    <Banner />
    <SectionOne />
    <SectionTwo />
    <SectionThree />
    <SectionFour />
  </div>
</template>

<script>
  import Banner from './components/banner.vue'
  import SectionOne from './components/sectionOne.vue'
  import SectionTwo from './components/sectionTwo.vue'
  import SectionThree from './components/sectionThree.vue'
  import SectionFour from './components/sectionFour.vue'

  export default {
    components: {
      Banner,
      SectionOne,
      SectionTwo,
      SectionThree,
      SectionFour
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