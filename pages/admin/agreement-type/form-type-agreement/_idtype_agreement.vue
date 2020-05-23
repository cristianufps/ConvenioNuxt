<template>
  <a-card>
    <a-row type="flex" justify="end">
      <a-col :xs="20" :sm="20" :md="22" :lg="22" :xl="22">
        <h2 v-if="idCategory" class="form-title">Editar Tipo Convenio</h2>
        <h2 v-else class="form-title">Registrar Tipo Convenio</h2>
      </a-col>

      <a-col :xs="4" :sm="4" :md="2" :lg="2" :xl="2" style="text-align:end;">
        <div class="pointer">
          <nuxt-link to="/admin/agreement-type/agreement-type-list">
            <a-button>Volver</a-button>
          </nuxt-link>
        </div>
      </a-col>
    </a-row>
    <a-form :form="form" @submit="handleSubmit">
      <a-row type="flex" justify="space-around">
        <a-col :xs="20" :sm="20" :md="10" :lg="10" :xl="10">
          <label class="label-form">Nombre</label>
          <a-form-item>
            <a-input
              v-decorator="[
          'tico_nombre',
          {
              initialValue:type_agreement.tico_nombre,
            rules: [{ required: true, message: 'Este campo es requerido', whitespace: true }]
          }
        ]"
              @change="validationLetters"
              :maxLength="150"
              autocomplete="off"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row type="flex" justify="space-around">
        <a-col :xs="5" :sm="5" :md="10" :lg="10" :xl="10">
          <a-form-item>
            <a-button v-if="idTypeAgreement" type="primary" html-type="submit">
              <b>Editar</b>
            </a-button>
            <a-button v-else type="primary" html-type="submit">
              <b>Registrar</b>
            </a-button>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
</template>
<script>
export default {
  layout: "administrador",
  beforeMount() {
    if (this.idTypeAgreement) {
      this.getTypeAgreement();
    }
  },
  data() {
    return {
      idTypeAgreement: this.$route.params.idtype_agreement,
      type_agreement: {
        tico_id: "",
        tico_nombre: ""
      }
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  methods: {
    openNotification(type, title, description) {
      this.$notification[type]({
        message: title,
        description: description,
        duration: 5
      });
    },
    getTypeAgreement() {
      let id = this.idTypeAgreement;
      this.$axios("/type_agreement_by_id/" + id)
        .then(res => {
          if (res.status == 200) {
            this.type_agreement = res.data.data;
          }
          this.$nuxt.$loading.finish();
        })
        .catch(err => {
          this.$nuxt.$loading.finish();
          this.openNotification("error", "Error", "Se ha producido un error.");
        });
    },
    updateTypeAgreement(datos) {
      this.$axios
        .$put("/update_type_agreement/" + this.idTypeAgreement, datos)
        .then(res => {
          if (res.error) {
            this.openNotification(
              "info",
              "Información",
              "la Tipo Convenio ya se encuentra registrada."
            );
          } else {
            this.openNotification(
              "success",
              "Información",
              "Se ha editado la Tipo Convenio satisfactoriamente."
            );
            this.$router.push("/admin/agreement-type/agreement-type-list");
          }
        })
        .catch(error => {
          if (error.message == "Request failed with status code 422") {
            this.openNotification(
              "info",
              "Información",
              "El área ya se encuentra registrada."
            );
          } else {
            this.openNotification(
              "error",
              "Error",
              "Se ha producido un error."
            );
          }
        });
    },
    registerTypeAgreement(datos) {
      this.$axios
        .$post("/create_type_agreement", datos)
        .then(res => {
          if (res != null) {
            this.openNotification(
              "success",
              "Información",
              "Se ha registrado la Tipo Convenio satisfactoriamente."
            );
            this.$router.push("/admin/agreement-type/agreement-type-list");
          }
        })
        .catch(error => {
          this.openNotification("error", "Error", "Se ha producido un error.");
        });
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let body = {
            type_agreement: {
              tico_nombre: values.tico_nombre.trim()
            }
          };

          if (this.idTypeAgreement) {
            this.updateTypeAgreement(body);
          } else {
            this.registerTypeAgreement(body);
          }
        }
      });
    },
    validationLetters(e) {
      const input = e.target.value;
      e.target.value = input.replace(/[^a-zA-Z\s]$/g, "");
    },
    validationNumbers(e) {
      const input = e.target.value;
      e.target.value = input.replace(/[^0-9]/g, "");
    },
    validateMinLength(rule, value, callback) {
      try {
        if (value != undefined) {
          if (value.length > 0 && value.length < 6) {
            callback("Por favor, no escribas menos de 6 caracteres.");
          }
        }
        callback();
      } catch (err) {
        callback(err);
      }
    }
  }
};
</script>
<style scoped>
.ant-card {
  width: 100%;
  height: 100%;
  border-radius: 15px;
}

.form-title {
  color: red !important;
}
</style>