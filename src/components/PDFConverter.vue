<template>
    <b-container class="pt-4"> 
        <h4 class="text-center pb-3 font-weight-bold">Importar CSV do Gerador de Pautas</h4>
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
          <b-form-input class="ml-auto mr-auto w-50 text-center" id="filename" v-model="filename"></b-form-input>
        </div>
        <b-button @click="generatePDF()" :disabled="this.file==null" variant="dark">Converter em PDF</b-button>
        <vue-html2pdf
        :show-layout="false"
        :enable-download="true"
        :preview-modal="false"
        :paginate-elements-by-height="800"
        :filename="filename"
        :pdf-quality="2"
        pdf-content-width="1124px"
        pdf-format="a3"
        pdf-orientation="portrait"
        @hasGenerated="clear()"
        ref="html2Pdf">
            <section slot="pdf-content" class="pl-1 pr-1">
                <h4 class="mt-3 pb-2 text-center font-weight-bold">{{title ? title : ""}}</h4>
                <b-table 
                class=""
                striped
                head-row-variant="none"
                :items="items"
                :fields="fields">
              <template v-slot:cell()="data">
                <div v-if="data.field.label == 'Nome'">{{data.value}}</div>
                <div v-else class="text-center">{{data.value}}</div>
              </template>
              <template v-slot:head()="data">
                <div v-if="data.label == 'Nome'">{{data.label}}</div>
                <div v-else class="text-center">{{data.label}}</div>
              </template>
                </b-table>
                <div class="pl-2 pt-3">
                  <span class="font-weight-bold">Docente: </span>Sância Maria Afonso Pires
                </div>
            </section>
        </vue-html2pdf>
  </b-container>
</template>

<script>

export default {
  name: "PDFConverter",
  data(){
    return {
      title: "",
      fields: [],
      items: [],
      contents: null,
      file: null,
      filename: "",
      validFile: false,
      windows: false
    }
  },
  mounted(){
    if(window.navigator.platform.includes("Win"))
      this.windows = true
  },
  methods:{
    clear(){
        this.contents = null
        this.items = []
        this.fields = []
        this.title = []
        this.filename = ""
        this.validFile = false
    },
    readContents(){
      if(this.checkFile()){
        let reader = new FileReader();
        if(this.windows)
          reader.readAsText(new Blob([this.file]), "windows-1252")
        else
          reader.readAsText(new Blob([this.file]), "UTF-8")
        reader.onloadend =  evt => {
          this.contents = evt.target.result;
        } 
        reader.onerror = evt => {
          console.error(evt);
        }    
      }
    },
    generatePDF(){
        this.transformCSV()
        this.file = null
        this.$refs.html2Pdf.generatePdf()
    },
    checkSeparator(arr){
      return arr[1].split(',').length > arr[0].split(";").length ? "," : ";"
    },
    transformCSV(){
        let arr = this.contents.split("\n")
        let separator = this.checkSeparator(arr)
        this.title = arr[0]
        this.fields = arr[1].split(separator)
        for(let i = 2; i<arr.length; i++){
            let aux = arr[i].split(separator)
            let json = {}
            for(let j = 0; j < aux.length; j++)
                json[this.fields[j]] = aux[j]
            this.items.push(json)
        }
    },
    checkFile(){
      let file = this.file ? true : false;

      if(file && this.file.name.endsWith(".csv")){
        this.filename = this.file.name.substring(0,this.file.name.length-4)
        this.makeToast(`Ficheiro ${this.filename} pronto a converter`, true)
        this.validFile = true
      }

      if(file && !this.file.name.endsWith(".csv")){
        this.file = null
        file = false
        this.makeToast("Erro. Deve importar um ficheiro .CSV")
        this.validFile = false
      }

      return this.validFile
    },
    makeToast(text, flag) {
        let variant = flag ? "success" : "danger"
        let title = flag ? "Sucesso" : "Erro"
        this.$bvToast.toast(text, {
          title: title,
          variant: variant,
          autoHideDelay: 5000
        })
    }
  }
}
</script>


<style scoped>

</style>