import Vue from 'vue';
import get from 'lodash.get';
import config, { isBrowser } from '../config';
import TargetContainer from './TargetContainer';
export default Vue.extend({
  name: 'VueSimplePortal',
  props: {
    disabled: {
      type: Boolean
    },
    prepend: {
      type: Boolean
    },
    selector: {
      type: String,
      default: function _default() {
        return "#".concat(config.selector);
      }
    },
    tag: {
      type: String,
      default: 'DIV'
    }
  },
  render: function render(h) {
    if (this.disabled) {
      var nodes = this.$scopedSlots && this.$scopedSlots.default();
      if (!nodes) return h();
      return nodes.length < 2 && !nodes[0].text ? nodes : h(this.tag, nodes);
    }

    return h();
  },
  created: function created() {
    if (!this.getTargetEl()) {
      this.insertTargetEl();
    }
  },
  updated: function updated() {
    var _this = this;

    // We only update the target container component
    // if the scoped slot function is a fresh one
    // The new slot syntax (since Vue 2.6) can cache unchanged slot functions
    // and we want to respect that here.
    this.$nextTick(function () {
      if (!_this.disabled && _this.slotFn !== _this.$scopedSlots.default) {
        _this.container.updatedNodes = _this.$scopedSlots.default;
      }

      _this.slotFn = _this.$scopedSlots.default;
    });
  },
  beforeDestroy: function beforeDestroy() {
    this.unmount();
  },
  watch: {
    disabled: {
      immediate: true,
      handler: function handler(disabled) {
        disabled ? this.unmount() : this.$nextTick(this.mount);
      }
    }
  },
  methods: {
    // This returns the element into which the content should be mounted.
    getTargetEl: function getTargetEl() {
      if (!isBrowser) return;
      return document.querySelector(this.selector);
    },
    insertTargetEl: function insertTargetEl() {
      if (!isBrowser) return;
      var parent = document.querySelector('body');
      this.createdPortalElement = document.createElement(this.tag);
      var classNames = get(this, '$vnode.data.staticClass', get(this, '$vnode.data.class', ''));

      if (classNames) {
        this.createdPortalElement.classList.add(classNames);
      }

      this.createdPortalElement.id = this.selector.substring(1);
      parent.appendChild(this.createdPortalElement);
    },
    mount: function mount() {
      if (!isBrowser) return;
      var targetEl = this.getTargetEl();
      var el = document.createElement('DIV');

      if (this.prepend && targetEl.firstChild) {
        targetEl.insertBefore(el, targetEl.firstChild);
      } else {
        targetEl.appendChild(el);
      }

      this.container = new TargetContainer({
        el: el,
        parent: this,
        propsData: {
          tag: this.tag,
          nodes: this.$scopedSlots.default
        }
      });
    },
    unmount: function unmount() {
      if (this.createdPortalElement) {
        this.createdPortalElement.parentNode.removeChild(this.createdPortalElement);
      }

      if (this.container) {
        this.container.$destroy();
        delete this.container;
      }
    }
  }
});