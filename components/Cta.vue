<script setup>
const props = defineProps({
  title: String,
  description: String,
  buttons: Array
});
</script>

<template>
  <div
    class="flex flex-col items-center px-10 py-10 mx-auto mb-20 text-center border-2 border-hunt-rust/50 border-dashed rounded-lg sm:px-20 sm:py-20 bg-hunt-charcoal shadow-2xl">
    <h2 class="text-4xl font-bold text-balance text-hunt-bone sm:text-5xl" v-if="title">{{ title }}</h2>
    <p class="mt-4 text-lg text-hunt-bone/60 sm:text-xl" v-if="description">
      {{ description }}
    </p>
    <div class="flex flex-wrap gap-4 mt-8">
      <div v-for="button of buttons">
        <NuxtLink v-if="button.label && button.url" :href="button.url"
          class="inline-flex px-6 py-3 text-white duration-300 bg-hunt-rust rounded-sm hover:bg-hunt-gold transition-color">
          {{ button.label }}</NuxtLink>
      </div>
    </div>
  </div>
</template>
