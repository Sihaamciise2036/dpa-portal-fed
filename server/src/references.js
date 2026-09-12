import { Router } from 'express';
import { z } from 'zod';
import { document, HttpError, id, list, ok } from './http.js';

const settingKeys = ['dpo_fees', 'data_controller_fees', 'data_processor_fees', 'data_controller_and_processor_fees',
  'notification_fcm_project_id', 'notification_firebase_api_key', 'notification_firebase_auth_domain', 'notification_firebase_storage_bucket',
  'notification_firebase_messaging_sender_id', 'notification_firebase_app_id', 'notification_firebase_measurement_id', 'notification_firebase_vapid_key'];
export function publicRoutes({ db }) {
  const router = Router();
  router.post('/user/setting/data', async (req, res) => {
    const settings = await db.collection('settings').find({ key: { $in: settingKeys } }).toArray();
    return ok(res, Object.fromEntries(settings.map(item => [item.key, item.value])));
  });
  router.post('/viewer/data/controller', async (req, res) => {
    const { search = '' } = z.object({ search: z.string().trim().max(100).optional() }).parse(req.body || {});
    // Exact certificate number lookup prevents bulk disclosure of registrants.
    const rows = search ? await db.collection('certificates').find({ certificateNumber: search, published: true, status: 4 }, { projection: { certificateNumber: 1, contact: 1, status: 1, licenseDate: 1, dpaLicenceNumber: 1 } }).limit(10).toArray() : [];
    return ok(res, { data: rows.map(document), total: rows.length });
  });
  for (const name of ['breach', 'complaint']) router.post(`/viewer/data/${name}`, () => { throw new HttpError(403, 'These records are private. Sign in to view your submissions.'); });
  return router;
}
export function referenceRoutes({ db }) {
  const router = Router();
  for (const [route, collection] of [['category', 'categories'], ['size', 'sizes']]) {
    router.get(`/${route}/active`, async (req, res) => ok(res, (await db.collection(collection).find({ active: true }).sort({ order: 1 }).limit(100).toArray()).map(document)));
  }
  router.post('/sector-classification/data', (req, res) => {
    const filters = z.object({ category_id: z.string().max(24).optional(), size_id: z.string().max(24).optional() }).parse(req.body?.extra_filter || {});
    return list(db, 'sectors', req, res, { active: true, ...filters }, ['sector_id.name']);
  });
  router.post('/faq/list', (req, res) => list(db, 'faqs', req, res, { active: true }, ['question', 'answer']));
  router.post('/data/dpo', (req, res) => list(db, 'staff_directory', req, res, { active: true, published: true, type: 'dpo' }, ['organisationName']));
  router.post('/data/dpo/ids', async (req, res) => {
    const { ids } = z.object({ ids: z.array(z.string()).max(100) }).parse(req.body);
    return ok(res, (await db.collection('staff_directory').find({ _id: { $in: ids.map(id) }, active: true, published: true, type: 'dpo' }).toArray()).map(document));
  });
  router.get('/payment-method/list', (req, res) => ok(res, []));
  router.post('/payment-method/:provider', () => { throw new HttpError(503, 'Payment processing is not configured. Your application remains saved as a draft.'); });
  router.post('/data/controller/initiate-compliance-payment/:id', () => { throw new HttpError(503, 'Compliance payments are not configured.'); });
  return router;
}
