<script setup lang="ts">
const { matches, deleteMatch } = useMatches()

const selectedPlayer = ref<string>('All Players')

const uniquePlayers = computed(() => {
  const players = new Set<string>()
  matches.value.forEach(m => {
    Object.keys(m.performance || {}).forEach(p => players.add(p))
  })
  return ['All Players', ...Array.from(players).sort()]
})

const filteredMatches = computed(() => {
  if (selectedPlayer.value === 'All Players') return matches.value
  return matches.value.filter(m => m.performance && m.performance[selectedPlayer.value])
})

const stats = computed(() => {
  const totalMatches = filteredMatches.value.length
  if (totalMatches === 0) return null

  let totalKills = 0
  let totalDeaths = 0
  let totalMoney = 0

  filteredMatches.value.forEach(match => {
    if (selectedPlayer.value === 'All Players') {
      totalKills += (match.totalKills || 0)
      totalDeaths += (match.totalDeaths || 0)
      totalMoney += (match.totalMoneyGained || 0)
    } else {
      const perf = match.performance?.[selectedPlayer.value]
      if (perf) {
        totalKills += perf.kills
        totalDeaths += perf.deaths
        totalMoney += perf.moneyGained
      }
    }
  })


  const extractions = filteredMatches.value.filter(m => m.result === 'Extraction').length
  
  return {
    totalMatches,
    kd: totalDeaths > 0 ? (totalKills / totalDeaths).toFixed(2) : totalKills.toFixed(2),
    extractionRate: ((extractions / totalMatches) * 100).toFixed(0) + '%',
    totalKills,
    totalDeaths,
    totalBosses: filteredMatches.value.reduce((acc, match) => acc + (match.bossesBanished || 0), 0),
    totalMoney
  }
})

const highKillMatch = computed(() => {
  if (filteredMatches.value.length === 0) return null
  
  return [...filteredMatches.value].sort((a, b) => {
    const killsA = selectedPlayer.value === 'All Players' ? (a.totalKills || 0) : (a.performance?.[selectedPlayer.value]?.kills || 0)
    const killsB = selectedPlayer.value === 'All Players' ? (b.totalKills || 0) : (b.performance?.[selectedPlayer.value]?.kills || 0)
    return killsB - killsA
  })[0]
})

const highKillCount = computed(() => {
  if (!highKillMatch.value) return 0
  if (selectedPlayer.value === 'All Players') return highKillMatch.value.totalKills
  return highKillMatch.value.performance?.[selectedPlayer.value]?.kills || 0
})


const expandedMatchId = ref<string | null>(null)

const toggleExpand = (id: string) => {
  expandedMatchId.value = expandedMatchId.value === id ? null : id
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString()
}
</script>

<template>
  <div class="py-12 px-6 max-w-5xl mx-auto">
    <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
      <div>
        <h1 class="text-4xl font-bold text-neutral-900 mb-2">Performance Reports</h1>
        <p class="text-neutral-500">Analyze your hunting history and growth.</p>
      </div>

      <div class="w-full md:w-64">
        <label class="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Filter by Player</label>
        <select v-model="selectedPlayer" class="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all">
          <option v-for="player in uniquePlayers" :key="player" :value="player">{{ player }}</option>
        </select>
      </div>
    </div>

    <div v-if="!stats" class="text-center py-20 bg-neutral-50 rounded-3xl border-2 border-dashed border-neutral-200">
      <p class="text-neutral-500 text-lg">No matches tracked for this selection.</p>
      <NuxtLink to="/tracker" class="mt-4 inline-block bg-neutral-900 text-white px-6 py-2 rounded-lg font-medium">
        Go to Tracker
      </NuxtLink>
    </div>

    <template v-else>
      <!-- Highlights and Stats -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <!-- High Kill Highlight -->
        <div class="lg:col-span-1 bg-neutral-900 text-white p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between">
          <div class="relative z-10">
            <span class="inline-block bg-white/10 text-white/80 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">Personal Best</span>
            <p class="text-4xl font-black mb-1">{{ highKillCount }} Kills</p>
            <p class="text-neutral-400 text-sm">Most kills in a single match</p>
          </div>
          
          <div class="mt-8 pt-6 border-t border-white/10 relative z-10">
            <p class="text-xs text-neutral-500 uppercase font-bold mb-1">Achieved on</p>
            <p class="font-medium">{{ highKillMatch ? formatDate(highKillMatch.date) : '-' }}</p>
            <p class="text-sm text-neutral-400">{{ highKillMatch?.map }}</p>
          </div>


          <!-- Abstract Decorative Element -->
          <div class="absolute -right-12 -top-12 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
        </div>

        <div class="lg:col-span-2 grid grid-cols-2 gap-6">
          <div class="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm flex flex-col justify-center">
            <p class="text-sm text-neutral-500 mb-1">{{ selectedPlayer === 'All Players' ? 'Team' : 'Player' }} K/D Ratio</p>
            <p class="text-4xl font-bold text-neutral-900">{{ stats.kd }}</p>
          </div>
          <div class="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm flex flex-col justify-center">
            <p class="text-sm text-neutral-500 mb-1">Extraction Rate</p>
            <p class="text-4xl font-bold text-neutral-900">{{ stats.extractionRate }}</p>
          </div>
          <div class="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm flex flex-col justify-center">
            <p class="text-sm text-neutral-500 mb-1">Total Kills</p>
            <p class="text-4xl font-bold text-neutral-900">{{ stats.totalKills }}</p>
          </div>
          <div class="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm flex flex-col justify-center">
            <p class="text-sm text-neutral-500 mb-1">Hunt Dollars</p>
            <p class="text-4xl font-bold text-neutral-900">${{ stats.totalMoney.toLocaleString() }}</p>
          </div>
        </div>
      </div>

      <!-- Match History -->
      <div class="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
        <div class="px-8 py-6 border-b border-neutral-100 flex items-center justify-between">
          <h2 class="text-xl font-bold text-neutral-900">Match History</h2>
          <span class="text-sm text-neutral-500">{{ filteredMatches.length }} matches shown</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-neutral-50 text-neutral-500 text-sm">
                <th class="px-8 py-4 font-medium">Date</th>
                <th class="px-4 py-4 font-medium">Result</th>
                <th class="px-4 py-4 font-medium">Map</th>
                <th class="px-4 py-4 font-medium text-center">Players</th>
                <th class="px-4 py-4 font-medium text-center">
                  {{ selectedPlayer === 'All Players' ? 'Team K/D' : 'Player K/D' }}
                </th>
                <th class="px-4 py-4 font-medium text-center">Bosses</th>
                <th class="px-8 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-100">
              <template v-for="match in filteredMatches" :key="match.id">
                <tr class="hover:bg-neutral-50 transition-colors cursor-pointer" @click="toggleExpand(match.id)">
                  <td class="px-8 py-4 text-sm">{{ formatDate(match.date) }}</td>
                  <td class="px-4 py-4">
                    <span :class="{
                      'px-2 py-1 rounded text-xs font-bold': true,
                      'bg-green-100 text-green-700': match.result === 'Extraction',
                      'bg-red-100 text-red-700': match.result === 'Death',
                      'bg-neutral-100 text-neutral-700': match.result === 'Loss'
                    }">
                      {{ match.result }}
                    </span>
                  </td>
                  <td class="px-4 py-4 text-sm">{{ match.map }}</td>
                  <td class="px-4 py-4 text-sm text-center">{{ match.totalPlayers }}</td>
                  <td class="px-4 py-4 text-sm text-center font-medium">
                    <template v-if="selectedPlayer === 'All Players'">
                      {{ match.totalKills }} / {{ match.totalDeaths }}
                    </template>
                    <template v-else>
                      {{ match.performance?.[selectedPlayer]?.kills || 0 }} / {{ match.performance?.[selectedPlayer]?.deaths || 0 }}
                    </template>
                  </td>

                  <td class="px-4 py-4 text-sm text-center">{{ match.bossesBanished }}</td>
                  <td class="px-8 py-4 text-right">
                    <button @click.stop="deleteMatch(match.id)" class="text-red-400 hover:text-red-600 transition-colors mr-4">
                      Delete
                    </button>
                    <span class="text-neutral-400 transition-transform duration-200" :class="{ 'rotate-180': expandedMatchId === match.id }">
                      ▼
                    </span>
                  </td>
                </tr>
                <!-- Expanded Row -->
                <tr v-if="expandedMatchId === match.id" class="bg-neutral-50/50">
                  <td colspan="7" class="px-8 py-6">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div v-for="(perf, name) in match.performance" :key="name" 
                           class="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm"
                           :class="{ 'ring-2 ring-neutral-900 ring-offset-2': name === selectedPlayer }">
                        <div class="flex items-center justify-between mb-4 border-b border-neutral-50 pb-2">
                          <p class="font-bold text-neutral-900">{{ name }}</p>
                          <span v-if="name === selectedPlayer" class="bg-neutral-900 text-white text-[10px] uppercase px-2 py-0.5 rounded-full font-bold">Filtered</span>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                          <div>
                            <p class="text-xs text-neutral-400 uppercase tracking-wider mb-0.5">Kills</p>
                            <p class="text-lg font-bold text-neutral-800">{{ perf.kills }}</p>
                          </div>
                          <div>
                            <p class="text-xs text-neutral-400 uppercase tracking-wider mb-0.5">Deaths</p>
                            <p class="text-lg font-bold text-neutral-800">{{ perf.deaths }}</p>
                          </div>
                          <div class="col-span-2 pt-2 border-t border-dotted border-neutral-100">
                            <p class="text-xs text-neutral-400 uppercase tracking-wider mb-0.5">Hunt Dollars</p>
                            <p class="text-lg font-bold text-green-600">${{ perf.moneyGained.toLocaleString() }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>
