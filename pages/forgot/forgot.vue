<template>
  <div class="card-forgot">
    <a-row type="flex" justify="space-around">
      <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="mitad"></a-col>
      <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <a-row type="flex" justify="space-around">
          <a-col :xs="18" :sm="18" :md="14" :lg="14" :xl="14" class="wrapper-forgot">
            <a-form :form="form" @submit="handleSubmit">
              <div class="wrapper-login">
                <img height="145" src="~assets/images/logo-login.png" />
              </div>
              <a-form-item>
                <label>Email</label>
                <a-input
                  :maxLength="70"
                  v-decorator="[
          'email',
          {
            rules: [
              {
                type: 'email',
                message: 'Por favor, ingrese un correo valido.',
              },
              {
                required: true,
                message: 'Ingrese su email.',
              },
            ],
          },
        ]"
                />
              </a-form-item>
              <a-form-item class="margin-reduce">
                <a-button type="primary" class="login-form-button" html-type="submit">
                  <b>Confirmar</b>
                </a-button>
              </a-form-item>

              <nuxt-link to="/">
                <a-button class="login-form-button">
                  <b class="red">Ingresar</b>
                </a-button>
              </nuxt-link>
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
  data() {
    return {
      error: null
    };
  },
  methods: {
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
    forgot(email) {
      this.$nuxt.$loading.start();
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
            this.$nuxt.$loading.finish();
          }
        })
        .catch(error => {
          this.$nuxt.$loading.finish();
          this.notification("error", "Error", "Se ha producido un error.");
        });
    },
    users(email) {
      let datos = {
        user: email
      };
      this.$axios("/usuarios")
        .then(res => {
          if (res) {
            if (res.status == 200) {
              console.log(res);
              this.notification("info", "Información", "");
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
<style>
.red {
  color: #dd4b39 !important;
}

.margin-reduce {
  margin-bottom: 5px;
}

.login-form-button {
  width: 100%;
}

.card-forgot {
  height: 100%;
  width: 100%;
  position: fixed;
  background: white;
}

.mitad {
  background: url(../../assets/images/img-forgot.jpeg);
  background-size: cover;
  height: 100%;
}

.card-forgot > div {
  height: 100% !important;
  align-items: center !important;
}

.wrapper-login {
  z-index: 5;
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
}

@media (max-width: 767px) and (min-width: 200px) {
  .mitad {
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