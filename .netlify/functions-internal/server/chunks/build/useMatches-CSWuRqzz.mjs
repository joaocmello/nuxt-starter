import { ref } from 'vue';

const useMatches = () => {
  const matches = ref([]);
  const isLoading = ref(false);
  const fetchMatches = async () => {
    isLoading.value = true;
    try {
      const data = await $fetch("/api/matches");
      matches.value = data;
    } catch (e) {
      console.error("Failed to fetch matches", e);
    } finally {
      isLoading.value = false;
    }
  };
  const addMatch = async (match) => {
    try {
      await $fetch("/api/matches", {
        method: "POST",
        body: match
      });
      await fetchMatches();
    } catch (e) {
      console.error("Failed to add match", e);
      throw e;
    }
  };
  const deleteMatch = async (id) => {
    try {
      await $fetch(`/api/matches/${id}`, {
        method: "DELETE"
      });
      await fetchMatches();
    } catch (e) {
      console.error("Failed to delete match", e);
      throw e;
    }
  };
  return {
    matches,
    isLoading,
    addMatch,
    deleteMatch,
    fetchMatches
  };
};

export { useMatches as u };
//# sourceMappingURL=useMatches-CSWuRqzz.mjs.map
