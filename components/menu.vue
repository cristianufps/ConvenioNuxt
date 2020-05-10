<template>
  <div class="cont-menu">
    <a-menu
      :defaultSelectedKeys="['1']"
      :defaultOpenKeys="['sub1']"
      mode="inline"
      :inlineCollapsed="collapsed"
    >
      <a-sub-menu key="sub0">
        <span slot="title">
          <a-icon type="tool" />
          <span>Predeterminado</span>
        </span>
        <a-menu-item key="11">Categorías</a-menu-item>
        <a-menu-item key="21">Tipo Convenio</a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="sub1">
        <span slot="title">
          <a-icon type="apartment" />
          <span>Empresas</span>
        </span>
        <a-menu-item key="111">
          <nuxt-link to="/company/list-company">Empresas registradas</nuxt-link>
        </a-menu-item>
        <a-menu-item key="211">
          <nuxt-link to="/legal-representant/list-representant">Representante legal</nuxt-link>
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub2">
        <span slot="title">
          <a-icon type="link" />
          <span>Convenios</span>
        </span>
        <a-menu-item key="5">
          <nuxt-link to="/agreement/list-agreement">Convenios registrados</nuxt-link>
        </a-menu-item>
        <a-menu-item key="6">Option 6</a-menu-item>
        <a-menu-item key="7">Option 7</a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub2">
        <span slot="title">
          <a-icon type="schedule" />
          <span>Alertas Tempranas</span>
        </span>
        <a-menu-item key="9">Option 9</a-menu-item>
        <a-menu-item key="10">Option 10</a-menu-item>
        <a-sub-menu key="sub3" title="Submenu">
          <a-menu-item key="11">Option 11</a-menu-item>
          <a-menu-item key="12">Option 12</a-menu-item>
        </a-sub-menu>
      </a-sub-menu>
    </a-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      collapsed: false
    };
  },
  methods: {
    async logout() {
      this.$auth.logout();
      location.reload();
    },
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
    }
  }
};
</script>
<style scoped>
.coll {
  position: absolute;
  z-index: 10;
  top: 0px;
}

.cont-menu {
  border-radius: 0px 10px 10px 0px;
  box-shadow: 1px 6px 10px 3px rgba(25, 10, 5, 0.21961);
  margin-bottom: 5px;
  background-color: #dd4b39;
}

.cont-menu > ul {
  width: 100%;
  border-radius: 0px 10px 10px 0px;
  margin: 0 !important;
}
</style>
