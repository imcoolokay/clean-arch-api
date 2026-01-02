type Crud = "create" | "read" | "update" | "delete";

const createCrud = (resource: string): Record<Crud, string> => ({
	create: `${resource}:create`,
	read: `${resource}:read`,
	update: `${resource}:update`,
	delete: `${resource}:delete`,
});

/*const custom = (resource: string, actions: string[]) => {
	return actions.reduce(
		(acc, action) => {
			acc[action] = `${resource}:${action}`;
			return acc;
		},
		{} as Record<string, string>,
	);
};*/

export const Permissions = {
	users: createCrud("users"),
} as const;
