-- Insert table

INSERT INTO "Role"
(id, "roleId", "name", "permissionIds", "permissionEntities", "isDefault", "isActive", "createdAt", "updatedAt")
VALUES(nextval('"Role_id_seq"'::regclass), 'INTERIOR_DESIGNER', 'Interior Designer', '{TASKS,READ_PROJECTS}', '{}', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);