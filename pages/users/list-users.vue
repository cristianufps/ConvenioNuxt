<template>
  <a-card>
    <a-row slot="title" type="flex" justify="space-around">
      <a-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20">
        <h3 class="card-title">Usuarios</h3>
      </a-col>
      <a-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
        <!-- <nuxt-link to="/users/form">
          <a-button type="primary">Registrar Usuario</a-button>
        </nuxt-link>-->
      </a-col>
    </a-row>
    <a-table :dataSource="users" :columns="columns">
      <div
        slot="filterDropdown"
        slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
        style="padding: 8px"
      >
        <a-input
          v-ant-ref="c => (searchInput = c)"
          :placeholder="`Search ${column.dataIndex}`"
          :value="selectedKeys[0]"
          @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
          @pressEnter="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
          style="width: 188px; margin-bottom: 8px; display: block;"
        />
        <a-button
          type="primary"
          @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
          icon="search"
          size="small"
          style="width: 90px; margin-right: 8px"
        >Search</a-button>
        <a-button @click="() => handleReset(clearFilters)" size="small" style="width: 90px">Reset</a-button>
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
                :to="{name: 'users-form-iduser', params: { iduser: record.usua_id } }"
              >{{ fragment }}</nuxt-link>
            </mark>
            <template v-else>
              <nuxt-link
                :key="i"
                :to="{name: 'users-form-iduser', params: { iduser: record.usua_id } }"
              >{{ fragment }}</nuxt-link>
            </template>
          </template>
        </span>
        <template v-else>
          <nuxt-link
            :to="{name: 'users-form-iduser', params: { iduser: record.usua_id } }"
          >{{ text }}</nuxt-link>
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
    this.listUsers();
  },
  layout: "administrador",
  data() {
    return {
      users: [],
      searchText: "",
      searchInput: null,
      searchedColumn: "",
      columns: [
        {
          title: "Nombres",
          dataIndex: "usua_nombres",
          key: "usua_nombres",
          scopedSlots: {
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
            customRender: "customRender"
          },
          onFilter: (value, record) =>
            record.usua_nombres
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              }, 0);
            }
          }
        },
        {
          title: "Apellidos",
          dataIndex: "usua_apellidos",
          key: "usua_apellidos",
          scopedSlots: {
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
            customRender: "customRender"
          },
          onFilter: (value, record) =>
            record.usua_apellidos
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              });
            }
          }
        },
        {
          title: "Correo",
          dataIndex: "usua_correo",
          key: "usua_correo",
          scopedSlots: {
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
            customRender: "customRender"
          },
          onFilter: (value, record) =>
            record.usua_correo
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              });
            }
          }
        }
      ]
    };
  },
  methods: {
    handleSearch(selectedKeys, confirm, dataIndex) {
      confirm();
      this.searchText = selectedKeys[0];
      this.searchedColumn = dataIndex;
    },
    handleReset(clearFilters) {
      clearFilters();
      this.searchText = "";
    },
    listUsers() {
      this.$axios("/usuarios")
        .then(res => {
          if (res) {
            console.log(res);
            this.users = res.data.usuario;
          }
          this.$nuxt.$loading.finish();
        })
        .catch(err => {
          console.log(err);
          this.$nuxt.$loading.finish();
        });
    }
  }
};
</script>
<style scoped>
.card-title {
  color: red;
}
</style>