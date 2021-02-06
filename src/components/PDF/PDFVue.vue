<template>
  <vue-html2pdf
    :show-layout="false"
    :enable-download="true"
    :preview-modal="false"
    :filename="filename"
    :paginate-elements-by-height="8000"
    pdf-content-width="100%"
    :pdf-format="pdfFormat"
    pdf-orientation="portrait"
    @hasGenerated="$parent.clear()"
    ref="html2Pdf"
  >
    <section slot="pdf-content">
      <section class="pdf-item">
        <div class="pt-1 pb-0 pl-1 pr-1">
          <b-table thead-class="bg-dark text-white" :items="items" :fields="fields" borderless striped>
            <template #thead-top>
              <b-tr>
                <b-th colspan="12" class="first-header bg-secondary">
                  {{ title }}
                </b-th>
              </b-tr>
            </template>
            <template #head()="data">
              <div class="header">{{ data.label }}</div>
            </template>
            <template #cell()="data">
              <div class="cell-value">{{ data.value }}</div>
            </template>
            <template #custom-foot>
              <b-tr>
                <b-th colspan="12" class="bg-secondary text-center">
                  <div class="footer"><b>Docente: </b>{{ teacher }}</div>
                </b-th>
              </b-tr>
            </template>
          </b-table>
        </div>
      </section>
    </section>
  </vue-html2pdf>
</template>

<script>
export default {
  name: 'PDFVue',
  props: {
    items: Array,
    fields: Array,
    filename: String,
    title: String,
    teacher: String,
    pdfFormat: String,
  },
  methods: {
    generatePDF() {
      this.$refs.html2Pdf.generatePdf()
    },
  },
}
</script>

<style>
.first-header {
  text-align: center;
}
.cell-value {
  text-align: center;
}
.footer {
  color: white;
}
.header {
  text-align: center;
}
.table-block tr {
  page-break-after: always !important;
  page-break-before: always !important;
  page-break-inside: auto !important;
}
thead {
  display: table-header-group;
}
tfoot {
  display: table-row-group;
}
tr {
  page-break-inside: avoid;
}
</style>
