import { render } from "https://cdn.skypack.dev/react-dom@17";
import { useForm } from "https://cdn.skypack.dev/react-hook-form@7";
import useCopyToClipboard from "https://cdn.skypack.dev/react-use@17/esm/useCopyToClipboard";
import useLocalStorage from "https://cdn.skypack.dev/react-use@17/esm/useLocalStorage";
import React, { useState } from "https://cdn.skypack.dev/react@17";

function randomInteger(max, min = 0) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const lowercase = "abcdefghijklmnopqrstuvwxyz";
const numbers = "0123456789";
const symbols = '!@#$%^&*()+_-=}{[]|:;"/?.><,`~';
const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const similarCharacters = /[lI|O0|5S]/g;

function generatePassword(options) {
  const defaults = {
    length: 10,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    includeUppercase: true,
    excludeSimilarCharacters: true
  };

  const {
    length,
    includeLowercase,
    includeNumbers,
    includeSymbols,
    includeUppercase,
    excludeSimilarCharacters
  } = Object.assign({}, defaults, options);

  let characters = "";

  if (includeLowercase) {
    characters += lowercase;
  }

  if (includeNumbers) {
    characters += numbers;
  }

  if (includeSymbols) {
    characters += symbols;
  }

  if (includeUppercase) {
    characters += uppercase;
  }

  if (excludeSimilarCharacters) {
    characters = characters.replace(similarCharacters, "");
  }

  let password = "";

  for (let i = 0; i < length; i += 1) {
    const character = characters[randomInteger(characters.length - 1)];

    password += character;
  }

  return password;
}

// https://iconmonstr.com/clipboard-4-svg/
function IconClipboard(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M16 10c3.469 0 2 4 2 4s4-1.594 4 2v6h-10v-12h4zm.827-2h-6.827v16h14v-8.842c0-2.392-4.011-7.158-7.173-7.158zm-8.827 12h-6v-16h4l2.102 2h3.898l2-2h4v2.145c.656.143 1.327.391 2 .754v-4.899h-3c-1.229 0-2.18-1.084-3-2h-8c-.82.916-1.771 2-3 2h-3v20h8v-2zm2-18c.553 0 1 .448 1 1s-.447 1-1 1-1-.448-1-1 .447-1 1-1zm4 18h6v-1h-6v1zm0-2h6v-1h-6v1zm0-2h6v-1h-6v1z" />
    </svg>
  );
}

function App() {
  const defaultSettings = {
    length: 12,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    includeUppercase: true,
    excludeSimilarCharacters: true
  };
  const [settings, setSettings] = useLocalStorage(
    "settings",
    JSON.stringify(defaultSettings)
  );
  const defaultValues = JSON.parse(settings);
  const [password, setPassword] = useState(generatePassword(defaultValues));
  const [_state, copyToClipboard] = useCopyToClipboard();
  const { register, handleSubmit, watch } = useForm({
    defaultValues
  });

  function onSubmit(data) {
    const password = generatePassword(data);

    setSettings(JSON.stringify(data));
    setPassword(password);
  }

  return (
    <div className="app">
      <div className="grid">
        <h1>INS PassGenerate</h1>
        <div className="output">
          <output>{password}</output>
          <button className="button" onClick={() => copyToClipboard(password)}>
            <IconClipboard />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <fieldset className="form__fieldset">
            <legend className="form__legend"></legend>
            <div className="form__field">
              <label htmlFor="length">Panjang</label>
              <input
                className="form__input form__input--range"
                id="length"
                type="range"
                min="6"
                max="32"
                step="1"
                {...register("length", {
                  valueAsNumber: true
                })}
              />
              <span>{watch("length")}</span>
            </div>
          </fieldset>

          <fieldset className="form__fieldset">
            <legend className="form__legend">Pengaturan</legend>

            <div className="form__field">
              <label htmlFor="includeLowercase">Sertakan huruf kecil</label>
              <input
                className="form__input form__input--checkbox"
                id="includeLowercase"
                type="checkbox"
                {...register("includeLowercase")}
              />
            </div>

            <div className="form__field">
              <label htmlFor="includeUppercase">Sertakan huruf besar</label>
              <input
                className="form__input form__input--checkbox"
                type="checkbox"
                id="includeUppercase"
                {...register("includeUppercase")}
              />
            </div>

            <div className="form__field">
              <label htmlFor="includeNumbers">Sertakan angka</label>
              <input
                className="form__input form__input--checkbox"
                id="includeNumbers"
                type="checkbox"
                {...register("includeNumbers")}
              />
            </div>

            <div className="form__field">
              <label htmlFor="includeSymbols">Sertakan simbol</label>
              <input
                className="form__input form__input--checkbox"
                id="includeSymbols"
                type="checkbox"
                {...register("includeSymbols")}
              />
            </div>

            <div className="form__field">
              <label htmlFor="excludeSimilarCharacters">
                Kecualikan karakter serupa
              </label>
              <input
                className="form__input form__input--checkbox"
                id="excludeSimilarCharacters"
                type="checkbox"
                {...register("excludeSimilarCharacters")}
              />
            </div>
          </fieldset>
          <button
            className="button button--large button--rounded"
            type="submit"
          >
            Buat Password
          </button>
        </form>
      </div>
    </div>
  );
}

render(<App />, document.getElementById("root"));
