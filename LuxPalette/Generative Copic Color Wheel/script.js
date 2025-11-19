console.clear();

import {
  Poline,
  positionFunctions
} from "https://cdn.skypack.dev/poline@0.11.0";

const $w = document.querySelector("[data-world]");

let poline = new Poline({
  numPoints: 10
});

let hueSection = 10;
let lightnessLevels = 3;
let isSmoothGradient = true;
let invertLight = false;
let speed = 0.75;
let direction = 1;
let rndPerSection = [];

const createLabels = (steps) => {
  const $w = document.createElement("div");
  $w.classList.add("labels");
  for (let i = 0; i < steps; i++) {
    const $label = document.createElement("div");
    $label.classList.add("labels__label");
    $label.style.setProperty("--i", i / steps);
    $w.appendChild($label);
  }
  return $w;
};

const newSettings = () => {
  direction = Math.random() < .5 ? 1 : -1;
  hueSection = 10 + Math.floor(Math.random() * 10);
  hueSection = 3 + Math.round(Math.random() * 45);
  if (Math.random() < 0.15) {
    hueSection = 100 + Math.round(Math.random() * 240);
  }
  lightnessLevels = 3 + Math.floor(Math.random() * 10);
  //lightnessLevels = 20;
  isSmoothGradient = Math.random() < 0.5;
  invertLight = Math.random() < 0.5;

  poline = new Poline({ // https://meodai.github.io/poline/
    numPoints: 10,
    positionFunctionX:
      Math.random() < 0.5
        ? positionFunctions.smoothStepPosition
        : positionFunctions.sinusoidalPosition,
  });

  const additionalAnchors =
    Math.random() < 0.3 ? Math.round(Math.random() * 2) : 2;

  for (let i = 0; i < additionalAnchors; i++) {
    poline.addAnchorPoint({
      xyz: [Math.random(), Math.random(), Math.random()]
    });
  }

  $w.classList.remove("trans");
  if (Math.random() < 0.5) {
    $w.classList.toggle("dark");
  }
  if (Math.random() < 0.1) {
    $w.classList.add("trans");
  }
  if (Math.random() < 0.5) {
    $w.classList.toggle("show-rings");
  }
  if (invertLight && Math.random() < 0.2) {
    $w.classList.add("blur");
  } else {
    $w.classList.remove("blur");
  }

  if (
    Math.random() < 0.25 &&
    isSmoothGradient &&
    !$w.classList.contains("dark")
  ) {
    $w.classList.add("notches");
  } else {
    $w.classList.remove("notches");
  }

  if (Math.random() < 0.1) {
    $w.classList.add("invert-scale");
  } else {
    $w.classList.remove("invert-scale");
  }

  speed = Math.random();

  $w.style.setProperty(
    "--s",
    Math.random() < 0.75 ? 1 : 0.5 + Math.random() * 0.5
  );

  rndPerSection = new Array(lightnessLevels)
    .fill("")
    .map((_, i) => Math.random());
};

const gradientStepsForSegment = (colorSegments) => {
  let l = colorSegments.length;

  const gradStops = colorSegments.map((colors, i) => {
    const nextStep = (i + 1) / l;
    const currentStep = i / l;
    const segmentRange = nextStep - currentStep;
    if (!colors) {
      if (isSmoothGradient) {
        return `var(--bgc)`;
      } else {
        return `var(--bgc) ${currentStep * 100}% ${nextStep * 100}%`;
      }
    } else {
      const cl = colors.length;
      return colors
        .map((c, j) => {
          const nextSubStep = (j + 1) / cl;
          const currentSubStep = j / cl;

          if (isSmoothGradient) {
            return `${c.css}`;
          } else {
            return `${c.css} ${
              (currentStep + currentSubStep * segmentRange) * 100
            }% ${
              (currentStep + segmentRange - currentSubStep * segmentRange) * 100
            }%`;
          }
        })
        .join();
    }
  });

  if (isSmoothGradient) {
    gradStops.push(gradStops[0]);
  }

  return gradStops.join();
};

function doIt() {
  $w.innerHTML = "";
  let hueSlice = 360 / hueSection;
  let lightnessSlice = 1 / lightnessLevels;

  const hueSections = new Array(hueSection)
    .fill("")
    .map((_, i) => (i + 1) * hueSlice);
  const lightnessSections = new Array(lightnessLevels)
    .fill("")
    .map((_, i) =>
      invertLight ? 1 - (i + 1) / lightnessLevels : (i + 1) / lightnessLevels
    );

  let colors = poline.colors.map((color, i) => {
    return {
      values: color,
      css: poline.colorsCSSlch[i],
      css: poline.colorsCSS[i]
    };
  });

  lightnessSections.forEach((lightnessSection, i) => {
    const currentSegmentLightness = colors.filter(
      (c) =>
        c.values[2] <= lightnessSection &&
        lightnessSection - lightnessSlice <= c.values[2]
    );

    const segementedHuesForLightness = hueSections
      .map((hueSection) =>
        currentSegmentLightness.filter(
          (c) =>
            c.values[0] <= hueSection && hueSection - hueSlice <= c.values[0]
        )
      )
      .map((a) => (a.length > 0 ? a : null));

    const gradientSteps = gradientStepsForSegment(segementedHuesForLightness);

    const $ring = document.createElement("div");
    $ring.classList.add("ring");
    $ring.style.setProperty("--i", i);
    $ring.style.setProperty("--iR", (i + 1) / lightnessLevels);
    $ring.style.setProperty("--g", gradientSteps);
    $ring.style.setProperty("--rnd", rndPerSection[i]);
    $w.appendChild($ring);

    return segementedHuesForLightness;
  });

  $w.appendChild(createLabels(hueSection));
}

newSettings();
doIt();

document.documentElement.addEventListener("click", () => {
  newSettings();
  doIt();
});

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  setInterval(() => {
    poline.shiftHue(speed * direction);
    doIt();
  }, 16.66);
}

document.querySelector("button").addEventListener("click", (e) => {
  e.stopPropagation();
  console.log(e);
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen?.();
  }
});
