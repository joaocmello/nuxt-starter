<script setup>
const menuitems = [
  {
    title: "Tracker",
    url: "/tracker",
  },
  {
    title: "Reports",
    url: "/reports",
  },
];
</script>

<template>
  <Container>
    <header class="flex flex-row flex-wrap items-center justify-between my-4 gap-x-6 gap-y-4">
      <div class="flex items-center justify-between">
        <NuxtLink to="/" class="text-2xl font-bold text-hunt-bone">
          <span class="text-hunt-rust">&#10070;</span> Hunt Tracker
        </NuxtLink>
      </div>
      <nav class="flex w-auto">
        <ul class="flex flex-row gap-3 text-sm">
          <li v-for="item of menuitems">
            <NuxtLink :to="item.url" class="flex px-3 py-2 text-hunt-bone/70 border border-hunt-bone/20 rounded-sm hover:text-hunt-gold hover:border-hunt-gold">
              {{ item.title }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </header>
  </Container>
</template>
