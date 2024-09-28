<script setup lang="ts">
async function addTodo() {
  const books = await $fetch('/books', {
    method: 'GET'
  })
}
</script>

<template>
  <img src="https://www.wescale.fr/hubfs/markentive/assets/images/wescale-logo-degrade.svg"/>
  <h1>
    Hello WeScale !
  </h1>
</template>
