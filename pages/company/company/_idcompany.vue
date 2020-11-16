<template>
  <a-card>
    <a-row slot="title" type="flex" justify="end">
      <a-col :xs="18" :sm="18" :md="22" :lg="22" :xl="22">
        <h3 v-if="idEmpresa" class="card-title">Editar Empresa</h3>
        <h3 v-else class="card-title">Registrar Empresa</h3>
      </a-col>

      <a-col :xs="6" :sm="6" :md="2" :lg="2" :xl="2" style="text-align: end">
        <div class="pointer">
          <nuxt-link to="/company/list-company">
            <a-button>Volver</a-button>
          </nuxt-link>
        </div>
      </a-col>
    </a-row>
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item v-bind="formItemLayout" label="Nit">
        <a-input
          :maxLength="20"
          @change="validationNumbers"
          v-decorator="[
            'empr_nit',
            {
              initialValue: company.empr_nit,
              rules: [
                {
                  required: true,
                  message: 'Este campo es obligatorio',
                },
              ],
            },
          ]"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout">
        <span slot="label">Nombre</span>
        <a-input
          :maxLength="100"
          v-decorator="[
            'empr_nombre',
            {
              initialValue: company.empr_nombre,
              rules: [
                {
                  required: true,
                  message: 'Este campo es obligatorio',
                  whitespace: true,
                },
              ],
            },
          ]"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="Telefono">
        <a-input
          :maxLength="10"
          @change="validationNumbers"
          v-decorator="[
            'empr_telefono',
            {
              initialValue: company.empr_telefono,
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
          :maxLength="100"
          v-decorator="[
            'empr_direccion',
            {
              initialValue: company.empr_direccion,
              rules: [
                {
                  required: true,
                  message: 'Este campo es obligatorio',
                  whitespace: true,
                },
              ],
            },
          ]"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="Representante legal">
        <a-select
          v-decorator="[
            'rele_id',
            {
              initialValue: company.rele_id,
              rules: [{ required: true, message: 'Este campo es obligatorio' }],
            },
          ]"
          placeholder="Por favor seleccione un Representante"
        >
          <a-select-option
            v-for="repr in legalRepresentants"
            :key="repr.rele_id"
            :value="repr.rele_id"
            >{{ repr.rele_nombres }} {{ repr.rele_apellidos }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item v-bind="tailFormItemLayout">
        <a-button v-if="idEmpresa" type="primary" html-type="submit">
          <b>Guardar cambios</b>
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
  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start();
    });
  },
  layout: "administrador",
  beforeMount() {
    if (this.idEmpresa) {
      this.getCompany();
    }
    this.listLegalRepresentant();
  },
  data() {
    return {
      idEmpresa: this.$route.params.idcompany,
      company: {
        empr_nombre: "",
        empr_nit: "",
        empr_telefono: "",
        empr_direccion: "",
        rele_id: "",
      },
      legalRepresentants: [],
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
    validationLetters(e) {
      const input = e.target.value;
      e.target.value = input.replace(/[^a-zA-Z\s]$/g, "");
    },
    validationNumbers(e) {
      const input = e.target.value;
      e.target.value = input.replace(/[^0-9]/g, "");
    },
    openNotification(type, title, description) {
      this.$notification[type]({
        message: title,
        description: description,
        duration: 5,
      });
    },
    getCompany() {
      let id = this.idEmpresa;
      this.$axios("/company_by_id/" + id)
        .then((res) => {
          if (res.status == 200) {
            this.company = res.data.data;
          }
          this.$nuxt.$loading.finish();
        })
        .catch((err) => {
          this.$nuxt.$loading.finish();
          this.openNotification("error", "Error", "Se ha producido un error.");
        });
    },
    listLegalRepresentant() {
      this.$axios("/list_legal_representant")
        .then((res) => {
          console.log("res -Z ", res);
          if (res) {
            this.legalRepresentants = res.data.data;
          }
          this.$nuxt.$loading.finish();
        })
        .catch((err) => {
          this.$nuxt.$loading.finish();
          this.openNotification("error", "Error", "Se ha producido un error.");
        });
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let body = {
            company: {
              empr_nombre: values.empr_nombre,
              empr_nit: values.empr_nit,
              empr_telefono: values.empr_telefono,
              empr_direccion: values.empr_direccion,
              rele_id: values.rele_id,
            },
          };

          if (this.idEmpresa) {
            this.updateCompany(body);
          } else {
            this.registerCompany(body);
          }
        }
      });
    },
    updateCompany(datos) {
      this.$axios
        .$put("/update_company/" + this.idEmpresa, datos)
        .then((res) => {
          console.log("upd ", res);
          if (res.error) {
            this.openNotification("info", "Atención", res.message);
          } else {
            this.openNotification(
              "success",
              "Información",
              "Se ha registrado la empresa satisfactoriamente."
            );
            this.$router.push("/company/list-company");
          }
        })
        .catch((error) => {
          this.openNotification("error", "Error", "Se ha producido un error.");
        });
    },
    registerCompany(datos) {
      this.$axios
        .$post("/create_company", datos)
        .then((res) => {
          if (res.error) {
            this.openNotification("info", "Atención", res.message);
          } else {
            this.openNotification(
              "success",
              "Información",
              "Se ha registrado la empresa satisfactoriamente."
            );
            this.$router.push("/company/list-company");
          }
        })
        .catch((error) => {
          this.openNotification(
            "error",
            "Error",
            "Se ha producido un error registrando la empresa."
          );
        });
    },
  },
};
</script>
<style scoped>
.card-title {
  color: red;
}
</style>