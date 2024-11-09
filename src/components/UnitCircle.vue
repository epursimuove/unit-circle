<script setup lang="ts">
import { computed, type ComputedRef, onMounted, type Ref, ref } from "vue";

const showSineCurve: Ref<boolean> = ref(true);
const showCosineCurve: Ref<boolean> = ref(true);
const showAngle: Ref<boolean> = ref(true);
const rpmFactor: Ref<number> = ref(4);
const currentAngleInRadians: Ref<number> = ref(0);
const currentTimestamp: Ref<number> = ref(0);

const rpmFactorPrettified: ComputedRef<number> = computed(() =>
  rpmFactor.value > 0
    ? rpmFactor.value - 1
    : rpmFactor.value < 0
      ? Math.abs(rpmFactor.value) - 1
      : 0,
);

const rpm: ComputedRef<number> = computed(() =>
  rpmFactor.value === 0 ? 0 : Math.sign(rpmFactor.value) * Math.pow(2, rpmFactorPrettified.value),
);

const timeElapsedInSeconds: ComputedRef<string> = computed(() =>
  toFixed(currentTimestamp.value / 1000, 0),
);

const currentAngleInDegrees: ComputedRef<string> = computed(() =>
  toFixed((currentAngleInRadians.value * 180) / Math.PI, 0),
);

const x: ComputedRef<number> = computed(() => Math.cos(currentAngleInRadians.value));

const y: ComputedRef<number> = computed(() => Math.sin(currentAngleInRadians.value));

const toFixed = (number: number, decimals = 2): string => {
  return number.toFixed(decimals);
};

const explicitSign = (number: number | string): string => {
  if (typeof number === "number") {
    return number < 0 ? `${number}` : `+${number}`;
  }
  return number.startsWith("-") ? number : `+${number}`;
};

onMounted(() => {
  console.log("onMounted");
  init();
});

const init: () => void = () => {
  console.log("init()");

  const canvasUnitCircle = document.getElementById("canvasUnitCircle") as HTMLCanvasElement;
  const canvasWidth = canvasUnitCircle?.width;
  const canvasHeight = canvasUnitCircle?.height;
  let cx: CanvasRenderingContext2D;

  const radius = 100;
  const radiusAngle = radius / 4;
  const radiusMarker = 5;
  const lineWidthThickLineHelper = 4;
  const lineWidthThinLineHelper = 1;
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
  const colorPoint = colorRadius; //"#333";
  const colorPointX = "#f66";
  const colorPointY = "#66f";
  const colorSinAngle = "#66f";
  const colorCosAngle = "#f66";
  const colorConnectingLine = "#ddd"; //"#f6f";

  let previousAngleInRadians = 0;
  let previousTimestamp = 0;

  function clearCanvas(): void {
    cx.clearRect(0, 0, canvasWidth, canvasHeight);
  }

  function calculateCurrentAngleInRadians(timestamp: number): number {
    previousTimestamp = currentTimestamp.value;
    currentTimestamp.value = timestamp;
    const tickInMs = currentTimestamp.value - previousTimestamp;
    const tickInMinute = tickInMs / (60 * 1000);

    const currentRevolution = rpm.value * tickInMinute;

    const oneLapInRadians = 2 * Math.PI;

    const progressForAngle = oneLapInRadians * currentRevolution;

    currentAngleInRadians.value = previousAngleInRadians + progressForAngle;
    currentAngleInRadians.value = (currentAngleInRadians.value + oneLapInRadians) % oneLapInRadians;
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
      timestamp: timestamp,
    } as State;
  }

  function drawUnitCircle(): void {
    cx.strokeStyle = colorUnitCircle;
    cx.lineWidth = 3.0;
    cx.setLineDash([]);

    cx.beginPath();

    cx.arc(origoX, origoY, radius, 0, Math.PI * 2, false);

    cx.closePath();
    cx.stroke();
  }

  function drawNorthArrow(x: number, y: number): void {
    cx.moveTo(x - axisArrowSize, y + axisArrowSize);
    cx.lineTo(x, y);
    cx.lineTo(x + axisArrowSize, y + axisArrowSize);
  }

  function drawEastArrow(x: number, y: number): void {
    cx.moveTo(x - axisArrowSize, y - axisArrowSize);
    cx.lineTo(x, y);
    cx.lineTo(x - axisArrowSize, y + axisArrowSize);
  }

  function drawSineWaveAxes(): void {
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

  function drawCoordinateAxes(): void {
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

  function drawAxesLabels(): void {
    cx.font = "14px 'Courier'";

    cx.fillStyle = colorCosAngle;
    cx.fillText("x", origoX + axisLength / 2 - 10, origoY + 15);

    cx.fillStyle = colorSinAngle;
    cx.fillText("y", origoX + 10, origoY - axisLength / 2 + 10);

    cx.fillStyle = colorCoordinateAxes;
    cx.fillText("t", waveEndX, origoY + 15);
    if (showSineCurve.value) {
      cx.fillStyle = colorSinAngle;
      cx.fillText("y = sin(t)", waveStartX - 90, origoY - axisLength / 2 + 10);
    }
    if (showCosineCurve.value) {
      cx.fillStyle = colorCosAngle;
      cx.fillText("x = cos(t)", waveStartX - 90, origoY - axisLength / 2 + 25);
    }
  }

  function drawWaveWithMarkers(state: State, sine: boolean): void {
    cx.fillStyle = sine ? colorPointY : colorPointX;

    cx.beginPath();

    const startAngleInRadians = state.angleInRadians;

    for (let x = waveStartX; x > waveEndX; x--) {
      const currentAngleInRadians = startAngleInRadians - ((Math.PI * 2) / 200) * (waveStartX - x);

      const y =
        origoY -
        (sine ? Math.sin(currentAngleInRadians) : Math.cos(currentAngleInRadians)) * radius;

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

    cx.arc(waveStartX, sine ? state.y : state.y2, radiusMarker, 0, Math.PI * 2, false); // Showing sin(t)!

    cx.fill();
  }

  function drawRadius(state: State): void {
    cx.strokeStyle = colorRadius;
    cx.lineWidth = lineWidthThickLineHelper;
    cx.setLineDash([]);

    cx.beginPath();

    cx.moveTo(origoX, origoY);
    cx.lineTo(state.x, state.y);

    cx.closePath();
    cx.stroke();
  }

  function drawAngle(state: State): void {
    cx.strokeStyle = colorAngle;
    cx.lineWidth = 2.0;
    cx.setLineDash([]);

    cx.beginPath();

    cx.arc(origoX, origoY, radiusAngle, 0, Math.PI * 2 - state.angleInRadians, true);

    cx.stroke();
  }

  function drawStaticContent(): void {
    drawCoordinateAxes();
    drawSineWaveAxes();
    drawAxesLabels();
    drawUnitCircle();
  }

  function drawPointOnCircleHelper(color: string, x: number, y: number): void {
    cx.fillStyle = color;

    cx.beginPath();

    cx.arc(x, y, radiusMarker, 0, Math.PI * 2, false);

    cx.fill();
  }

  function drawPointOnCircle(state: State): void {
    drawPointOnCircleHelper(colorPoint, state.x, state.y);
  }

  function drawPointForX(state: State): void {
    drawPointOnCircleHelper(colorPointX, state.x, origoY);
  }

  function drawPointForY(state: State): void {
    drawPointOnCircleHelper(colorPointY, origoX, state.y);
  }

  function drawLine(
    color: string,
    xFrom: number,
    yFrom: number,
    xTo: number,
    yTo: number,
    lineWidth: number,
  ): void {
    cx.strokeStyle = color;
    cx.lineWidth = lineWidth;
    cx.setLineDash([]);

    cx.beginPath();

    cx.moveTo(xFrom, yFrom);
    cx.lineTo(xTo, yTo);

    cx.closePath();
    cx.stroke();
  }

  function drawCosHelper(state: State): void {
    drawLine(colorCosAngle, state.x, origoY, origoX, origoY, lineWidthThickLineHelper);
    drawLine(colorCosAngle, state.x, state.y, origoX, state.y, lineWidthThinLineHelper);
  }

  function drawSinHelper(state: State): void {
    drawLine(colorSinAngle, origoX, state.y, origoX, origoY, lineWidthThickLineHelper);
    drawLine(colorSinAngle, state.x, state.y, state.x, origoY, lineWidthThinLineHelper);
  }

  function drawDynamicContent(state: State): void {
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

  function updateLoop(timestamp: number): void {
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
</script>

<template>
  <div class="unit-circle">
    <div class="settings">
      <div>
        <input id="rpmFactor" type="range" v-model="rpmFactor" min="-8" max="8" autofocus />
        <label for="rpmFactor">
          Velocity (rounds per minute (logarithmic scale)):
          <span v-if="rpm !== 0">{{ rpm }}</span>
          <strong v-else>PAUSED</strong>
        </label>
      </div>

      <div>
        <input id="showSineCurve" type="checkbox" v-model="showSineCurve" />
        <label for="showSineCurve"> Show sine curve </label>
      </div>

      <div>
        <input id="showCosineCurve" type="checkbox" v-model="showCosineCurve" />
        <label for="showCosineCurve"> Show cosine curve </label>
      </div>

      <div>
        <input id="showAngle" type="checkbox" v-model="showAngle" />
        <label for="showAngle"> Show angle </label>
      </div>
    </div>

    <div class="canvas-wrapper">
      <canvas id="canvasUnitCircle" width="800" height="300" />
    </div>

    <div class="current-state">
      <div class="math color-angle">
        &theta;:
        {{ toFixed(currentAngleInRadians / Math.PI) }}π rad = {{ currentAngleInDegrees }}°
      </div>

      <div class="math color-cosine">x = cos(&theta;): {{ explicitSign(toFixed(x)) }}</div>

      <div class="math color-sine">y = sin(&theta;): {{ explicitSign(toFixed(y)) }}</div>

      <div class="math">
        <span class="color-radius">1</span>

        = <var class="color-cosine">x</var><sup>2</sup> + <var class="color-sine">y</var
        ><sup>2</sup>

        = <span class="color-cosine">{{ explicitSign(toFixed(x)) }}</span
        ><sup>2</sup> + <span class="color-sine">{{ explicitSign(toFixed(y)) }}</span
        ><sup>2</sup>

        = {{ toFixed(Math.pow(x, 2)) }} + {{ toFixed(Math.pow(y, 2)) }}
      </div>

      <div>Time elapsed: {{ timeElapsedInSeconds }} s</div>
    </div>
  </div>
</template>

<style scoped>
.unit-circle {
  max-width: 50rem;
}

.settings,
.current-state {
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
