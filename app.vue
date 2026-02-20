<script setup>
useHead({
  htmlAttrs: { lang: "en-US" },
  title: "Hunt Tracker",
  meta: [
    {
      name: "description",
      content:
        "Hunt Tracker is a specialized tool for tracking your performance in Hunt: The Showdown.",
    },
  ],
  bodyAttrs: {
    class: 'font-display'
  }
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
