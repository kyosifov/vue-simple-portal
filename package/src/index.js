import Vue from 'vue';
import Portal from './components/Portal';
import config, { setSelector } from './config';

function install(_Vue) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  _Vue.component(options.name || 'portal', Portal);

  if (options.defaultSelector) {
    setSelector(options.defaultSelector);
  }
}

export default install;
export { Portal, setSelector, config };