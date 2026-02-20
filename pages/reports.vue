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
        <h1 class="text-4xl font-bold text-hunt-bone mb-2">Performance Reports</h1>
        <p class="text-hunt-bone/60">Analyze your hunting history and growth.</p>
      </div>

      <div class="w-full md:w-64">
        <label class="block text-xs font-semibold text-hunt-bone/50 uppercase tracking-wider mb-2">Filter by Player</label>
        <select v-model="selectedPlayer" class="w-full px-4 py-2 rounded-lg bg-black/40 border border-hunt-bone/20 text-hunt-bone focus:ring-2 focus:ring-hunt-rust focus:border-transparent outline-none transition-all">
          <option v-for="player in uniquePlayers" :key="player" :value="player">{{ player }}</option>
        </select>
      </div>
    </div>

    <div v-if="!stats" class="text-center py-20 bg-hunt-charcoal rounded-3xl border-2 border-dashed border-hunt-bone/20">
      <p class="text-hunt-bone/50 text-lg">No matches tracked for this selection.</p>
      <NuxtLink to="/tracker" class="mt-4 inline-block bg-hunt-rust text-white px-6 py-2 rounded-lg font-medium hover:bg-hunt-gold transition-colors">
        Go to Tracker
      </NuxtLink>
    </div>

    <template v-else>
      <!-- Highlights and Stats -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <!-- High Kill Highlight -->
        <div class="lg:col-span-1 bg-hunt-charcoal text-white p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between border border-hunt-gold/50 shadow-2xl">
          <div class="relative z-10">
            <span class="inline-block bg-hunt-gold/20 text-hunt-gold px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">Personal Best</span>
            <p class="text-4xl font-black mb-1">{{ highKillCount }} Kills</p>
            <p class="text-hunt-bone/40 text-sm">Most kills in a single match</p>
          </div>
          
          <div class="mt-8 pt-6 border-t border-hunt-gold/50 relative z-10">
            <p class="text-xs text-hunt-gold/60 uppercase font-bold mb-1">Achieved on</p>
            <p class="font-medium">{{ highKillMatch ? formatDate(highKillMatch.date) : '-' }}</p>
            <p class="text-sm text-hunt-bone/40">{{ highKillMatch?.map }}</p>
          </div>

          <!-- Abstract Decorative Element -->
          <div class="absolute -right-12 -top-12 w-64 h-64 bg-hunt-rust/10 rounded-full blur-3xl"></div>
        </div>

        <div class="lg:col-span-2 grid grid-cols-2 gap-6">
          <div class="bg-hunt-charcoal p-6 rounded-2xl border border-hunt-gold/50 shadow-sm flex flex-col justify-center">
            <p class="text-sm text-hunt-bone/40 mb-1">{{ selectedPlayer === 'All Players' ? 'Team' : 'Player' }} K/D Ratio</p>
            <p class="text-4xl font-bold text-hunt-bone">{{ stats.kd }}</p>
          </div>
          <div class="bg-hunt-charcoal p-6 rounded-2xl border border-hunt-gold/50 shadow-sm flex flex-col justify-center">
            <p class="text-sm text-hunt-bone/40 mb-1">Extraction Rate</p>
            <p class="text-4xl font-bold text-hunt-bone">{{ stats.extractionRate }}</p>
          </div>
          <div class="bg-hunt-charcoal p-6 rounded-2xl border border-hunt-gold/50 shadow-sm flex flex-col justify-center">
            <p class="text-sm text-hunt-bone/40 mb-1">Total Kills</p>
            <p class="text-4xl font-bold text-hunt-bone">{{ stats.totalKills }}</p>
          </div>
          <div class="bg-hunt-charcoal p-6 rounded-2xl border border-hunt-gold/50 shadow-sm flex flex-col justify-center">
            <p class="text-sm text-hunt-bone/40 mb-1">Hunt Dollars</p>
            <p class="text-4xl font-bold text-hunt-bone">${{ stats.totalMoney.toLocaleString() }}</p>
          </div>
        </div>
      </div>

      <!-- Match History -->
      <div class="bg-hunt-charcoal rounded-3xl border border-hunt-gold/50 shadow-sm overflow-hidden mb-12">
        <div class="px-8 py-6 border-b border-hunt-gold/50 flex items-center justify-between">
          <h2 class="text-xl font-bold text-hunt-bone">Match History</h2>
          <span class="text-sm text-hunt-bone/40">{{ filteredMatches.length }} matches shown</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-black/40 text-hunt-bone/50 text-sm">
                <th class="px-8 py-4 font-medium uppercase tracking-wider">Date</th>
                <th class="px-4 py-4 font-medium uppercase tracking-wider">Result</th>
                <th class="px-4 py-4 font-medium uppercase tracking-wider">Map</th>
                <th class="px-4 py-4 font-medium uppercase tracking-wider text-center">Players</th>
                <th class="px-4 py-4 font-medium uppercase tracking-wider text-center">
                  {{ selectedPlayer === 'All Players' ? 'Team K/D' : 'Player K/D' }}
                </th>
                <th class="px-4 py-4 font-medium uppercase tracking-wider text-center">Bosses</th>
                <th class="px-8 py-4 text-right font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-hunt-bone/5">
              <template v-for="match in filteredMatches" :key="match.id">
                <tr class="hover:bg-white/5 transition-colors cursor-pointer" @click="toggleExpand(match.id)">
                  <td class="px-8 py-4 text-sm text-hunt-bone/80">{{ formatDate(match.date) }}</td>
                  <td class="px-4 py-4">
                    <span :class="{
                      'px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest': true,
                      'bg-hunt-victory/20 text-hunt-victory border border-hunt-victory/30': match.result === 'Extraction',
                      'bg-hunt-rust/20 text-hunt-rust border border-hunt-rust/50': match.result === 'Death',
                      'bg-hunt-charcoal text-hunt-bone/60 border border-hunt-bone/20': match.result === 'Loss'
                    }">
                      {{ match.result }}
                    </span>
                  </td>
                  <td class="px-4 py-4 text-sm text-hunt-bone/70">{{ match.map }}</td>
                  <td class="px-4 py-4 text-sm text-center text-hunt-bone/70">{{ match.totalPlayers }}</td>
                  <td class="px-4 py-4 text-sm text-center font-bold text-hunt-bone">
                    <template v-if="selectedPlayer === 'All Players'">
                      {{ match.totalKills }} / {{ match.totalDeaths }}
                    </template>
                    <template v-else>
                      {{ match.performance?.[selectedPlayer]?.kills || 0 }} / {{ match.performance?.[selectedPlayer]?.deaths || 0 }}
                    </template>
                  </td>

                  <td class="px-4 py-4 text-sm text-center text-hunt-bone/70">{{ match.bossesBanished }}</td>
                  <td class="px-8 py-4 text-right">
                    <button @click.stop="deleteMatch(match.id)" class="text-hunt-rust hover:text-hunt-rust transition-colors mr-4 text-xs font-bold uppercase tracking-tighter">
                      Delete
                    </button>
                    <span class="text-hunt-bone/20 transition-transform duration-200 inline-block" :class="{ 'rotate-180': expandedMatchId === match.id }">
                      ▼
                    </span>
                  </td>
                </tr>
                <!-- Expanded Row -->
                <tr v-if="expandedMatchId === match.id" class="bg-hunt-swamp/30">
                  <td colspan="7" class="px-8 py-8">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div v-for="(perf, name) in match.performance" :key="name" 
                           class="bg-hunt-charcoal p-6 rounded-2xl border border-hunt-gold/50 shadow-xl"
                           :class="{ 'ring-1 ring-hunt-rust ring-offset-4 ring-offset-black': name === selectedPlayer }">
                        <div class="flex items-center justify-between mb-4 border-b border-hunt-bone/5 pb-3">
                          <p class="font-bold text-hunt-bone text-lg tracking-tight">{{ name }}</p>
                          <span v-if="name === selectedPlayer" class="bg-hunt-rust text-white text-[10px] uppercase px-2 py-1 rounded font-black tracking-widest">Filter</span>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                          <div>
                            <p class="text-[10px] text-hunt-bone/50 uppercase font-black tracking-tighter mb-1">Kills</p>
                            <p class="text-2xl font-black text-hunt-bone">{{ perf.kills }}</p>
                          </div>
                          <div>
                            <p class="text-[10px] text-hunt-bone/50 uppercase font-black tracking-tighter mb-1">Deaths</p>
                            <p class="text-2xl font-black text-hunt-bone">{{ perf.deaths }}</p>
                          </div>
                          <div class="col-span-2 pt-4 border-t border-dotted border-hunt-gold/50">
                            <p class="text-[10px] text-hunt-bone/50 uppercase font-black tracking-tighter mb-1">Hunt Dollars</p>
                            <p class="text-2xl font-black text-hunt-gold">${{ perf.moneyGained.toLocaleString() }}</p>
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
