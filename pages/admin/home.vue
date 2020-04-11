<template>
  <div>AAAAAAAAAAAAAAAAAAA</div>
</template>
<script>
export default {
  mounted() {
    setTimeout(() => {
      // Extend loader for an additional 5s
      this.$nuxt.$loading.finish();
    }, 10000);
  },
  layout: "administrador"
};
</script>