import { Router } from 'express';
import { z } from 'zod';
import { cleanJson, document, HttpError, id, list, ok } from './http.js';

const controllerFields = 'categoriesSensitive categorySubject companyType contact dataAuthorizations dataControllers dataCountry dataProcessors dataRepresentatives dataSubjects dataTransferOutsideCountry dpoId employeeInvolved entityType groundData levelType numberOfEmployee organizationType organizationalMeasures personalBio personalData personalLogo purposeOfDataProcessing rcNumber revenue riskLevel sesitivePersonalData technicalMeasures termsConditionRead formStepComplete'.split(' ');
const breachFields = 'entityType entityName entitySector licenseNumber contact dpo breachDetails discoveryMethod declaration declarationSignature contractFile'.split(' ');
const complaintFields = 'organizationType companyType complainantDetails legalRepresentative declaration complaint attemptedContact correspondenceEvidence organizationSpecify mandatedPerson consentGiven organizationDetails complaintDetails caseTracking signature'.split(' ');
function payload(body, fields) {
  const value = cleanJson(z.record(z.string(), z.unknown()).parse(body));
  return Object.fromEntries(fields.filter(key => value[key] !== undefined).map(key => [key, value[key]]));
}
async function owned(db, collection, recordId, userId) {
  const result = await db.collection(collection).findOne({ _id: id(recordId), userId });
  if (!result) throw new HttpError(404, 'Record not found.');
  return result;
}
export function recordRoutes({ db }) {
  const router = Router();
  router.get('/data/controller/status', async (req, res) => ok(res, document(await db.collection('controllers').findOne({ userId: req.userId, status: 7 }, { sort: { updatedAt: -1 } }))));

  for (const [route, collection, fields] of [['controller', 'controllers', controllerFields], ['breach', 'breaches', breachFields], ['complaint', 'complaints', complaintFields]]) {
    router.post(`/data/${route}`, (req, res) => list(db, collection, req, res, { userId: req.userId }));
    router.get(`/data/${route}/:id`, async (req, res) => ok(res, document(await owned(db, collection, req.params.id, req.userId))));
    router.post(`/data/${route}/add`, async (req, res) => {
      const data = payload(req.body, fields);
      if (route === 'controller') {
        z.object({ contact: z.object({ name: z.string().trim().min(2).max(200) }), formStepComplete: z.coerce.number().int().min(1).max(9).optional() }).parse(data);
      } else if (route === 'breach') {
        z.object({ entityName: z.string().trim().min(2).max(200), contact: z.object({ email: z.string().email() }) }).parse(data);
      } else {
        z.object({ complainantDetails: z.object({ name: z.string().trim().min(2).max(200), email: z.string().email() }) }).parse(data);
      }
      const record = { ...data, userId: req.userId, status: route === 'controller' ? 7 : 1, payment_status: 1,
        registrationFee: route === 'controller' ? null : 0, createdAt: new Date(), updatedAt: new Date(), formDate: new Date() };
      const result = await db.collection(collection).insertOne(record);
      return ok(res, document({ ...record, _id: result.insertedId }), route === 'controller' ? 'Application draft saved.' : 'Record submitted.', 201);
    });
    if (route === 'controller') router.put('/data/controller/:id', async (req, res) => {
      const existing = await owned(db, collection, req.params.id, req.userId);
      if (existing.status !== 7) throw new HttpError(409, 'Only draft applications can be edited.');
      const data = payload(req.body, fields);
      if (data.contact) z.object({ name: z.string().trim().min(2).max(200) }).parse(data.contact);
      if (data.formStepComplete !== undefined) data.formStepComplete = z.coerce.number().int().min(1).max(9).parse(data.formStepComplete);
      const updated = await db.collection(collection).findOneAndUpdate({ _id: existing._id, userId: req.userId, status: 7 }, { $set: { ...data, updatedAt: new Date() } }, { returnDocument: 'after' });
      if (!updated) throw new HttpError(409, 'Application changed. Reload and try again.');
      return ok(res, document(updated), 'Application draft saved.');
    });
  }

  router.post('/support-ticket/list', (req, res) => list(db, 'support_tickets', req, res, { userId: req.userId }, ['title', 'description']));
  const ticketSchema = z.object({ title: z.string().trim().min(2).max(200), description: z.string().trim().min(5).max(20000), uploadFile: z.string().max(150).optional() });
  router.post('/support-ticket/add', async (req, res) => {
    const data = ticketSchema.parse(req.body);
    const record = { ...data, userId: req.userId, status: 1, createdAt: new Date(), updatedAt: new Date() };
    const result = await db.collection('support_tickets').insertOne(record);
    return ok(res, document({ ...record, _id: result.insertedId }), 'Enquiry created.', 201);
  });
  router.get('/support-ticket/chat/:id', async (req, res) => {
    await owned(db, 'support_tickets', req.params.id, req.userId);
    const rows = await db.collection('ticket_messages').find({ supportTicketId: req.params.id, userId: req.userId }).sort({ createdAt: 1 }).limit(500).toArray();
    return ok(res, rows.map(document));
  });
  router.post('/support-ticket/chat', async (req, res) => {
    const data = z.object({ supportTicketId: z.string(), message: z.string().trim().min(1).max(10000), uploadFile: z.string().max(150).optional() }).parse(req.body);
    await owned(db, 'support_tickets', data.supportTicketId, req.userId);
    const record = { ...data, userId: req.userId, senderId: req.userId, senderType: 1, receiverType: 2, createdAt: new Date() };
    const result = await db.collection('ticket_messages').insertOne(record);
    return ok(res, document({ ...record, _id: result.insertedId }), 'Message saved.', 201);
  });
  router.get('/support-ticket/:id', async (req, res) => ok(res, document(await owned(db, 'support_tickets', req.params.id, req.userId))));
  router.put('/support-ticket/:id', async (req, res) => {
    const existing = await owned(db, 'support_tickets', req.params.id, req.userId);
    const data = ticketSchema.partial().parse(req.body);
    const updated = await db.collection('support_tickets').findOneAndUpdate({ _id: existing._id, userId: req.userId }, { $set: { ...data, updatedAt: new Date() } }, { returnDocument: 'after' });
    return ok(res, document(updated), 'Enquiry updated.');
  });
  router.post('/transaction/data', (req, res) => list(db, 'transactions', req, res, { userId: req.userId }, ['reference', 'transactionId']));
  router.get('/transaction/:id', async (req, res) => ok(res, document(await owned(db, 'transactions', req.params.id, req.userId))));
  router.put('/transaction/:id', () => { throw new HttpError(403, 'Transactions can only be updated by a verified payment provider.'); });
  router.get('/data/certificate/:id', async (req, res) => ok(res, document(await owned(db, 'certificates', req.params.id, req.userId))));
  router.post('/data/form-reply/get', async (req, res) => {
    const rows = await db.collection('form_replies').find({ userId: req.userId }).sort({ createdAt: 1 }).limit(100).toArray();
    return ok(res, rows.map(document));
  });
  router.post('/data/form-reply/type/get', (req, res) => list(db, 'form_replies', req, res, { userId: req.userId }, ['message']));
  return router;
}
