<script setup lang="ts">
function test () {
  alert('Hello World')
}
</script>

<template>
  <div>
    
  <UiButton @click="test">
    Click Me
  </UiButton>
  </div>
</template>

