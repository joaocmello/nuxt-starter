import { ref, onMounted } from 'vue'

export interface Match {
    id: string
    date: string
    result: 'Extraction' | 'Death'
    totalKills: number
    totalDeaths: number
    totalPlayers: number
    totalMoneyGained: number
    bountyTokens: number
    map: string
    performance: Record<string, {
        kills: number
        deaths: number
        moneyGained: number
    }>
}

export const useMatches = () => {
    const matches = ref<Match[]>([])
    const isLoading = ref(false)

    const fetchMatches = async () => {
        isLoading.value = true
        try {
            const data = await $fetch<Match[]>('/api/matches')
            matches.value = data
        } catch (e) {
            console.error('Failed to fetch matches', e)
        } finally {
            isLoading.value = false
        }
    }

    // Load from API on mount and check for migration
    onMounted(async () => {
        await fetchMatches()

        // Migration logic: if localStorage has data, upload it and clear it
        const saved = localStorage.getItem('hunt_matches')
        if (saved) {
            try {
                const localMatches = JSON.parse(saved) as Match[]
                if (localMatches.length > 0) {
                    console.info('Migrating localStorage matches to DB...')
                    for (const match of localMatches) {
                        await $fetch('/api/matches', {
                            method: 'POST',
                            body: match
                        })
                    }
                    localStorage.removeItem('hunt_matches')
                    console.info('Migration complete.')
                    await fetchMatches() // Refresh list after migration
                }
            } catch (e) {
                console.error('Failed to migrate matches', e)
            }
        }
    })

    const addMatch = async (match: Omit<Match, 'id' | 'date'>) => {
        try {
            await $fetch('/api/matches', {
                method: 'POST',
                body: match
            })
            await fetchMatches()
        } catch (e) {
            console.error('Failed to add match', e)
            throw e
        }
    }

    const deleteMatch = async (id: string) => {
        try {
            await $fetch(`/api/matches/${id}`, {
                method: 'DELETE'
            })
            await fetchMatches()
        } catch (e) {
            console.error('Failed to delete match', e)
            throw e
        }
    }

    return {
        matches,
        isLoading,
        addMatch,
        deleteMatch,
        fetchMatches
    }
}
