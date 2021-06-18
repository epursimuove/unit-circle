<template>
  <h1>
    NNM Unit circle <small class="meta">{{ vueAppVersion }}</small>
  </h1>

  <UnitCircle/>

  <h2>About</h2>

  <p>
    An animation of the <span class="color-radius">radius <var>r</var></span> rotating along the <span class="color-unit-circle">unit circle</span> and creating an <span class="color-angle">angle <var>&theta;</var></span>. The <span class="color-cosine"><var>x</var> value</span>, which equals <code class="color-cosine">cos(&theta;)</code> and the <span class="color-sine"><var>y</var> value</span>, which equals <code class="color-sine">sin(&theta;)</code>, will also be indicated.
  </p>

  <p>
    This is an enhancement of the <a href="https://anders.nemonisimors.com/unitCircle.php">original unit circle</a>. Complete documentation and theory can be found on the original page.
  </p>

  <p>
    Implemented with the help of <a href="https://v3.vuejs.org">Vue</a> <var>{{ version }}</var>. First version created in June 2021.
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
    console.info('App version', vueAppVersion);

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

.color-radius {
  color: #dd0;
}

.color-unit-circle {
  color: #0dd;
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
