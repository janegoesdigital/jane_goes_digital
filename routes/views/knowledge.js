var keystone = require('keystone');
var async = require('async');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// console.log("Locals from knowledge.js:", locals);

	// Init locals - these are the bits which come from browser - the data sent by the browser

	locals.section = 'knowledge';

	// console.log("Locals.section", locals.section);


	// console.log("Second log of locals", locals);

	locals.filters = {
		category: req.params.category,
	};

// console.log("locals filters is ", locals.filters)

// console.log("Third log of locals adding Locals. filters", locals);

	locals.data = {
		knowledges: [],
		categories: [],
		types: [],
	};

	// console.log("Fourth log of Locals:", locals);

	// Load all categories
	view.on('init', function (next) {
		keystone.list('PostCategory')
			.model
			.find()
			.sort('name')
			.exec(function (err, results) {
				if (err || !results.length) {
					return next(err);
				}
				locals.data.categories = results;

				console.log("Results", results);
				console.log("Locals.data", locals.data);



			// Load the counts for each category
				async.each(locals.data.categories, function (category, next) {
					keystone
					.list('Knowledge')
					.model.count()
					.where('categories')
					.in([category.id])
					.exec(function (err, count) {
						category.postCount = count;
						next(err);
				});

			}, function (err) {
				next(err);
			});
		});
	});

	// Load the current category filter
	view.on('init', function (next) {

		if (req.params.category) {
			keystone.list('PostCategory')
				.model.findOne({ key: locals.filters.category })
				.exec(function (err, result) {
					locals.data.category = result;
					next(err);
					});
				} else {
					next();
		}
	});

	// Load the posts
	view.on('init', function (next) {

		var q = keystone.list('Knowledge')
			.paginate({
				page: req.query.page || 1,
				perPage: 10,
				maxPages: 10,
				filters: {
					state: 'published',
				},
			})
			.sort('-contentTypes')
			.populate('author categories contentTypes');

			if (locals.data.category) {
				q.where('categories').in([locals.data.category]);
				}
			q.exec(function (err, results) {
				locals.data.knowledges = results;
				next(err);
			});
		// console.log("This is q:",q);
		});

	view.on('init', (next) => {
		if (req.params.type) {
			keystone
				.list('TypeCategory')
				.model
				.findOne({ key: locals.filters.type })
				.exec((err, result) => {
					locals.data.type = result;
					next(err);
				});
		} else {
			next();
		}
	// console.log("Last locals.data", locals.data.results);
	})


	// Render the view
	view.render('knowledge');
};
