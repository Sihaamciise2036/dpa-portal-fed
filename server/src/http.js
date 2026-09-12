import { ObjectId } from 'mongodb';
import { z } from 'zod';

export class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
export const ok = (res, data = null, message = 'Success', status = 200) => res.status(status).json({ success: true, message, data });
export function id(value) {
  if (typeof value !== 'string' || !/^[a-f0-9]{24}$/i.test(value)) throw new HttpError(400, 'Invalid record ID.');
  return new ObjectId(value);
}
export function document(value) {
  if (!value) return null;
  const { _id, ...rest } = value;
  return { ...rest, _id: String(_id), id: String(_id) };
}
export const emailSchema = z.string().trim().toLowerCase().email().max(254);
export const passwordSchema = z.string().min(6).max(128);
export function cleanJson(value, depth = 0) {
  if (depth > 12) throw new HttpError(422, 'Form nesting is too deep.');
  if (value === null || typeof value === 'boolean') return value;
  if (typeof value === 'string') { if (value.length > 20000) throw new HttpError(422, 'A form value is too long.'); return value; }
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (Array.isArray(value)) { if (value.length > 200) throw new HttpError(422, 'Too many form values.'); return value.map(item => cleanJson(item, depth + 1)); }
  if (value && typeof value === 'object') {
    const result = {};
    for (const [key, item] of Object.entries(value)) {
      if (key.startsWith('$') || key.includes('.') || ['__proto__', 'constructor', 'prototype'].includes(key)) throw new HttpError(422, 'Invalid form field.');
      result[key] = cleanJson(item, depth + 1);
    }
    return result;
  }
  throw new HttpError(422, 'Invalid form value.');
}
export const pageSchema = z.object({ page: z.coerce.number().int().min(1).max(10000).default(1), limit: z.coerce.number().int().min(1).max(1000).default(10), search: z.string().trim().max(150).default('') });
export async function list(db, collection, req, res, filter, fields = ['title', 'contact.name', 'entityName']) {
  const { page, limit, search } = pageSchema.parse(req.body || {});
  const query = { ...filter };
  if (search) {
    const literal = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    query.$or = fields.map(field => ({ [field]: { $regex: literal, $options: 'i' } }));
  }
  const [rows, total] = await Promise.all([db.collection(collection).find(query).sort({ createdAt: -1, _id: -1 }).skip((page - 1) * limit).limit(limit).toArray(), db.collection(collection).countDocuments(query)]);
  return ok(res, { data: rows.map(document), total, page, limit });
}
