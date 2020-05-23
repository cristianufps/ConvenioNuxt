<template>
  <a-card title="Representante legal">
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item v-bind="formItemLayout">
        <span slot="label">Documento</span>
        <a-input
          v-decorator="[
          'rele_documento',
          {
            initialValue:representant.rele_documento,
            rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }],
          },
        ]"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout">
        <span slot="label">Nombres</span>
        <a-input
          v-decorator="[
          'rele_nombres',
          {
            initialValue:representant.rele_nombres,
            rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }],
          },
        ]"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout">
        <span slot="label">Apellidos</span>
        <a-input
          v-decorator="[
          'rele_apellidos',
          {
            initialValue:representant.rele_apellidos,
            rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }],
          },
        ]"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="E-mail">
        <a-input
          v-decorator="[
          'rele_correo',
          {
            initialValue:representant.rele_correo,
            rules: [
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'este campo es obligatorio',
              },
            ],
          },
        ]"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="Celular">
        <a-input
          v-decorator="[
          'rele_celular',
          {
            initialValue:representant.rele_celular,
            rules: [{ required: true, message: 'Please input your phone number!' }],
          },
        ]"
          style="width: 100%"
        >
          <a-select
            slot="addonBefore"
            v-decorator="['prefix', { initialValue: '57' }]"
            style="width: 70px"
          >
            <a-select-option value="57">+57</a-select-option>
            <a-select-option value="86">+86</a-select-option>
            <a-select-option value="87">+87</a-select-option>
          </a-select>
        </a-input>
      </a-form-item>
      <a-form-item v-bind="tailFormItemLayout">
        <a-button v-if="idRepresentante" type="primary" html-type="submit">
          <b>Editar</b>
        </a-button>
        <a-button v-else type="primary" html-type="submit">
          <b>Registrar</b>
        </a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
export default {
  layout: "administrador",
  beforeMount() {
    if (this.idRepresentante) {
      this.getRepresentant();
    }
  },
  data() {
    return {
      idRepresentante: this.$route.params.idrepresentant,
      representant: {
        rele_id: "",
        rele_nombres: "",
        rele_apellidos: "",
        rele_documento: "",
        rele_celular: "",
        rele_correo: ""
      },
      confirmDirty: false,
      autoCompleteResult: [],
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        }
      },
      tailFormItemLayout: {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0
          },
          sm: {
            span: 16,
            offset: 8
          }
        }
      }
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "register" });
  },
  methods: {
    handleConfirmBlur(e) {
      const value = e.target.value;
      this.confirmDirty = this.confirmDirty || !!value;
    },
    compareToFirstPassword(rule, value, callback) {
      const form = this.form;
      if (value && value !== form.getFieldValue("password")) {
        callback("Two passwords that you enter is inconsistent!");
      } else {
        callback();
      }
    },
    validateToNextPassword(rule, value, callback) {
      const form = this.form;
      if (value && this.confirmDirty) {
        form.validateFields(["confirm"], { force: true });
      }
      callback();
    },
    handleWebsiteChange(value) {
      let autoCompleteResult;
      if (!value) {
        autoCompleteResult = [];
      } else {
        autoCompleteResult = [".com", ".org", ".net"].map(
          domain => `${value}${domain}`
        );
      }
      this.autoCompleteResult = autoCompleteResult;
    },
    openNotification(type, title, description) {
      this.$notification[type]({
        message: title,
        description: description,
        duration: 5
      });
    },
    getRepresentant() {
      let id = this.idRepresentante;
      this.$axios("/legal_representant_by_id/" + id)
        .then(res => {
          if (res.status == 200) {
            this.representant = res.data.data;
          }
          this.$nuxt.$loading.finish();
        })
        .catch(err => {
          this.$nuxt.$loading.finish();
          this.openNotification("error", "Error", "Se ha producido un error.");
        });
    },
    updateLegalRepresentant(datos) {
      this.$axios
        .$put("/update_legal_representant/" + this.idRepresentante, datos)
        .then(res => {
          if (res.error) {
            this.openNotification(
              "info",
              "Información",
              "la representante ya se encuentra registrado."
            );
          } else {
            this.openNotification(
              "success",
              "Información",
              "Se ha editado el Representante satisfactoriamente."
            );
            this.$router.push("/legal-representant/list-representant");
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
    registerLegalRepresentant(datos) {
      this.$axios
        .$post("/create_legal_representant", datos)
        .then(res => {
          if (res != null) {
            this.openNotification(
              "success",
              "Información",
              "Se ha registrado la representante satisfactoriamente."
            );
            this.$router.push("/legal-representant/list-representant");
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
            legal_representant: {
              rele_nombres: values.rele_nombres.trim(),
              rele_apellidos: values.rele_apellidos.trim(),
              rele_documento: values.rele_documento.trim(),
              rele_celular: values.rele_celular.trim(),
              rele_correo: values.rele_correo.trim()
            }
          };

          if (this.idRepresentante) {
            this.updateLegalRepresentant(body);
          } else {
            this.registerLegalRepresentant(body);
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