<template>
  <a-card>
    <a-row slot="title" type="flex" justify="space-around">
      <a-col :xs="11" :sm="11" :md="16" :lg="16" :xl="16">
        <h3 class="card-title">Convenios</h3>
      </a-col>
      <a-col :xs="13" :sm="13" :md="4" :lg="4" :xl="4">
        <a-button @click="excel" v-if="agreements.length > 0" type="primary">
          <b>Descargar Excel</b>
        </a-button>
      </a-col>
      <a-col :xs="13" :sm="13" :md="4" :lg="4" :xl="4">
        <nuxt-link to="/agreement/form/">
          <a-button type="primary">
            <b>Registrar Convenio</b>
          </a-button>
        </nuxt-link>
      </a-col>
    </a-row>
    <a-table rowKey="conv_id" :dataSource="agreements" :columns="columns">
      <div
        slot="filterDropdown"
        slot-scope="{
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
          column,
        }"
        style="padding: 8px"
      >
        <a-input
          v-ant-ref="(c) => (searchInput = c)"
          :placeholder="`Search ${column.dataIndex}`"
          :value="selectedKeys[0]"
          @change="
            (e) => setSelectedKeys(e.target.value ? [e.target.value] : [])
          "
          @pressEnter="
            () => handleSearch(selectedKeys, confirm, column.dataIndex)
          "
          style="width: 188px; margin-bottom: 8px; display: block"
        />
        <a-button
          type="primary"
          @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
          icon="search"
          size="small"
          style="width: 90px; margin-right: 8px"
          >Search</a-button
        >
        <a-button
          @click="() => handleReset(clearFilters)"
          size="small"
          style="width: 90px"
          >Reset</a-button
        >
      </div>
      <a-icon
        slot="filterIcon"
        slot-scope="filtered"
        type="search"
        :style="{ color: filtered ? '#108ee9' : undefined }"
      />
      <template slot="customRender" slot-scope="text, record, index, column">
        <span v-if="searchText && searchedColumn === column.dataIndex">
          <template
            v-for="(fragment, i) in text
              .toString()
              .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
          >
            <mark
              v-if="fragment.toLowerCase() === searchText.toLowerCase()"
              :key="i"
              class="highlight"
            >
              <nuxt-link
                :to="{
                  name: 'agreement-form-idagreement',
                  params: { idagreement: record.conv_id },
                }"
                >{{ fragment }}</nuxt-link
              >
            </mark>
            <template v-else>
              <nuxt-link
                :key="i"
                :to="{
                  name: 'agreement-form-idagreement',
                  params: { idagreement: record.conv_id },
                }"
                >{{ fragment }}</nuxt-link
              >
            </template>
          </template>
        </span>
        <template v-else>
          <nuxt-link
            :to="{
              name: 'agreement-form-idagreement',
              params: { idagreement: record.conv_id },
            }"
            >{{ text }}</nuxt-link
          >
        </template>
      </template>
      <template slot="delete" slot-scope="text, record, index, column">
        <a-popconfirm
          title="¿Eliminar Convenio?"
          okText="Si"
          cancelText="No"
          @confirm="() => deleteAgremment(record.conv_id)"
        >
          <a-button class="btn-error btn-table"
            ><strong> Eliminar </strong>
          </a-button>
        </a-popconfirm>
      </template>
    </a-table>
  </a-card>
</template>
<script>
export default {
  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start();
    });
  },
  beforeMount() {
    this.listAgreements();
  },
  layout: "administrador",
  data() {
    return {
      agreements: [],
      searchText: "",
      searchInput: null,
      searchedColumn: "",
      columns: [
        {
          title: "Nombre",
          dataIndex: "conv_nombre",
          key: "conv_nombre",
          scopedSlots: {
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
            customRender: "customRender",
          },
          onFilter: (value, record) =>
            record.conv_nombre
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              }, 0);
            }
          },
        },
        {
          title: "Empresa",
          dataIndex: "empr_nombre",
          key: "empr_nombre",
          scopedSlots: {
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
            customRender: "customRender",
          },
          onFilter: (value, record) =>
            record.empr_nombre
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              }, 0);
            }
          },
        },
        {
          title: "Tipo Convenio",
          dataIndex: "tico_nombre",
          key: "tico_nombre",
          scopedSlots: {
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
            customRender: "customRender",
          },
          onFilter: (value, record) =>
            record.tico_nombre
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              });
            }
          },
        },
        {
          title: "Fecha final",
          dataIndex: "conv_fechafinal",
          key: "conv_fechafinal",
          scopedSlots: {
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
            customRender: "customRender",
          },
          onFilter: (value, record) =>
            record.conv_fechafinal
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              });
            }
          },
        },
        {
          title: "Acción",
          dataIndex: "conv_id",
          key: "conv_id",
          scopedSlots: {
            customRender: "delete",
          },
        },
      ],
    };
  },
  methods: {
    success(description) {
      this.$message.success(description);
    },
    error(description) {
      this.$message.error(description);
    },
    openNotification(type, title, description) {
      this.$notification[type]({
        message: title,
        description: description,
        duration: 5,
      });
    },
    handleSearch(selectedKeys, confirm, dataIndex) {
      confirm();
      this.searchText = selectedKeys[0];
      this.searchedColumn = dataIndex;
    },
    handleReset(clearFilters) {
      clearFilters();
      this.searchText = "";
    },
    listAgreements() {
      this.$axios("list_agreements")
        .then((res) => {
          console.log("list ", res);
          if (res.status == 200) {
            this.agreements = res.data.data;
          }
          this.$nuxt.$loading.finish();
        })
        .catch((err) => {
          this.openNotification(
            "error",
            "Error",
            "Se ha producido un error listando los convenios"
          );
          this.$nuxt.$loading.finish();
        });
    },
    excel() {
      // let id = this.$auth.$state.user.id
      // let rol = this.$auth.$state.user.role.role_id
      let route = "";

      route = this.$axios.defaults.baseURL + "/excel_agreements";

      if (route !== null) {
        let newWindow = window.open(route, "blank");
        if (
          !newWindow ||
          newWindow.closed ||
          typeof newWindow.closed === "undefined"
        ) {
          this.allowEmergingWindows();
        }
        this.success("Se descargó el archivo con éxito");
      } else {
        this.error("Se ha produciodo un problema.");
      }
    },
    allowEmergingWindows() {
      Modal.warning({
        title: "Ventanas emergentes",
        content:
          "Por favor habilite las ventanas emergentes de acuerdo con su navegador",
      });
    },
    txt(file, nombreFile) {
      var blob = new Blob([file], {
        type: "text/plain;charset=utf-8",
      });
      var a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      var url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = nombreFile;
      a.click();
    },
    deleteAgremment(id) {
      this.$axios
        .delete("/delete_agreement_by_id/" + id)
        .then((res) => {
          console.log("delete_agreement_by_id ", res);
          if (res.status == 200) {
            if (res.data.error) {
              let arch = "";
              let errores = [];
              if (res.data.agremments) {
                if (Array.isArray(res.data.agremments)) {
                  errores = res.data.agremments;
                } else {
                  errores.push(res.data.agremments);
                }
                errores.map((item) => (arch += "-" + item.conv_nombre + "\n"));
                this.txt(arch, "convenios_relacionados.txt");
              }
              if (res.data.students) {
                if (Array.isArray(res.data.students)) {
                  errores = res.data.students;
                } else {
                  errores.push(res.data.students);
                }
                errores.map(
                  (item) =>
                    (arch +=
                      "-" +
                      item.estu_nombres +
                      " " +
                      item.estu_apellidos +
                      " " +
                      item.estu_codigo +
                      "\n")
                );
                this.txt(arch, "estudiantes_relacionados.txt");
              }
              this.$info({
                width: 500,
                title: "Atención",
                content: function () {
                  return (
                    <ul style="padding-left: 0;">
                      <li>El convenio tiene registro relacionados.</li>
                      <li>
                        Para poder eliminar el convenio debe eliminar los
                        registros que se encuentran en archivo generado.
                      </li>
                    </ul>
                  );
                },
                onOk: null,
              });
            } else {
              this.listAgreements();
              this.openNotification(
                "success",
                "Información",
                "Se ha eliminado el convenio satisfactoriamente."
              );
            }
          }
        })
        .catch((err) => {
          console.log("errrr", err);
          this.openNotification(
            "error",
            "Información",
            "Ha ocurrido un error."
          );
        });
    },
  },
};
</script>
<style scoped>
.card-title,
.btn-error {
  color: red;
}

.btn-table {
  height: 50%;
  font-size: 13px;
  padding-left: 5%;
  padding-right: 5%;
}
</style>