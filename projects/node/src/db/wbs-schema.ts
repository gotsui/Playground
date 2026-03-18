import {
    AnyPgColumn,
    check,
    doublePrecision,
    foreignKey,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { users } from "./auth-schema";

const id = uuid("id").primaryKey().defaultRandom();
const createdAt = timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull();
const createdBy = uuid("createdBy").references(() => users.id).notNull();

export const wbsTasks = pgTable("wbs_tasks", {
    id,
    createdAt,
    createdBy,
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    deletedBy: uuid("deletedBy").references(() => users.id),
}, (table) => [
    check(
        "deleted_check",
        sql`(${table.deletedAt} IS NULL AND ${table.deletedBy} IS NULL) OR (${table.deletedAt} IS NOT NULL AND ${table.deletedBy} IS NOT NULL)`,
    ),
]);

export const wbsTaskHistories = pgTable("wbs_task_histories", {
    id,
    taskId: uuid("task_id").references(() => wbsTasks.id).notNull(),
    parentId: uuid("parent_id").references((): AnyPgColumn => wbsTaskHistories.id),
    logicalId: uuid("logical_id").notNull(),
    logicalParentId: uuid("logical_parent_id"),
    name: text("name").notNull(),
    assignee: text("assignee"),
    status: text("status").notNull(),
    plannedEffort: doublePrecision("planned_effort").notNull(),
    buffer: doublePrecision("buffer").notNull(),
    actualEffort: doublePrecision("actual_effort").notNull(),
    notes: text("notes"),
    createdAt,
    createdBy,
}, (table) => [
    foreignKey({
        columns: [table.parentId],
        foreignColumns: [table.id],
    }),
]);
