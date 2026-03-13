import {
    AnyPgColumn,
    doublePrecision,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";

const id = uuid("id").primaryKey().defaultRandom();
const createdAt = timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull();
const updatedAt = timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull();

export const wbs = pgTable("wbs", {
    id,
    name: text("name").notNull(),
    createdAt,
    updatedAt,
});

// 隣接リストモデル
export const wbsTasks = pgTable("wbs_tasks", {
    id,
    wbsId: uuid("wbs_id").references(() => wbs.id).notNull(),
    parentId: uuid("parent_id").references((): AnyPgColumn => wbsTasks.id),
    name: text("name").notNull(),
    assignee: text("assignee"),
    status: text("status").notNull(),
    effort: doublePrecision("effort").notNull(),
    buffer: doublePrecision("buffer").notNull(),
    notes: text("notes"),
    createdAt,
    updatedAt,
});
