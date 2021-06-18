<template>
  <div class="unit-circle">

    <div class="settings">
      <div>
        <input id="showSineCurve" type="checkbox" v-model="showSineCurve" />
        <label for="showSineCurve">
          Show sine curve
        </label>
      </div>

      <div>
        <input id="showCosineCurve" type="checkbox" v-model="showCosineCurve" />
        <label for="showCosineCurve">
          Show cosine curve
        </label>
      </div>

      <div>
        <input id="showAngle" type="checkbox" v-model="showAngle" />
        <label for="showAngle">
          Show angle
        </label>
      </div>

      <div>
        <input id="rpmFactor" type="range" v-model="rpmFactor" min="-1" max="7" />
        <label for="rpmFactor">
          Velocity: 2<sup>{{ rpmFactor }}</sup> = {{ rpm }} rounds per minute (logarithmic scale)
        </label>
      </div>
    </div>

    <div class="canvas-wrapper">
      <canvas id="canvasUnitCircle" width="800" height="300" />
    </div>

    <div class="current-state">
      <div class="math color-angle">
        &theta;:
        {{ toFixed(currentAngleInRadians / Math.PI) }}π rad
        = {{ currentAngleInDegrees }}°
      </div>

      <div class="math color-cosine">
        x = cos(&theta;): {{ showSign(toFixed(Math.cos(currentAngleInRadians))) }}
      </div>

      <div class="math color-sine">
        y = sin(&theta;): {{ showSign(toFixed(Math.sin(currentAngleInRadians))) }}
      </div>

      <div class="math">

        1

        = <var class="color-cosine">x</var><sup>2</sup> + <var class="color-sine">y</var><sup>2</sup>

        = <span class="color-cosine">{{ showSign(toFixed(Math.cos(currentAngleInRadians))) }}</span><sup>2</sup> + <span class="color-sine">{{ showSign(toFixed(Math.sin(currentAngleInRadians))) }}</span><sup>2</sup>

        = {{ toFixed(Math.pow(Math.cos(currentAngleInRadians), 2)) }} + {{ toFixed(Math.pow(Math.sin(currentAngleInRadians), 2)) }}

      </div>

      <div>
        Revolutions: {{ revolutions }}
      </div>

      <div>
        Time elapsed: {{ timeElapsedInSeconds }} s
      </div>

    </div>

  </div>

</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref} from "vue";

export default defineComponent({
  name: "UnitCircle",

  setup() {

    const showSineCurve = ref(true);
    const showCosineCurve = ref(true);
    const showAngle = ref(true);
    const rpmFactor = ref(4);
    const revolutions = ref(0);
    const currentAngleInRadians = ref(0);
    const currentTimestamp = ref(0);

    const rpm = computed(() => rpmFactor.value >= 0 ? Math.pow(2, rpmFactor.value) : 0);

    const timeElapsedInSeconds = computed(() => toFixed(currentTimestamp.value / 1000, 0));

    const currentAngleInDegrees = computed(() => toFixed(currentAngleInRadians.value * 180 / Math.PI, 0));

    const toFixed = (number: number, decimals = 2): string => {
      return number.toFixed(decimals);
    };

    const showSign = (number: number | string): string => {
      if (typeof number === "number") {
        return number < 0 ? "" + number : "+" + number;
      }
      return number.startsWith("-") ? number : "+" + number;
    };

    onMounted(() => {
      console.log("onMounted");
      init();
      // console.log("process.env.VUE_APP_VERSION", process.env.VUE_APP_VERSION);
    });

    const init = () => {
      console.log("init()");

      const canvasUnitCircle = document.getElementById("canvasUnitCircle") as HTMLCanvasElement;
      const canvasWidth = canvasUnitCircle?.width;
      const canvasHeight = canvasUnitCircle?.height;
      let cx: CanvasRenderingContext2D;

      const radius = 100;
      const radiusAngle = radius / 4;
      const origoX = 650;
      const origoY = 150;
      const axisLength = 260;
      const axisArrowSize = 5;
      const waveSize = 2;

      const waveStartX = 500;
      const waveEndX = 20;

      const colorCoordinateAxes = "#666"; //"#ccc";
      const colorUnitCircle = "#0dd";
      const colorRadius = "#dd0";
      const colorAngle = "#6a6";
      const colorPoint = "#333";
      const colorPointX = "#f66";
      const colorPointY = "#66f";
      const colorSinAngle = "#66f";
      const colorCosAngle = "#f66";
      const colorConnectingLine = "#ddd"; //"#f6f";

      let previousAngleInRadians = 0;
      let previousTimestamp = 0;

      function clearCanvas() {
        cx.clearRect(0, 0, canvasWidth, canvasHeight);
      }

      function calculateCurrentAngleInRadians(timestamp: number) {
        previousTimestamp = currentTimestamp.value;
        currentTimestamp.value = timestamp;
        const tickInMs = currentTimestamp.value - previousTimestamp;
        const tickInMinute = tickInMs / (60 * 1000);

        const currentRevolution = rpm.value * tickInMinute;

        const oneLapInRadians = 2 * Math.PI;

        const progressForAngle = oneLapInRadians * currentRevolution;

        currentAngleInRadians.value = previousAngleInRadians + progressForAngle;
        currentAngleInRadians.value %= oneLapInRadians;
        if (currentAngleInRadians.value < previousAngleInRadians) {
          revolutions.value++;
        }
        previousAngleInRadians = currentAngleInRadians.value;

        return currentAngleInRadians.value;
      }

      interface State {
        cos: number;
        sin: number;
        x: number;
        y: number;
        y2: number;
        angleInRadians: number;
        timestamp: number;
      }

      function calculateState(timestamp: number): State {
        const currentAngleInRadians = calculateCurrentAngleInRadians(timestamp);

        const cos = Math.cos(currentAngleInRadians);
        const sin = Math.sin(currentAngleInRadians);

        const x = origoX + radius * cos;
        const ySin = origoY - radius * sin;
        const yCos = origoY - radius * cos;

        return {
          cos: cos,
          sin: sin,
          x: x,
          y: ySin,
          y2: yCos,
          angleInRadians: currentAngleInRadians,
          timestamp: timestamp
        } as State;
      }

      function drawUnitCircle() {
        cx.strokeStyle = colorUnitCircle;
        cx.lineWidth = 3.0;
        cx.setLineDash([]);

        cx.beginPath();

        cx.arc(
            origoX,
            origoY,
            radius,
            0,
            Math.PI * 2,
            false
        );

        cx.closePath();
        cx.stroke();
      }

      function drawNorthArrow(x: number, y: number) {
        cx.moveTo(x - axisArrowSize, y + axisArrowSize);
        cx.lineTo(x, y);
        cx.lineTo(x + axisArrowSize, y + axisArrowSize);
      }

      function drawEastArrow(x: number, y: number) {
        cx.moveTo(x - axisArrowSize, y - axisArrowSize);
        cx.lineTo(x, y);
        cx.lineTo(x - axisArrowSize, y + axisArrowSize);
      }

      function drawSineWaveAxes() {
        cx.strokeStyle = colorCoordinateAxes;
        cx.lineWidth = 1.0;
        cx.setLineDash([]);

        cx.beginPath();

        cx.moveTo(waveStartX, origoY - axisLength / 2);
        cx.lineTo(waveStartX, origoY + axisLength / 2);
        cx.moveTo(waveStartX, origoY);
        cx.lineTo(waveEndX - 10, origoY);

        drawNorthArrow(waveStartX, origoY - axisLength / 2);

        // cx.closePath();
        cx.stroke();
      }

      function drawCoordinateAxes() {
        cx.strokeStyle = colorCoordinateAxes;
        cx.lineWidth = 1.0;
        cx.setLineDash([]);

        cx.beginPath();

        cx.moveTo(origoX, origoY - axisLength / 2);
        cx.lineTo(origoX, origoY + axisLength / 2);
        cx.moveTo(origoX - axisLength / 2, origoY);
        cx.lineTo(origoX + axisLength / 2, origoY);

        drawNorthArrow(origoX, origoY - axisLength / 2);

        drawEastArrow(origoX + axisLength / 2, origoY);

        // cx.closePath();
        cx.stroke();
      }

      function drawAxesLabels() {
        cx.font = "14px 'Courier'";

        cx.fillStyle = colorCosAngle;
        cx.fillText(
            "x",
            origoX + axisLength / 2 - 10,
            origoY + 15
        );

        cx.fillStyle = colorSinAngle;
        cx.fillText(
            "y",
            origoX + 10,
            origoY - axisLength / 2 + 10
        );

        cx.fillStyle = colorCoordinateAxes;
        cx.fillText(
            "t",
            waveEndX,
            origoY + 15
        );
        if (showSineCurve.value) {
          cx.fillStyle = colorSinAngle;
          cx.fillText(
              "y = sin(t)",
              waveStartX - 90,
              origoY - axisLength / 2 + 10
          );
        }
        if (showCosineCurve.value) {
          cx.fillStyle = colorCosAngle;
          cx.fillText(
              "x = cos(t)",
              waveStartX - 90,
              origoY - axisLength / 2 + 25
          );
        }
      }

      function drawWaveWithMarkers(state: State, sine: boolean) {
        cx.fillStyle = sine ? colorPointY : colorPointX;

        cx.beginPath();

        const startAngleInRadians = state.angleInRadians;

        for (let x = waveStartX; x > waveEndX; x--) {

          const currentAngleInRadians = startAngleInRadians - Math.PI * 2 / 200 * (waveStartX - x);

          const y = origoY - (sine ? Math.sin(currentAngleInRadians) : Math.cos(currentAngleInRadians)) * radius;

          cx.fillRect(x, y, waveSize, waveSize);
        }

        cx.fill();

        cx.strokeStyle = colorConnectingLine;
        cx.lineWidth = 1.0;
        cx.setLineDash([]);

        cx.beginPath();

        cx.moveTo(state.x, sine ? state.y : origoY);
        cx.lineTo(waveStartX, sine ? state.y : state.y2);

        cx.closePath();
        cx.stroke();

        cx.fillStyle = sine ? colorPointY : colorPointX;

        cx.beginPath();

        cx.arc(
            waveStartX,
            sine ? state.y : state.y2,
            3,
            0,
            Math.PI * 2,
            false
        ); // Showing sin(t)!

        cx.fill();
      }

      function drawRadius(state: State) {
        cx.strokeStyle = colorRadius;
        cx.lineWidth = 3.0;
        cx.setLineDash([]);

        cx.beginPath();

        cx.moveTo(origoX, origoY);
        cx.lineTo(state.x, state.y);

        cx.closePath();
        cx.stroke();
      }

      function drawAngle(state: State) {
        cx.strokeStyle = colorAngle;
        cx.lineWidth = 2.0;
        cx.setLineDash([]);

        cx.beginPath();

        cx.arc(
            origoX,
            origoY,
            radiusAngle,
            0,
            Math.PI * 2 - state.angleInRadians,
            true
        );

        cx.stroke();
      }

      function drawStaticContent() {
        drawCoordinateAxes();
        drawSineWaveAxes();
        drawAxesLabels();
        drawUnitCircle();
      }

      function drawPointOnCircleHelper(color: string, x: number, y: number) {
        cx.fillStyle = color;

        cx.beginPath();

        cx.arc(x, y, 3, 0, Math.PI * 2, false);

        cx.fill();
      }

      function drawPointOnCircle(state: State) {
        drawPointOnCircleHelper(colorPoint, state.x, state.y);
      }

      function drawPointForX(state: State) {
        drawPointOnCircleHelper(colorPointX, state.x, origoY);
      }

      function drawPointForY(state: State) {
        drawPointOnCircleHelper(colorPointY, origoX, state.y);
      }

      function drawLine(
          color: string,
          xFrom: number,
          yFrom: number,
          xTo: number,
          yTo: number
      ) {

        cx.strokeStyle = color;
        cx.lineWidth = 2.0;
        cx.setLineDash([]);

        cx.beginPath();

        cx.moveTo(xFrom, yFrom);
        cx.lineTo(xTo, yTo);

        cx.closePath();
        cx.stroke();
      }

      function drawCosHelper(state: State) {
        drawLine(colorCosAngle, state.x, state.y, origoX, state.y);
      }

      function drawSinHelper(state: State) {
        drawLine(colorSinAngle, state.x, state.y, state.x, origoY);
      }

      function drawDynamicContent(state: State) {
        if (showSineCurve.value) {
          drawWaveWithMarkers(state, true);
        }
        if (showCosineCurve.value) {
          drawWaveWithMarkers(state, false);
        }
        drawRadius(state);
        drawCosHelper(state);
        drawSinHelper(state);
        if (showAngle.value) {
          drawAngle(state);
        }
        drawPointForX(state);
        drawPointForY(state);
        drawPointOnCircle(state);
      }

      function updateLoop(timestamp: number) {

        window.requestAnimationFrame(updateLoop);

        const state = calculateState(timestamp);
        clearCanvas();
        drawStaticContent();
        drawDynamicContent(state);
      }

      if (typeof canvasUnitCircle?.getContext !== "undefined") {

        cx = canvasUnitCircle?.getContext("2d") as CanvasRenderingContext2D;

        window.requestAnimationFrame(updateLoop);
      }
    };

    return {
      showSineCurve,
      showCosineCurve,
      showAngle,
      rpmFactor,
      rpm,
      currentAngleInRadians,
      currentAngleInDegrees,
      revolutions,

      timeElapsedInSeconds,

      toFixed,
      showSign,
    };
  }

});

</script>

<style scoped>

.unit-circle {
  max-width: 50rem;
}

.settings, .current-state {
  /*max-width: 50rem;*/
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  flex-wrap: wrap;
  gap: 0.8rem;
}


.settings > div {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.canvas-wrapper {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

canvas {
  /*border: 1px solid lightgray;*/
  max-width: 100%;
}

</style>
