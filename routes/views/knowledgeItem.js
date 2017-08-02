var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	//Jane notes - locals are the data coming from the browser in the request
	locals.section = 'knowledge';


	locals.filters = {
		knowledge: req.params.knowledge,
	};

	locals.data = {
		knowledges: [],
	};


	// Load the current knowledge item
	view.on('init', function (next) {

		var q = keystone.list('Knowledge').model.findOne({
			state: 'published',
			slug: locals.filters.knowledge,
		}).populate('author categories contentTypes');

		q.exec(function (err, result) {
			locals.data.knowledge = result;
			console.log("Locals", locals.data)

			locals.data.contentTypes = result.contentTypes.map(type => type.name).join(', ');

			// console.log("Second locals",locals.data);
			console.log("Content types",locals.data.contentTypes);
			// console.log("Other results", result.contentTypes[0].name);
			next(err);
		});

	});




	// Load other posts
	view.on('init', function (next) {

		var q = keystone.list('Knowledge').model.find().where('state', 'published').sort('-publishedDate').populate('author').limit('4');

		q.exec(function (err, results) {
			locals.data.knowledges = results;
			next(err);
		});

	});

	// Render the view
	view.render('knowledgeItem');
};
