<template>
  <a-card>
    <a-row slot="title" type="flex" justify="space-around">
      <a-col :xs="12" :sm="18" :md="20" :lg="20" :xl="20">
        <h3 class="card-title">Categorías</h3>
      </a-col>
      <a-col :xs="12" :sm="12" :md="4" :lg="4" :xl="4">
        <nuxt-link to="/admin/category/form-category">
          <a-button type="primary">
            <b>Registrar Categoría</b>
          </a-button>
        </nuxt-link>
      </a-col>
    </a-row>
    <a-table rowKey="cate_id" :dataSource="categoryList" :columns="columns">
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
                :to="{name: 'admin-category-form-category-idcategory', params: { idcategory: record.cate_id } }"
              >{{ fragment }}</nuxt-link>
            </mark>
            <template v-else>
              <nuxt-link
                :key="i"
                :to="{name: 'admin-category-form-category-idcategory', params: { idcategory: record.cate_id } }"
              >{{ fragment }}</nuxt-link>
            </template>
          </template>
        </span>
        <template v-else>
          <nuxt-link
            :to="{name: 'admin-category-form-category-idcategory', params: { idcategory: record.cate_id } }"
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
    this.listCategories();
  },
  layout: "administrador",
  data() {
    return {
      categoryList: [],
      searchText: "",
      searchInput: null,
      searchedColumn: "",
      columns: [
        {
          title: "Nombre",
          dataIndex: "cate_nombre",
          key: "cate_nombre",
          scopedSlots: {
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
            customRender: "customRender"
          },
          onFilter: (value, record) =>
            record.cate_nombre
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
        }
      ]
    };
  },
  methods: {
    openNotification(type, title, description) {
      this.$notification[type]({
        message: title,
        description: description,
        duration: 5
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
    listCategories() {
      this.$axios("/list_category")
        .then(res => {
          if (res.status == 200) {
            this.categoryList = res.data.data;
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
</style>