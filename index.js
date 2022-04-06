const BLACK = 0;
const WHITE = 255;

const $black = document.querySelector("#color-black");
const $white = document.querySelector("#color-white");
const $count = document.querySelector("#color-count");
const $coeff = document.querySelector("#color-coeff");
const $align = document.querySelector("#color-align");

const $params = document.querySelector("#params");
const $button = document.querySelector("#button");
const $colors = document.querySelector("#colors");

window.onload = () => {
  $button.click();
};

$count.onchange = () => {
  $button.click();
};

$align.onchange = () => {
  $button.click();
};

$button.addEventListener("click", (event) => {
  event.preventDefault();

  $colors.innerHTML = "";

  const l = parseInt($black.value, 10); // [0, 127]
  const r = parseInt($white.value, 10); // [127, 255]
  const diapason = r - l; // [0, 255]
  const range = diapason + 1; // [1, 256]
  const count = parseInt($count.value, 10); // [1, 256];
  const coeff = parseFloat($coeff.value, 10); // [1, 10]

  if (count > range) {
    const $err = document.createElement("div");
    $err.classList = Object.values({
      layout: "p-4 bg-red-100",
      border: "border border-red-500 rounded",
      typography: "text-xs text-red-500 font-medium",
    }).join(" ");
    $err.textContent = `Colors number - ${count}, is greater than an available hex colors in range - ${range}`;
    $params.appendChild($err);
    setTimeout(() => {
      $params.removeChild($err);
    }, 3000);
    return;
  }

  const step = Math.floor(range / count);
  const subrange = count * step;
  const remainder = diapason - subrange;

  // console.log(l, r, diapason);
  // console.log(diapason, count, step, subrange, remainder);

  let min, max;
  switch ($align.value) {
    case "start":
      [min, max] = [l, r - remainder];
      break;
    case "end":
      [min, max] = [l + remainder, r];
      break;
    case "evenly":
      const padding = Math.floor(remainder / 2);
      [min, max] = [l + padding, r - padding];
      break;
    default:
      [min, max] = [l, r - remainder];
      break;
  }

  // console.log(min, max);

  for (let i = min; i <= max; i += Math.floor(step * coeff)) {
    const color = `#${hex(i)}`;

    // create dom elements
    const $box = document.createElement("div");
    $box.classList = Object.values({
      common: "cursor-pointer ",
      square: "aspect-square rounded",
      layout: "flex flex-col justify-center items-center space-y-2",
      border: "border-2 border-blue-500",
    }).join(" ");
    $box.style.backgroundColor = color;

    const $txt = document.createElement("div");
    $txt.classList = Object.values({
      typography: "text-sm uppercase leading-none",
      color: i > 127 ? "text-black" : "text-white",
    }).join(" ");
    $txt.textContent = color;

    const $btn = document.createElement("button");
    $btn.classList = Object.values({
      common: "cursor-pointer transform",
      typography: "text-xs text-blue-500 hover:text-blue-600",
    }).join(" ");

    // set clipboard behavior
    $btn.textContent = `Copy #${i}`;
    $box.title = "Copy to clipboard";
    $box.setAttribute("data-clipboard-text", color);

    const clipboard = new ClipboardJS($box);

    clipboard.on("success", () => {
      $box.classList.add("border-green-500");
      $btn.classList.add("text-green-500");
      $btn.textContent = "Copied!";
      setTimeout(() => {
        $box.classList.remove("border-green-500");
        $btn.classList.remove("text-green-500");
        $btn.textContent = "Copy";
      }, 3000);
    });

    clipboard.on("error", () => {
      $box.classList.add("border-red-500");
      $btn.classList.add("text-red-500");
      $btn.textContent = "Error!";
      setTimeout(() => {
        $box.classList.remove("border-red-500");
        $btn.classList.remove("text-red-500");
        $btn.textContent = "Copy";
      }, 3000);
    });

    // mount dom elements
    $box.appendChild($txt);
    $box.appendChild($btn);
    $colors.appendChild($box);
  }
});

function hex(number = 0) {
  return number.toString(16).padStart(2, 0).repeat(3);
}