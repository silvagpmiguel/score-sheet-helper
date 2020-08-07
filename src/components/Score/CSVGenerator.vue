<template>
  <b-container class="pt-4">
    <h4 class="text-center pb-3 font-weight-bold">Importar Pautas Excel</h4>
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
                <b-form-input
                  placeholder="Unidade Curricular"
                  v-model="uc"
                  id="uc"
                ></b-form-input>
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
            v-if="
              selectedMethod == 'Avaliação Prática' ||
                selectedMethod == 'Avaliação Final'
            "
          >
            <b-form-input
              :disabled="true"
              v-model="jobNames"
              id="nested-street"
            ></b-form-input>
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
            v-if="
              selectedMethod == 'Avaliação Prática' ||
                selectedMethod == 'Avaliação Final'
            "
          >
            <b-form-input
              v-model="jobPercentages"
              id="nested-city"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            label-cols-sm="4"
            label="Nota Mínima Prática"
            label-align-sm="right"
            label-for="pMinGrade"
            v-if="
              selectedMethod == 'Avaliação Prática' ||
                selectedMethod == 'Avaliação Final'
            "
          >
            <b-form-input v-model="pMinGrade" id="pMinGrade"></b-form-input>
          </b-form-group>
          <b-form-group
            label-cols-sm="4"
            label="Nomes das Colunas dos Testes"
            label-align-sm="right"
            label-for="nested-state"
            v-if="
              selectedMethod == 'Avaliação Teórica' ||
                selectedMethod == 'Avaliação Final'
            "
          >
            <b-form-input
              :disabled="true"
              v-model="testNames"
              id="nested-state"
            ></b-form-input>
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
            v-if="
              selectedMethod == 'Avaliação Teórica' ||
                selectedMethod == 'Avaliação Final'
            "
          >
            <b-form-input
              v-model="testPercentages"
              id="nested-country"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            label-cols-sm="4"
            label="Nota Mínima Teórica"
            label-align-sm="right"
            label-for="tMinGrade"
            v-if="
              selectedMethod == 'Avaliação Teórica' ||
                selectedMethod == 'Avaliação Final'
            "
          >
            <b-form-input
              v-model="tMinGrade"
              id="nested-tMinGrade"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            label-cols-sm="4"
            label="Percentagem Final Teórica (0-1)"
            label-align-sm="right"
            label-for="nested-p"
            v-if="selectedMethod == 'Avaliação Final'"
          >
            <b-form-input
              v-model="t_evaluation_percentage"
              id="nested-p"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            label-cols-sm="4"
            label="Percentagem Final Prática (0-1)"
            label-align-sm="right"
            label-for="nested-t"
            v-if="selectedMethod == 'Avaliação Final'"
          >
            <b-form-input
              v-model="p_evaluation_percentage"
              id="nested-t"
            ></b-form-input>
          </b-form-group>
        </b-form-group>
      </b-card>
    </b-container>
    <b-row class="pb-3">
      <b-button
        class="mr-auto ml-auto"
        v-show="!meanBoolean"
        :disabled="
          (testNames == '' || testPercentages == '') &&
            (jobNames == '' || jobPercentages == '')
        "
        @click="calculateMean()"
        variant="dark"
        >Calcular Media</b-button
      >
    </b-row>
    <b-row class="pb-3 mr-auto ml-auto" v-show="meanBoolean">
      <b-col class="pr-5">
        <label class="font-weight-bold mr-auto ml-auto" for="filename"
          >Nome da Pauta CSV</label
        >
        <div class="pb-2">
          <b-form-input
            class="text-center"
            id="filename"
            v-model="filename"
          ></b-form-input>
        </div>
        <b-button :disabled="csvGenerated" @click="downloadCSV()" variant="dark"
          >Download CSV</b-button
        >
      </b-col>
      <b-col class="pl-5">
        <label class="font-weight-bold mr-auto ml-auto" for="filename2"
          >Nome da Pauta PDF</label
        >
        <div class="pb-2">
          <b-form-input
            class="text-center"
            id="filename2"
            v-model="filename2"
          ></b-form-input>
        </div>
        <b-button :disabled="pdfGenerated" @click="downloadPDF()" variant="dark"
          >Download PDF</b-button
        >
      </b-col>
    </b-row>
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
import PDFVue from "../PDF/PDFVue.vue";
import utils from "./ExcelUtils.js";
import Mixin from "../mixins/mixin.js";

export default {
  name: "MainPage",
  mixins: [Mixin],
  components: {
    PDFVue
  },
  data() {
    return {
      /** Score */
      csv: null,
      filename: "avFinal.csv",
      selectedJobNames: [],
      selectedTestNames: [],
      jobNames: "",
      jobPercentages: "",
      testNames: "",
      testPercentages: "",
      t_evaluation_percentage: 0.5,
      p_evaluation_percentage: 0.5,
      output: [[]],
      meanBoolean: false,
      uc: "",
      date: `${new Date().getFullYear() - 1}/${new Date().getFullYear()}`,
      selectedMethod: "Avaliação Final",
      methods: ["Avaliação Teórica", "Avaliação Prática", "Avaliação Final"],
      tMinGrade: 9.5,
      pMinGrade: 0,
      out: [],
      csvGenerated: false

      /** WINDOWS & PDF OPTIONS ARE DECLARED IN THE MIXIN */
    };
  },
  methods: {
    adjustPercentages() {
      if (this.selectedMethod == "Avaliação Final") {
        this.t_evaluation_percentage = 0.5;
        this.p_evaluation_percentage = 0.5;
        this.filename = "avFinal.csv";
      } else if (this.selectedMethod == "Avaliação Prática") {
        this.filename = "avPratica.csv";
      } else {
        this.filename = "avTeorica.csv";
      }
    },
    calculateMean() {
      let msg = "final";
      if (this.selectedMethod == "Avaliação Final") {
        utils.calculateFinalMean(
          this.jobNames,
          this.jobPercentages,
          this.testNames,
          this.testPercentages,
          this.output,
          this.uc,
          this.date,
          this.csv,
          this.pMinGrade,
          this.tMinGrade,
          this.t_evaluation_percentage,
          this.p_evaluation_percentage
        );
        msg = "final";
      } else if (this.selectedMethod == "Avaliação Prática") {
        utils.calculatePraticalMean(
          this.jobNames,
          this.jobPercentages,
          this.uc,
          this.date,
          this.output,
          this.csv
        );
        msg = "prática";
      } else {
        utils.calculateTheoricalMean(
          this.testNames,
          this.testPercentages,
          this.uc,
          this.date,
          this.csv,
          this.output
        );
        msg = "teórica";
      }
      this.meanBoolean = true;
      this.filename2 = this.filename.substring(0, this.filename.length - 4);
      this.prepareCSVForDownload();
      this.makeToast(`Pauta ${msg} criada!`, this.meanBoolean);
    },
    refreshInput(input, selected) {
      if (input == "j") {
        this.jobNames = selected.join();
        let all = selected.slice();
        let perc = parseFloat(1 / all.length)
          .toFixed(2)
          .toString();
        for (let i = 0; i < all.length; i++) {
          all[i] = perc;
        }
        this.jobPercentages = all.join();
      } else {
        this.testNames = selected.join();
        let all = selected.slice();
        let perc = parseFloat(1 / all.length)
          .toFixed(2)
          .toString();
        for (let i = 0; i < all.length; i++) {
          all[i] = perc;
        }
        this.testPercentages = all.join();
      }
    },
    transformJSON() {
      if (this.csv && this.csv.files && this.csv.files.includes(this.file.name))
        return;

      let arr = this.contents.trim().split("\n");
      utils.orderById(arr);
      let header = arr[0].split(this.separator);

      if (this.csv) {
        this.csv.files.push(this.file.name);
        utils.updateJSON(arr, header, this.csv, this.separator);
      } else {
        this.csv = {};
        this.csv.files = [this.file.name];
        utils.createJSON(arr, header, this.csv, this.separator);
      }

      this.makeToast(this.file.name + " lido com sucesso!", true);
    },
    checkFile() {
      let file = this.file ? true : false;
      let isValid = false;

      if (file && this.file.name.endsWith(".csv")) {
        isValid = true;
        const reader = new FileReader();
        reader.onload = evt => {
          this.contents = evt.target.result;
          this.separator = this.checkSeparator(this.contents);
          this.transformJSON();
          this.file = null;
        };
        reader.onerror = evt => {
          console.error(evt);
        };
        reader.readAsText(new Blob([this.file]), "UTF-8");
      } else if (file && this.file.name.endsWith(".xlsx")) {
        isValid = true;
        const reader = new FileReader();
        const XLSX = require("xlsx");
        reader.onload = evt => {
          const data = new Uint8Array(evt.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetsList = workbook.SheetNames;
          this.contents = XLSX.utils
            .sheet_to_csv(workbook.Sheets[sheetsList[0]], {
              header: 1,
              defval: "",
              blankrows: false
            })
            .replace(/"/g, "");
          this.transformJSON();
          this.file = null;
        };
        reader.onerror = evt => {
          console.error(evt);
        };
        reader.readAsArrayBuffer(new Blob([this.file]));
      }
      if (file && !isValid) {
        this.file = null;
        file = false;
        this.makeToast("Erro. Deve importar um ficheiro .csv ou .xlsx");
      }
      return file;
    },
    prepareCSVForDownload() {
      if (this.separator == ",")
        this.out = this.output
          .map(e => e.join(","))
          .join("\n")
          .trim();
      else
        this.out = this.output
          .map(e => e.join(","))
          .join("\n")
          .replace(/,/g, ";")
          .trim();
    },
    downloadCSV() {
      let iconv = require("iconv-lite");
      let FileSaver = require("file-saver");
      let encode = "text/csv;charset=utf-8";

      if (this.windows) {
        this.out = iconv.encode(this.out, "win1252");
        encode = "text/csv;charset=win1252";
      }

      let blob = new Blob([this.out], { type: encode });
      FileSaver.saveAs(blob, this.filename);
      this.csvGenerated = true;
      this.clearCSVDependencies();
    },
    downloadPDF() {
      this.transformCSVToPDF(this.out);
      this.pdfGenerated = true;
    },
    clear() {
      this.fields = [];
      this.items = [];
      this.filename2 = "";
      if (this.pdfGenerated && this.csvGenerated) {
        this.out = [];
        this.meanBoolean = false;
        this.pdfGenerated = false;
        this.csvGenerated = false;
      }
    },
    clearCSVDependencies() {
      if (this.pdfGenerated && this.csvGenerated) {
        this.out = [];
        this.meanBoolean = false;
        this.pdfGenerated = false;
        this.csvGenerated = false;
      }

      this.output = [[]];
      this.contents = null;
      this.file = null;
      this.csv = null;
      this.jobNames = "";
      this.jobPercentages = "";
      this.testNames = "";
      this.testPercentages = "";
      this.selectedJobNames = [];
      this.selectedTestNames = [];
      this.uc = "";
      this.filename = "avFinal.csv";
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h4 {
  text-align: center;
}
</style>
