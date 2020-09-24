<template>
  <div class="head-header">
    <a-button
      @click="showDrawer"
      class="icon-responsive"
      type="primary"
      icon="menu-unfold"
      size="large"
    />
    <a-menu v-model="current" mode="horizontal" style="text-align:end;">
      <!-- <a-menu-item key="img" class="opc-image">
        <nuxt-link to="/profile/image-profile">
          <img :src="constantes.URLIMG + imgPerfil" :alt="imgPerfil" class="style-img" />
        </nuxt-link>
      </a-menu-item>-->

      <a-sub-menu class="opc-image">
        <span slot="title" class="submenu-title-wrapper">
          <a-icon type="setting" />
          <!-- <span class="no-response">Ajustes</span> -->
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
      <a-menu-item key="mail" class="opc-image">
        <nuxt-link to="/profile/update-profile">{{ nombreUsuario }}</nuxt-link>
      </a-menu-item>
    </a-menu>
    <div class="img-div">
      <a-popover trigger="hover" placement="bottomRight">
        <template slot="content">
          <img
            @click="redirImg"
            :src="constantes.URLIMG + imgPerfil"
            :alt="imgPerfil"
            class="style-img-popover"
          />
        </template>

        <img
          @click="redirImg"
          :src="constantes.URLIMG + imgPerfil"
          :alt="imgPerfil"
          class="style-img"
        />
      </a-popover>
    </div>
  </div>
</template>
<script>
import constantes from "~/lib/constants.js";
import { mapState } from "vuex";
export default {
  beforeMount() {
    console.log("STATE", this.$auth.$state.user.usua_nombres);
    console.log("constantes", constantes);
  },
  computed: {
    ...mapState({
      visibleDrawer: state => state.drawerApp
    }),
    ...mapState({
      nombreUsuario: state => {
        if (state.auth.user != false) {
          return (
            state.auth.user.usua_nombres + " " + state.auth.user.usua_apellidos
          );
        }
      },
      imgPerfil: state => {
        if (state.auth.user != false) {
          return state.auth.user.usua_imgperfil;
        }
      }
    })
  },
  data() {
    return {
      constantes: constantes,
      idLogged: this.$auth.$state.user.usua_id,
      current: ["mail"]
    };
  },
  methods: {
    showDrawer() {
      this.$store.commit("setDrawer", true);
    },
    async logout() {
      this.$auth.logout();
      location.reload();
    },
    redirImg() {
      this.$router.push("/profile/image-profile");
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

.style-img {
  height: 45px;
  width: 45px;
  border-radius: 25px;
}

.style-img-popover {
  height: 150px;
  width: 150px;
  border-radius: 70px;
  cursor: pointer;
}
.img-div {
  background-color: #dd4b39;
  padding-right: 10px;
  cursor: pointer;
}

.head-header {
  width: 100%;
  align-items: center;
  display: flex;
  background-color: #dd4b39;
}
.head-header > ul {
  width: 100%;
}

.icon-responsive {
  display: none;
}

@media (max-width: 767px) and (min-width: 200px) {
  .no-response {
    display: none;
  }
  .icon-responsive {
    position: absolute;
    display: block;
  }
  .icon-responsive > i {
    font-size: 25px;
    font-weight: bold;
    color: #fff;
  }
}
</style>
