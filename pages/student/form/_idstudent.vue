<template>
  <a-card>
    <a-row slot="title" type="flex" justify="end">
      <a-col :xs="18" :sm="18" :md="22" :lg="22" :xl="22">
        <h3 v-if="idStudent" class="card-title">Editar Estudiante</h3>
        <h3 v-else class="card-title">Registrar Estudiante</h3>
      </a-col>
      <a-col :xs="6" :sm="6" :md="2" :lg="2" :xl="2" style="text-align: end">
        <div class="pointer">
          <nuxt-link to="/student/list-student">
            <a-button>Volver</a-button>
          </nuxt-link>
        </div>
      </a-col>
    </a-row>

    <a-form :form="form" @submit="handleSubmit">
      <a-form-item v-bind="formItemLayout">
        <span slot="label">Codigo</span>
        <a-input
          autocomplete="off"
          @change="validationNumbers"
          :maxLengt="8"
          v-decorator="[
            'estu_codigo',
            {
              initialValue: estudiante.estu_codigo,
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
      <a-form-item v-bind="formItemLayout">
        <span slot="label">Nombres</span>
        <a-input
          autocomplete="off"
          :maxLength="100"
          @change="validationLetters"
          v-decorator="[
            'estu_nombres',
            {
              initialValue: estudiante.estu_nombres,
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
      <a-form-item v-bind="formItemLayout">
        <span slot="label">Apellidos</span>
        <a-input
          autocomplete="off"
          :maxLength="100"
          @change="validationLetters"
          v-decorator="[
            'estu_apellidos',
            {
              initialValue: estudiante.estu_apellidos,
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
      <a-form-item v-bind="formItemLayout" label="Convenio">
        <a-select
          v-decorator="[
            'conv_id',
            {
              initialValue: estudiante.conv_id,
              rules: [{ required: true, message: 'Este campo es obligatorio' }],
            },
          ]"
          placeholder="Por favor seleccione un convenio"
        >
          <a-select-option
            v-for="conv in agremments"
            :value="conv.conv_id"
            :key="conv.conv_id"
            >{{ conv.conv_nombre }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <span v-if="idStudent">{{
        new Date(estudiante.estu_fecharegistro).toLocaleDateString(
          "ES",
          options
        )
      }}</span>
      <a-form-item v-bind="tailFormItemLayout">
        <a-button v-if="idStudent" type="primary" html-type="submit">
          <b>Guardar Cambios</b>
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
    this.listAgreements();
    if (this.idStudent) {
      this.getStudent();
    } else {
      setTimeout(() => {
        // Extend loader for an additional 5s
        this.$nuxt.$loading.finish();
      }, 1000);
    }
  },
  data() {
    return {
      options: {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      },
      idStudent: this.$route.params.idstudent,
      estudiante: {
        estu_apellidos: "",
        estu_nombres: "",
        estu_codigo: "",
        conv_id: "",
        estu_fecharegistro: "",
      },
      confirmDirty: false,
      agremments: [],
      autoCompleteResult: [],
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
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
    listAgreements() {
      this.$axios("/list_agreements")
        .then((res) => {
          if (res.status == 200) {
            this.agremments = res.data.data;
          }
        })
        .catch((err) => {
          this.notification("error", "Error", "Se ha producido un error.");
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
    getStudent() {
      this.$axios("/student_by_id/" + this.idStudent)
        .then((res) => {
          console.log(res);
          if (res.status == 200) {
            this.estudiante = res.data.response;
            this.$nuxt.$loading.finish();
          }
        })
        .catch((err) => {
          this.$nuxt.$loading.finish();
          this.notification(
            "error",
            "Error",
            "Se ha producido un error obteniendo Información."
          );
        });
    },
    updateStudent(student) {
      this.$nuxt.$loading.start();
      this.$axios
        .put("/update_student/" + this.idStudent, student)
        .then((res) => {
          if (res.status == 200) {
            if (res.data.error) {
              this.notification("info", "Información", "El codigo ya existe");
            } else {
              this.notification(
                "success",
                "Información",
                "Se ha editado el estudiante correctamente"
              );
              this.$router.push("/student/list-student");
            }
            this.$nuxt.$loading.finish();
          }
        })
        .catch((err) => {
          this.notification(
            "error",
            "Error",
            "Se ha producido un error editando el estudiante."
          );
          this.$nuxt.$loading.finish();
        });
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let request = {
            student: {
              estu_id: this.idStudent,
              estu_apellidos: values.estu_apellidos,
              estu_nombres: values.estu_nombres,
              estu_codigo: values.estu_codigo,
              conv_id: values.conv_id,
            },
          };

          if (this.idStudent) {
            this.updateStudent(request);
          } else {
            this.registerStudent(request);
          }
          console.log("Received values of form: ", values);
        }
      });
    },
    registerStudent(datos) {
      this.$axios
        .$post("/create_student", datos)
        .then((res) => {
          console.log("esduante", res);
          if (res.error) {
            this.notification(
              "info",
              "Información",
              "El codigo del estudiante ya existe"
            );
          } else {
            this.notification(
              "success",
              "Información",
              "Se ha registrado el estudiante satisfactoriamente."
            );
            this.$router.push("/student/list-student");
          }
        })
        .catch((error) => {
          this.notification("error", "Error", "Se ha producido un error.");
        });
    },
    notification(type, title, mensaje) {
      this.$notification[type]({
        message: title,
        description: mensaje,
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
          (domain) => `${value}${domain}`
        );
      }
      this.autoCompleteResult = autoCompleteResult;
    },
  },
};
</script>
<style scoped>
.card-title {
  color: red;
}
</style>