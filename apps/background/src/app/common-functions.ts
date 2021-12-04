import type { Language } from "@parrotly.io/constants";
import { pluck, map, first, filter } from "rxjs/operators";
import { userAndSettings$ } from './firebase';

/**
 * Function that transfer text to speech.
 *
 * @param {string} word Word to transfer
 * @param {string} language Language to transfer
 */
export function playWord(word: string, language: Language) {
  //noinspection JSUnresolvedFunction
  const audio = new Audio(
    `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${language}&q=${encodeURIComponent(word)}`
  );
  audio.play();
}

/**
* Translate word from one language to another.
*
* @param {string} from: Language
* @param {string} to: Language
* @param {string} text Word to translate
* @param {function} after Function that will be executed after translation is fetched
*/
export function translate(from: Language, to: Language, text, after) {
  // text.toLowerCase() gives more variants of result in some cases.
  const googleTranslator = "https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&dt=bd&hl=" +
    encodeURIComponent(from) + "&sl=" + encodeURIComponent(from) + "&tl=" +
    encodeURIComponent(to) + "&q=" + encodeURIComponent(text.toLowerCase());
  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    let result;
    let translation;
    let alternative;
    const alternatives = [];

    if (this.readyState === 4) {
      if (this.status === 200) {
        text = text.trim();

        if (text !== "") {
          result = JSON.parse(xhr.responseText);
          translation = result[0][0][0];
          translation = translation.charAt(0).toUpperCase() + translation.slice(1);

          // Save alternatives for future functionality.
          if (result[1] != null) {
            for (let i = 0; i < result[1].length; i++) {
              alternative = {};

              // Capitalize first letter in each alternative word.
              result[1][i][1].forEach(function (part, index, array) {
                array[index] = array[index].charAt(0).toUpperCase() + array[index].slice(1);
              });
              alternative[result[1][i][0]] = result[1][i][1];
              alternatives.push(alternative);
            }
          }
          after({
            translation: translation,
            alternatives: alternatives,
            isTranslated: translation.toLowerCase() !== text.toLowerCase()
          });
        } else {
          after({
            translation: "",
            alternatives: null,
            isTranslated: true
          });
        }
      }
    }
  };
  xhr.open("GET", googleTranslator, true);
  xhr.send();
}


export async function getCurrentTheme() {
  return userAndSettings$.pipe(
    map(([user, settings]) => settings.theme),
    filter(theme => Boolean(theme)),
    map((theme) => theme === 'dark'),
    first(),
  ).toPromise()
}

