import { Permissions } from "@/core/constants/permissions";
import { databaseConnect } from "@/infra/database/connection";
import { permissionsTable } from "@/infra/database/schemas/rbac";

type PermissionNode = string | { [key: string]: PermissionNode };

function getAllSlugs(obj: PermissionNode): string[] {
	let slugs: string[] = [];

	if (typeof obj === "string") {
		return [obj];
	}

	for (const value of Object.values(obj)) {
		if (typeof value === "string") {
			slugs.push(value);
		} else if (typeof value === "object" && value !== null) {
			slugs = slugs.concat(getAllSlugs(value));
		}
	}

	return Array.from(new Set(slugs));
}

(async (): Promise<void> => {
	console.log("Starting Permissions Sync...");

	const db = await databaseConnect();

	try {
		const allSlugs = getAllSlugs(Permissions as unknown as PermissionNode);

		const rows = allSlugs.map((slug) => ({
			slug,
			description: `Auto-generated for ${slug}`,
		}));

		if (rows.length === 0) {
			console.log("No permissions found in constants.");
			process.exit(0);
		}

		const inserted = await db
			.insert(permissionsTable)
			.values(rows)
			.returning({ id: permissionsTable.id })
			.onConflictDoNothing({
				target: permissionsTable.slug,
			});

		console.log(`Synced permissions!`);
		console.log(`Total available in code: ${rows.length}`);
		console.log(`Newly inserted: ${inserted.length}`);

		process.exit(0);
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error("Error syncing permissions:", error.message);
		} else {
			console.error("Unknown error syncing permissions:", String(error));
		}
		process.exit(1);
	}
})();
