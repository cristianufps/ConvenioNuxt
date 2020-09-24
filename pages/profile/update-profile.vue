<template>
  <a-card title="Editar perfil">
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item v-bind="formItemLayout">
        <span slot="label">Documento</span>
        <a-input
          autocomplete="off"
          :maxLength="12"
          v-decorator="[
          'usua_documento',
          {
            initialValue:usuario.usua_documento,
            rules: [{ required: true, message: 'Este campo es obligatorio', whitespace: true }],
          },
        ]"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout">
        <span slot="label">Nombres</span>
        <a-input
          autocomplete="off"
          :maxLength="100"
          @change="validationLetters"
          v-decorator="[
          'usua_nombres',
          {
            initialValue:usuario.usua_nombres,
            rules: [{ required: true, message: 'Este campo es obligatorio', whitespace: true }],
          },
        ]"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout">
        <span slot="label">Apellidos</span>
        <a-input
          autocomplete="off"
          :maxLength="200"
          @change="validationLetters"
          v-decorator="[
          'usua_apellidos',
          {
            initialValue:usuario.usua_apellidos,
            rules: [{ required: true, message: 'Este campo es obligatorio', whitespace: true }],
          },
        ]"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="E-mail">
        <a-input
          autocomplete="off"
          :maxLength="80"
          v-decorator="[
          'usua_correo',
          {
            initialValue:usuario.usua_correo,
            rules: [
              {
                type: 'email',
                message: 'Ingrese un correo valido',
              },
              {
                required: true,
                message: 'Este campo es obligatorio',
              },
            ],
          },
        ]"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="Celular">
        <a-input
          autocomplete="off"
          :maxLength="10"
          @change="validationNumbers"
          v-decorator="[
          'usua_celular',
          {
            initialValue:usuario.usua_celular,
            rules: [{ required: true, message: 'Este campo es obligatorio' }],
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
      <a-form-item v-bind="formItemLayout">
        <span slot="label">Dirección</span>
        <a-input
          autocomplete="off"
          :maxLength="100"
          v-decorator="[
          'usua_direccion',
          {
            initialValue:usuario.usua_direccion,
            rules: [{ required: true, message: 'Este campo es obligatorio', whitespace: true }],
          },
        ]"
        />
      </a-form-item>
      <a-form-item v-bind="tailFormItemLayout">
        <a-button type="primary" html-type="submit">
          <b>Guardar Cambios</b>
        </a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
export default {
  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start();
    });
  },
  layout: "administrador",
  beforeMount() {
    this.getUser();
  },
  data() {
    return {
      idLogged: this.$auth.$state.user.usua_id,
      usuario: {
        tius_id: 0,
        usua_apellidos: "",
        usua_celular: "",
        usua_correo: "",
        usua_direccion: "",
        usua_documento: "",
        usua_estado: "",
        usua_fecharegistro: "",
        usua_imgperfil: "",
        usua_nombres: ""
      },
      confirmDirty: false,
      autoCompleteResult: [],
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 }
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
    validationLetters(e) {
      const input = e.target.value;
      e.target.value = input.replace(/[^a-zA-Z\s]$/g, "");
    },
    validationNumbers(e) {
      const input = e.target.value;
      e.target.value = input.replace(/[^0-9]/g, "");
    },
    getUser() {
      this.$axios("/user_by_id/" + this.idLogged)
        .then(res => {
          if (res.status == 200) {
            this.usuario = res.data.usuario;
            this.$nuxt.$loading.finish();
          }
        })
        .catch(err => {
          this.$nuxt.$loading.finish();
          this.notification(
            "error",
            "Error",
            "Se ha producido un error obteniendo Información."
          );
        });
    },
    updateProfile(user) {
      this.$nuxt.$loading.start();
      this.$axios
        .put("/update_profile/" + this.idLogged, user)
        .then(res => {
          if (res.status == 200) {
            this.$auth.fetchUser();
            this.notification(
              "success",
              "Información",
              "Se ha editado el perfil correctamente"
            );
            this.$nuxt.$loading.finish();
          }
        })
        .catch(err => {
          this.notification(
            "error",
            "Error",
            "Se ha producido un error editando el perfil."
          );
          this.$nuxt.$loading.finish();
        });
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let request = {
            user: {
              usua_id: this.idLogged,
              usua_apellidos: values.usua_apellidos,
              usua_celular: values.usua_celular,
              usua_correo: values.usua_correo,
              usua_direccion: values.usua_direccion,
              usua_documento: values.usua_documento,
              usua_nombres: values.usua_nombres
            }
          };

          this.updateProfile(request);
          console.log("Received values of form: ", values);
        }
      });
    },
    notification(type, title, mensaje) {
      this.$notification[type]({
        message: title,
        description: mensaje
      });
    },
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
    }
  }
};
</script>