<template>
  <div class="head-header">
    <a-button
      @click="showDrawer"
      class="icon-responsive"
      type="primary"
      icon="menu-unfold"
      size="large"
    />
    <a-menu
      v-model="current"
      mode="horizontal"
      class="prueba"
      style="text-align: end"
    >
      <a-sub-menu class="opc-image">
        <span slot="title" class="submenu-title-wrapper">
          <a-badge :count="notificaciones.length" :overflowCount="99">
            <a-icon type="bell" />
          </a-badge>
        </span>
        <a-menu-item
          v-for="alert in notificaciones"
          :key="alert.alert_id"
          class="notify"
        >
          <div @click="leerAlerta(alert)" class="drop_item pointer">
            <div class="preview-thumbnail">
              <a-icon
                v-if="alert.tial_id == 1"
                type="info-circle"
                style="font-size: 30px !important"
                :style="{ color: '#dd4b39' }"
              />
              <i v-else class="tu-icon-roles icons-bells"></i>
            </div>
            <div class="preview-item-content">
              <h3 class="bajarPalabras">
                {{ alert.tial_nombre }}
              </h3>
              <p class="bajarPalabras">
                Responsable:
                {{ alert.soli_responsable }}
              </p>
            </div>
          </div>
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu class="opc-image">
        <span slot="title" class="submenu-title-wrapper">
          <a-icon type="setting" />
          <!-- <span class="no-response">Ajustes</span> -->
        </span>
        <a-menu-item class="noti-session"  key="setting:1">
          <nuxt-link to="/profile/update-password"
            >Cambiar contraseña</nuxt-link
          >
        </a-menu-item>
        <a-menu-item class="noti-session" key="setting:2">
          <nuxt-link to="/profile/update-profile">Editar perfil</nuxt-link>
        </a-menu-item>
        <a-menu-item class="noti-session" key="setting:3" @click="logout">
          <a-icon type="logout" />Cerrar sesión
        </a-menu-item>
      </a-sub-menu>
      <a-menu-item key="mail" class="opc-image">
        <nuxt-link to="/profile/update-profile">{{ nombreUsuario }}</nuxt-link>
      </a-menu-item>
    </a-menu>
    <div class="img-div">
      <a-popover trigger="hover" class="popover-img" placement="bottomRight">
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
    this.getNotifications();
  },
  computed: {
    ...mapState({
      visibleDrawer: (state) => state.drawerApp,
    }),
    ...mapState({
      nombreUsuario: (state) => {
        if (state.auth.user != false) {
          return (
            state.auth.user.usua_nombres + " " + state.auth.user.usua_apellidos
          );
        }
      },
      imgPerfil: (state) => {
        if (state.auth.user != false) {
          return state.auth.user.usua_imgperfil;
        }
      },
    }),
  },
  data() {
    return {
      constantes: constantes,
      notificaciones: [],
      idLogged: this.$auth.$state.user.usua_id,
      current: ["mail"],
    };
  },
  methods: {
    openNotification(type, title, description) {
      this.$notification[type]({
        message: title,
        description: description,
        duration: 5,
      });
    },
    leerAlerta() {},
    getNotifications() {
      this.$axios("/list_alerts")
        .then((res) => {
          if (res.status == 200) {
            this.notificaciones = res.data.resp;
          }
        })
        .catch((err) => {
          this.openNotification(
            "error",
            "error",
            "Ha ocurrido un error listando notificaciones."
          );
        });
    },
    showDrawer() {
      this.$store.commit("setDrawer", true);
    },
    async logout() {
      this.$auth.logout();
      location.reload();
    },
    redirImg() {
      this.$router.push("/profile/image-profile");
    },
  },
};
</script>
<style>
.ant-progress-inner {
  width: 20px !important;
  height: 20px !important;
  font-size: 15px !important;
  overflow: visible;
}

.ant-progress-text {
  left: 30px !important;
  font-weight: bold;
  font-family: "Open Sans", sans-serif !important;
}

.ant-dropdown-link {
  color: #5e5555 !important;
  text-decoration: none;
  background-color: transparent;
  font-weight: bold;
}

.ant-dropdown-placement-bottomRight {
  margin-top: 10px;
}

body {
  background: #eff3f5;
}

.drop_item {
  display: flex !important;
}

.bajarPalabras {
  width: 260px !important;
  white-space: normal;
}

.campanita {
  max-height: 200px;
  overflow-y: auto;
}

.campanita::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  border-radius: 10px;
}

.campanita::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 10px;
}
.preview-item-content {
  line-height: 1;
  padding-left: 15px;
}

.small-text {
  margin-bottom: 2px !important;
}

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

.ant-menu-horizontal > .ant-menu-item:hover,
.ant-menu-horizontal > .ant-menu-submenu:hover,
.ant-menu-horizontal > .ant-menu-item-active,
.ant-menu-horizontal > .ant-menu-submenu-active,
.ant-menu-horizontal > .ant-menu-item-open,
.ant-menu-horizontal > .ant-menu-submenu-open,
.ant-menu-horizontal > .ant-menu-item-selected,
.ant-menu-horizontal > .ant-menu-submenu-selected {
  color: #fff;
  border-bottom: none;
}

.notify {
  background-color: #fff;
}
.notify.ant-menu-sub {
  background-color: #fff;
}

/* .ant-menu-submenu-popup > .ant-menu-sub {
  background-color: #fff !important;
} */

.ant-menu-submenu-popup > .ant-menu-sub > li.notify {
  margin-bottom: 0px !important;
  height: 45px !important;
  margin-top: 0px !important;
}

.ant-menu-submenu-popup > .ant-menu-sub > li.noti-session {
  margin-bottom: 0px !important;
  height: 35px !important;
  margin-top: 0px !important;
}

.ant-menu-submenu-popup > .ant-menu-sub > li.notify:nth-child(2n + 1) {
  background-color: #f3f3f3 !important;
}

.preview-thumbnail {
  padding-top: 5px !important;
}

.bajarPalabras {
  color: #727272;
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
