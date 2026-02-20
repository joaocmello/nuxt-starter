<script setup lang="ts">
const { addMatch } = useMatches()

const form = ref({
  result: 'Extraction' as const,
  bossesBanished: 0,
  map: 'Stillwater Bayou',
  players: [
    { name: '', kills: 0, deaths: 0, moneyGained: 0 }
  ]
})

const teamStats = computed(() => {
  return form.value.players.reduce((acc, p) => {
    acc.totalKills += p.kills
    acc.totalDeaths += p.deaths
    acc.totalMoneyGained += p.moneyGained
    return acc
  }, { totalKills: 0, totalDeaths: 0, totalMoneyGained: 0 })
})

const maps = [
  'Stillwater Bayou',
  'Lawson Delta',
  'Desalle',
  'Mammon\'s Gulch'
]

const results = ['Extraction', 'Death', 'Loss']

const knownPlayers = [
  'Bonkersdud',
  'andreguyc',
  'edbacil',
  'Alex',
  'PolarBeardedBear'
]

const addPlayer = () => {
  if (form.value.players.length < 3) {
    form.value.players.push({ name: '', kills: 0, deaths: 0, moneyGained: 0 })
  }
}

const removePlayer = (index: number) => {
  if (form.value.players.length > 1) {
    form.value.players.splice(index, 1)
  }
}

const submitMatch = () => {
  const performance: Record<string, { kills: number, deaths: number, moneyGained: number }> = {}
  form.value.players.forEach(p => {
    const name = p.name.trim() || `Player ${Object.keys(performance).length + 1}`
    performance[name] = {
      kills: p.kills,
      deaths: p.deaths,
      moneyGained: p.moneyGained
    }
  })

  addMatch({
    result: form.value.result,
    bossesBanished: form.value.bossesBanished,
    map: form.value.map,
    totalKills: teamStats.value.totalKills,
    totalDeaths: teamStats.value.totalDeaths,
    totalPlayers: form.value.players.length,
    totalMoneyGained: teamStats.value.totalMoneyGained,
    performance
  })

  // Reset form
  form.value = {
    result: 'Extraction',
    bossesBanished: 0,
    map: 'Stillwater Bayou',
    players: [{ name: '', kills: 0, deaths: 0, moneyGained: 0 }]
  }
  alert('Match tracked successfully!')
}
</script>

<template>
  <div class="py-12 px-6 max-w-4xl mx-auto">
    <h1 class="text-4xl font-bold mb-8 text-neutral-900">Track New Match</h1>
    
    <form @submit.prevent="submitMatch" class="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Result -->
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-2">Match Result</label>
          <select v-model="form.result" class="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all">
            <option v-for="res in results" :key="res" :value="res">{{ res }}</option>
          </select>
        </div>

        <!-- Map -->
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-2">Map</label>
          <select v-model="form.map" class="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all">
            <option v-for="m in maps" :key="m" :value="m">{{ m }}</option>
          </select>
        </div>

        <!-- Bosses Banished -->
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-2">Bosses Banished</label>
          <input type="number" v-model.number="form.bossesBanished" min="0" max="4" class="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
        </div>
      </div>

      <div class="border-t border-neutral-100 pt-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-neutral-900">Team Performance</h2>
          <button type="button" @click="addPlayer" v-if="form.players.length < 3" class="text-sm bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-4 py-2 rounded-lg font-medium transition-colors">
            + Add Player
          </button>
        </div>

        <div class="space-y-6">
          <div v-for="(player, index) in form.players" :key="index" class="p-6 bg-neutral-50 rounded-xl relative border border-neutral-100">
            <button v-if="form.players.length > 1" type="button" @click="removePlayer(index)" class="absolute top-4 right-4 text-neutral-400 hover:text-red-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <!-- Player Name -->
              <div>
                <label class="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Player</label>
                <input list="known-players" v-model="player.name" placeholder="Enter name" class="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm" />
                <datalist id="known-players">
                  <option v-for="kp in knownPlayers" :key="kp" :value="kp" />
                </datalist>
              </div>

              <!-- Kills -->
              <div>
                <label class="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Kills</label>
                <input type="number" v-model.number="player.kills" min="0" class="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm" />
              </div>

              <!-- Deaths -->
              <div>
                <label class="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Deaths</label>
                <input type="number" v-model.number="player.deaths" min="0" class="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm" />
              </div>

              <!-- Money -->
              <div>
                <label class="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Hunt Dollars</label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
                  <input type="number" v-model.number="player.moneyGained" min="0" class="w-full pl-7 pr-3 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Team Totals Summary -->
      <div class="bg-neutral-900 text-white p-6 rounded-2xl flex flex-wrap gap-8 items-center justify-between">
        <div class="flex gap-8">
          <div>
            <p class="text-xs text-neutral-400 uppercase tracking-wider mb-1">Team Kills</p>
            <p class="text-2xl font-bold">{{ teamStats.totalKills }}</p>
          </div>
          <div>
            <p class="text-xs text-neutral-400 uppercase tracking-wider mb-1">Team Deaths</p>
            <p class="text-2xl font-bold">{{ teamStats.totalDeaths }}</p>
          </div>
          <div>
            <p class="text-xs text-neutral-400 uppercase tracking-wider mb-1">Total Money</p>
            <p class="text-2xl font-bold">${{ teamStats.totalMoneyGained }}</p>
          </div>
        </div>
        
        <button type="submit" class="bg-white text-neutral-900 px-8 py-3 rounded-xl font-bold hover:bg-neutral-100 transition-colors shadow-lg">
          Save Match Result
        </button>
      </div>
    </form>
  </div>
</template>
