<template>
  <b-container class="pt-4">
    <h4 class="text-center pb-3 font-weight-bold">
      Importar CSV do Gerador de Pautas
    </h4>
    <b-card
      class="converter-card"
      header-bg-variant="secondary"
      header-text-variant="light"
      body-bg-variant="dark"
      body-text-variant="light"
      header="CSV to PDF Converter"
    >
      <b-container>
        <div class="pt-1 pb-1">
          <b-form-group label-size="sm" label-cols-sm="1" label="CSV">
            <b-form-file
              size="sm"
              v-model="file"
              :state="validFile"
              @input="readContents()"
              placeholder="Choose/Drop a CSV file.."
              drop-placeholder="Drop file here.."
            ></b-form-file>
          </b-form-group>
        </div>
        <div class="pb-1">
          <b-form-group label-size="sm" label-cols-sm="2" label="Docente">
            <b-form-input
              size="sm"
              class="text-center"
              v-model="teacher"
            ></b-form-input>
          </b-form-group>
        </div>
      </b-container>
      <b-button
        variant="primary"
        class="mb-2"
        @click="generatePDF()"
        :disabled="file == null || teacher.length == 0"
        v-b-tooltip.hover
        title=""
        >Converter em PDF
      </b-button>
    </b-card>
    <PDFVue
      variant="lg"
      ref="pdf"
      :filename="filename2"
      :title="title"
      :items="items"
      :fields="fields"
      :teacher="teacher"
    />
  </b-container>
</template>

<script>
import PDFVue from './PDFVue.vue'
import Mixin from '../../mixins/mixin.js'

export default {
  name: 'PDFConverter',
  mixins: [Mixin],
  components: {
    PDFVue,
  },
  data() {
    return {
      /** WINDOWS & PDF OPTIONS ARE DECLARED IN THE MIXIN */
      validFile: false,
      teacher: '',
    }
  },
  methods: {
    clear() {
      this.contents = null
      this.items = []
      this.fields = []
      this.title = ''
      this.filename2 = ''
      this.validFile = false
      this.pdfGenerated = false
    },
    readContents() {
      if (this.checkFile()) {
        let reader = new FileReader()
        if (this.windows)
          reader.readAsText(new Blob([this.file]), 'windows-1252')
        else reader.readAsText(new Blob([this.file]), 'UTF-8')
        reader.onloadend = (evt) => {
          this.contents = evt.target.result
          this.separator = this.checkSeparator(this.contents)
        }
        reader.onerror = (evt) => {
          console.error(evt)
        }
      }
    },
    generatePDF() {
      this.transformCSVToPDF(this.contents)
      this.pdfGenerated = true
      this.$refs.pdf.generatePDF()
      this.file = null
    },
    checkFile() {
      let file = this.file ? true : false

      if (file && this.file.name.endsWith('.csv')) {
        this.filename2 = this.file.name.substring(0, this.file.name.length - 4)
        this.makeToast(`Ficheiro ${this.filename2} pronto a converter`, true)
        this.validFile = true
      }

      if (file && !this.file.name.endsWith('.csv')) {
        this.file = null
        file = false
        this.makeToast('Erro. Deve importar um ficheiro .CSV')
        this.validFile = false
      }

      return this.validFile
    },
  },
}
</script>

<style scoped>
.converter-card {
  width: 35rem;
  margin-left: auto;
  margin-right: auto;
}
</style>
