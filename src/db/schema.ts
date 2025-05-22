import { int, sqliteTable, text} from 'drizzle-orm/sqlite-core'

export const linksTable = sqliteTable("links_table", {
    id: int().primaryKey({autoIncrement: true}),
    slug: text().notNull().unique(),
    url: text().notNull(),

    name: text(),
    description: text()
})