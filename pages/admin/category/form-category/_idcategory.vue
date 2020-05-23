<template>
  <a-card>
    <a-row type="flex" justify="end">
      <a-col :xs="20" :sm="20" :md="22" :lg="22" :xl="22">
        <h2 v-if="idCategory" class="form-title">Editar Categoría</h2>
        <h2 v-else class="form-title">Registrar Categoría</h2>
      </a-col>

      <a-col :xs="4" :sm="4" :md="2" :lg="2" :xl="2" style="text-align:end;">
        <div class="pointer">
          <nuxt-link to="/admin/category/category-list">
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
          'cate_nombre',
          {
              initialValue:category.cate_nombre,
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
            <a-button v-if="idCategory" type="primary" html-type="submit">
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
    if (this.idCategory) {
      this.getCategory();
    }
  },
  data() {
    return {
      idCategory: this.$route.params.idcategory,
      category: {
        cate_id: "",
        cate_nombre: ""
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
    getCategory() {
      let id = this.idCategory;
      this.$axios("/category_by_id/" + id)
        .then(res => {
          if (res.status == 200) {
            this.category = res.data.data;
          }
          this.$nuxt.$loading.finish();
        })
        .catch(err => {
          this.$nuxt.$loading.finish();
          this.openNotification("error", "Error", "Se ha producido un error.");
        });
    },
    updateCategory(datos) {
      this.$axios
        .$put("/update_category/" + this.idCategory, datos)
        .then(res => {
          if (res.error) {
            this.openNotification(
              "info",
              "Información",
              "la categoría ya se encuentra registrada."
            );
          } else {
            this.openNotification(
              "success",
              "Información",
              "Se ha editado la categoría satisfactoriamente."
            );
            this.$router.push("/admin/category/category-list");
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
    registerCategory(datos) {
      this.$axios
        .$post("/create_category", datos)
        .then(res => {
          if (res != null) {
            this.openNotification(
              "success",
              "Información",
              "Se ha registrado la categoría satisfactoriamente."
            );
            this.$router.push("/admin/category/category-list");
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
            category: {
              cate_nombre: values.cate_nombre.trim()
            }
          };

          if (this.idCategory) {
            this.updateCategory(body);
          } else {
            this.registerCategory(body);
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