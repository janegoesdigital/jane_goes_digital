var keystone = require('keystone');

/**
 * Content Type Category Model
 * ==================
 */

var TypeCategory = new keystone.List('TypeCategory', {
	autokey: { from: 'name', path: 'key', unique: true },
});

TypeCategory.add({
	name: { type: String, required: true },
});

TypeCategory.relationship({ ref: 'Knowledge', path: 'types' });

TypeCategory.register();
