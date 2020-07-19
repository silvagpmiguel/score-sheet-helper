<template>
  <b-container class="pt-4">
    <h4 class="text-center pb-3 font-weight-bold">
      Importar CSV do Gerador de Pautas
    </h4>
    <b-row class="pb-4">
      <b-form-file
        v-model="file"
        :state="validFile"
        @input="readContents()"
        placeholder="Choose a file or drop it here..."
        drop-placeholder="Drop file here..."
        class="w-50 mr-auto ml-auto"
      ></b-form-file>
    </b-row>
    <div v-show="validFile" class="pb-3">
      <label class="font-weight-bold" for="filename">Nome da nova Pauta</label>
      <b-form-input
        class="ml-auto mr-auto w-50 text-center"
        id="filename"
        v-model="filename"
      ></b-form-input>
    </div>
    <b-button @click="generatePDF()" :disabled="file == null" variant="dark"
      >Converter em PDF</b-button
    >
    <PDFVue
      :isGenerated="isGenerated"
      :filename="filename"
      :title="title"
      :items="items"
      :fields="fields"
    />
  </b-container>
</template>

<script>
import PDFVue from "./PDFVue.vue";

export default {
  name: "PDFConverter",
  components: {
    PDFVue,
  },
  data() {
    return {
      title: "",
      fields: [],
      items: [],
      contents: null,
      file: null,
      filename: "",
      validFile: false,
      windows: false,
      isGenerated: false,
    };
  },
  mounted() {
    if (window.navigator.platform.includes("Win")) this.windows = true;
  },
  methods: {
    clear() {
      this.contents = null;
      this.items = [];
      this.fields = [];
      this.title = "";
      this.filename = "";
      this.validFile = false;
      this.isGenerated = false;
    },
    readContents() {
      if (this.checkFile()) {
        let reader = new FileReader();
        if (this.windows)
          reader.readAsText(new Blob([this.file]), "windows-1252");
        else reader.readAsText(new Blob([this.file]), "UTF-8");
        reader.onloadend = (evt) => {
          this.contents = evt.target.result;
        };
        reader.onerror = (evt) => {
          console.error(evt);
        };
      }
    },
    generatePDF() {
      this.transformCSV();
      this.file = null;
      this.isGenerated = true;
    },
    checkSeparator(arr) {
      return arr[1].split(",").length > arr[0].split(";").length ? "," : ";";
    },
    transformCSV() {
      let arr = this.contents.split("\n");
      let separator = this.checkSeparator(arr);
      this.title = arr[0];
      this.fields = arr[1].split(separator);
      for (let i = 2; i < arr.length; i++) {
        let aux = arr[i].split(separator);
        let json = {};
        for (let j = 0; j < aux.length; j++) json[this.fields[j]] = aux[j];
        this.items.push(json);
      }
    },
    checkFile() {
      let file = this.file ? true : false;

      if (file && this.file.name.endsWith(".csv")) {
        this.filename = this.file.name.substring(0, this.file.name.length - 4);
        this.makeToast(`Ficheiro ${this.filename} pronto a converter`, true);
        this.validFile = true;
      }

      if (file && !this.file.name.endsWith(".csv")) {
        this.file = null;
        file = false;
        this.makeToast("Erro. Deve importar um ficheiro .CSV");
        this.validFile = false;
      }

      return this.validFile;
    },
    makeToast(text, flag) {
      let variant = flag ? "success" : "danger";
      let title = flag ? "Sucesso" : "Erro";
      this.$bvToast.toast(text, {
        title: title,
        variant: variant,
        autoHideDelay: 3000,
      });
    },
  },
};
</script>

<style scoped></style>
