import { contactsType } from '../../constants/contacts.js';

export const ParseContactsFiltersParams = ({ type, isFavourite }) => {
  const parsedType = contactsType.includes(type) ? type : undefined;

  return {
    type: parsedType,
    isFavourite,
  };
};
