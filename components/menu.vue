<template>
  <div class="cont-menu">
    <a-menu
      class="mm"
      :defaultSelectedKeys="['1']"
      :defaultOpenKeys="['sub2']"
      mode="inline"
      :inlineCollapsed="collapsed"
    >
      <a-sub-menu key="sub0">
        <span slot="title">
          <a-icon type="tool" />
          <span>Predeterminado</span>
        </span>
        <a-menu-item key="key_categoria">
          <nuxt-link to="/admin/category/category-list">Categorías</nuxt-link>
        </a-menu-item>
        <a-menu-item key="key_tipoconvenio">
          <nuxt-link to="/admin/agreement-type/agreement-type-list"
            >Tipo Convenio</nuxt-link
          >
        </a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="sub1">
        <span slot="title">
          <a-icon type="apartment" />
          <span>Empresas</span>
        </span>
        <a-menu-item key="key_companies">
          <nuxt-link to="/company/list-company">Empresas registradas</nuxt-link>
        </a-menu-item>
        <a-menu-item key="key_legal">
          <nuxt-link to="/legal-representant/list-representant"
            >Representante legal</nuxt-link
          >
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub2">
        <span slot="title">
          <a-icon type="link" />
          <span>Convenios</span>
        </span>
        <a-menu-item key="key_macro">
          <nuxt-link to="/agreement/list-agreement-macro"
            >Convenios Macro</nuxt-link
          >
        </a-menu-item>
        <a-menu-item key="key_esp">
          <nuxt-link to="/agreement/list-agreement-specific"
            >Convenios Especificos</nuxt-link
          >
        </a-menu-item>
        <a-menu-item key="key_agre">
          <nuxt-link to="/agreement/list-agreement"
            >Convenios registrados</nuxt-link
          >
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub3">
        <span slot="title">
          <a-icon type="solution" />
          <span>Peticiones</span>
        </span>
        <a-menu-item key="key_pet"
          ><nuxt-link to="/request/request"
            >Solicitudes
          </nuxt-link></a-menu-item
        >
      </a-sub-menu>
      <a-sub-menu key="sub15">
        <span slot="title">
          <a-icon type="schedule" />
          <span>Alertas Tempranas</span>
        </span>
      </a-sub-menu>
      <a-sub-menu key="sub4">
        <span slot="title">
          <a-icon type="user" />
          <span>Estudiantes</span>
        </span>
        <a-menu-item key="key_student">
          <nuxt-link to="/student/list-student"
            >Estudiantes registrados</nuxt-link
          >
        </a-menu-item>
      </a-sub-menu>
    </a-menu>
    <a-drawer
      class="menu-drawer"
      width="250px"
      :placement="placement"
      :closable="false"
      @close="onClose"
      :visible="visibleDrawer"
    >
      <a-menu
        class="menu-drawer"
        :defaultSelectedKeys="['1']"
        :defaultOpenKeys="['sub1']"
        mode="inline"
        :inlineCollapsed="collapsed"
      >
        <a-sub-menu key="sub0e">
          <span slot="title">
            <a-icon type="tool" />
            <span>Predeterminado</span>
          </span>
          <a-menu-item key="11e">
            <nuxt-link to="/admin/category/category-list">Categorías</nuxt-link>
          </a-menu-item>
          <a-menu-item key="21e">
            <nuxt-link to="/admin/agreement-type/agreement-type-list"
              >Tipo Convenio</nuxt-link
            >
          </a-menu-item>
        </a-sub-menu>

        <a-sub-menu key="sub1e">
          <span slot="title">
            <a-icon type="apartment" />
            <span>Empresas</span>
          </span>
          <a-menu-item key="111e">
            <nuxt-link to="/company/list-company"
              >Empresas registradas</nuxt-link
            >
          </a-menu-item>
          <a-menu-item key="211e">
            <nuxt-link to="/legal-representant/list-representant"
              >Representante legal</nuxt-link
            >
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub2e">
          <span slot="title">
            <a-icon type="link" />
            <span>Convenios</span>
          </span>
          <a-menu-item key="5e">
            <nuxt-link to="/agreement/list-agreement-macro"
              >Convenios Macro</nuxt-link
            >
          </a-menu-item>
          <a-menu-item key="6e">
            <nuxt-link to="/agreement/list-agreement-specific"
              >Convenios Especificos</nuxt-link
            >
          </a-menu-item>
          <a-menu-item key="7e">
            <nuxt-link to="/agreement/list-agreement"
              >Convenios registrados</nuxt-link
            >
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub3e">
          <span slot="title">
            <a-icon type="schedule" />
            <span>Alertas Tempranas</span>
          </span>
          <a-menu-item key="9e"
            ><nuxt-link to="/request/request"
              >Solicitudes</nuxt-link
            ></a-menu-item
          >
        </a-sub-menu>
        <a-sub-menu key="sub4e">
          <span slot="title">
            <a-icon type="user" />
            <span>Usuarios</span>
          </span>
          <a-menu-item key="14e4">
            <nuxt-link to="/users/list-users">Usuarios registrados</nuxt-link>
          </a-menu-item>
          <a-menu-item key="14e6">Option 6</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-drawer>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      placement: "left",
      collapsed: false,
    };
  },
  computed: {
    ...mapState({
      visibleDrawer: (state) => state.drawerApp,
    }),
  },
  methods: {
    showDrawer() {
      this.visible = true;
    },
    onClose() {
      this.$store.commit("setDrawer", false);
    },
    async logout() {
      this.$auth.logout();
      location.reload();
    },
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
    },
  },
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
.menu-drawer {
  background-color: #dd4b39 !important;
}

@media (max-width: 767px) and (min-width: 200px) {
  .mm {
    display: none;
  }
}
</style>
