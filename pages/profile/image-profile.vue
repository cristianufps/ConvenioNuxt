<template>
  <a-card title="Imagen de perfil">
    <a-row type="flex" justify="center">
      <a-col :span="10" style="text-align: center;display: flex;justify-content: center;">
        <a-row type="flex" justify="center">
          <a-upload
            name="avatar"
            listType="picture-card"
            class="avatar-uploader page-update"
            :showUploadList="false"
            :beforeUpload="beforeUpload"
            @change="handleChange"
          >
            <img
              v-if="imageUrl"
              :src="imageUrl"
              width="250"
              height="250"
              alt="avatar"
              class="img-update-profile"
            />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">Subir imagen</div>
            </div>
          </a-upload>
        </a-row>
      </a-col>
    </a-row>
    <a-row type="flex" justify="center" v-if="imgUpdate">
      <a-button type="primary" @click="updateImgProfile">
        <b>Subir imagen</b>
      </a-button>
    </a-row>
  </a-card>
</template>
<script>
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
export default {
  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start();

      setTimeout(() => this.$nuxt.$loading.finish(), 500);
    });
  },
  layout: "administrador",
  data() {
    return {
      boxMunicipality: "",
      boxDepartment: "",
      imgUpdate: null,
      typeDocuments: [],
      loading: false,
      flagImg: false,
      imageUrl: ""
    };
  },
  methods: {
    notification(type, title, mensaje) {
      this.$notification[type]({
        message: title,
        description: mensaje
      });
    },
    updateImgProfile() {
      this.$nuxt.$loading.start();
      var img = new FormData();
      img.append("image", this.imgUpdate);
      let id = this.$auth.$state.user.usua_id;
      this.$axios
        .post("/upload_image/" + id, img)
        .then(res => {
          if (res.status == 200) {
            this.$auth.fetchUser();
            this.notification(
              "success",
              "Información",
              "Se ha editado el perfil con éxito"
            );
            this.$nuxt.$loading.finish();
            this.$router.push("/");
          }
        })
        .catch(error => {
          this.$nuxt.$loading.finish();
          this.notification("error", "Error", "Ha ocurrido un error.");
        });
    },
    handleChange(info) {
      if (info.file.status === "uploading") {
        this.loading = true;
        return;
      }
      if (info.file.status === "done") {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl => {
          this.imageUrl = imageUrl;
          this.loading = false;
        });
        this.flagImg = true;
        this.imgUpdate = info.file.originFileObj;
      }
    },
    beforeUpload(file) {
      const isJPG = file.type === "image/jpeg";
      if (!isJPG) {
        this.$message.error("Solo puedes subir imagenes JPG!");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("la imagen debe pesar menos de 2MB!");
      }
      return isJPG && isLt2M;
    }
  }
};
</script>
<style scoped>
</style>