export default {
  mounted() {
    if (!window.navigator.platform.includes('Win')) {
      this.windows = false
      this.separator = ','
    }
  },
  data() {
    return {
      windows: true,
      file: null,
      contents: null,
      filename2: '',
      separator: ';',
    }
  },
  methods: {
    transformCSVToPDF(csv) {
      let arr = csv.split('\n')
      this.title = arr[0]
      this.fields = arr[1].split(this.separator)
      for (let i = 2; i < arr.length; i++) {
        let aux = arr[i].split(this.separator)
        let json = {}
        for (let j = 0; j < aux.length; j++) json[this.fields[j]] = aux[j]
        this.items.push(json)
      }
    },
    findHeader(arr, separator) {
      const firstLine = arr[0].split(separator).length,
        len = arr.length
      let line = 1
      for (; line < len; line++) {
        if (firstLine < arr[line].split(separator).length) return arr.slice(line, len)
      }
      return arr
    },
    checkSeparator(contents) {
      return contents.split(',').length > contents.split(';').length ? ',' : ';'
    },
    round(num, decimal) {
      const num2 = Math.pow(10, decimal)
      return isNaN(num) ? num : Math.round(num * num2) / num2
    },
    makeToast(text, flag) {
      let variant = flag ? 'success' : 'danger'
      let title = flag ? 'Sucesso' : 'Erro'
      this.$bvToast.toast(text, {
        title: title,
        variant: variant,
        autoHideDelay: 3000,
      })
    },
  },
}
