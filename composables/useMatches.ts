import { ref, watch, onMounted } from 'vue'

export interface Match {
    id: string
    date: string
    result: 'Extraction' | 'Death' | 'Loss'
    totalKills: number
    totalDeaths: number
    totalPlayers: number
    totalMoneyGained: number
    bossesBanished: number
    map: string
    performance: Record<string, {
        kills: number
        deaths: number
        moneyGained: number
    }>
}

export const useMatches = () => {
    const matches = ref<Match[]>([])

    // Load from localStorage on mount
    onMounted(() => {
        const saved = localStorage.getItem('hunt_matches')
        if (saved) {
            try {
                matches.value = JSON.parse(saved)
            } catch (e) {
                console.error('Failed to parse matches from localStorage', e)
            }
        }
    })

    // Watch for changes and save to localStorage
    watch(matches, (newMatches) => {
        localStorage.setItem('hunt_matches', JSON.stringify(newMatches))
    }, { deep: true })

    const addMatch = (match: Omit<Match, 'id' | 'date'>) => {
        const newMatch: Match = {
            ...match,
            id: crypto.randomUUID(),
            date: new Date().toISOString()
        }
        matches.value.unshift(newMatch)
    }

    const deleteMatch = (id: string) => {
        matches.value = matches.value.filter(m => m.id !== id)
    }

    return {
        matches,
        addMatch,
        deleteMatch
    }
}
