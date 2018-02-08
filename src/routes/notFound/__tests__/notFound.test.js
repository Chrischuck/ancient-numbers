import Vue from 'vue'
import NotFound from '../index.vue'

describe('index.vue', () => {
  it('displays default message', () => {
    const Ctor = Vue.extend(NotFound)
    const vm = new Ctor().$mount()

    expect(vm.$el.textContent).toContain('404 Not Found')
  })
})