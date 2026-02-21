import { _ as __nuxt_component_0 } from './Container-D1D0LwSs.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-CN9IxF-h.mjs';
import { useSSRContext, mergeProps, withCtx, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, Fragment, renderList } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderSlot, ssrRenderList } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import '../_/nitro.mjs';
import '@neondatabase/serverless';
import 'drizzle-orm/neon-http';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import '@iconify/utils';
import 'node:crypto';
import 'consola';
import 'node:url';
import 'ipx';
import 'node:fs';
import 'node:path';
import './server.mjs';
import 'vue-router';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

const _sfc_main$2 = {
  __name: "Navbar",
  __ssrInlineRender: true,
  setup(__props) {
    const menuitems = [
      {
        title: "Tracker",
        url: "/tracker"
      },
      {
        title: "Reports",
        url: "/reports"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Container = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(ssrRenderComponent(_component_Container, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<header class="flex flex-row flex-wrap items-center justify-between my-4 gap-x-6 gap-y-4"${_scopeId}><div class="flex items-center justify-between"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/",
              class: "text-2xl font-bold text-hunt-bone"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="text-hunt-rust"${_scopeId2}>❖</span> Hunt Tracker `);
                } else {
                  return [
                    createVNode("span", { class: "text-hunt-rust" }, "❖"),
                    createTextVNode(" Hunt Tracker ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><nav class="flex w-auto"${_scopeId}><ul class="flex flex-row gap-3 text-sm"${_scopeId}><!--[-->`);
            ssrRenderList(menuitems, (item) => {
              _push2(`<li${_scopeId}>`);
              _push2(ssrRenderComponent(_component_NuxtLink, {
                to: item.url,
                class: "flex px-3 py-2 text-hunt-bone/70 border border-hunt-bone/20 rounded-sm hover:text-hunt-gold hover:border-hunt-gold"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(item.title)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(item.title), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</li>`);
            });
            _push2(`<!--]--></ul></nav></header>`);
          } else {
            return [
              createVNode("header", { class: "flex flex-row flex-wrap items-center justify-between my-4 gap-x-6 gap-y-4" }, [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode(_component_NuxtLink, {
                    to: "/",
                    class: "text-2xl font-bold text-hunt-bone"
                  }, {
                    default: withCtx(() => [
                      createVNode("span", { class: "text-hunt-rust" }, "❖"),
                      createTextVNode(" Hunt Tracker ")
                    ]),
                    _: 1
                  })
                ]),
                createVNode("nav", { class: "flex w-auto" }, [
                  createVNode("ul", { class: "flex flex-row gap-3 text-sm" }, [
                    (openBlock(), createBlock(Fragment, null, renderList(menuitems, (item) => {
                      return createVNode("li", null, [
                        createVNode(_component_NuxtLink, {
                          to: item.url,
                          class: "flex px-3 py-2 text-hunt-bone/70 border border-hunt-bone/20 rounded-sm hover:text-hunt-gold hover:border-hunt-gold"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(item.title), 1)
                          ]),
                          _: 2
                        }, 1032, ["to"])
                      ]);
                    }), 64))
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Navbar.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  _push(`<footer${ssrRenderAttrs(mergeProps({ class: "my-20" }, _attrs))}><p class="text-sm text-center text-hunt-bone/40"> Copyright © ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} Hunt Tracker. Powered by <a href="https://www.netlify.com/" class="underline text-hunt-gold/60 hover:text-hunt-gold">Netlify</a>. </p></footer>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Footer.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1]]), { __name: "Footer" });
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_Navbar = _sfc_main$2;
  const _component_Footer = __nuxt_component_1;
  _push(`<!--[-->`);
  _push(ssrRenderComponent(_component_Navbar, null, null, _parent));
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(ssrRenderComponent(_component_Footer, null, null, _parent));
  _push(`<!--]-->`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { _default as default };
//# sourceMappingURL=default-DPEc9Hnm.mjs.map
