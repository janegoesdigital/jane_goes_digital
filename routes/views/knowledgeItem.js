var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
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
		}).populate('author categories');

		q.exec(function (err, result) {
			locals.data.knowledge = result;
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
