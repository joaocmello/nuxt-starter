import { _ as __nuxt_component_0$1 } from './Container-D1D0LwSs.mjs';
import { ref, withCtx, unref, createVNode, mergeProps, createTextVNode, toDisplayString, computed, useAttrs, useTemplateRef, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderSlot } from 'vue/server-renderer';
import { H as defu, z as hasProtocol, J as withLeadingSlash, t as joinURL, w as parseURL, K as encodeParam, x as encodePath } from '../_/nitro.mjs';
import { u as useHead, a as useNuxtApp, b as useRuntimeConfig } from './server.mjs';
import { _ as __nuxt_component_0$2 } from './nuxt-link-CN9IxF-h.mjs';
import __nuxt_component_0$3 from './index-Cu6EaYnJ.mjs';
import './_plugin-vue_export-helper-1tPrXgE0.mjs';
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
import 'vue-router';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import '@iconify/utils/lib/css/icon';

async function imageMeta(_ctx, url) {
  const meta = await _imageMeta(url).catch((err) => {
    console.error("Failed to get image meta for " + url, err + "");
    return {
      width: 0,
      height: 0,
      ratio: 0
    };
  });
  return meta;
}
async function _imageMeta(url) {
  {
    const imageMeta2 = await import('image-meta').then((r) => r.imageMeta);
    const data = await fetch(url).then((res) => res.buffer());
    const metadata = imageMeta2(data);
    if (!metadata) {
      throw new Error(`No metadata could be extracted from the image \`${url}\`.`);
    }
    const { width, height } = metadata;
    const meta = {
      width,
      height,
      ratio: width && height ? width / height : void 0
    };
    return meta;
  }
}
function createMapper(map) {
  return ((key) => key !== void 0 ? map[key] || key : map.missingValue);
}
function createOperationsGenerator(config = {}) {
  const formatter = config.formatter;
  const keyMap = config.keyMap && typeof config.keyMap !== "function" ? createMapper(config.keyMap) : config.keyMap;
  const map = {};
  for (const key in config.valueMap) {
    const valueKey = key;
    const value = config.valueMap[valueKey];
    map[valueKey] = typeof value === "object" ? createMapper(value) : value;
  }
  return (modifiers) => {
    const operations = [];
    for (const _key in modifiers) {
      const key = _key;
      if (typeof modifiers[key] === "undefined") {
        continue;
      }
      const value = typeof map[key] === "function" ? map[key](modifiers[key]) : modifiers[key];
      operations.push([keyMap ? keyMap(key) : key, value]);
    }
    if (formatter) {
      return operations.map((entry) => formatter(...entry)).join(config.joinWith ?? "&");
    }
    return new URLSearchParams(operations).toString();
  };
}
function parseDensities(input = "") {
  if (input === void 0 || !input.length) {
    return [];
  }
  const densities = /* @__PURE__ */ new Set();
  for (const density of input.split(" ")) {
    const d = Number.parseInt(density.replace("x", ""));
    if (d) {
      densities.add(d);
    }
  }
  return Array.from(densities);
}
function checkDensities(densities) {
  if (densities.length === 0) {
    throw new Error("`densities` must not be empty, configure to `1` to render regular size only (DPR 1.0)");
  }
}
function parseSize(input = "") {
  if (typeof input === "number") {
    return input;
  }
  if (typeof input === "string") {
    if (input.replace("px", "").match(/^\d+$/g)) {
      return Number.parseInt(input, 10);
    }
  }
}
function parseSizes(input) {
  const sizes = {};
  if (typeof input === "string") {
    for (const entry of input.split(/[\s,]+/).filter((e) => e)) {
      const s = entry.split(":");
      if (s.length !== 2) {
        sizes["1px"] = s[0].trim();
      } else {
        sizes[s[0].trim()] = s[1].trim();
      }
    }
  } else {
    Object.assign(sizes, input);
  }
  return sizes;
}
function createImage(globalOptions) {
  const ctx = {
    options: globalOptions
  };
  const getImage = (input, options = {}) => {
    const image = resolveImage(ctx, input, options);
    return image;
  };
  const $img = ((input, modifiers, options) => getImage(input, defu({ modifiers }, options)).url);
  for (const presetName in globalOptions.presets) {
    $img[presetName] = ((source, modifiers, options) => $img(source, modifiers, { ...globalOptions.presets[presetName], ...options }));
  }
  $img.options = globalOptions;
  $img.getImage = getImage;
  $img.getMeta = ((input, options) => getMeta(ctx, input, options));
  $img.getSizes = ((input, options) => getSizes(ctx, input, options));
  ctx.$img = $img;
  return $img;
}
async function getMeta(ctx, input, options) {
  const image = resolveImage(ctx, input, { ...options });
  if (typeof image.getMeta === "function") {
    return await image.getMeta();
  } else {
    return await imageMeta(ctx, image.url);
  }
}
function resolveImage(ctx, input, options) {
  if (input && typeof input !== "string") {
    throw new TypeError(`input must be a string (received ${typeof input}: ${JSON.stringify(input)})`);
  }
  if (!input || input.startsWith("data:")) {
    return {
      url: input
    };
  }
  const { setup, defaults } = getProvider(ctx, options.provider || ctx.options.provider);
  const provider = setup();
  const preset = getPreset(ctx, options.preset);
  input = hasProtocol(input) ? input : withLeadingSlash(input);
  if (!provider.supportsAlias) {
    for (const base in ctx.options.alias) {
      if (input.startsWith(base)) {
        const alias = ctx.options.alias[base];
        if (alias) {
          input = joinURL(alias, input.slice(base.length));
        }
      }
    }
  }
  if (provider.validateDomains && hasProtocol(input)) {
    const inputHost = parseURL(input).host;
    if (!ctx.options.domains.find((d) => d === inputHost)) {
      return {
        url: input
      };
    }
  }
  const _options = defu(options, preset, defaults);
  const resolvedOptions = {
    ..._options,
    modifiers: {
      ..._options.modifiers,
      width: _options.modifiers?.width ? parseSize(_options.modifiers.width) : void 0,
      height: _options.modifiers?.height ? parseSize(_options.modifiers.height) : void 0
    }
  };
  const image = provider.getImage(input, resolvedOptions, ctx);
  image.format ||= resolvedOptions.modifiers.format || "";
  return image;
}
function getProvider(ctx, name) {
  const provider = ctx.options.providers[name];
  if (!provider) {
    throw new Error("Unknown provider: " + name);
  }
  return provider;
}
function getPreset(ctx, name) {
  if (!name) {
    return {};
  }
  if (!ctx.options.presets[name]) {
    throw new Error("Unknown preset: " + name);
  }
  return ctx.options.presets[name];
}
function getSizes(ctx, input, opts) {
  const preset = getPreset(ctx, opts.preset);
  const merged = defu(opts, preset);
  const width = parseSize(merged.modifiers?.width);
  const height = parseSize(merged.modifiers?.height);
  const sizes = merged.sizes ? parseSizes(merged.sizes) : {};
  const _densities = merged.densities?.trim();
  const densities = _densities ? parseDensities(_densities) : ctx.options.densities;
  checkDensities(densities);
  const hwRatio = width && height ? height / width : 0;
  const sizeVariants = [];
  const srcsetVariants = [];
  if (Object.keys(sizes).length >= 1) {
    for (const key in sizes) {
      const variant = getSizesVariant(key, String(sizes[key]), height, hwRatio, ctx);
      if (variant === void 0) {
        continue;
      }
      sizeVariants.push({
        size: variant.size,
        screenMaxWidth: variant.screenMaxWidth,
        media: `(max-width: ${variant.screenMaxWidth}px)`
      });
      for (const density of densities) {
        srcsetVariants.push({
          width: variant._cWidth * density,
          src: getVariantSrc(ctx, input, opts, variant, density)
        });
      }
    }
    finaliseSizeVariants(sizeVariants);
  } else {
    for (const density of densities) {
      const key = Object.keys(sizes)[0];
      let variant = key ? getSizesVariant(key, String(sizes[key]), height, hwRatio, ctx) : void 0;
      if (variant === void 0) {
        variant = {
          size: "",
          screenMaxWidth: 0,
          _cWidth: opts.modifiers?.width,
          _cHeight: opts.modifiers?.height
        };
      }
      srcsetVariants.push({
        width: density,
        src: getVariantSrc(ctx, input, opts, variant, density)
      });
    }
  }
  finaliseSrcsetVariants(srcsetVariants);
  const defaultVariant = srcsetVariants[srcsetVariants.length - 1];
  const sizesVal = sizeVariants.length ? sizeVariants.map((v) => `${v.media ? v.media + " " : ""}${v.size}`).join(", ") : void 0;
  const suffix = sizesVal ? "w" : "x";
  const srcsetVal = srcsetVariants.map((v) => `${v.src} ${v.width}${suffix}`).join(", ");
  return {
    sizes: sizesVal,
    srcset: srcsetVal,
    src: defaultVariant?.src
  };
}
function getSizesVariant(key, size, height, hwRatio, ctx) {
  const screenMaxWidth = ctx.options.screens && ctx.options.screens[key] || Number.parseInt(key);
  const isFluid = size.endsWith("vw");
  if (!isFluid && /^\d+$/.test(size)) {
    size = size + "px";
  }
  if (!isFluid && !size.endsWith("px")) {
    return void 0;
  }
  let _cWidth = Number.parseInt(size);
  if (!screenMaxWidth || !_cWidth) {
    return void 0;
  }
  if (isFluid) {
    _cWidth = Math.round(_cWidth / 100 * screenMaxWidth);
  }
  const _cHeight = hwRatio ? Math.round(_cWidth * hwRatio) : height;
  return {
    size,
    screenMaxWidth,
    _cWidth,
    _cHeight
  };
}
function getVariantSrc(ctx, input, opts, variant, density) {
  return ctx.$img(
    input,
    {
      ...opts.modifiers,
      width: variant._cWidth ? variant._cWidth * density : void 0,
      height: variant._cHeight ? variant._cHeight * density : void 0
    },
    opts
  );
}
function finaliseSizeVariants(sizeVariants) {
  sizeVariants.sort((v1, v2) => v1.screenMaxWidth - v2.screenMaxWidth);
  let previousMedia = null;
  for (let i = sizeVariants.length - 1; i >= 0; i--) {
    const sizeVariant = sizeVariants[i];
    if (sizeVariant.media === previousMedia) {
      sizeVariants.splice(i, 1);
    }
    previousMedia = sizeVariant.media;
  }
  for (let i = 0; i < sizeVariants.length; i++) {
    sizeVariants[i].media = sizeVariants[i + 1]?.media || "";
  }
}
function finaliseSrcsetVariants(srcsetVariants) {
  srcsetVariants.sort((v1, v2) => v1.width - v2.width);
  let previousWidth = null;
  for (let i = srcsetVariants.length - 1; i >= 0; i--) {
    const sizeVariant = srcsetVariants[i];
    if (sizeVariant.width === previousWidth) {
      srcsetVariants.splice(i, 1);
    }
    previousWidth = sizeVariant.width;
  }
}
function defineProvider(setup) {
  let result;
  return () => {
    if (result) {
      return result;
    }
    result = typeof setup === "function" ? setup() : setup;
    return result;
  };
}
const operationsGenerator = createOperationsGenerator({
  keyMap: {
    format: "f",
    width: "w",
    height: "h",
    resize: "s",
    quality: "q",
    background: "b",
    position: "pos"
  },
  formatter: (key, val) => encodeParam(key) + "_" + encodeParam(val.toString())
});
const ipxRuntime$_45ki8sQ1mskKCpbgxYVef8iET5OAofxDqRK4C6Z_i6pE = defineProvider({
  validateDomains: true,
  supportsAlias: true,
  getImage: (src, { modifiers, baseURL }, ctx) => {
    if (modifiers.width && modifiers.height) {
      modifiers.resize = `${modifiers.width}x${modifiers.height}`;
      delete modifiers.width;
      delete modifiers.height;
    }
    const params = operationsGenerator(modifiers) || "_";
    if (!baseURL) {
      baseURL = joinURL(ctx.options.nuxt.baseURL, "/_ipx");
    }
    return {
      url: joinURL(baseURL, params, encodePath(src))
    };
  }
});
const imageOptions = {
  ...{
    "screens": {
      "sm": 640,
      "md": 768,
      "lg": 1024,
      "xl": 1280,
      "2xl": 1536
    },
    "presets": {},
    "provider": "ipx",
    "domains": [],
    "alias": {},
    "densities": [
      1,
      2
    ],
    "format": [
      "webp"
    ]
  },
  /** @type {"ipx"} */
  provider: "ipx",
  providers: {
    ["ipx"]: { setup: ipxRuntime$_45ki8sQ1mskKCpbgxYVef8iET5OAofxDqRK4C6Z_i6pE, defaults: {} }
  }
};
const useImage = (event) => {
  const config = useRuntimeConfig();
  const nuxtApp = useNuxtApp();
  return nuxtApp.$img || nuxtApp._img || (nuxtApp._img = createImage({
    ...imageOptions,
    event: nuxtApp.ssrContext?.event,
    nuxt: {
      baseURL: config.app.baseURL
    },
    runtimeConfig: config
  }));
};
const useImageProps = (props) => {
  const $img = useImage();
  const providerOptions = computed(() => ({
    provider: props.provider,
    preset: props.preset
  }));
  const normalizedAttrs = computed(() => ({
    width: parseSize(props.width),
    height: parseSize(props.height),
    crossorigin: props.crossorigin === true ? "anonymous" : props.crossorigin || void 0,
    nonce: props.nonce
  }));
  const imageModifiers = computed(() => {
    return {
      ...props.modifiers,
      width: props.width,
      height: props.height,
      format: props.format,
      quality: props.quality || $img.options.quality,
      background: props.background,
      fit: props.fit
    };
  });
  return { providerOptions, normalizedAttrs, imageModifiers };
};
const _sfc_main$6 = {
  __name: "NuxtImg",
  __ssrInlineRender: true,
  props: {
    custom: { type: Boolean, required: false },
    placeholder: { type: [Boolean, String, Number, Array], required: false },
    placeholderClass: { type: String, required: false },
    src: { type: String, required: false },
    format: { type: String, required: false },
    quality: { type: [String, Number], required: false },
    background: { type: String, required: false },
    fit: { type: String, required: false },
    modifiers: { type: Object, required: false },
    preset: { type: String, required: false },
    provider: { type: null, required: false },
    sizes: { type: [String, Object], required: false },
    densities: { type: String, required: false },
    preload: { type: [Boolean, Object], required: false },
    width: { type: [String, Number], required: false },
    height: { type: [String, Number], required: false },
    crossorigin: { type: [String, Boolean], required: false },
    nonce: { type: String, required: false }
  },
  emits: ["load", "error"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const $img = useImage();
    const { providerOptions, normalizedAttrs, imageModifiers } = useImageProps(props);
    const sizes = computed(() => $img.getSizes(props.src, {
      ...providerOptions.value,
      sizes: props.sizes,
      densities: props.densities,
      modifiers: imageModifiers.value
    }));
    const placeholderLoaded = ref(false);
    const attrs = useAttrs();
    const imgAttrs = computed(() => ({
      ...normalizedAttrs.value,
      "data-nuxt-img": "",
      ...!props.placeholder || placeholderLoaded.value ? { sizes: sizes.value.sizes, srcset: sizes.value.srcset } : {},
      ...{ onerror: "this.setAttribute('data-error', 1)" },
      ...attrs
    }));
    const placeholder = computed(() => {
      if (placeholderLoaded.value) {
        return false;
      }
      const placeholder2 = props.placeholder === "" ? [10, 10] : props.placeholder;
      if (!placeholder2) {
        return false;
      }
      if (typeof placeholder2 === "string") {
        return placeholder2;
      }
      const [width = 10, height = width, quality = 50, blur = 3] = Array.isArray(placeholder2) ? placeholder2 : typeof placeholder2 === "number" ? [placeholder2] : [];
      return $img(props.src, {
        ...imageModifiers.value,
        width,
        height,
        quality,
        blur
      }, providerOptions.value);
    });
    const mainSrc = computed(
      () => props.sizes ? sizes.value.src : $img(props.src, imageModifiers.value, providerOptions.value)
    );
    const src = computed(() => placeholder.value || mainSrc.value);
    if (props.preload) {
      const hasMultipleDensities = sizes.value.srcset.includes("x, ");
      const isResponsive = hasMultipleDensities || !!sizes.value.sizes;
      useHead({
        link: [{
          rel: "preload",
          as: "image",
          nonce: props.nonce,
          crossorigin: normalizedAttrs.value.crossorigin,
          href: isResponsive ? sizes.value.src : src.value,
          ...sizes.value.sizes && { imagesizes: sizes.value.sizes },
          ...hasMultipleDensities && { imagesrcset: sizes.value.srcset },
          ...typeof props.preload !== "boolean" && props.preload.fetchPriority ? { fetchpriority: props.preload.fetchPriority } : {}
        }]
      });
    }
    useNuxtApp().isHydrating;
    const imgEl = useTemplateRef("imgEl");
    __expose({ imgEl });
    return (_ctx, _push, _parent, _attrs) => {
      if (!__props.custom) {
        _push(`<img${ssrRenderAttrs(mergeProps({
          ref_key: "imgEl",
          ref: imgEl,
          class: placeholder.value ? __props.placeholderClass : void 0
        }, imgAttrs.value, { src: src.value }, _attrs))}>`);
      } else {
        ssrRenderSlot(_ctx.$slots, "default", {
          imgAttrs: imgAttrs.value,
          isLoaded: placeholderLoaded.value,
          src: src.value
        }, null, _push, _parent);
      }
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/image/dist/runtime/components/NuxtImg.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$6, { __name: "NuxtImg" });
const _sfc_main$5 = {
  __name: "Hero",
  __ssrInlineRender: true,
  props: {
    title: String,
    description: String,
    image: String,
    imageAlt: String,
    buttons: Array
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col gap-12 mt-10 mb-20 lg:items-center lg:flex-row" }, _attrs))}><div class="flex-1 w-full">`);
      if (__props.image) {
        _push(ssrRenderComponent(_component_NuxtImg, {
          class: "rounded-lg",
          sizes: "100vw lg:600px",
          src: __props.image,
          alt: __props.imageAlt
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex-1 w-full">`);
      if (__props.title) {
        _push(`<h1 class="text-4xl font-bold text-hunt-bone sm:text-5xl text-balance">${ssrInterpolate(__props.title)}</h1>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.description) {
        _push(`<p class="max-w-xl mt-4 text-lg text-hunt-bone/80 sm:text-xl">${ssrInterpolate(__props.description)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex flex-wrap gap-4 mt-8"><!--[-->`);
      ssrRenderList(__props.buttons, (button) => {
        _push(`<div>`);
        if (button.label && button.url) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            href: button.url,
            class: "inline-flex px-6 py-3 text-white duration-300 bg-hunt-rust rounded-sm hover:bg-hunt-gold transition-color"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(button.label)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(button.label), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div></div></div>`);
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Hero.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = {
  __name: "Logos",
  __ssrInlineRender: true,
  props: {
    title: String,
    icons: Array
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0$3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mb-20" }, _attrs))}>`);
      if (__props.title) {
        _push(`<h2 class="text-center text-zinc-600">${ssrInterpolate(__props.title)}</h2>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex flex-wrap items-center justify-center mt-10 gap-x-12 gap-y-8 sm:gap-x-24 sm:gap-y-12"><!--[-->`);
      ssrRenderList(__props.icons, (icon) => {
        _push(`<div>`);
        if (icon.name) {
          _push(ssrRenderComponent(_component_Icon, {
            class: "h-8 md:h-12",
            name: icon.name,
            size: "48"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Logos.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = {
  __name: "Features",
  __ssrInlineRender: true,
  props: {
    title: String,
    description: String,
    items: Array
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      if (__props.title) {
        _push(`<h2 class="text-3xl font-bold text-center text-hunt-bone sm:text-4xl">${ssrInterpolate(__props.title)}</h2>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.description) {
        _push(`<p class="max-w-3xl mx-auto mt-4 text-lg text-center text-hunt-bone/60">${ssrInterpolate(__props.description)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="grid gap-8 mt-10 mb-20 md:grid-cols-2"><!--[-->`);
      ssrRenderList(__props.items, (item) => {
        _push(`<div class="p-8 border-2 border-dashed rounded-sm border-hunt-bone/20 sm:p-12">`);
        if (item.title) {
          _push(`<h3 class="text-2xl font-semibold text-hunt-bone">${ssrInterpolate(item.title)}</h3>`);
        } else {
          _push(`<!---->`);
        }
        if (item.description) {
          _push(`<p class="mt-2 leading-relaxed text-hunt-bone/50">${ssrInterpolate(item.description)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div><!--]-->`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Features.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = {
  __name: "Testimonials",
  __ssrInlineRender: true,
  props: {
    title: String,
    description: String,
    items: Array
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_0;
      _push(`<!--[-->`);
      if (__props.title) {
        _push(`<h2 class="text-3xl font-bold text-center text-hunt-bone sm:text-4xl">${ssrInterpolate(__props.title)}</h2>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.description) {
        _push(`<p class="max-w-3xl mx-auto mt-4 text-lg text-center text-hunt-bone/60">${ssrInterpolate(__props.description)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mt-10 mb-20 sm:gap-8 sm:columns-2 lg:columns-3"><!--[-->`);
      ssrRenderList(__props.items, (item) => {
        _push(`<blockquote class="p-8 mb-8 border-2 border-dashed rounded-sm border-hunt-bone/20 break-inside-avoid sm:p-12">`);
        if (item.quote) {
          _push(`<p class="text-hunt-bone/50">${ssrInterpolate(item.quote)}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (item.author) {
          _push(`<footer class="flex items-center gap-4 mt-4">`);
          if (item.author.avatar) {
            _push(ssrRenderComponent(_component_NuxtImg, {
              src: item.author.avatar,
              alt: item.author.name,
              width: "64",
              height: "64",
              class: "object-cover w-16 h-16 rounded-sm shrink-0"
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          if (item.author.name || item.author.title) {
            _push(`<div class="text-sm">`);
            if (item.author.name) {
              _push(`<p class="font-bold text-hunt-bone">${ssrInterpolate(item.author.name)}</p>`);
            } else {
              _push(`<!---->`);
            }
            if (item.author.title) {
              _push(`<p class="text-hunt-bone/50">${ssrInterpolate(item.author.title)}</p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</footer>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</blockquote>`);
      });
      _push(`<!--]--></div><!--]-->`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Testimonials.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "Cta",
  __ssrInlineRender: true,
  props: {
    title: String,
    description: String,
    buttons: Array
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col items-center px-10 py-10 mx-auto mb-20 text-center border-2 border-hunt-rust/50 border-dashed rounded-lg sm:px-20 sm:py-20 bg-hunt-charcoal shadow-2xl" }, _attrs))}>`);
      if (__props.title) {
        _push(`<h2 class="text-4xl font-bold text-balance text-hunt-bone sm:text-5xl">${ssrInterpolate(__props.title)}</h2>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.description) {
        _push(`<p class="mt-4 text-lg text-hunt-bone/60 sm:text-xl">${ssrInterpolate(__props.description)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex flex-wrap gap-4 mt-8"><!--[-->`);
      ssrRenderList(__props.buttons, (button) => {
        _push(`<div>`);
        if (button.label && button.url) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            href: button.url,
            class: "inline-flex px-6 py-3 text-white duration-300 bg-hunt-rust rounded-sm hover:bg-hunt-gold transition-color"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(button.label)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(button.label), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Cta.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const hero = { "title": "Master the Bayou with Hunt Tracker", "description": "Track your kills, deaths, and extractions. Analyze your performance and become the ultimate hunter in Hunt: The Showdown.", "image": "images/hero.jpg", "imageAlt": "Hunt Tracker Hero", "buttons": [{ "label": "Start Tracking", "url": "/tracker" }] };
const logos = { "title": "Trusted by the world's best", "icons": [{ "name": "i-simple-icons-gitlab" }, { "name": "i-simple-icons-github" }, { "name": "i-simple-icons-openai" }, { "name": "i-simple-icons-google" }, { "name": "i-simple-icons-netlify" }] };
const features = { "title": "Why choose Nuxt.js?", "description": "Nuxt.js is a powerful framework built on top of Vue.js that provides an excellent developer experience.", "items": [{ "title": "Server-Side Rendering", "description": "Nuxt.js allows you to build SSR applications with Vue.js, ensuring fast initial page loads and better SEO." }, { "title": "Static Site Generation", "description": "You can pre-render pages at build time for static websites. This helps with performance and scalability by serving content directly from a CDN." }, { "title": "Auto-Routing", "description": "Nuxt automatically generates routes based on the file structure inside the pages directory, reducing the need for manual configuration." }, { "title": "File-based Configuration", "description": "Nuxt uses a convention-over-configuration approach, allowing you to define configurations easily in nuxt.config.js without much boilerplate." }, { "title": "Dynamic Imports", "description": "It supports lazy loading of components with dynamic imports to improve performance by splitting the code into smaller chunks." }, { "title": "SEO Friendly", "description": "With SSR, SSG, and automatic meta tag handling, Nuxt.js ensures your application is SEO-friendly." }] };
const testimonials = { "title": "What Our Users Are Saying", "description": "Hear from our clients about their experiences working with Nuxt and Netlify.", "items": [{ "quote": "Nuxt has made building our projects so much easier and more enjoyable! Its simple setup and powerful features help us create fast, responsive websites with minimal effort.", "author": { "name": "Daniel H.", "title": "Marketing Specialist at Some Company", "avatar": "images/person-1.jpg" } }, { "quote": "The scalability offered by Netlify and the flexibility of Nuxt have allowed us to expand our site's functionality without worrying about performance issues. This combination is a powerful solution for any growing business.", "author": { "name": "Sarah L.", "title": "CEO at Some Company", "avatar": "images/person-2.jpg" } }, { "quote": "Switching to Nuxt and Netlify was a game-changer for our development process. The seamless integration between the two platforms allowed us to deploy faster and with fewer headaches.", "author": { "name": "Mark T.", "title": "Frontend Engineer at Some Company", "avatar": "images/person-3.jpg" } }] };
const cta = { "title": "Start Building with Nuxt & Netlify", "description": "Let your next project be smarter, faster, and effortlessly deployable.", "buttons": [{ "label": "Get Started Today", "url": "https://www.netlify.com/" }] };
const pageData = {
  hero,
  logos,
  features,
  testimonials,
  cta
};
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const page = ref(pageData);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Container = __nuxt_component_0$1;
      const _component_Hero = _sfc_main$5;
      const _component_Logos = _sfc_main$4;
      const _component_Features = _sfc_main$3;
      const _component_Testimonials = _sfc_main$2;
      const _component_Cta = _sfc_main$1;
      _push(ssrRenderComponent(_component_Container, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Hero, {
              title: unref(page).hero.title,
              description: unref(page).hero.description,
              image: unref(page).hero.image,
              imageAlt: unref(page).hero.imageAlt,
              buttons: unref(page).hero.buttons
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Logos, {
              title: unref(page).logos.title,
              icons: unref(page).logos.icons
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Features, {
              title: unref(page).features.title,
              description: unref(page).features.description,
              items: unref(page).features.items
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Testimonials, {
              title: unref(page).testimonials.title,
              description: unref(page).testimonials.description,
              items: unref(page).testimonials.items
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Cta, {
              title: unref(page).cta.title,
              description: unref(page).cta.description,
              buttons: unref(page).cta.buttons
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Hero, {
                title: unref(page).hero.title,
                description: unref(page).hero.description,
                image: unref(page).hero.image,
                imageAlt: unref(page).hero.imageAlt,
                buttons: unref(page).hero.buttons
              }, null, 8, ["title", "description", "image", "imageAlt", "buttons"]),
              createVNode(_component_Logos, {
                title: unref(page).logos.title,
                icons: unref(page).logos.icons
              }, null, 8, ["title", "icons"]),
              createVNode(_component_Features, {
                title: unref(page).features.title,
                description: unref(page).features.description,
                items: unref(page).features.items
              }, null, 8, ["title", "description", "items"]),
              createVNode(_component_Testimonials, {
                title: unref(page).testimonials.title,
                description: unref(page).testimonials.description,
                items: unref(page).testimonials.items
              }, null, 8, ["title", "description", "items"]),
              createVNode(_component_Cta, {
                title: unref(page).cta.title,
                description: unref(page).cta.description,
                buttons: unref(page).cta.buttons
              }, null, 8, ["title", "description", "buttons"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CkV-b7d3.mjs.map
