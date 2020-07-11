<template>
  <b-container class="pt-4">
    <h4 class="text-center pb-3 font-weight-bold">Importar Pautas CSV</h4>
    <b-row class="pb-5">
      <b-form-file
        v-model="file"
        :state="checkFile()"
        placeholder="Choose a file or drop it here..."
        drop-placeholder="Drop file here..."
        class="w-50 mr-auto ml-auto"
      ></b-form-file>
    </b-row>
    <b-container v-show="!meanBoolean" class="pb-3">
      <b-card bg-variant="light">
          <b-form-group
            label-cols-lg="2"
            label="Parâmetros"
            label-size="lg"
            label-class="font-weight-bold pt-0"
            class="pr-5"
          >
            <b-form-radio-group
              class="pt-2 pb-3"
              v-model="selectedMethod"
              @input="adjustPercentages()" 
              :options="methods"
            ></b-form-radio-group>
            <b-form-group
              label-cols-sm="4"
              label="U.C / Ano Letivo"
              label-align-sm="right"
              label-for="uc"
            >
              <b-row>
                <b-col>
                <b-form-input placeholder="Unidade Curricular" v-model="uc" id="uc"></b-form-input>
                </b-col>
                <b-col>
                <b-form-input v-model="date" id="date"></b-form-input>
                </b-col>
              </b-row>
            </b-form-group>
            <b-form-group
              label-cols-sm="4"
              label="Nomes das Colunas dos Trabalhos"
              label-align-sm="right"
              label-for="nested-street"
              v-if="selectedMethod == 'Avaliação Prática' || selectedMethod == 'Avaliação Final'"
            >
              <b-form-input :disabled="true" v-model="jobNames" id="nested-street"></b-form-input>
              <b-form-checkbox-group
                class="pt-2"
                v-if="contents"
                v-model="selectedJobNames"
                @input="refreshInput('j', selectedJobNames)"
                :options="csv.headers.slice().splice(2, csv.headers.length)"
                ></b-form-checkbox-group>
            </b-form-group>
            <b-form-group
              label-cols-sm="4"
              label="Percentagem dos Trabalhos (0-1)"
              label-align-sm="right"
              label-for="nested-city"
              v-if="selectedMethod == 'Avaliação Prática' || selectedMethod == 'Avaliação Final'"
            >
              <b-form-input v-model="jobPercentages" id="nested-city"></b-form-input>
            </b-form-group>
            <b-form-group
              label-cols-sm="4"
              label="Nota Mínima Prática"
              label-align-sm="right"
              label-for="pMinGrade"
              v-if="selectedMethod == 'Avaliação Prática' || selectedMethod == 'Avaliação Final'"
            >
              <b-form-input v-model="pMinGrade" id="pMinGrade"></b-form-input>
            </b-form-group>
            <b-form-group
             label-cols-sm="4"
              label="Nomes das Colunas dos Testes"
              label-align-sm="right"
              label-for="nested-state"
              v-if="selectedMethod == 'Avaliação Teórica' || selectedMethod == 'Avaliação Final'"
            >
              <b-form-input :disabled="true" v-model="testNames" id="nested-state"></b-form-input>
              <b-form-checkbox-group
                class="pt-2"
                v-if="contents"
                v-model="selectedTestNames"
                @input="refreshInput('t', selectedTestNames)"
                :options="csv.headers.slice().splice(2, csv.headers.length)"
              ></b-form-checkbox-group>
            </b-form-group>
            <b-form-group
              label-cols-sm="4"
              label="Percentagem dos Testes (0-1)"
              label-align-sm="right"
              label-for="nested-country"
              v-if="selectedMethod == 'Avaliação Teórica' || selectedMethod == 'Avaliação Final'"
            >
              <b-form-input v-model="testPercentages" id="nested-country"></b-form-input>
            </b-form-group>
            <b-form-group
              label-cols-sm="4"
              label="Nota Mínima Teórica"
              label-align-sm="right"
              label-for="tMinGrade"
              v-if="selectedMethod == 'Avaliação Teórica' || selectedMethod == 'Avaliação Final'"
            >
              <b-form-input v-model="tMinGrade" id="nested-tMinGrade"></b-form-input>
            </b-form-group>
            <b-form-group
              label-cols-sm="4"
              label="Percentagem Final Teórica (0-1)"
              label-align-sm="right"
              label-for="nested-p"
              v-if="selectedMethod == 'Avaliação Final'"
            >
              <b-form-input v-model="t_evaluation_percentage" id="nested-p"></b-form-input>
            </b-form-group>

            <b-form-group
              label-cols-sm="4"
              label="Percentagem Final Prática (0-1)"
              label-align-sm="right"
              label-for="nested-t"
              v-if="selectedMethod == 'Avaliação Final'"
            >
              <b-form-input v-model="p_evaluation_percentage" id="nested-t"></b-form-input>
            </b-form-group>
          </b-form-group>
        </b-card>
    </b-container>
    <b-row class="pb-3">
      <b-button class="mr-auto ml-auto" v-show="!meanBoolean" :disabled="(testNames == '' || testPercentages == '') && (jobNames == '' || jobPercentages == '')" @click="calculateMean()" variant="dark">Calcular Media</b-button>
    </b-row>
      <b-row v-show="meanBoolean" class="pb-3">
        <b-form-group class="mr-auto ml-auto">
          <b-row class="pb-3 ">
            <label class="font-weight-bold mr-auto ml-auto" for="filename">Nome da nova Pauta</label>
            <b-form-input id="filename" v-model="filename"></b-form-input>
          </b-row>
          <b-button :disabled="disableDownload" @click="download()" variant="dark">Download</b-button>
        </b-form-group>
      </b-row>
  </b-container>
</template>

<script>
export default {
  name: "MainPage",
  data(){
    return {
      csv: null,
      filename: "avFinal.csv",
      file: null,
      contents: null,
      selectedJobNames: [],
      selectedTestNames: [],
      jobNames: "",
      jobPercentages: "",
      testNames: "",
      testPercentages: "",
      disableDownload: true,
      t_evaluation_percentage: 0.5,
      p_evaluation_percentage: 0.5,
      output: [[]],
      meanBoolean: false,
      separator: ";",
      windows: false,
      uc: "",
      date: `${new Date().getFullYear()-1}/${new Date().getFullYear()}`,
      selectedMethod: "Avaliação Final",
      methods: ['Avaliação Teórica', 'Avaliação Prática', 'Avaliação Final'],
      tMinGrade: 9.5,
      pMinGrade: 0
    }
  },
  mounted(){
    if(window.navigator.platform.includes("Win"))
      this.windows = true
  },
  methods:{
    adjustPercentages(){
      if(this.selectedMethod == 'Avaliação Final'){
        this.t_evaluation_percentage = 0.5
        this.p_evaluation_percentage = 0.5
        this.filename = "avFinal.csv"
      }else if(this.selectedMethod == 'Avaliação Prática'){
        this.filename = "avPratica.csv"
      }else{
        this.filename = "avTeorica.csv"
      }
    },
    calculateMean(){
      let msg = "final"
      if(this.selectedMethod == 'Avaliação Final'){
        this.calculateFinalMean()
        msg = "final"
      }else if(this.selectedMethod == 'Avaliação Prática'){
        this.calculatePraticalMean()
        msg = "prática"
      }else{
        this.calculateTheoricalMean()
        msg = "teórica"
      }
      this.meanBoolean = true
      this.disableDownload = false
      this.makeToast(`Pauta ${msg} criada!`, this.meanBoolean)
    },
    calculateTheoricalMean(){
      let tests = this.testNames.split(",")
      let tests_percentage = this.testPercentages.split(",")
      this.output.push([`U.C de ${this.uc} - Ano Letivo ${this.date}`])
      let outputHeaders = [this.csv.headers[0], this.csv.headers[1], "Av. Teórica"]
      this.output.push(outputHeaders)
      let grade 
      for(let i=0; i<this.csv[this.csv.headers[0]].length; i++){
        var mean_t = parseFloat("0")
        for(let k=0; k<tests.length; k++){
          if(!isNaN(this.csv[tests[k]][i])){
            mean_t += parseFloat(this.csv[tests[k]][i]) * parseFloat(tests_percentage[k])
          }
        }

        grade = mean_t.toFixed(2)
        this.output.push([this.csv[this.csv.headers[0]][i], this.csv[this.csv.headers[1]][i], grade])
      }
    },
    calculatePraticalMean(){
      let jobs = this.jobNames.split(",")
      let jobs_percentage = this.jobPercentages.split(",")
      this.output.push([`U.C de ${this.uc} - Ano Letivo ${this.date}`])
      let outputHeaders = [this.csv.headers[0], this.csv.headers[1], "Av. Prática"]
      this.output.push(outputHeaders)
      let grade

      for(let i=0; i<this.csv[jobs[0]].length; i++){
        var mean_p = parseFloat("0")
        for(let j=0; j<jobs.length; j++){
          if(this.csv[jobs[j]][i].includes(','))
            this.csv[jobs[j]][i] = this.csv[jobs[j]][i].replace(',', '.')

          if(!isNaN(this.csv[jobs[j]][i])){
            mean_p += (parseFloat(this.csv[jobs[j]][i]) * parseFloat(jobs_percentage[j]))
          }
        }

        grade = mean_p.toFixed(2)

        this.output.push([this.csv[this.csv.headers[0]][i], this.csv[this.csv.headers[1]][i], grade])
      }
    },
    calculateFinalMean(){
      let jobs = this.jobNames.split(",")
      let jobs_percentage = this.jobPercentages.split(",")
      let tests = this.testNames.split(",")
      let tests_percentage = this.testPercentages.split(",")
      this.output.push([`U.C de ${this.uc} - Ano Letivo ${this.date}`])
      let outputHeaders = [this.csv.headers[0], this.csv.headers[1], "Av. Prática", "Av. Teórica", "Av. Final"]
      this.output.push(outputHeaders)
      let pGrade, tGrade, grade

      for(let i=0; i<this.csv[jobs[0]].length; i++){
        var mean_p = parseFloat("0")
        var mean_t = parseFloat("0")
        for(let j=0; j<jobs.length; j++){
          if(this.csv[jobs[j]][i].includes(','))
            this.csv[jobs[j]][i] = this.csv[jobs[j]][i].replace(',', '.')

          if(!isNaN(this.csv[jobs[j]][i])){
            mean_p += (parseFloat(this.csv[jobs[j]][i]) * parseFloat(jobs_percentage[j]))
          }
        }
        for(let k=0; k<tests.length; k++){
          if(!isNaN(this.csv[tests[k]][i])){
            mean_t += parseFloat(this.csv[tests[k]][i]) * parseFloat(tests_percentage[k])
          }
        }

        if(this.pMinGrade == 0){
          pGrade = mean_p.toFixed(2)
        }else{
          pGrade = mean_p < this.pMinGrade ? mean_p.toFixed(2) + " (R)" : mean_p.toFixed(2)
        }

        tGrade = mean_t < this.tMinGrade ? mean_t.toFixed(2) + " (R)" : mean_t.toFixed(2)
        if (isNaN(pGrade) || isNaN(tGrade))
          grade = "R"
        else{
          let aux = (mean_t * parseFloat(this.t_evaluation_percentage) + mean_p * parseFloat(this.p_evaluation_percentage))
          grade = aux < this.tMinGrade ? aux.toFixed(0) + " (R)" : aux.toFixed(0) 
        }

        this.output.push([this.csv[this.csv.headers[0]][i], this.csv[this.csv.headers[1]][i], pGrade, tGrade, grade])
      }
    },
    refreshInput(input, selected){
        if(input == 'j'){
          this.jobNames = selected.join()
          let all = selected.slice()
          let perc = parseFloat(1/all.length).toFixed(2).toString()
          for(let i=0; i<all.length;i++){ all[i] = perc }
          this.jobPercentages = all.join()
          
        }
        else{
          this.testNames = selected.join()
          let all = selected.slice()
          let perc = parseFloat(1/all.length).toFixed(2).toString()
          for(let i=0; i<all.length;i++){ all[i] = perc }
          this.testPercentages = all.join()
        }
    },
    createJSON(arr, header){
      this.csv = {}
      this.csv.files = [this.file.name]

      for(let str of header){
        this.csv[str] = []
        if (this.csv.headers)
          this.csv.headers.push(str)
        else
          this.csv.headers = [str]
      }

      for(let i=1; i<arr.length; i++){
        let arr2 = arr[i].split(this.separator)
        for(let j=0; j<arr2.length; j++){
          this.csv[header[j]].push(arr2[j])
        }
      }
    },
    updateJSON(arr, header){
      this.csv.files.push(this.file.name)

      if(this.csv[this.csv.headers[0]].length < arr.length){
        let newStruct = this.checkUsers(arr)
        this.csv.headers = newStruct[0]
        for(let i=0; i<newStruct[0].length; i++){
          this.csv[newStruct[0][i]] = []
          for(let j=1; j<newStruct.length; j++){
            this.csv[newStruct[0][i]].push(newStruct[j][i])
          }
        }
      }
      else{
        for(let i=0; i<header.length && this.csv.headers.length; i++){
          if(!this.csv.headers.includes(header[i])){
            this.csv[header[i]] = []
            for(let j=0; j<this.csv[header[0]].length; j++){
              this.csv[header[i]].push("0")
            }
            this.csv.headers.push(header[i])
          }
        }
        for(let j=1; j<arr.length; j++){
          var arr2 = arr[j].split(this.separator)
          for(let k=2; k < arr2.length; k++){
            let newId = arr2[0]
            let index = this.csv[header[0]].findIndex( x => x === newId)
            let newVal = arr2[k]
            if(index!==undefined){
              this.csv[header[k]][index] = newVal
            }
          }
        }
      }
    },
    checkUsers(arr){
      let newStruct = [arr[0].split(this.separator)]
      let len = arr.length
      for(let i=1; i < arr.length; i++){
        newStruct.push(arr[i].split(this.separator))
      }

      for(let j=2; j<this.csv.headers.length; j++){
        let newHeader = this.csv.headers[j]
        newStruct[0].push(newHeader)
        let c = 0
        newStruct[0]
        for(let k=1; k<len; k++){
          let val = this.csv[newHeader][c]
          if(val != undefined){
            if(this.csv[this.csv.headers[0]][c] == newStruct[k][0]){
              newStruct[k].push(val)
              c++;
            }
            else
              newStruct[k].push("0")
          }
          else
            newStruct[k].push("0")
        }
      }
      return newStruct;
    },
    checkSeparator(arr){
      return arr[0].split(',').length > arr[0].split(";").length ? "," : ";"
    },
    orderById(arr){
      let len = arr.length
      for(let i=1; i<len; i++){
        for(let j=i+1; j<len; j++){
          if(arr[i].split(this.separator)[0] > arr[j].split(this.separator)[0]){
            let aux = arr[i]
            arr[i] = arr[j]
            arr[j] = aux
          }
        }
      }
    },
    transformJSON(){
      if(this.csv && this.csv.files && this.csv.files.includes(this.file.name))
        return

      let arr = this.contents.trim().split("\n")
      this.separator = this.checkSeparator(arr)
      this.orderById(arr)
      let header = arr[0].split(this.separator)


      if(this.csv){
        this.updateJSON(arr, header)
      }
      else{
        this.createJSON(arr, header)
      }

      this.makeToast(this.file.name+" lido com sucesso!", true)
    },
    checkFile(){
      let file = this.file ? true : false;

      if(file && this.file.name.endsWith(".csv")){
          let reader = new FileReader();
          reader.readAsText(this.file, "UTF-8");
          reader.onload =  evt => {
            this.contents = evt.target.result;
            this.transformJSON()
            this.file = null
          } 
          reader.onerror = evt => {
            console.error(evt);
          }
      }

      if(file && !this.file.name.endsWith(".csv")){
        this.file = null
        file = false
        this.makeToast("Erro. Deve importar um ficheiro .CSV")
      }
      return file
    },
    prepareCSVForDownload(){
      if(this.separator == ",")
        this.output = this.output.map(e => e.join(",")).join("\n").trim()
      else
        this.output = this.output.map(e => e.join(",")).join("\n").replace(/,/g, ";").trim()
    },
    download(){ 
      let iconv = require('iconv-lite');
      let FileSaver = require('file-saver')
      let encode = "text/csv;charset=utf-8"
      this.prepareCSVForDownload()
      let out = this.output

      if(this.windows){
        out = iconv.encode(this.output, 'win1252')
        encode = "text/csv;charset=win1252"
      }

      let blob = new Blob([out], {type: encode})
      FileSaver.saveAs(blob, this.filename)

      this.meanBoolean = false
      this.output = [[]]
      this.contents = null
      this.file = null
      this.csv = null
      this.jobNames = ""
      this.jobPercentages = ""
      this.testNames = ""
      this.testPercentages = ""
      this.selectedJobNames = []
      this.selectedTestNames = []
      this.uc = ""
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
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h4{
  text-align: center;
}
</style>
