<template>
  <b-navbar type="dark" variant="dark">
    <b-navbar-nav>
      <b-nav-item to="/">Excel Merger and PDF Conversor</b-nav-item>
      <b-nav-item to="/generateCSV">Generate Score</b-nav-item>
      <b-nav-item to="/convertToPDF">Convert CSV to PDF</b-nav-item>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
export default {
  name: "TopNav"
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped></style>
