import 'dotenv/config';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { linksTable } from './db/schema';

import { eq } from 'drizzle-orm'

const db = drizzle(process.env.DB_FILE_NAME!);

export async function createShortLink(url: string | URL, slug?: string, name?: string, description?: string) {
    if (!slug) {
        slug = crypto.randomUUID().split("-")[0];
    }
    if (url instanceof URL) {
        url = url.toString()
    }

    const link: typeof linksTable.$inferInsert = {
        url: url,
        slug: slug,

        name: name,
        description: description,
    }
    try {
        const newLink = await db.insert(linksTable).values(link);
        console.log("New link created!", newLink)
        return { success: true, data: newLink}
    }
    catch (error: any) {
        console.error("FUCK: ", error) 
        return { success: false, error}
    }
}

export async function getLinkFromSlug(slug: string) {
    const link = await db.select().from(linksTable).where(eq(linksTable.slug, slug));
    if (!link ) {
        console.error(`Slug ${slug} does not exist`)
        return null;
    } else {
        console.log(link)
        return link[0];
    }
}

export async function getURLFromSlug(slug: string) {
    const url = await db.select({ url: linksTable.url}).from(linksTable).where(eq(linksTable.slug, slug));
    if (!url ) {
        console.error(`Slug ${slug} does not exist`)
        return null;
    } else {
        console.log(url)
        return url[0];
    }
}