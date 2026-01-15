import {
    integer,
    jsonb,
    pgTable,
    text,
    timestamp,
    unique,
    uuid,
} from "drizzle-orm/pg-core";

import { users } from "./auth-schema";

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

export const approvalFlows = pgTable("approval_flows", {
    id,
    name: text("name").notNull(),
    createdAt,
    updatedAt,
});

export const approvalProcesses = pgTable("approval_processes", {
    id,
    approvalFlowId: uuid("approval_flow_id").references(() => approvalFlows.id).notNull(),
    name: text("name").notNull(),
    step: integer("step").notNull(),
    priority: integer("priority").notNull(),
    type: text("type").notNull(),
    createdAt,
    updatedAt,
});

export const requests = pgTable("requests", {
    id,
    userId: uuid("user_id").references(() => users.id).notNull(),
    approvalFlowId: uuid("approval_flow_id").references(() => approvalFlows.id).notNull(),
    createdAt,
    updatedAt,
});

export const requestFields = pgTable("request_fields", {
    id,
    requestId: uuid("request_id").references(() => requests.id).notNull(),
    fieldName: text("field_name").notNull(),
    fieldValue: text("field_value").notNull(),
    createdAt,
    updatedAt,
});

export const approvers = pgTable("approvers", {
    id,
    approvalProcessId: uuid("approval_process_id").references(() => approvalProcesses.id).notNull(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    createdAt,
    updatedAt,
});
