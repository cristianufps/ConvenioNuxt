<template>
  <div>
    <Header class="end"></Header>
    <div>
      <a-row type="flex" justify="space-around">
        <a-col :xs="24" :sm="24" :md="4" :lg="4" :xl="4">
          <Menu class="menu"></Menu>
        </a-col>
        <a-col :xs="23" :sm="23" :md="20" :lg="20" :xl="20" class="p-izq">
          <nuxt />
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script>
import Menu from "~/components/menu";
import Header from "~/components/Header";

export default {
  components: {
    Menu,
    Header
  }
};
</script>
<style>
.felx {
  display: flex;
}

.end > ul {
  text-align: end !important;
}

.p-izq{
  padding-right: 10px;
}

/* @media (max-width: 767px) and (min-width: 200px) {
  .menu {
    display: none;
  }
} */
</style>
