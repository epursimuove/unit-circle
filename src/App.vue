<script setup lang="ts">
import { version } from "vue";
import UnitCircle from "@/components/UnitCircle.vue";
import { name as appName, version as appVersion } from "../package.json";

console.group(`Starting up "${appName}" ${appVersion}`);
console.info("Vue version", version);
console.groupEnd();

const currentYear: number = new Date().getFullYear();
</script>

<template>
  <header>
    <div>
      <img alt="NNM logo" src="/favicon-nnm-arcs.svg" width="32" height="32" />
    </div>

    <div>
      NNM Unit circle <var class="meta">{{ appVersion }}</var>
    </div>
  </header>

  <UnitCircle />

  <h1>About</h1>

  <p>
    An animation of the <span class="color-radius">radius <var>r</var></span> rotating along the
    <span class="color-unit-circle">unit circle</span> and creating an
    <span class="color-angle">angle <var>&theta;</var></span
    >. The <span class="color-cosine"><var>x</var> value</span>, which equals
    <code class="color-cosine">cos(&theta;)</code> and the
    <span class="color-sine"><var>y</var> value</span>, which equals
    <code class="color-sine">sin(&theta;)</code>, will also be indicated.
  </p>

  <p>
    This is an enhancement of the
    <a href="https://anders.nemonisimors.com/unitCircle">original unit circle</a>. Complete
    documentation and theory can be found on the original page.
  </p>

  <p>
    Implemented with the help of <a href="https://vuejs.org">Vue</a> <var>{{ version }}</var
    >. First version created in June 2021. Second version created in November 2024.
  </p>

  <footer>
    <div>
      <em>NNM Unit circle</em> <var>{{ appVersion }}</var>
    </div>
    <div>
      Code repository:
      <a href="https://github.com/epursimuove/unit-circle"
        >https://github.com/epursimuove/unit-circle</a
      >
    </div>
    <div>
      Copyright &copy; 2021-{{ currentYear }}
      <a href="https://anders.nemonisimors.com">Anders Gustafson</a>
    </div>
    <div>
      <a href="https://www.nemonisimors.com"><em>Nemo nisi mors</em></a>
    </div>
  </footer>
</template>

<style scoped></style>
