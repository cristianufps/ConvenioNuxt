<template>
  <a-card>
    <a-row slot="title" type="flex" justify="space-around">
      <a-col :xs="10" :sm="10" :md="18" :lg="16" :xl="16">
        <h3 class="card-title">Estudiantes</h3>
      </a-col>
      <a-col :xs="10" :sm="10" :md="4" :lg="4" :xl="4">
        <a-button @click="excel" v-if="students.length > 0" type="primary">
          <b>Descargar Excel</b>
        </a-button>
      </a-col>
      <a-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
        <nuxt-link to="/student/form">
          <a-button type="primary">Registrar Estudiante</a-button>
        </nuxt-link>
      </a-col>
    </a-row>
    <a-table
      :pagination="{ size: 'small' }"
      :dataSource="students"
      :columns="columns"
      rowKey="estu_id"
    >
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
                  name: 'student-form-idstudent',
                  params: { idstudent: record.estu_id },
                }"
                >{{ fragment }}</nuxt-link
              >
            </mark>
            <template v-else>
              <nuxt-link
                :key="i"
                :to="{
                  name: 'student-form-idstudent',
                  params: { idstudent: record.estu_id },
                }"
                >{{ fragment }}</nuxt-link
              >
            </template>
          </template>
        </span>
        <template v-else>
          <nuxt-link
            :to="{
              name: 'student-form-idstudent',
              params: { idstudent: record.estu_id },
            }"
            >{{ text }}</nuxt-link
          >
        </template>
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
    this.listStudents();
  },
  layout: "administrador",
  data() {
    return {
      students: [],
      searchText: "",
      searchInput: null,
      searchedColumn: "",
      columns: [
        {
          title: "Nombres",
          dataIndex: "estu_nombres",
          key: "estu_nombres",
          scopedSlots: {
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
            customRender: "customRender",
          },
          onFilter: (value, record) =>
            record.estu_nombres
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
          title: "Apellidos",
          dataIndex: "estu_apellidos",
          key: "estu_apellidos",
          scopedSlots: {
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
            customRender: "customRender",
          },
          onFilter: (value, record) =>
            record.estu_apellidos
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
          title: "Codigo",
          dataIndex: "estu_codigo",
          key: "estu_codigo",
          scopedSlots: {
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
            customRender: "customRender",
          },
          onFilter: (value, record) =>
            record.usua_correo
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
          title: "Convenio",
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
      ],
    };
  },
  methods: {
    success(description) {
      this.$message.success(description);
    },
    excel() {
      let route = "";
      route = this.$axios.defaults.baseURL + "/excel_students";
      let newWindow = window.open(route, "blank");
      if (
        !newWindow ||
        newWindow.closed ||
        typeof newWindow.closed === "undefined"
      ) {
        this.allowEmergingWindows();
      }
      this.success("Se descargó el archivo con éxito");
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
    listStudents() {
      this.$axios("/list_student")
        .then((res) => {
          if (res) {
            console.log(res);
            this.students = res.data.data;
          }
          this.$nuxt.$loading.finish();
        })
        .catch((err) => {
          console.log(err);
          this.$nuxt.$loading.finish();
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