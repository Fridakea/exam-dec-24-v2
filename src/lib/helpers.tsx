import { apiBaseUrl } from "./api";

export const clamp = (min: number, num: number, max: number) => {
  return Math.max(min, Math.min(num, max));
};

export const findBandImage = (logo: string): string => {
  return logo.includes("https") ? logo : `${apiBaseUrl}/logos/${logo}`;
};

// How to regex in javascript source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test
export const MyRegexes = {
  onlyText: new RegExp("^[A-Za-zæøåÆØÅ\\s]*$"), // lowercase and uppercase letters including spaces and æ,ø,å allowed.
  onlyNumber: new RegExp("^[\\d+\\s]+$"),
};
