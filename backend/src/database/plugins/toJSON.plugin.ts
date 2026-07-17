import { Schema, Document } from "mongoose";

/**
 * A mongoose schema plugin which applies the following in the toJSON transform call:
 *  - removes __v, createdAt, updatedAt, and any path that has private: true
 *  - replaces _id with id
 */
export const toJSON = (schema: Schema) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let transform: any;
  if (schema.options.toJSON && schema.options.toJSON.transform) {
    transform = schema.options.toJSON.transform;
  }

  schema.options.toJSON = Object.assign(schema.options.toJSON || {}, {
    transform(doc: Document, ret: Record<string, unknown>, options: Record<string, unknown>) {
      Object.keys(schema.paths).forEach((path) => {
        if (schema.paths[path].options && schema.paths[path].options.private) {
          delete ret[path];
        }
      });

      if (ret._id) {
        ret.id = ret._id.toString();
        delete ret._id;
      }

      delete ret.__v;

      if (transform) {
        return transform(doc, ret, options);
      }
    },
  });
};
