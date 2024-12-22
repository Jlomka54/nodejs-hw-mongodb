const parseNumber = (number, numberDefault) => {
  if (typeof number !== 'string') return numberDefault;
  const parsedNumber = parseInt(number);
  if (Number.isNaN(parsedNumber)) return numberDefault;
  return parsedNumber;
};

export const parsePaginationParams = ({ page, perPage }) => {
  const parsedPage = parseNumber(page, 1);
  const parsedPerPage = parseNumber(perPage, 10);
  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
};
