<template>
  <a-card class="card-forgot">
    <a-row type="flex" justify="space-around">
      <a-col :span="11"></a-col>
      <a-col :span="11">
        <h5>Recuperar contraseña</h5>
        <a-form :form="form" class="login-form" @submit="handleSubmit">
          <label class="label-form">Contraseña nueva</label>
          <a-form-item>
            <a-input
              maxlength="20"
              v-decorator="[
          'password',
          {
            rules: [{
              required: true, message: 'Este campo es requerido',
            },
            {
              validator: minLength,
            }],
          }
        ]"
              type="password"
            />
          </a-form-item>
          <label class="label-form">Confirmar contraseña</label>
          <a-form-item>
            <a-input
              maxlength="20"
              v-decorator="[
          'confirm',
          {
            rules: [{
              required: true, message: 'Este campo es requerido',
            }, {
              validator: compareToFirstPassword,
            }],
          }
        ]"
              type="password"
            />
          </a-form-item>
          <a-form-item class="center">
            <a-button type="primary" html-type="submit">
              <b>Guardar cambios</b>
            </a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </a-card>
</template>
<script>
export default {
  auth: false,
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  data() {
    return {
      error: null
    };
  },
  methods: {
    compareToFirstPassword(rule, value, callback) {
      const form = this.form;
      if (value && value !== form.getFieldValue("password")) {
        callback("Las contraseñas no coinciden");
      } else {
        callback();
      }
    },
    notification(type, title, msj) {
      this.$notification[type]({
        message: title,
        description: msj
      });
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.forgot(values.email);
        }
      });
    },
    updatePassword(us) {
      let header = this.token;
      header = header.replace("/users/reset/?token=", "");
      this.$axios.setHeader("Authorization", header);
      this.$axios
        .post("/reset", us)
        .then(res => {
          if (res.status == 200 || res.status == 204) {
            let msj = res.data.message;
            this.notification("success", "Información", msj);
            this.$router.push("/");
          }
        })
        .catch(error => {
          this.notification("error", "Error", "Ha ocurrido un error.");
        });
    },
    forgot(email) {
      let datos = {
        user: email
      };
      this.$axios
        .post("/forgot", datos)
        .then(res => {
          if (res) {
            if (res.status == 200) {
              let msj = res.data.message;
              this.notification("info", "Información", msj);
            }
          }
        })
        .catch(error => {
          this.notification("error", "Error", "Se ha producido un error.");
        });
    }
  }
};
</script>
<style scoped>
.card-forgot {
  /* background: url(../../assets/images/car-repair.jpg); */
  background-size: cover;
  height: 100%;
  width: 100%;
  position: fixed;
}
</style>