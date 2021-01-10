<template>
  <div class="main-container">
    <div class="container-left">
      <b-card
        header-bg-variant="secondary"
        header-text-variant="light"
        body-bg-variant="dark"
        body-text-variant="light"
        header="Definições da Pauta"
      >
        <b-form-radio-group
          class="pb-2"
          v-model="selectedOption"
          :options="options"
        >
        </b-form-radio-group>
        <b-form-group label-size="sm" label-cols-sm="3" label="Título">
          <b-form-input size="sm" v-model="title"></b-form-input>
        </b-form-group>
        <b-form-group label-size="sm" label-cols-sm="3" label="Docente">
          <b-form-input size="sm" v-model="teacher"></b-form-input>
        </b-form-group>
        <b-form-group label-size="sm" label-cols-sm="3" label="Ficheiro">
          <b-form-input size="sm" v-model="filename"></b-form-input>
        </b-form-group>
        <div v-show="selectedOption != 'p'">
          <b-form-group label-size="sm" label-cols-sm="3" label="T(Cols)">
            <b-form-spinbutton
              size="sm"
              v-model="colsT"
              min="1"
              max="4"
              inline
            ></b-form-spinbutton>
          </b-form-group>
          <b-form-group label-size="sm" label-cols-sm="3" label="T(%)">
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
          <b-form-group label-size="sm" label-cols-sm="3" label="P(Cols)">
            <b-form-spinbutton
              size="sm"
              v-model="colsP"
              min="1"
              max="4"
              inline
            ></b-form-spinbutton>
          </b-form-group>
          <b-form-group label-size="sm" label-cols-sm="3" label="P(%)">
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
        <div>
          <b-button
            size="sm"
            variant="primary"
            class="mr-2 mb-1"
            @click="addRow()"
            v-b-tooltip.hover
            title="Adicionar Linha"
            ><b-icon icon="arrow-down" variant="light"></b-icon>
          </b-button>
          <b-button
            size="sm"
            variant="primary"
            class="mr-2 mb-1"
            @click="deleteLastRow()"
            v-b-tooltip.hover.bottom
            title="Remover Linha"
            ><b-icon icon="arrow-up" variant="light"></b-icon>
          </b-button>
          <b-button
            size="sm"
            variant="primary"
            class="mr-2 mb-1"
            @click="resetTable()"
            v-b-tooltip.hover
            title="Reset Table"
            ><b-icon icon="trash" variant="light"></b-icon
          ></b-button>
          <b-button
            :disabled="items.length == 0 || teacher.length == 0"
            variant="primary"
            class="mr-2 mb-1"
            size="sm"
            @click="downloadCSV()"
            v-b-tooltip.hover
            title="Download CSV"
            ><b-icon icon="file-text"></b-icon>
          </b-button>
          <b-button
            class="mr-2 mb-1"
            :disabled="items.length == 0 || teacher.length == 0"
            variant="primary"
            size="sm"
            v-b-tooltip.hover
            title="Download PDF"
            @click="downloadPDF()"
            ><b-icon icon="file-ppt"></b-icon>
          </b-button>
        </div>
      </b-card>
    </div>
    <div class="container-right">
      <h4 class="font-weight-bold">{{ title }}</h4>
      <b-table
        ref="table"
        head-variant="dark"
        :fields="fields"
        :items="items"
        striped
        hover
        borderless
      >
        <template #head()="data">
          <Header
            :beforeKey="data.column"
            :beforeLabel="data.label"
            @updateHeader="updateHeader"
          />
        </template>
        <template #cell()="data">
          <b-form-input
            v-model="data.item[data.field.key]"
            class="no-border"
            @input="refreshRow(data)"
            :disabled="data.field.key.slice(-1) == 'F'"
          ></b-form-input>
        </template>
      </b-table>
      <div class="text-left">
        <span class="font-weight-bold">Docente: </span>{{ teacher }}
      </div>
    </div>
    <PDFVue
      ref="pdf"
      :filename="filename"
      :title="title"
      :items="items"
      :fields="fields"
      :teacher="teacher"
    />
  </div>
</template>
<script>
import PDFVue from '../PDF/PDFVue'
import Header from './Header'
export default {
  name: 'Creator',
  components: {
    PDFVue,
    Header,
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
      fields: [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Nome' },
        { key: 'avT1', label: 'Av. Teórica 1' },
        { key: 'avTF', label: 'Av. Teórica Final' },
      ],
      options: [
        { value: 't', text: 'Teórica' },
        { value: 'p', text: 'Prática' },
        { value: 'f', text: 'Final' },
      ],
      selectedOption: 't',
      colsT: 1,
      colsP: 1,
      tPercent: 0.5,
      pPercent: 0.5,
      filename: 'pauta',
      title: 'U.C de A - Ano Letivo B/C',
      windows: false,
      separator: ',',
      teacher: '',
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
    updateHeader(key, label) {
      this.fields.find((item) => item.key == key).label = label
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
      const index = this.fields.findIndex((item) => item.key == lastKey)
      this.fields.splice(index + 1, 0, {
        key: key,
        label: label,
      })
    },
    removeColumn(lastKey) {
      const index = this.fields.findIndex((item) => item.key == lastKey)
      this.fields.splice(index, 1)
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

      for (let field of this.fields) {
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
    selectedOption: function (option) {
      if (option == 't') {
        this.fields = [
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Nome' },
          { key: 'avT1', label: 'Av. Teórica 1' },
          { key: 'avTF', label: 'Av. Teórica Final' },
        ]
      } else if (option == 'p') {
        this.fields = [
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Nome' },
          { key: 'avP1', label: 'Av. Prática 1' },
          { key: 'avPF', label: 'Av. Prática Final' },
        ]
      } else {
        this.fields = [
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
    colsT: function (after, before) {
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
    colsP: function (after, before) {
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
}
</script>
<style scoped>
.container-left {
  position: fixed;
  left: 0;
  top: 30vh;
  width: 20vw;
}
.container-right {
  padding-top: 0.5vh;
  margin-left: 20.5vw;
  width: 78.5vw;
}
button {
  border: none;
}
.card-body {
  padding: 1rem;
  padding-top: 0.5rem;
}
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
</style>