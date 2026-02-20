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
        <NuxtLink to="/" class="text-2xl font-bold text-zinc-800">
          <span class="text-green-500">&#10070;</span> Hunt Tracker
        </NuxtLink>
      </div>
      <nav class="flex w-auto">
        <ul class="flex flex-row gap-3 text-sm">
          <li v-for="item of menuitems">
            <NuxtLink :to="item.url" class="flex px-3 py-2 text-gray-600 border rounded-sm hover:text-gray-800">
              {{ item.title }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </header>
  </Container>
</template>
