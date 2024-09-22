<script setup lang="ts">
async function addTodo() {
  const books = await $fetch('/books', {
    method: 'GET'
  })
}
</script>

<template>
  <div>
    Hello WeScale !
  </div>
</template>
