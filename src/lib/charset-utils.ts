/* eslint-disable import/prefer-default-export */

const gsmReplacements = [
  ["‘", "'"],
  ["’", "'"],
  ["”", '"'],
  ["”", '"'],
  ["“", '"'],
  ["–", "-"]
];

export const replaceEasyGsmWins = (text: string) =>
  gsmReplacements.reduce(
    (acc, replacement) => acc.replace(replacement[0], replacement[1]),
    text
  );
