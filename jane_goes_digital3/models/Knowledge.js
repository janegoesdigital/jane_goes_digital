var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Knowledge Bank Model
 * ==========
 */

var Knowledge = new keystone.List('Knowledge', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
});

Knowledge.add({
	title: { type: String, required: true },
	link: { type: Types.Url},
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	contributor: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	categories: { type: Types.Relationship, ref: 'PostCategory', many: true },
	//Set of categories for the type of content it might be.
	contentTypes: { type: Types.Relationship, ref: 'TypeCategory', many: true },

	// contentType: {type: Types.Select, options: 'cool tool, good blog, interesting article, interesting news', index: true},
	content: {
		description: { type: Types.Html, wysiwyg: true, height: 150 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 },
	},
	//I want to use the same set of topic categories as I use for posts - so that on the bottom of a post page I can link automatically to any resources I have on the topic

});

Knowledge.schema.virtual('content.full').get(function () {
	return this.content.description || this.content.extended;
});

Knowledge.defaultColumns = 'title, status|20%,link|20%, content.description|20%, categories|20%';

Knowledge.register();
