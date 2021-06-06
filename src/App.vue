<template>
  <h1>
    NNM Unit circle <small class="meta">{{ vueAppVersion }}</small>
  </h1>

  <UnitCircle/>

  <h2>About</h2>

  <p>
    An animation of the radius <var>r</var> rotating along the unit circle and creating an angle <var class="color-angle">&theta;</var>. The <var class="color-cosine">x</var> value, which equals <code class="color-cosine">cos(&theta;)</code> and the <var class="color-sine">y</var> value, which equals <code class="color-sine">sin(&theta;)</code>, will also be indicated.
  </p>

  <p>
    This is an enhancement of the <a href="https://anders.nemonisimors.com/unitCircle.php">original unit circle</a>. Complete documentation and theory can be found on the original page.
  </p>

  <p>
    Implemented with the help of <a href="https://v3.vuejs.org">Vue</a> <var>{{ version }}</var>.
  </p>

  <footer>
    <div>
      <em>NNM Unit circle</em> <small>{{ vueAppVersion }}</small>
    </div>
    <div>
      Code repository: <a href="https://github.com/epursimuove/unit-circle">https://github.com/epursimuove/unit-circle</a>
    </div>
    <div>
      Copyright &copy; 2021-&infin;
      <a href="https://anders.nemonisimors.com">Anders Gustafson</a>
    </div>
    <div>
      <a href="https://www.nemonisimors.com"><em>Nemo nisi mors</em></a>
    </div>
  </footer>

</template>

<script lang="ts">
import {defineComponent, version} from "vue";
import UnitCircle from "@/components/UnitCircle.vue";

export default defineComponent({
  name: "App",

  components: {
    UnitCircle,
  },

  setup() {
    console.info("Vue version", version);

    const vueAppVersion = process.env.VUE_APP_VERSION;

    return {
      version,
      vueAppVersion
    };
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

body {
  margin: 0 1rem;
  /*background-color: black;*/
  /*color: white;*/
  max-width: 840px;
}

h2 {
  margin-top: 2.5rem;
}

.color-angle {
  color: #6a6;
}

.color-sine {
  color: #66f;
}

.color-cosine {
  color: #f66;
}

.math {
  font-family: Courier, monospace;
}

a {
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

code {
  font-family: Courier, monospace;
}

footer {
  margin: 2rem 0 1rem;
  font-size: 0.9em;
  color: hsl(100, 0%, 60%);
}

.meta {
  color: hsl(100, 0%, 60%);
}
</style>
