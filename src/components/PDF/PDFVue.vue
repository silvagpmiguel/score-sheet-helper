<template>
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
    <section slot="pdf-content" class="pl-1 pr-1">
      <h4 class="mt-3 pb-2 text-center font-weight-bold">{{ title }}</h4>
      <b-table striped head-row-variant="none" :items="items" :fields="fields">
        <template v-slot:cell()="data">
          <div v-if="data.field.label == 'Nome'">{{ data.value }}</div>
          <div v-else class="text-center">{{ data.value }}</div>
        </template>
        <template v-slot:head()="data">
          <div v-if="data.label == 'Nome'">{{ data.label }}</div>
          <div v-else class="text-center">{{ data.label }}</div>
        </template>
      </b-table>
      <div class="pl-2 pt-2">
        <span class="font-weight-bold">Docente: </span>Sância Maria Afonso Pires
      </div>
    </section>
  </vue-html2pdf>
</template>

<script>
export default {
  name: "PDFVue",
  props: {
    items: Array,
    fields: Array,
    filename: String,
    title: String,
    isGenerated: Boolean,
  },
  watch: {
    isGenerated: {
      handler(val) {
        if (val) this.$refs.html2Pdf.generatePdf();
      },
    },
  },
};
</script>

<style scoped></style>
