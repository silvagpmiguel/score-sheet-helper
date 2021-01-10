<template>
  <div>
    <vue-html2pdf
      :show-layout="false"
      :enable-download="true"
      :preview-modal="false"
      :filename="filename"
      :paginate-elements-by-height="1600"
      pdf-content-width="100%"
      pdf-format="a3"
      pdf-orientation="portrait"
      @hasGenerated="$parent.clear()"
      ref="html2Pdf"
    >
      <section slot="pdf-content">
        <div class="pt-1 pl-1 pr-3">
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
