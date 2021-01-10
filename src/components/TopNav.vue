<template>
  <b-navbar small type="dark" variant="dark">
    <b-navbar-brand>Score Helper</b-navbar-brand>
    <b-navbar-nav small class="ml-auto">
      <b-nav-item to="/createScore">Create Score</b-nav-item>
      <b-nav-item to="/generateCSV">Import & Generate Score</b-nav-item>
      <b-nav-item to="/convertToPDF">Convert CSV to PDF</b-nav-item>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
export default {
  name: 'TopNav',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.navbar {
  padding: 0.2rem 0.5rem !important;
}
.navbar-brand {
  font-size: 1rem !important;
}
</style>
