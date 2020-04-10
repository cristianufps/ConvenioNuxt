<template>
  <a-row class="login-card" type="flex" align="middle" justify="space-around">
    <a-col :md="8" :lg="8" :xl="8" class="back-block"></a-col>

    <a-col :xs="24" :sm="24" :md="7" :lg="7" :xl="7">
      <a-form
        id="components-form-demo-normal-login"
        :form="form"
        class="login-form"
        @submit="handleSubmit"
      >
        <div class="wrapper-login">
          <img height="145" src="~assets/images/logo-login.png" />
        </div>

        <a-form-item>
          <a-input
            v-decorator="[
          'userName',
          { rules: [{ required: true, message: 'Por favor ingrese su correo!' }] },
        ]"
            placeholder="Correo"
          >
            <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="[
          'password',
          { rules: [{ required: true, message: 'Por favor ingrese su contraseña!' }] },
        ]"
            type="password"
            placeholder="Contraseña"
          >
            <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>

        <a-alert v-if="error" type="error" message="Datos incorrectos" banner />
        <a-form-item>
          <a-button type="primary" html-type="submit" class="login-form-button">
            <b>Iniciar sesión</b>
          </a-button>
        </a-form-item>
        <nuxt-link class="login-form-forgot lk-f" to="/forgot/forgot">¿olvidó la contraseña?</nuxt-link>
      </a-form>
    </a-col>
  </a-row>
</template>

<script>
import "~/assets/css/login.css";

export default {
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "normal_login" });
  },
  middleware: "auth",
  name: "Login",
  data() {
    return {
      error: null
    };
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.login(values);
        }
      });
    },
    async login(e) {
      try {
        let datos = {
          user: e.userName,
          password: e.password
        };

        const edinson = await this.$auth.loginWith("local", {
          data: datos
        });
        console.log("errr>>> ", edinson);
      } catch (error) {
        console.log("errrorZ>>> ", error);
        this.error = error;
      }
    }
  }
};
</script>
<style scoped>
.lk-f {
  color: red !important;
}

#components-form-demo-normal-login .login-form {
  max-width: 300px;
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
}

.login-card {
  /* background: url(../../assets/images/car-repair.jpg); */
  background-size: cover;
  height: 100%;
  width: 100%;
  position: fixed;
}

/* .back-block {
  background: url(https://ww2.ufps.edu.co/public/imagenes/noticia/99d3ecda99295bae792dd42378e31d53.jpg);
  background-size: cover;
  height: 100%;
  width: 100%;
  position: fixed;
} */

.wrapper-login {
  z-index: 5;
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>