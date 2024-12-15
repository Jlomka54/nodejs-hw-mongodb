import { Router } from 'express';
import * as ContactsController from '../controllers/contacts.js';
import { ctrWrapper } from '../utils/ctrWrapper.js';

const router = Router();
router.get('/contacts', ctrWrapper(ContactsController.getContactsControler));
router.get(
  '/contacts/:contactId',
  ctrWrapper(ContactsController.getContactsByIdControler),
);
router.post(
  '/contacts',
  ctrWrapper(ContactsController.createContactController),
);
router.delete(
  '/contacts/:contactId',
  ctrWrapper(ContactsController.deleteContactController),
);

router.put(
  '/contacts/:contactId',
  ctrWrapper(ContactsController.upsertContactController),
);

router.patch(
  '/contacts/:contactId',
  ctrWrapper(ContactsController.patchContactController),
);
export default router;
