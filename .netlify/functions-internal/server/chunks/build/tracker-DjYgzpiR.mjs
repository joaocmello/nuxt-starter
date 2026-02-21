import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrInterpolate } from 'vue/server-renderer';
import { u as useMatches } from './useMatches-CSWuRqzz.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "tracker",
  __ssrInlineRender: true,
  setup(__props) {
    useMatches();
    const form = ref({
      result: "Extraction",
      bossesBanished: 0,
      map: "Stillwater Bayou",
      players: [
        { name: "", kills: 0, deaths: 0, moneyGained: 0 }
      ]
    });
    const teamStats = computed(() => {
      return form.value.players.reduce((acc, p) => {
        acc.totalKills += p.kills;
        acc.totalDeaths += p.deaths;
        acc.totalMoneyGained += p.moneyGained;
        return acc;
      }, { totalKills: 0, totalDeaths: 0, totalMoneyGained: 0 });
    });
    const maps = [
      "Stillwater Bayou",
      "Lawson Delta",
      "Desalle",
      "Mammon's Gulch"
    ];
    const results = ["Extraction", "Death", "Loss"];
    const knownPlayers = [
      "Bonkersdud",
      "andreguyc",
      "edbacil",
      "Alex",
      "PolarBeardedBear"
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "py-12 px-6 max-w-4xl mx-auto" }, _attrs))}><h1 class="text-4xl font-bold mb-8 text-hunt-bone">Track New Match</h1><form class="space-y-8 bg-hunt-charcoal p-8 rounded-2xl shadow-xl border border-hunt-bone/10"><div class="grid grid-cols-1 md:grid-cols-3 gap-6"><div><label class="block text-sm font-medium text-hunt-bone/70 mb-2">Match Result</label><select class="w-full px-4 py-2 rounded-lg bg-black/40 border border-hunt-bone/20 text-hunt-bone focus:ring-2 focus:ring-hunt-rust focus:border-transparent outline-none transition-all"><!--[-->`);
      ssrRenderList(results, (res) => {
        _push(`<option${ssrRenderAttr("value", res)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).result) ? ssrLooseContain(unref(form).result, res) : ssrLooseEqual(unref(form).result, res)) ? " selected" : ""}>${ssrInterpolate(res)}</option>`);
      });
      _push(`<!--]--></select></div><div><label class="block text-sm font-medium text-hunt-bone/70 mb-2">Map</label><select class="w-full px-4 py-2 rounded-lg bg-black/40 border border-hunt-bone/20 text-hunt-bone focus:ring-2 focus:ring-hunt-rust focus:border-transparent outline-none transition-all"><!--[-->`);
      ssrRenderList(maps, (m) => {
        _push(`<option${ssrRenderAttr("value", m)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).map) ? ssrLooseContain(unref(form).map, m) : ssrLooseEqual(unref(form).map, m)) ? " selected" : ""}>${ssrInterpolate(m)}</option>`);
      });
      _push(`<!--]--></select></div><div><label class="block text-sm font-medium text-hunt-bone/70 mb-2">Bosses Banished</label><input type="number"${ssrRenderAttr("value", unref(form).bossesBanished)} min="0" max="4" class="w-full px-4 py-2 rounded-lg bg-black/40 border border-hunt-bone/20 text-hunt-bone focus:ring-2 focus:ring-hunt-rust focus:border-transparent outline-none transition-all"></div></div><div class="border-t border-hunt-bone/10 pt-8"><div class="flex items-center justify-between mb-6"><h2 class="text-xl font-bold text-hunt-bone">Team Performance</h2>`);
      if (unref(form).players.length < 3) {
        _push(`<button type="button" class="text-sm bg-hunt-bone/10 hover:bg-hunt-bone/20 text-hunt-bone px-4 py-2 rounded-lg font-medium transition-colors"> + Add Player </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="space-y-6"><!--[-->`);
      ssrRenderList(unref(form).players, (player, index) => {
        _push(`<div class="p-6 bg-black/20 rounded-xl relative border border-hunt-bone/10">`);
        if (unref(form).players.length > 1) {
          _push(`<button type="button" class="absolute top-4 right-4 text-hunt-bone/30 hover:text-hunt-rust transition-colors"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg></button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="grid grid-cols-1 md:grid-cols-4 gap-4"><div><label class="block text-xs font-semibold text-hunt-bone/50 uppercase tracking-wider mb-2">Player</label><input list="known-players"${ssrRenderAttr("value", player.name)} placeholder="Enter name" class="w-full px-3 py-2 rounded-lg bg-black/40 border border-hunt-bone/20 text-hunt-bone focus:ring-2 focus:ring-hunt-rust focus:border-transparent outline-none transition-all text-sm"><datalist id="known-players"><!--[-->`);
        ssrRenderList(knownPlayers, (kp) => {
          _push(`<option${ssrRenderAttr("value", kp)}></option>`);
        });
        _push(`<!--]--></datalist></div><div><label class="block text-xs font-semibold text-hunt-bone/50 uppercase tracking-wider mb-2">Kills</label><input type="number"${ssrRenderAttr("value", player.kills)} min="0" class="w-full px-3 py-2 rounded-lg bg-black/40 border border-hunt-bone/20 text-hunt-bone focus:ring-2 focus:ring-hunt-rust focus:border-transparent outline-none transition-all text-sm"></div><div><label class="block text-xs font-semibold text-hunt-bone/50 uppercase tracking-wider mb-2">Deaths</label><input type="number"${ssrRenderAttr("value", player.deaths)} min="0" class="w-full px-3 py-2 rounded-lg bg-black/40 border border-hunt-bone/20 text-hunt-bone focus:ring-2 focus:ring-hunt-rust focus:border-transparent outline-none transition-all text-sm"></div><div><label class="block text-xs font-semibold text-hunt-bone/50 uppercase tracking-wider mb-2">Hunt Dollars</label><div class="relative"><span class="absolute left-3 top-1/2 -translate-y-1/2 text-hunt-bone/40 text-sm">$</span><input type="number"${ssrRenderAttr("value", player.moneyGained)} min="0" class="w-full pl-7 pr-3 py-2 rounded-lg bg-black/40 border border-hunt-bone/20 text-hunt-bone focus:ring-2 focus:ring-hunt-rust focus:border-transparent outline-none transition-all text-sm"></div></div></div></div>`);
      });
      _push(`<!--]--></div></div><div class="bg-black/60 text-hunt-bone p-6 rounded-2xl flex flex-wrap gap-8 items-center justify-between border border-hunt-bone/5"><div class="flex gap-8"><div><p class="text-xs text-hunt-gold/70 uppercase tracking-wider mb-1">Team Kills</p><p class="text-2xl font-bold">${ssrInterpolate(unref(teamStats).totalKills)}</p></div><div><p class="text-xs text-hunt-gold/70 uppercase tracking-wider mb-1">Team Deaths</p><p class="text-2xl font-bold">${ssrInterpolate(unref(teamStats).totalDeaths)}</p></div><div><p class="text-xs text-hunt-gold/70 uppercase tracking-wider mb-1">Total Money</p><p class="text-2xl font-bold">$${ssrInterpolate(unref(teamStats).totalMoneyGained)}</p></div></div><button type="submit" class="bg-hunt-rust text-white px-8 py-3 rounded-xl font-bold hover:bg-hunt-gold transition-colors shadow-lg"> Save Match Result </button></div></form></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tracker.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=tracker-DjYgzpiR.mjs.map
