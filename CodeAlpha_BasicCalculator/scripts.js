const display = document.getElementById("calc-display");
const buttons = document.querySelectorAll(".btn");
const historyContainer = document.querySelector(".history-content");
const clearHistoryBtn = document.getElementById("clear-history-btn");
const historyElement = document.getElementById("history");
const historyHeader = document.querySelector(".history-header");
const themeToggle = document.getElementById('dark-mode-toggle');

let currentInput = "";
let history = [];
let resultShown = false;

/**** HISTORY FIELD HANDLING *****/

historyHeader.addEventListener('click', (e) => {
  if (e.target === clearHistoryBtn || e.target.closest('#clear-history-btn')) {
    return;
  }
  historyElement.classList.toggle('collapsed');
});

/**** BUTTONS AND CLICK EVENTS *****/

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const value = btn.dataset.value;
    const action = btn.dataset.action;

    if (action === "clear") {
      clearDisplay();
    } else if (action === "backspace") {
      deleteLast();
    } else if (action === "equals") {
      calculateResult();
    } else if (action === "clear-history") {
      clearHistory();
    } else if (value) {
      appendValue(value);
    }
  });
});

/**** CORE CALCULATOR LOGIC | CLEARS SCREEN AFTER ANSWER *****/

function appendValue(value) {
  if (resultShown) {
    currentInput = "";
    resultShown = false;
  }
  currentInput += value;
  display.value = currentInput;
}

/**** CALCULATION, HISTORY, AND ERROR HANDLING *****/

function clearDisplay() {
  currentInput = "";
  display.value = "";
  resultShown = false;
}

function deleteLast() {
  currentInput = currentInput.slice(0, -1);
  display.value = currentInput;
}

function calculateResult() {
  try {
    if (!currentInput) return;

    const expression = currentInput.replace(/%/g, "/100");
    let result = eval(expression);

    if (isNaN(result) || result === undefined) {
      display.value = "Error";
      setTimeout(clearDisplay, 1500);
      return;
    }

    result = parseFloat(result.toFixed(4));
    display.value = result;
    addToHistory(currentInput, result);
    currentInput = result.toString();
    resultShown = true;
  } catch {
    display.value = "Error";
    currentInput = "";
    setTimeout(clearDisplay, 1500);
  }
}

/**** HISTORY FIELD *****/

function addToHistory(expr, res) {
  history.push({ expr, res });

  if (history.length > 20) history.shift();

  historyContainer.innerHTML = "";
  [...history].reverse().forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("history-item");
    div.textContent = `${item.expr} = ${item.res}`;
    historyContainer.appendChild(div);
  });


  if (historyElement.classList.contains('collapsed')) {
    historyElement.classList.remove('collapsed');
  }
}

/**** CLEAR HISTORY *****/

function clearHistory() {
  history = [];
  historyContainer.innerHTML = "";
  historyElement.classList.add('collapsed');
}

/**** KEYBOARD SUPPORT *****/

document.addEventListener("keydown", (e) => {
  if ((e.key >= "0" && e.key <= "9") || "+-*/.%".includes(e.key)) {
    appendValue(e.key);
  } else if (e.key === "Enter") {
    calculateResult();
  } else if (e.key === "Backspace") {
    deleteLast();
  } else if (e.key.toLowerCase() === "c") {
    clearDisplay();
  }
});

/**** LIGTH AND DARK MODE TOGGLE *****/

const body = document.body;

const savedTheme = localStorage.getItem('theme') || 
                  (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

if (savedTheme === 'light') {
  themeToggle.checked = true;
  body.classList.add('light-mode');
}

themeToggle.addEventListener('change', function() {
  if (this.checked) {
    body.classList.add('light-mode');
    localStorage.setItem('theme', 'light');
  } else {
    body.classList.remove('light-mode');
    localStorage.setItem('theme', 'dark');
  }
});