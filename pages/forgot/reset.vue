<template>
  <div class="card-forgot">
    <a-row type="flex" justify="space-around">
      <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="mitad-forgot"></a-col>
      <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <a-row type="flex" justify="space-around">
          <a-col :xs="16" :sm="16" :md="11" :lg="11" :xl="11" class="wrapper-forgot">
            <a-form :form="form" class="login-form" @submit="handleSubmit">
              <label class="label-form">Contraseña nueva</label>
              <a-form-item>
                <a-input
                  :maxLength="20"
                  v-decorator="[
          'password',
          {
            rules: [{
              required: true, message: 'Este campo es requerido',
            },
            {
             validator: validateMinLength
            }],
          }
        ]"
                  type="password"
                />
              </a-form-item>
              <label class="label-form">Confirmar contraseña</label>
              <a-form-item>
                <a-input
                  :maxLength="20"
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
                <a-button type="primary" class="login-form-button" html-type="submit">
                  <b>Guardar cambios</b>
                </a-button>
              </a-form-item>
            </a-form>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>
<script>
export default {
  auth: false,
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  beforeMount() {
    let params = this.$route.fullPath.replace("/forgot/reset/?token=", "");
    this.token = params;
  },
  data() {
    return {
      error: null,
      token: ""
    };
  },
  methods: {
    validateMinLength(rule, value, callback) {
      try {
        if (value != undefined) {
          if (value.length > 0 && value.length < 8) {
            callback("Por favor, no escribas menos de 8 caracteres.");
          }
        }
        callback();
      } catch (err) {
        callback(err);
      }
    },
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
          this.updatePassword(values.password);
        }
      });
    },
    updatePassword(us) {
      let header = this.token;
      header = header.replace("/forgot/reset/?token=", "");
      this.$axios.setHeader("Authorization", header);
      let body = {
        password: us
      };
      this.$axios
        .post("/reset", body)
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
    }
  }
};
</script>
<style >
.mitad-forgot {
  background: url(../../assets/images/img-reset.jpeg);
  background-size: cover;
  height: 100%;
}

.card-forgot {
  height: 100%;
  width: 100%;
  position: fixed;
  background: white;
}

.login-form-button {
  width: 100%;
}

.card-forgot > div {
  height: 100% !important;
  align-items: center !important;
}
@media (max-width: 767px) and (min-width: 200px) {
  .mitad-forgot {
    position: absolute;
    top: 0;
    min-height: 100vh;
  }

  .wrapper-forgot {
    background: white;
    padding: 20px;
    border-radius: 20px;
  }
}
</style>