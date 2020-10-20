<template>
  <a-row class="login-card" type="flex" align="middle" justify="end">
    <a-col class="padd" :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
      <a-form
        id="components-form-demo-normal-login cover-page"
        :form="form"
        class="login-form"
        @submit="handleSubmit"
      >
        <h2>Contáctanos</h2>
        <!-- <div class="wrapper-login">
          <img height="145" src="~assets/images/logo-login.png" />
        </div> -->
        <a-form-item>
          <a-input
            autocomplete="off"
            :maxLength="100"
            v-decorator="[
              'nombres',
              {
                rules: [{ required: true, message: 'Este campo es requerido' }],
              },
            ]"
            placeholder="Nombre"
          >
            <a-icon
              slot="prefix"
              type="user"
              style="color: rgba(0, 0, 0, 0.25)"
            />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            autocomplete="off"
            :maxLength="70"
            v-decorator="[
              'correo',
              {
                rules: [
                  {
                    type: 'email',
                    message: 'Ingrese un correo valido!',
                  },
                  { required: true, message: 'Por favor ingrese su correo!' },
                ],
              },
            ]"
            placeholder="Correo"
          >
            <a-icon
              slot="prefix"
              type="mail"
              style="color: rgba(0, 0, 0, 0.25)"
            />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            autocomplete="off"
            :maxLength="10"
            v-decorator="[
              'celular',
              {
                rules: [{ required: true, message: 'Este campo es requerido' }],
              },
            ]"
            placeholder="Celular"
          >
            <a-icon
              slot="prefix"
              type="phone"
              style="color: rgba(0, 0, 0, 0.25)"
            />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-textarea
            :maxLength="200"
            placeholder="Detalle"
            v-decorator="[
              'mensaje',
              {
                rules: [{ required: true, message: 'Este campo es requerido' }],
              },
            ]"
          ></a-textarea>
        </a-form-item>

        <!-- <a-alert v-if="error" type="error" message="Datos incorrectos" banner /> -->
        <a-row type="flex" justify="space-around">
          <a-col :span="10">
            <a-form-item>
              <a-button block html-type="submit" class="login-form-button">
                <b>Enviar</b>
              </a-button>
            </a-form-item>
          </a-col>
          <a-col :span="10">
            <nuxt-link to="/authentication/login">
              <a-button block type="primary" class="login-form-button">
                <b>Iniciar sesión</b>
                <a-icon type="right" />
              </a-button>
            </nuxt-link>
          </a-col>
        </a-row>
      </a-form>
    </a-col>
    <a-col class="padd" :xs="1" :sm="1" :md="1" :lg="1" :xl="1"> </a-col>
  </a-row>
</template>
<script>
import "~/assets/css/login.css";
export default {
  auth: false,
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "normal_login" });
  },
  data() {
    return {
      error: null,
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
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.applyFor(values);
        }
      });
    },
    async applyFor(e) {
      this.$nuxt.$loading.start();

      let datos = {
        request: {
          soli_responsable: e.nombres,
          soli_correo: e.correo,
          soli_celular: e.celular,
          soli_detalle: e.mensaje,
        },
      };
      this.$axios
        .post("/create_request", datos)
        .then((res) => {
          if (res.status == 200) {
            this.openNotification(
              "success",
              "Error",
              "Se ha registrado la solicitud con éxito"
            );
          }
          this.$nuxt.$loading.finish();
        })
        .catch((error) => {
          this.error = error;
          this.openNotification(
            "error",
            "Error",
            "Se ha producido un error registrando la solicitud"
          );
          this.$nuxt.$loading.finish();
        });
    },
  },
};
</script>
<style scoped>
.login-card {
  background-size: cover;
  background: url(../../assets/images/img-login.jpg);
  height: 100%;
  width: 100%;
  position: fixed;
}

.cover-page > div {
  margin-bottom: 15px !important;
}
</style>