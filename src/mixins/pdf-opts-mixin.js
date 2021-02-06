export default {
  data() {
    return {
      filename: 'pauta.csv',
      title: `U.C de A - Ano Letivo ${new Date().getFullYear() - 1}/${new Date().getFullYear()}`,
      items: [],
      fields: [],
      teacher: '',
    }
  },
  methods: {
    computePdfFormat() {
      const cols = this.fields.length
      const jsPDF = {
        unit: 'in',
        format: 'a4',
        orientation: 'portrait',
      }

      if (cols > 4 && cols <= 8) {
        jsPDF.format = 'a3'
      } else if (cols > 8) {
        jsPDF.format = 'a2'
      }
      return jsPDF
    },
  },
}
