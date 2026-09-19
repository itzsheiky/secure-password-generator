const characterSets = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.?",
};

const form = document.querySelector("#generator-form");
const passwordOutput = document.querySelector("#password-output");
const lengthInput = document.querySelector("#length");
const copyButton = document.querySelector("#copy-button");
let copyTimer;

function selectedSetNames() {
  return Object.keys(characterSets).filter((name) => form.elements[name].checked);
}

// Rejection sampling keeps the index distribution unbiased.
function secureIndex(maximum) {
  const rejectionLimit = 256 - (256 % maximum);
  const randomByte = new Uint8Array(1);

  do {
    crypto.getRandomValues(randomByte);
  } while (randomByte[0] >= rejectionLimit);

  return randomByte[0] % maximum;
}

function generatePassword() {
  const selectedNames = selectedSetNames();
  const passwordLength = Number(lengthInput.value);

  if (!selectedNames.length) {
    document.querySelector("#validation-message").textContent =
      "Select at least one character set to generate a password.";
    return;
  }

  const pool = selectedNames.map((name) => characterSets[name]).join("");
  const characters = selectedNames.map((name) => {
    const set = characterSets[name];
    return set[secureIndex(set.length)];
  });

  while (characters.length < passwordLength) {
    characters.push(pool[secureIndex(pool.length)]);
  }

  // Secure Fisher-Yates shuffle after guaranteeing one character per set.
  for (let index = characters.length - 1; index > 0; index -= 1) {
    const swapIndex = secureIndex(index + 1);
    [characters[index], characters[swapIndex]] = [
      characters[swapIndex],
      characters[index],
    ];
  }

  passwordOutput.textContent = characters.join("");
  updatePasswordInformation();
}

function updatePasswordInformation() {
  const selectedNames = selectedSetNames();
  const passwordLength = Number(lengthInput.value);
  const poolSize = selectedNames.reduce(
    (total, name) => total + characterSets[name].length,
    0,
  );
  const estimatedEntropy = selectedNames.length
    ? passwordLength * Math.log2(poolSize)
    : 0;

  document.querySelector("#length-value").textContent = `${passwordLength} characters`;
  document.querySelector("#set-count").textContent = `${selectedNames.length} selected`;
  document.querySelector("#stat-length").textContent = passwordLength;
  document.querySelector("#stat-sets").textContent = selectedNames.length;
  document.querySelector("#stat-entropy").textContent = selectedNames.length
    ? `~${Math.floor(estimatedEntropy)} bits`
    : "—";

  const strengthScore =
    estimatedEntropy >= 90
      ? 100
      : estimatedEntropy >= 60
        ? 72
        : estimatedEntropy >= 40
          ? 45
          : 22;
  const strengthLabel =
    strengthScore >= 90
      ? "Very Strong"
      : strengthScore >= 60
        ? "Strong"
        : strengthScore >= 35
          ? "Fair"
          : "Weak";
  const strengthMeter = document.querySelector("#strength-meter");

  document.querySelector("#strength-bar").style.width = `${strengthScore}%`;
  document.querySelector("#strength-label").textContent = strengthLabel;
  strengthMeter.setAttribute("aria-valuenow", String(strengthScore));
  strengthMeter.setAttribute(
    "aria-valuetext",
    `${strengthLabel}, approximately ${Math.floor(estimatedEntropy)} bits of entropy`,
  );

  if (selectedNames.length) {
    document.querySelector("#validation-message").textContent = "";
  }
}

lengthInput.addEventListener("input", () => {
  updatePasswordInformation();
  generatePassword();
});

form.addEventListener("change", () => {
  updatePasswordInformation();
  if (selectedSetNames().length) generatePassword();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  generatePassword();
});

document.querySelector("#regenerate-button").addEventListener("click", generatePassword);

copyButton.addEventListener("click", async () => {
  clearTimeout(copyTimer);

  try {
    await navigator.clipboard.writeText(passwordOutput.textContent);
    copyButton.firstChild.textContent = "Copied! ";
    copyButton.classList.add("is-copied");
    document.querySelector("#copy-status").textContent = "Password copied to clipboard.";

    copyTimer = setTimeout(() => {
      copyButton.firstChild.textContent = "Copy ";
      copyButton.classList.remove("is-copied");
      document.querySelector("#copy-status").textContent = "";
    }, 2200);
  } catch {
    document.querySelector("#copy-status").textContent =
      "Copy unavailable — select the password manually.";
  }
});

generatePassword();
