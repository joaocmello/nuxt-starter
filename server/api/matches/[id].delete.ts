import { eq } from 'drizzle-orm';
import { db } from '../../utils/db';
import { matches } from '../../utils/schema';

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id');

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ID is required',
        });
    }

    await db.delete(matches).where(eq(matches.id, id));

    return { success: true };
});
