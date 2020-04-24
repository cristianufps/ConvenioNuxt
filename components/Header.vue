<template>
  <div>
    <a-menu v-model="current" mode="horizontal" style="text-align:end;">
      <a-menu-item key="mail">{{ nombre }} {{ apellido }}</a-menu-item>

      <a-sub-menu>
        <span slot="title" class="submenu-title-wrapper">
          <a-icon type="setting" />Ajustes
        </span>
        <a-menu-item key="setting:1">Cambiar contraseña</a-menu-item>
        <a-menu-item key="setting:2">Editar perfil</a-menu-item>
        <a-menu-item key="setting:3">
          <a-icon type="logout" />Cerrar sesión
        </a-menu-item>
      </a-sub-menu>
    </a-menu>
  </div>
</template>
<script>
export default {
  beforeMount() {
    console.log("STATE", this.$auth.$state.user.usua_nombres);
  },
  data() {
    return {
      nombre: this.$auth.$state.user.usua_nombres,
      apellido: this.$auth.$state.user.usua_apellidos,
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
</style>
