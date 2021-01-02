<template>
  <b-container fluid class="pt-4">
    <b-row class="pt-4 w-100">
      <b-col lg="4">
        <b-card
          header-bg-variant="secondary"
          header-text-variant="light"
          body-bg-variant="dark"
          body-text-variant="light"
          size="xl"
          header="Definições da Pauta"
        >
          <b-form-radio-group
            class="pb-4"
            v-model="selectedOption"
            :options="options"
          >
          </b-form-radio-group>
          <b-form-group label-cols-sm="4" label="Título">
            <b-form-input v-model="title"></b-form-input>
          </b-form-group>
          <b-form-group label-cols-sm="4" label="Nome do Ficheiro">
            <b-form-input v-model="filename"></b-form-input>
          </b-form-group>
          <div v-show="selectedOption != 'p'">
            <b-form-group label-cols-sm="4" label="Nº Testes Teóricos">
              <b-form-spinbutton
                size="sm"
                v-model="colsT"
                min="1"
                max="4"
                inline
              ></b-form-spinbutton>
            </b-form-group>

            <b-form-group label-cols-sm="4" label="Percentagem Teórica">
              <b-form-spinbutton
                size="sm"
                v-model="tPercent"
                min="0.1"
                max="1"
                step="0.1"
                @change="refreshFinalAv()"
                inline
              ></b-form-spinbutton>
            </b-form-group>
          </div>
          <div v-show="selectedOption != 't'">
            <b-form-group
              label-cols-sm="4"
              label="Nº Testes Práticos"
              label-align-sm="center"
            >
              <b-form-spinbutton
                size="sm"
                v-model="colsP"
                min="1"
                max="4"
                inline
              ></b-form-spinbutton>
            </b-form-group>
            <b-form-group
              label-cols-sm="4"
              label="Percentagem Prática"
              label-align-sm="center"
            >
              <b-form-spinbutton
                size="sm"
                v-model="pPercent"
                min="0.1"
                max="1.0"
                step="0.1"
                @change="refreshFinalAv()"
                inline
              ></b-form-spinbutton>
            </b-form-group>
          </div>
          <b-container class="pb-2">
            <b-button size="sm" class="mr-2" @click="addRow()"
              >Adicionar Linha</b-button
            >
            <b-button size="sm" class="mr-2" @click="deleteLastRow()"
              >Remover Última Linha</b-button
            >
            <b-button size="sm" @click="resetTable()">Reset</b-button>
          </b-container>
          <b-container>
            <b-button
              :disabled="items.length == 0"
              variant="info"
              class="mr-2"
              size="sm"
              @click="downloadCSV()"
              >Download CSV</b-button
            >
            <b-button
              :disabled="items.length == 0"
              variant="primary"
              size="sm"
              @click="downloadPDF()"
              >Download PDF</b-button
            >
          </b-container>
        </b-card>
      </b-col>
      <b-col class="pt-2 pr-4">
        <h4 class="pb-1 text-center font-weight-bold">{{ title }}</h4>
        <b-table
          ref="table"
          head-variant="dark"
          :fields="computedFields"
          :items="items"
          striped
          hover
          borderless
        >
          <template #cell()="data">
            <b-form-input
              v-model="data.item[data.field.key]"
              class="no-border"
              @change="refreshRow(data)"
              :value="data.value"
              :disabled="data.field.key.slice(-1) == 'F'"
            ></b-form-input>
          </template>
        </b-table>
      </b-col>
    </b-row>
    <PDFVue
      ref="pdf"
      :filename="filename"
      :title="title"
      :items="items"
      :fields="computedFields"
    />
  </b-container>
</template>
<script>
import PDFVue from '../PDF/PDFVue'
export default {
  name: 'Creator',
  components: {
    PDFVue,
  },
  mounted() {
    if (window.navigator.platform.includes('Win')) {
      this.separator = ';'
      this.windows = true
    }
  },
  data() {
    return {
      items: [
        {
          id: 0,
          name: 'None',
          avT1: -1,
          avT2: -1,
          avT3: -1,
          avT4: -1,
          avTF: -1,
          avP1: -1,
          avP2: -1,
          avP3: -1,
          avP4: -1,
          avPF: -1,
          avF: -1,
        },
      ],
      options: [
        { value: 't', text: 'Avaliação Teórica' },
        { value: 'p', text: 'Avaliação Prática' },
        { value: 'f', text: 'Avaliação Final' },
      ],
      selectedOption: 't',
      colsT: 1,
      colsP: 1,
      tPercent: 0.5,
      pPercent: 0.5,
      filename: 'pauta',
      title: 'Pauta',
      windows: false,
      separator: ',',
    }
  },
  methods: {
    resetTable() {
      this.items = [
        {
          id: 0,
          name: 'None',
          avT1: -1,
          avT2: -1,
          avT3: -1,
          avT4: -1,
          avTF: -1,
          avP1: -1,
          avP2: -1,
          avP3: -1,
          avP4: -1,
          avPF: -1,
          avF: -1,
        },
      ]
    },
    addRow() {
      this.items.push({
        id: 0,
        name: 'None',
        avT1: -1,
        avT2: -1,
        avT3: -1,
        avT4: -1,
        avTF: -1,
        avP1: -1,
        avP2: -1,
        avP3: -1,
        avP4: -1,
        avPF: -1,
        avF: -1,
      })
    },
    deleteLastRow() {
      this.items.pop()
    },
    addColumn(lastKey, key, label) {
      const index = this.computedFields.findIndex((item) => item.key == lastKey)
      this.computedFields.splice(index + 1, 0, {
        key: key,
        label: label,
      })
    },
    removeColumn(lastKey) {
      const index = this.computedFields.findIndex((item) => item.key == lastKey)
      this.computedFields.splice(index, 1)
    },
    computeMean(item, type) {
      let mean = 0
      let len = 0

      for (let key in item) {
        let val = item[key]
        if (val >= 0 && key[2] == type && key[3] != 'F') {
          mean += Number(val)
          len++
        }
      }

      return mean / len
    },
    refreshRow(cell) {
      switch (this.selectedOption) {
        case 'p': {
          cell.item.avPF = this.computeMean(cell.item, 'P')
          break
        }
        case 't': {
          cell.item.avTF = this.computeMean(cell.item, 'T')
          break
        }
        case 'f': {
          cell.item.avTF = this.computeMean(cell.item, 'T')
          cell.item.avPF = this.computeMean(cell.item, 'P')
          cell.item.avF =
            cell.item.avTF * this.tPercent + cell.item.avPF * this.pPercent
          break
        }
      }
    },
    refreshFinalAv() {
      for (let item of this.items) {
        item.avF = item.avTF * this.tPercent + item.avPF * this.pPercent
      }
    },
    tableToCSV() {
      let fields = []
      let out = ''
      let line = ''

      out += this.title + '\n'

      for (let field of this.computedFields) {
        line += field.label + this.separator
        fields.push(field.key)
      }

      out += line + '\n'

      for (let item of this.items) {
        line = ''
        for (let key of fields) {
          line += item[key] + this.separator
        }
        out += line.replaceAll('.', ',') + '\n'
      }

      return out
    },
    downloadCSV() {
      let iconv = require('iconv-lite')
      let FileSaver = require('file-saver')
      let encode = 'text/csv;charset=utf-8'
      let output = this.tableToCSV()

      if (this.windows) {
        output = iconv.encode(output, 'win1252')
        encode = 'text/csv;charset=win1252'
      }

      FileSaver.saveAs(
        new Blob([output], { type: encode }),
        this.filename + '.csv'
      )
    },
    downloadPDF() {
      this.$refs.pdf.generatePDF()
    },
  },
  watch: {
    colsT: {
      handler(after, before) {
        const lastKey = `avT${before}`
        const key = `avT${after}`
        const label = `Av. Teórica ${after}`

        if (after > before) {
          this.addColumn(lastKey, key, label)
        } else {
          this.removeColumn(lastKey)
        }
        this.$refs.table.refresh()
      },
    },
    colsP: {
      handler(after, before) {
        const lastKey = `avP${before}`
        const key = `avP${after}`
        const label = `Av. Prática ${after}`
        if (after > before) {
          this.addColumn(lastKey, key, label)
        } else {
          this.removeColumn(lastKey)
        }
        this.$refs.table.refresh()
      },
    },
  },
  computed: {
    computedFields() {
      if (this.selectedOption == 't') {
        return [
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Nome' },
          { key: 'avT1', label: 'Av. Teórica 1' },
          { key: 'avTF', label: 'Av. Teórica Final' },
        ]
      } else if (this.selectedOption == 'p') {
        return [
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Nome' },
          { key: 'avP1', label: 'Av. Prática 1' },
          { key: 'avPF', label: 'Av. Prática Final' },
        ]
      } else {
        return [
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Nome' },
          { key: 'avT1', label: 'Av. Teórica 1' },
          { key: 'avTF', label: 'Av. Teórica Final' },
          { key: 'avP1', label: 'Av. Prática 1' },
          { key: 'avPF', label: 'Av. Prática Final' },
          { key: 'avF', label: 'Av. Final' },
        ]
      }
    },
  },
}
</script>
<style scoped>
input {
  text-align: center;
}

.no-border {
  border: none;
  background-color: transparent;
}
.no-border:hover {
  background-color: white;
}
.card {
  position: fixed;
  left: 2.5vw;
  top: 30vh;
  width: 25vw;
}
</style>
