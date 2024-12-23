import { Router } from 'express';
import * as ContactsController from '../controllers/contacts.js';
import { ctrWrapper } from '../utils/ctrWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  contactsAddSchema,
  contactsUpdateSchema,
} from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = Router();
router.get('/contacts', ctrWrapper(ContactsController.getContactsControler));
router.get(
  '/contacts/:contactId',
  isValidId,
  ctrWrapper(ContactsController.getContactsByIdControler),
);
router.post(
  '/contacts',
  validateBody(contactsAddSchema),
  ctrWrapper(ContactsController.createContactController),
);
router.delete(
  '/contacts/:contactId',
  isValidId,
  ctrWrapper(ContactsController.deleteContactController),
);

router.put(
  '/contacts/:contactId',
  isValidId,
  validateBody(contactsAddSchema),

  ctrWrapper(ContactsController.upsertContactController),
);

router.patch(
  '/contacts/:contactId',
  isValidId,
  validateBody(contactsUpdateSchema),
  ctrWrapper(ContactsController.patchContactController),
);
export default router;
