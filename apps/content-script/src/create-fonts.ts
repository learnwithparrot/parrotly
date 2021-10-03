//https://stackoverflow.com/a/57623658/6441976

//Loads fonts from the fonts folder.
import browser from 'webextension-polyfill';

const fonts = [
  {
    'font-family': 'Line Awesome Brands',
    'font-style': 'normal',
    'font-weight': 400,
    'font-display': 'auto',
    'eot': browser.runtime.getURL('fonts/alegreya/la-brands-400.eot'),
    'woff2': browser.runtime.getURL('fonts/alegreya/la-brands-400.woff2'),
    'woff': browser.runtime.getURL('fonts/alegreya/la-brands-400.woff'),
    'ttf': browser.runtime.getURL('fonts/alegreya/la-brands-400.ttf'),
    'svg': browser.runtime.getURL('fonts/alegreya/la-brands-400.svg'),
  },
  {
    'font-family': 'Line Awesome Free',
    'font-style': 'normal',
    'font-weight': 400,
    'font-display': 'auto',
    'eot': browser.runtime.getURL('fonts/alegreya/la-regular-400.eot'),
    'woff2': browser.runtime.getURL('fonts/alegreya/la-regular-400.woff2'),
    'woff': browser.runtime.getURL('fonts/alegreya/la-regular-400.woff'),
    'ttf': browser.runtime.getURL('fonts/alegreya/la-regular-400.ttf'),
    'svg': browser.runtime.getURL('fonts/alegreya/la-regular-400.svg'),
  },
  {
    'font-family': 'Line Awesome Free',
    'font-style': 'normal',
    'font-weight': 900,
    'font-display': 'auto',
    'eot': browser.runtime.getURL('fonts/alegreya/la-solid-900.eot'),
    'woff2': browser.runtime.getURL('fonts/alegreya/la-solid-900.woff2'),
    'woff': browser.runtime.getURL('fonts/alegreya/la-solid-900.woff'),
    'ttf': browser.runtime.getURL('fonts/alegreya/la-solid-900.ttf'),
    'svg': browser.runtime.getURL('fonts/alegreya/la-solid-900.svg'),
  },
]

export function createFonts() {
  const fontStyle = document.createElement("style");
  fontStyle.id = "fontStyle8730011";
  fontStyle.innerHTML = fonts.map(font => {
    return `
      @font-face{
        font-family: ${font['font-family']};
        font-style: ${font['font-style']};
        font-weight: ${font['font-weight']};
        font-display: ${font['font-display']};
        src: url(${font.eot});
        src: url(${font.eot}?#iefix) format('embedded-opentype'),
        url(${font.woff2}) format('woff2'),
        url(${font.woff}) format('woff'),
        url(${font.ttf}) format('truetype'),
        url(${font.svg}#lineawesome) format('svg');
      }
    `;
  }).join(`
  `);
  document.head.appendChild(fontStyle);

}
