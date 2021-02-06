<template>
  <div>
    <PDFVue
      ref="pdf"
      :filename="filename"
      :title="title"
      :items="items"
      :fields="fields"
      :teacher="teacher"
    />
    <div class="container-left">
      <b-card
        header-bg-variant="secondary"
        header-text-variant="light"
        body-bg-variant="dark"
        body-text-variant="light"
        header="Definições da Pauta"
      >
        <b-form-radio-group size="sm" class="pb-1" v-model="selectedOption" :options="options">
        </b-form-radio-group>
        <b-form-group label-cols-sm="3" label="Título">
          <b-form-input size="sm" v-model="title"></b-form-input>
        </b-form-group>
        <b-form-group label-cols-sm="3" label="Docente">
          <b-form-input size="sm" v-model="teacher"></b-form-input>
        </b-form-group>
        <b-form-group label-cols-sm="3" label="Ficheiro">
          <b-form-input size="sm" v-model="filename"></b-form-input>
        </b-form-group>
        <div v-show="selectedOption != 't'">
          <b-form-group label-cols-sm="3" label="P(Cols)">
            <b-form-spinbutton
              size="sm"
              v-model="colsP"
              min="1"
              max="4"
              inline
              @change="updateColsP($event, beforeP)"
            ></b-form-spinbutton>
          </b-form-group>
          <b-form-group label-cols-sm="3" label="P(%)">
            <b-form-spinbutton
              size="sm"
              v-model="pPercent"
              min="0.1"
              max="1.0"
              step="0.1"
              @input="refreshFinalAv()"
              inline
            ></b-form-spinbutton>
          </b-form-group>
          <b-form-group label-cols-sm="3" label="P(Min)">
            <b-form-input size="sm" v-model="pMin"></b-form-input>
          </b-form-group>
        </div>
        <div v-show="selectedOption != 'p'">
          <b-form-group label-cols-sm="3" label="T(Cols)">
            <b-form-spinbutton
              size="sm"
              v-model="colsT"
              min="1"
              max="4"
              inline
              @change="updateColsT($event, beforeT)"
            ></b-form-spinbutton>
          </b-form-group>
          <b-form-group label-cols-sm="3" label="T(%)">
            <b-form-spinbutton
              size="sm"
              v-model="tPercent"
              min="0.1"
              max="1"
              step="0.1"
              @input="refreshFinalAv()"
              inline
            ></b-form-spinbutton>
          </b-form-group>
          <b-form-group label-cols-sm="3" label="T(Min)">
            <b-form-input size="sm" v-model="tMin"></b-form-input>
          </b-form-group>
        </div>
        <div v-show="selectedOption == 'f'">
          <b-form-group label-cols-sm="3" label="Decisão">
            <b-form-input size="sm" v-model="decision"></b-form-input>
          </b-form-group>
        </div>
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
          variant="primary"
          class="mr-2 mb-1"
          size="sm"
          @click="popColumn()"
          v-b-tooltip.hover
          title="Remover Última Coluna"
          ><b-icon icon="arrow-left"></b-icon>
        </b-button>
        <b-button
          class="mr-2 mb-1"
          :disabled="items.length == 0 || teacher.length == 0"
          variant="primary"
          size="sm"
          v-b-tooltip.hover
          title="Download CSV"
          @click="downloadCSV()"
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
      </b-card>
    </div>
    <div class="container-right">
      <b-table ref="table" head-variant="dark" :fields="fields" :items="items" striped hover borderless>
        <template #thead-top>
          <b-tr>
            <b-th colspan="12" class="bg-secondary">
              {{ title }}
            </b-th>
          </b-tr>
        </template>
        <template #head()="data">
          <Header :beforeKey="data.column" :beforeLabel="data.label" @updateHeader="updateHeader" />
        </template>
        <template #cell()="data">
          <b-form-textarea
            rows="2"
            no-auto-shrink
            no-resize
            size="sm"
            v-model="data.item[data.field.key]"
            class="no-border"
            @blur="refreshRow(data)"
            :disabled="
              data.field.key == 'avF' ||
              (data.field.key == 'avTF' && colsT > 1) ||
              (data.field.key == 'avTP' && colsP > 1)
            "
          ></b-form-textarea>
        </template>
        <template #custom-foot>
          <b-tr>
            <b-th colspan="12" class="bg-secondary">
              <small><b>Docente: </b>{{ teacher }}</small>
            </b-th>
          </b-tr>
        </template>
      </b-table>
    </div>
  </div>
</template>
<script>
import PDFVue from '../PDF/PDFVue'
import Header from './Header'
import mixin from '../../mixins/mixin.js'
import pdfMixin from '../../mixins/pdf-opts-mixin.js'

export default {
  name: 'Creator',
  mixins: [mixin, pdfMixin],
  components: {
    PDFVue,
    Header,
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
        { key: 'avTF', label: 'Av. Teórica Final' },
      ],
      options: [
        { value: 't', text: 'Teórica' },
        { value: 'p', text: 'Prática' },
        { value: 'f', text: 'Final' },
      ],
      selectedOption: 't',
      colsT: 1,
      beforeT: 1,
      colsP: 1,
      beforeP: 1,
      tPercent: 0.5,
      pPercent: 0.5,
      filename: 'pauta',
      tMin: 9.5,
      pMin: 9.5,
      fMin: 9.5,
      decision: 'Recurso',
    }
  },
  methods: {
    popColumn() {
      this.fields.pop()
    },
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
    addColumn(lastKey, key, label, targetIndex) {
      const index = this.fields.findIndex((item) => item.key == lastKey)
      this.fields.splice(index + targetIndex, 0, {
        key: key,
        label: label,
      })
    },
    removeColumn(lastKey) {
      const index = this.fields.findIndex((item) => item.key == lastKey)
      this.fields.splice(index, 1)
    },
    computeMean(item, type) {
      let mean = 0,
        len = 0,
        str = '',
        nan = true,
        val = null

      for (let key in item) {
        item[key] = item[key].toString().trim().replaceAll(',', '.')
        val = item[key]
        if (key[2] == type && key[3] != 'F') {
          if (isNaN(val)) {
            str = val
            len++
          } else if (val >= 0) {
            mean += Number(val)
            nan = false
            len++
          }
        }
      }
      return nan ? str : this.round(mean / len, 1)
    },
    splitValues(index, value) {
      const arr = value.trim().replaceAll(',', '.').split('\n')
      const len = this.items.length
      let i = index
      for (let line of arr) {
        let j = 0,
          values = line.split(/\t|[ ]{2,}/)
        if (i >= len) {
          this.addRow()
        }
        for (let k = 0; k < values.length && k < this.fields.length; k++) {
          this.items[i][this.fields[j++]['key']] = values[k]
        }
        this.calculateMean(this.items[i])
        i++
      }
    },
    refreshRow(cell) {
      const cellValue = isNaN(cell.value) ? cell.value : ''
      if (cellValue.includes('  ') || cellValue.includes('\t')) {
        this.splitValues(cell.index, cellValue)
        return
      }
      this.calculateMean(cell.item)
    },
    calculateMean(item) {
      const isOneColT = this.colsT == 1,
        isOneColP = this.colsP == 1
      let avtf = 0.0,
        avpf = 0.0
      switch (this.selectedOption) {
        case 'p': {
          item.avPF = item.avPF.toString().trim().replaceAll(',', '.')
          item.avPF = isOneColP ? this.round(item.avPF, 1) : this.round(this.computeMean(item, 'P'), 1)
          break
        }
        case 't': {
          item.avTF = item.avTF.toString().trim().replaceAll(',', '.')
          item.avTF = isOneColT ? this.round(item.avTF, 1) : this.round(this.computeMean(item, 'T'), 1)
          break
        }
        case 'f': {
          avtf = isOneColT ? item.avTF.toString().trim().replaceAll(',', '.') : this.computeMean(item, 'T')
          avpf = isOneColP ? item.avPF.toString().trim().replaceAll(',', '.') : this.computeMean(item, 'P')
          item.avTF = this.round(avtf, 1)
          item.avPF = this.round(avpf, 1)
          avtf = isNaN(avtf) ? 0.0 : avtf
          avpf = isNaN(avpf) ? 0.0 : avpf

          if (avtf < this.tMin || avpf < this.pMin) {
            item.avF = this.decision
            break
          }

          item.avF = this.round(avtf * this.tPercent + avpf * this.pPercent, 0)
          item.avF = item.avF < this.fMin ? item.avF + `(${this.decision})` : item.avF
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
    updateColsT(after, before) {
      if (after == before) return
      const lastKey = `avT${before}`
      const key = `avT${after}`
      const label = `Av. Teórica ${after}`
      if (after > before) {
        if (before == 1) {
          this.addColumn('avTF', 'avT1', 'Av. Teórica 1', 0)
        }
        this.addColumn(lastKey, key, label, 1)
      } else {
        if (after == 1) {
          this.removeColumn('avT1')
        }
        this.removeColumn(lastKey)
      }
      this.beforeT = after
      this.$refs.table.refresh()
    },
    updateColsP(after, before) {
      if (after == before) return
      const lastKey = `avP${before}`
      const key = `avP${after}`
      const label = `Av. Prática ${after}`
      if (after > before) {
        if (before == 1) {
          this.addColumn('avPF', 'avP1', 'Av. Prática 1', 0)
        }
        this.addColumn(lastKey, key, label, 1)
      } else {
        if (after == 1) {
          this.removeColumn('avP1')
        }
        this.removeColumn(lastKey)
      }
      this.beforeP = after
      this.$refs.table.refresh()
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

      FileSaver.saveAs(new Blob([output], { type: encode }), this.filename + '.csv')
    },
    downloadPDF() {
      this.$refs.pdf.generatePDF(this.computePdfFormat())
    },
  },
  watch: {
    selectedOption: function (option) {
      if (option == 't') {
        this.fields = [
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Nome' },
          { key: 'avTF', label: 'Av. Teórica Final' },
        ]
      } else if (option == 'p') {
        this.fields = [
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Nome' },
          { key: 'avPF', label: 'Av. Prática Final' },
        ]
      } else {
        this.fields = [
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Nome' },
          { key: 'avPF', label: 'Av. Prática Final' },
          { key: 'avTF', label: 'Av. Teórica Final' },
          { key: 'avF', label: 'Av. Final' },
        ]
      }
      this.resetTable()
      this.colsT = 1
      this.beforeT = 1
      this.colsP = 1
      this.beforeP = 1
      this.tPercent = 0.5
      this.pPercent = 0.5
      this.$refs.table.refresh()
    },
  },
}
</script>
<style>
.col-form-label,
.form-control-sm,
.textarea.form-control {
  font-size: 0.75rem !important;
}
.custom-radio {
  line-height: 1.8 !important;
  font-size: 0.75rem !important;
}
textarea.form-control {
  height: calc(1.5em + 0.5rem + 2px);
  text-align: center;
  overflow-y: hidden;
}
.container-left {
  position: fixed;
  left: 0;
  top: 2.6rem;
  width: 20vw;
}
.container-right {
  padding-top: 0.21vh;
  padding-left: 20vw;
  width: 99.95vw;
}
button {
  border: none;
}
.form-group {
  margin-bottom: 0.25rem;
}
.card-body {
  padding: 0.25vh 0.4vw 0.25vh 0vw;
  border: none;
}
input {
  text-align: center;
}
.no-border,
.no-border:disabled {
  border: none;
  background-color: transparent;
}
.no-border:hover {
  background-color: white;
}
.btn {
  padding: 0.2rem 0.3rem;
  font-size: 0.8rem;
}
</style>
