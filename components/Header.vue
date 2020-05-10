<template>
  <div>
    <a-menu v-model="current" mode="horizontal" style="text-align:end;">
      <a-menu-item key="mail">
        <nuxt-link to="/profile/update-profile">{{ nombreUsuario }}</nuxt-link>
      </a-menu-item>
      <a-sub-menu>
        <span slot="title" class="submenu-title-wrapper">
          <a-icon type="setting" />Ajustes
        </span>
        <a-menu-item key="setting:1">
          <nuxt-link to="/profile/update-password">Cambiar contraseña</nuxt-link>
        </a-menu-item>
        <a-menu-item key="setting:2">
          <nuxt-link to="/profile/update-profile">Editar perfil</nuxt-link>
        </a-menu-item>
        <a-menu-item key="setting:3" @click="logout">
          <a-icon type="logout" />Cerrar sesión
        </a-menu-item>
      </a-sub-menu>
    </a-menu>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  beforeMount() {
    console.log("STATE", this.$auth.$state.user.usua_nombres);
  },
  computed: {
    ...mapState({
      nombreUsuario: state => {
        if (state.auth.user != false) {
          return (
            state.auth.user.usua_nombres + " " + state.auth.user.usua_apellidos
          );
        }
      }
    })
  },
  data() {
    return {
      idLogged: this.$auth.$state.user.usua_id,
      current: ["mail"]
    };
  },
  methods: {
    async logout() {
      this.$auth.logout();
      location.reload();
    }
  }
};
</script>
<style>
.end {
  text-align: end !important;
}

.ant-menu-horizontal > .ant-menu-item-selected > a {
  color: #fff;
}
</style>
