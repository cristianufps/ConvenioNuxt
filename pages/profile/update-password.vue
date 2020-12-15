<template>
  <a-card title="Cambiar contraseña">
    <a-row type="flex" justify="space-around">
      <a-col :xs="18" :sm="18" :md="12" :lg="12" :xl="12">
        <a-form :form="form" @submit="handleSubmit">
          <a-form-item v-bind="formItemLayout" label="Contraseña actual">
            <a-input
              type="password"
              v-decorator="[
                'password_actual',
                {
                  rules: [
                    {
                      required: true,
                      message: 'Este campo es obligatorio',
                    },
                    {
                      validator: validatePassword,
                    },
                  ],
                },
              ]"
            />
          </a-form-item>
          <a-form-item
            v-bind="formItemLayout"
            label="Nueva contraseña"
            has-feedback
          >
            <a-input
              v-decorator="[
                'password',
                {
                  rules: [
                    {
                      required: true,
                      message: 'Este campo es obligatorio',
                    },
                    {
                      validator: validateToNextPassword,
                    },
                    {
                      min: 8,
                      message: 'Contraseña corta',
                    },
                  ],
                },
              ]"
              type="password"
            />
          </a-form-item>
          <a-form-item
            v-bind="formItemLayout"
            label="Confirmar contraseña"
            has-feedback
          >
            <a-input
              v-decorator="[
                'confirm',
                {
                  rules: [
                    {
                      required: true,
                      message: 'Este campo es obligatorio',
                    },
                    {
                      validator: compareToFirstPassword,
                    },
                  ],
                },
              ]"
              type="password"
              @blur="handleConfirmBlur"
            />
          </a-form-item>

          <a-form-item v-bind="tailFormItemLayout">
            <a-button type="primary" html-type="submit">
              <b>Confirmar</b>
            </a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
export default {
  layout: "administrador",
  data() {
    return {
      idLogged: this.$auth.$state.user.usua_id,
      confirmDirty: false,
      autoCompleteResult: [],
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      },
      tailFormItemLayout: {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0,
          },
          sm: {
            span: 16,
            offset: 8,
          },
        },
      },
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "register" });
  },
  methods: {
    notification(type, title, mensaje) {
      this.$notification[type]({
        message: title,
        description: mensaje,
      });
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          this.updatePassword(values);
        }
      });
    },
    handleConfirmBlur(e) {
      const value = e.target.value;
      this.confirmDirty = this.confirmDirty || !!value;
    },
    compareToFirstPassword(rule, value, callback) {
      const form = this.form;
      if (value && value !== form.getFieldValue("password")) {
        callback("las contraseñas no coinciden");
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
          (domain) => `${value}${domain}`
        );
      }
      this.autoCompleteResult = autoCompleteResult;
    },
    validatePassword(rule, value, callback) {
      let id = this.idLogged;
      this.$axios("/validate_password/" + id + "/" + value)
        .then((res) => {
          if (res) {
            if (res.data.response) {
              callback();
            } else {
              callback("Contraseña actual no coincide!");
            }
          }
        })
        .catch((err) => {
          callback("Contraseña actual no coincide!");
        });
    },
    updatePassword(datos) {
      this.$nuxt.$loading.start();

      let body = {
        actualPassword: datos.password_actual,
        newPassword: datos.password,
      };
      let id = this.idLogged;
      this.$axios
        .put("/update_password/" + id, body)
        .then((res) => {
          if (res) {
            if (res.status == 200) {
              this.notification("success", "Información", res.data.message);
              this.form.resetFields();
              this.$nuxt.$loading.finish();
            }
          }
        })
        .catch((err) => {
          this.notification(
            "error",
            "Error",
            "Se ha producido un error actualizando la contraseña."
          );
          this.$nuxt.$loading.finish();
        });
    },
  },
};
</script>