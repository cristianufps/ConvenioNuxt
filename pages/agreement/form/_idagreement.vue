<template>
  <a-card>
    <a-row slot="title" type="flex" justify="end">
      <a-col :xs="18" :sm="18" :md="22" :lg="22" :xl="22">
        <h3 v-if="idAgreement" class="card-title">Editar Convenio</h3>
        <h3 v-else class="card-title">Registrar Convenio</h3>
      </a-col>
      <a-col :xs="6" :sm="6" :md="2" :lg="2" :xl="2" style="text-align:end;">
        <div class="pointer">
          <nuxt-link to="/agreement/list-agreement">
            <a-button>Volver</a-button>
          </nuxt-link>
        </div>
      </a-col>
    </a-row>
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item v-bind="formItemLayout">
        <span slot="label">Nombre</span>
        <a-input
          autocomplete="off"
          :maxLengt="100"
          v-decorator="[
          'conv_nombre',
          {
            initialValue:agreement.conv_nombre,
            rules: [{ required: true, message: 'Este campo es obligatorio', whitespace: true }],
          },
        ]"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="Tipo Convenio">
        <a-select
          :disabled="idAgreement != null"
          @change="typeAgreement"
          v-decorator="[
          'tico_id',
          {
            initialValue:agreement.tico_id,
             rules: [{ required: true, message: 'Este campo es obligatorio' }] },
        ]"
          placeholder="Seleccione tipo de convenio"
        >
          <a-select-option
            v-for="type in typeAgreementList"
            :value="type.tico_id"
            :key="type.tico_id"
          >{{ type.tico_nombre }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item v-show="parent" v-bind="formItemLayout" label="Convenio padre">
        <a-select
          :disabled="idAgreement != null"
          v-decorator="[
          'conv_padre',
          {
            initialValue:agreement.conv_padre,
             rules: [{ required: false, message: 'Este campo es obligatorio' }] },
        ]"
          placeholder="Por favor seleccione un convenio Macro (opcional)"
        >
          <a-select-option
            v-for="conv in parents"
            :value="conv.conv_id"
            :key="conv.conv_id"
          >{{ conv.conv_nombre }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="Categoria">
        <a-select
          v-decorator="[
          'cate_id',
          { 
            initialValue:agreement.cate_id,
            rules: [{ required: true, message: 'Este campo es obligatorio' }] },
        ]"
          placeholder="Seleccione categoria"
        >
          <a-select-option
            v-for="cat in categoryList"
            :value="cat.cate_id"
            :key="cat.cate_id"
          >{{ cat.cate_nombre }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="Empresa">
        <a-select
          v-decorator="[
          'empr_id',
          { 
            initialValue:agreement.empr_id,
            rules: [{ required: true, message: 'Este campo es obligatorio' }] },
        ]"
          placeholder="Seleccione empresa"
        >
          <a-select-option
            v-for="emp in companies"
            :value="emp.empr_id"
            :key="emp.empr_id"
          >{{ emp.empr_nombre }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="Fecha inicial">
        <a-range-picker
          :locale="locale"
          v-decorator="['fechas', { 
            initialValue:agreement.fechas,
            rules: [{ type:'array',required: true, message: 'Este campo es obligatorio' }] },]"
        />
        <!-- <a-date-picker v-decorator="['date-picker', config]" /> -->
      </a-form-item>

      <a-form-item v-bind="formItemLayout">
        <span slot="label">Costo</span>
        <a-input
          autocomplete="off"
          @change="validationNumbers"
          :maxLengt="12"
          v-decorator="[
          'conv_costo',
          {
            initialValue:agreement.conv_costo,
            rules: [{ required: false, message: 'Este campo es obligatorio', whitespace: true }],
          },
        ]"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout">
        <span slot="label">Razón o descripción</span>
        <a-textarea
          :maxLength="300"
          placeholder="Descripcion"
          :auto-size="{ minRows: 3, maxRows: 5 }"
          v-decorator="[
          'conv_descripcion',
          {
            initialValue:agreement.conv_descripcion,
            rules: [{ required: true, message: 'Este campo es obligatorio', whitespace: true }],
          },
        ]"
        />
      </a-form-item>
      <a-form-item v-bind="tailFormItemLayout">
        <a-button v-if="idAgreement" type="primary" html-type="submit">
          <b>Guardar Cambios</b>
        </a-button>
        <a-button v-else type="primary" html-type="submit">
          <b>Registrar</b>
        </a-button>
      </a-form-item>
    </a-form>
    <a-row v-if="idAgreement" class="row-upload" type="flex" justify="space-around">
      <a-col :span="10">
        <a-upload-dragger
          accept="application/msword, text/plain, application/pdf"
          name="file"
          :multiple="true"
          @change="handleChange"
        >
          <p class="ant-upload-drag-icon">
            <a-icon type="inbox" />
          </p>
          <p class="ant-upload-text">Haga clic o arrastre el archivo a esta área para cargar</p>
          <p class="ant-upload-hint">Solo se pueden cargar archivos word y pdf</p>
        </a-upload-dragger>
      </a-col>
      <a-col :span="11">
        <div style="margin-bottom:50px;">
          <h3 class="card-title">Documento cargado</h3>

          <a
            v-if="agreement.conv_soporte"
            :href="urlBuckect+agreement.conv_soporte"
            target="_blank"
          >{{ agreement.conv_soporte }}</a>
          <p v-else>No tiene documento cargado</p>
        </div>

        <a-row v-if="doc" type="flex" justify="start">
          <a-button v-if="agreement.conv_soporte" @click="uploadDocument" type="primary">
            <b>Reemplazar Archivo</b>
          </a-button>
          <a-button v-else @click="uploadDocument" type="primary">
            <b>Subir Archivo</b>
          </a-button>
        </a-row>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import moment from "moment";
moment.locale("es-MX");

export default {
  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start();
    });
  },
  beforeMount() {
    this.listAgreementsParents();
    this.listCategories();
    this.listTypeAgreement();
    this.listCompany();
    if (this.idAgreement) {
      this.getAgreement();
    }
  },
  layout: "administrador",
  data() {
    return {
      urlBuckect:
        "https://storage.googleapis.com/convenio-273922.appspot.com/soportes_convenios/",
      idAgreement: this.$route.params.idagreement,
      agreement: {
        conv_nombre: "",
        conv_descripcion: "",
        fechas: [],
        conv_padre: "",
        cate_id: "",
        empr_id: "",
        tico_id: "",
        conv_costo: ""
      },
      parents: [],
      categoryList: [],
      companies: [],
      locale: {
        lang: {
          placeholder: "Select date",
          rangePlaceholder: ["Fecha inicio", "Fecha fin"],
          today: "Today",
          now: "Now",
          backToToday: "Back to today",
          ok: "Ok",
          clear: "Clear",
          month: "Mes",
          year: "Año",
          timeSelect: "Select time",
          dateSelect: "Select date",
          monthSelect: "Elegir mes",
          yearSelect: "Elegir año",
          decadeSelect: "Choose a decade",
          yearFormat: "YYYY",
          dateFormat: "M/D/YYYY",
          dayFormat: "D",
          dateTimeFormat: "M/D/YYYY HH:mm:ss",
          monthFormat: "MMMM",
          monthBeforeYear: true,
          previousMonth: "Mes anterior",
          nextMonth: "Mes siguiente",
          previousYear: "Año anterior (Control + left)",
          nextYear: "Siguiente año (Control + right)",
          previousDecade: "Last decade",
          nextDecade: "Next decade",
          previousCentury: "Last century",
          nextCentury: "Next century"
        },
        timePickerLocale: {
          placeholder: "Select time"
        },
        dateFormat: "YYYY-MM-DD",
        dateTimeFormat: "YYYY-MM-DD HH:mm:ss",
        weekFormat: "YYYY-wo",
        monthFormat: "YYYY-MM"
      },
      typeAgreementList: [],
      parent: false,
      confirmDirty: false,
      autoCompleteResult: [],
      doc: null,
      config: {
        rules: [
          {
            type: "array",
            required: true,
            message: "Seleccione un rango de fechas"
          }
        ]
      },
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
    handleChange(info) {
      const status = info.file.status;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        this.doc = info.file;
        this.$message.success(
          `${info.file.name} se cargó el archivo completamente.`
        );
      } else if (status === "error") {
        this.$message.error(
          `${info.file.name} ocurrió un error cargando el archivo.`
        );
      }
    },
    uploadDocument() {
      this.$nuxt.$loading.start();
      var document = new FormData();
      document.append("image", this.doc.originFileObj);
      this.$axios
        .post("/upload_doc/" + this.idAgreement, document)
        .then(res => {
          if (res.status == 200) {
            this.getAgreement();
            this.openNotification(
              "success",
              "Información",
              "Se ha cargado el documento con éxito"
            );
            this.$nuxt.$loading.finish();
          }
        })
        .catch(error => {
          this.$nuxt.$loading.finish();
          this.notification("error", "Error", "Ha ocurrido un error.");
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
    openNotification(type, title, description) {
      this.$notification[type]({
        message: title,
        description: description,
        duration: 5
      });
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);

          let body = {
            agreement: {
              conv_nombre: values.conv_nombre,
              conv_descripcion: values.conv_descripcion,
              conv_fechainicial: values.fechas[0].format("YYYY-MM-DD"),
              conv_fechafinal: values.fechas[1].format("YYYY-MM-DD"),
              cate_id: values.cate_id,
              tico_id: values.tico_id,
              empr_id: values.empr_id,
              conv_costo: values.conv_costo,
              conv_padre: values.conv_padre
            }
          };
          console.log("BODY ", body);
          if (this.idAgreement) {
            this.updateAgreement(body);
          } else {
            this.registerAgreement(body);
          }

          // birth_date.format('YYYY-MM-DD')
        }
      });
    },
    registerAgreement(datos) {
      this.$axios
        .$post("/create_agreement", datos)
        .then(res => {
          if (res != null) {
            this.openNotification(
              "success",
              "Información",
              "Se ha registrado el convenio satisfactoriamente."
            );
            this.$router.push("/agreement/list-agreement");
          }
        })
        .catch(error => {
          this.openNotification("error", "Error", "Se ha producido un error.");
        });
    },
    updateAgreement(datos) {
      let id = this.idAgreement;
      this.$axios
        .$put("/update_agreement/" + id, datos)
        .then(res => {
          if (res != null) {
            this.openNotification(
              "success",
              "Información",
              "Se ha editado el convenio satisfactoriamente."
            );
            this.$router.push("/agreement/list-agreement");
          }
        })
        .catch(error => {
          this.openNotification("error", "Error", "Se ha producido un error.");
        });
    },
    handleConfirmBlur(e) {
      const value = e.target.value;
      this.confirmDirty = this.confirmDirty || !!value;
    },
    typeAgreement(e) {
      console.log("--> ", e);
      if (e == 1) {
        this.parent = false;
      } else {
        this.parent = true;
      }
    },
    listTypeAgreement() {
      this.$axios("/list_type_agreement")
        .then(res => {
          console.log("res -Z ", res);
          if (res) {
            this.typeAgreementList = res.data.data;
          }
          // this.$nuxt.$loading.finish();
        })
        .catch(err => {
          this.$nuxt.$loading.finish();
          this.openNotification("error", "Error", "Se ha producido un error.");
        });
    },
    listCategories() {
      this.$axios("/list_category")
        .then(res => {
          if (res) {
            this.categoryList = res.data.data;
          }
        })
        .catch(err => {
          this.openNotification("error", "Error", "Se ha producido un error.");
        });
    },
    listAgreementsParents() {
      this.$axios("/list_agreements_parents")
        .then(res => {
          if (res) {
            this.parents = res.data.data;
          }
        })
        .catch(err => {
          this.openNotification("error", "Error", "Se ha producido un error.");
        });
    },
    listCompany() {
      this.$axios("/list_company")
        .then(res => {
          if (res.status == 200) {
            this.companies = res.data.data;
          }
          this.$nuxt.$loading.finish();
        })
        .catch(err => {
          this.$nuxt.$loading.finish();
          this.openNotification(
            "error",
            "Error",
            "Se ha producido un error listando las empresas"
          );
        });
    },
    getAgreement() {
      let id = this.idAgreement;
      this.$axios("/agreement_by_id/" + id)
        .then(res => {
          if (res.status == 200) {
            this.agreement = res.data.data;
            this.agreement.fechas = [
              moment(this.agreement.conv_fechainicial, "YYYY-MM-DD"),
              moment(this.agreement.conv_fechafinal, "YYYY-MM-DD")
            ];
            if (
              this.agreement.tico_id == 2 &&
              this.agreement.conv_padre != null
            ) {
              this.parent = true;
            }
          }
          this.$nuxt.$loading.finish();
        })
        .catch(err => {
          this.$nuxt.$loading.finish();
          this.openNotification("error", "Error", "Se ha producido un error.");
        });
    }
  }
};
</script>
<style scoped>
.card-title {
  color: red;
}

.row-upload {
  padding-top: 25px;
  border-top: 1px solid #e8e8e8;
}
</style>