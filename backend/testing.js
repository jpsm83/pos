result = "Error: Contacte con el Administrador";

try {
	let group = permission !== "Maintenance" ? permission + "s" : permission;

	Users[username].workPhone = phone ? phone : null;
	Users[username].team = team ? team : null;
	Users[username].emailAddress = email ? email : null;
	Users[username].department = department ? department : null;
	Users[username].permissionType = group ? group : null;

	me.updateUserGroup({
		name: username /* STRING */ ,
		destiny: group /* STRING */
	});

	result = "OK: User " + username + " updated.";

} catch (error) {
	result = "Error: " + error;
}



// ==============================================================================



if (!email || !phone || !department || !permissionType) {
	result =
		"Los campos de email, mobile, departamento y permiso son obligatorios!";
} else if (!/^\S+@\S+\.\S+$/.test(email)) {
	result = "El formato de correo electrónico no es válido!";
} else if (
	permissionType != "Invitados" &&
	permissionType != "Mantenimiento" &&
	permissionType != "Administradores" &&
	permissionType != "Usuarios"
) {
	result = "El tipo de permiso no es válido";
} else {


	// Add user to group "Guests", "Maintenance", "Administrators", "Users"
	let permissionEnglish = {
		Invitados: "Guests",
		Mantenimiento: "Maintenance",
		Administradores: "Administrators",
		Usuarios: "Users",
	};

	let group = permissionEnglish[permissionType];

	Users[username].workPhone = phone;
	Users[username].team = team ? team : null;
	Users[username].emailAddress = email;
	Users[username].department = department;
	Users[username].permissionType = group;

	me.updateUserGroup({
		name: username /* STRING */ ,
		destiny: group /* STRING */
	});

	result = "Usuario " + username + " actualizado.";

}