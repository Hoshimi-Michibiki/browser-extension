


<!--! IMPORTANT NOTE: You can't import any CSS files here, in any component under this folder -->
<!--? Instead, you should import your CSS files in your scripts inside @/content-scripts/sites/*/index.ts -->
<!--* See README.ts for more info -->
<script lang="ts" setup>
import { ref } from 'vue';
const count = ref(0);
</script>

<template>
  <button class="button button-elevated" type="button" @click="count++">Oh you seen me {{ count }} times</button>
</template>


