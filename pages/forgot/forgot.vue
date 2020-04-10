<template>
  <a-card class="card-forgot">
    <a-button type="primary" @click="users">prueba</a-button>
    <a-row type="flex" justify="space-around">
      <a-col :span="11"></a-col>
      <a-col :span="11">
        <h5>Recuperar contraseña</h5>
        <a-form :form="form" @submit="handleSubmit">
          <a-form-item>
            <label>Email</label>
            <a-input
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
          <a-form-item>
            <a-button type="primary" html-type="submit">Confirmar</a-button>
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
<style scoped>
.card-forgot {
  /* background: url(../../assets/images/car-repair.jpg); */
  background-size: cover;
  height: 100%;
  width: 100%;
  position: fixed;
}
</style>