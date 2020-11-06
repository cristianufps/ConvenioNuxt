<template>
  <a-card>
    <a-row slot="title" type="flex" justify="space-around">
      <a-col :xs="11" :sm="11" :md="20" :lg="20" :xl="20">
        <h3 class="card-title">Solicitudes</h3>
      </a-col>
      <a-col :xs="13" :sm="13" :md="4" :lg="4" :xl="4"> </a-col>
    </a-row>
    <a-row type="flex" justify="center">
      <a-col :span="20">
        <a-list :pagination="pagination" :data-source="requests">
          <a-list-item slot="renderItem" slot-scope="item, index">
            <!-- <a-card :title="item.title"> Card content </a-card> -->
            <a-descriptions bordered size="small">
              <a-descriptions-item label="Responsable">
                {{ item.soli_responsable }}
              </a-descriptions-item>
              <a-descriptions-item label="Celular">
                {{ item.soli_celular }}
              </a-descriptions-item>
              <a-descriptions-item label="Correo">
                {{ item.soli_correo }}
              </a-descriptions-item>
              <a-descriptions-item label="Fecha">
                {{
                  new Date(item.soli_fecharegistro).toLocaleDateString(
                    "ES",
                    options
                  )
                }}
              </a-descriptions-item>
              <a-descriptions-item label="Descripción">
                {{ item.soli_detalle }}
              </a-descriptions-item>
              <a-descriptions-item label="Acción">
                <div class="cont-resques">
                  <a-popover
                    @click="clearText"
                    title="Enviar correo"
                    placement="left"
                    trigger="click"
                  >
                    <template slot="content">
                      <div style="width: 400px; text-align: center">
                        <a-textarea
                          v-model="bodyText"
                          placeholder="Descripción"
                          :auto-size="{ minRows: 3, maxRows: 5 }"
                          :maxLength="500"
                        />
                        <a-button
                          style="margin-top: 5px"
                          type="primary"
                          class="buttom-requets"
                          @click="sendMail(item)"
                          >Enviar</a-button
                        >
                      </div>
                    </template>
                    <a-button type="primary" class="buttom-requets"
                      >Responder</a-button
                    >
                  </a-popover>
                  <a-popconfirm
                    title="¿Estás seguro?"
                    ok-text="Si"
                    cancel-text="No"
                    @confirm="deleteRequests(item.soli_id)"
                  >
                    <a-button class="buttom-requets">Rechazar</a-button>
                  </a-popconfirm>
                </div>
              </a-descriptions-item>
            </a-descriptions>
          </a-list-item>
        </a-list>
      </a-col>
    </a-row>
  </a-card>
</template>
<script>
export default {
  layout: "administrador",
  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start();
    });
  },
  beforeMount() {
    this.listRequests();
  },
  // computed: {
  //   arraySort: function () {
  //     return this.requests.sort(function (a, b) {
  //       // Turn your strings into dates, and then subtract them
  //       // to get a value that is either negative, positive, or zero.
  //       return new Date(a.aler_fecharegistro) - new Date(b.aler_fecharegistro);
  //     });
  //   },
  // },
  data() {
    return {
      bodyText: "",
      requests: [],
      options: {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      },
      pagination: {
        onChange: (page) => {
          console.log(page);
        },
        pageSize: 5,
      },
    };
  },
  methods: {
    sendMail(e) {
      if (this.bodyText == "") {
        return this.$message.error("Llene todos los campos");
      }
      this.$nuxt.$loading.start();
      let req = {
        request: {
          soli_id: e.soli_id,
          message: this.bodyText,
          soli_correo: e.soli_correo,
          soli_estado: 2,
        },
      };

      this.$axios
        .post("/response_request", req)
        .then((res) => {
          console.log("resp ", res);
          if (res.status == 200) {
            this.bodyText = "";
            this.openNotification(
              "success",
              "Información",
              "Se ha enviado la Información satisfactoriamente"
            );
          }
          this.$nuxt.$loading.finish();
        })
        .catch((err) => {
          this.openNotification(
            "error",
            "Error",
            "Se ha producido un error enviando el correo"
          );
          this.$nuxt.$loading.finish();
        });
    },
    clearText() {
      this.bodyText = "";
    },
    openNotification(type, title, description) {
      this.$notification[type]({
        message: title,
        description: description,
        duration: 5,
      });
    },
    listRequests() {
      this.$axios("/list_request")
        .then((res) => {
          console.log("list ", res);
          if (res.status == 200) {
            this.requests = res.data.data;
          }
          this.$nuxt.$loading.finish();
        })
        .catch((err) => {
          this.openNotification(
            "error",
            "Error",
            "Se ha producido un error listando las solicitudes"
          );
          this.$nuxt.$loading.finish();
        });
    },
    deleteRequests(id) {
      this.$nuxt.$loading.start();
      this.$axios
        .delete("/delete_request/" + id)
        .then((res) => {
          if (res.status == 200) {
            this.listRequests();
            this.$store.commit("setAlerts", id);
            this.openNotification(
              "success",
              "Información",
              "Se ha borrado la solicitud satisfactoriamente"
            );
          }
          this.$nuxt.$loading.finish();
        })
        .catch((err) => {
          this.openNotification(
            "error",
            "Error",
            "Se ha producido un error listando las solicitudes"
          );
          this.$nuxt.$loading.finish();
        });
    },
  },
};
</script>
<style>
.buttom-requets {
  height: 60% !important;
  width: 100px;
  margin-bottom: 5px;
}

.cont-resques {
  text-align: center;
}
</style>