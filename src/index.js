import Vue from 'vue'
import Portal from './components/Portal'
import config, { setSelector } from './config'

function install(_Vue, options = {}) {
  _Vue.component(options.name || 'portal', Portal)
  if (options.defaultSelector) {
    setSelector(options.defaultSelector)
  }
}

export default install
export { Portal, setSelector, config }
