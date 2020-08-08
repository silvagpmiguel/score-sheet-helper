export default {
  mounted() {
    if (window.navigator.platform.includes("Win")) this.windows = true;
  },
  data() {
    return {
      windows: false,
      file: null,
      contents: null,
      items: [],
      fields: [],
      title: "",
      pdfGenerated: false,
      filename2: "",
      separator: ";"
    };
  },
  methods: {
    transformCSVToPDF(csv) {
      let arr = csv.split("\n");
      this.title = arr[0];
      this.fields = arr[1].split(this.separator);
      for (let i = 2; i < arr.length; i++) {
        let aux = arr[i].split(this.separator);
        let json = {};
        for (let j = 0; j < aux.length; j++) json[this.fields[j]] = aux[j];
        this.items.push(json);
      }
    },
    checkSeparator(contents) {
      return contents.split(",").length > contents.split(";").length
        ? ","
        : ";";
    },
    makeToast(text, flag) {
      let variant = flag ? "success" : "danger";
      let title = flag ? "Sucesso" : "Erro";
      this.$bvToast.toast(text, {
        title: title,
        variant: variant,
        autoHideDelay: 3000
      });
    }
  }
};
