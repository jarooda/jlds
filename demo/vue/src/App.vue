<script setup lang="ts">
import { Button } from './components/ui/button';

function test () {
  alert('Hello World')
}
</script>

<template>
  <Button @click="test">
    Click Me
  </Button>
</template>

<style scoped></style>
