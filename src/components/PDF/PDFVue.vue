<template>
  <div>
    <vue-html2pdf
      :show-layout="false"
      :enable-download="true"
      :preview-modal="false"
      :paginate-elements-by-height="800"
      :filename="filename"
      :pdf-quality="2"
      pdf-content-width="1120px"
      pdf-format="a3"
      pdf-orientation="portrait"
      @hasGenerated="$parent.clear()"
      ref="html2Pdf"
    >
      <section slot="pdf-content">
        <div class="ml-1 mr-1">
          <h4 class="text-center font-weight-bold">{{ title }}</h4>
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
    </vue-html2pdf>
  </div>
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

<style scoped>
.docente2 {
  text-align: left;
  font-size: 1rem;
}
</style>
