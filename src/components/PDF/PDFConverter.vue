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
        v-model="filename2"
      ></b-form-input>
    </div>
    <b-button @click="generatePDF()" :disabled="file == null" variant="dark"
      >Converter em PDF</b-button
    >
    <PDFVue
      :isGenerated="pdfGenerated"
      :filename="filename2"
      :title="title"
      :items="items"
      :fields="fields"
    />
  </b-container>
</template>

<script>
import PDFVue from "./PDFVue.vue";
import Mixin from "../mixins/mixin.js";

export default {
  name: "PDFConverter",
  mixins: [Mixin],
  components: {
    PDFVue
  },
  data() {
    return {
      /** WINDOWS & PDF OPTIONS ARE DECLARED IN THE MIXIN */
      validFile: false
    };
  },
  methods: {
    clear() {
      this.contents = null;
      this.items = [];
      this.fields = [];
      this.title = "";
      this.filename2 = "";
      this.validFile = false;
      this.pdfGenerated = false;
    },
    readContents() {
      if (this.checkFile()) {
        let reader = new FileReader();
        if (this.windows)
          reader.readAsText(new Blob([this.file]), "windows-1252");
        else reader.readAsText(new Blob([this.file]), "UTF-8");
        reader.onloadend = evt => {
          this.contents = evt.target.result;
          this.separator = this.checkSeparator(this.contents);
        };
        reader.onerror = evt => {
          console.error(evt);
        };
      }
    },
    generatePDF() {
      this.transformCSVToPDF(this.contents);
      this.pdfGenerated = true;
      this.file = null;
    },
    checkFile() {
      let file = this.file ? true : false;

      if (file && this.file.name.endsWith(".csv")) {
        this.filename2 = this.file.name.substring(0, this.file.name.length - 4);
        this.makeToast(`Ficheiro ${this.filename2} pronto a converter`, true);
        this.validFile = true;
      }

      if (file && !this.file.name.endsWith(".csv")) {
        this.file = null;
        file = false;
        this.makeToast("Erro. Deve importar um ficheiro .CSV");
        this.validFile = false;
      }

      return this.validFile;
    }
  }
};
</script>

<style scoped></style>
