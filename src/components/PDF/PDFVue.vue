<template>
  <vue-html2pdf
    :show-layout="false"
    :enable-download="true"
    :preview-modal="false"
    :filename="filename"
    :paginate-elements-by-height="8000"
    pdf-content-width="100%"
    pdf-format="a3"
    pdf-orientation="portrait"
    @hasGenerated="$parent.clear()"
    ref="html2Pdf"
  >
    <section slot="pdf-content">
      <section class="pdf-item">
        <div class="mt-0 pt-0 pl-1 pr-2">
          <h5 class="text-center font-weight-bold">{{ title }}</h5>
          <b-table
            thead-class="bg-dark text-white"
            :items="items"
            :fields="fields"
            borderless
            striped
          >
            <template v-slot:cell()="data">
              <div v-if="data.field.label == 'Nome'">{{ data.value }}</div>
              <div v-else class="text-center">{{ data.value }}</div>
            </template>
            <template v-slot:head()="data">
              <div v-if="data.label == 'Nome'">{{ data.label }}</div>
              <div v-else class="text-center">{{ data.label }}</div>
            </template>
          </b-table>
          <div class="docente2">
            <span class="font-weight-bold">Docente: </span>{{ teacher }}
          </div>
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
  },
  methods: {
    generatePDF() {
      this.$refs.html2Pdf.generatePdf()
    },
  },
}
</script>

<style>
.docente2 {
  text-align: left;
  font-size: 1rem;
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
