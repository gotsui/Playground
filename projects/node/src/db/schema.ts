import { boolean, jsonb, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";

const id = uuid("id").primaryKey().defaultRandom();
const createdAt = timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull();
const updatedAt = timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull();

export const forms = pgTable("forms", {
    id,
    name: text("name").notNull(),
    createdAt,
    updatedAt,
});

export const fields = pgTable("fields", {
    id,
    formId: uuid("form_id").references(() => forms.id).notNull(),
    name: text("name").notNull(),
    rect: jsonb("rect").notNull(),
    data: jsonb("data").notNull(),
    type: text("type").notNull(),
    createdAt,
    updatedAt,
}, (t) => [
    unique().on(t.formId, t.name),
]);
