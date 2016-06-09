var User = require('../schemas/user')
var Zone = require('../schemas/zone')
var multer = require('multer');

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'public/uploads');
	},
	// 添加后缀名
	filename: function (req, file, cb) {
		var _suffix = file.originalname.split('.');
		cb(null, file.fieldname + '_' + Date.now() + '.' + _suffix[_suffix.length-1]);
	}
})
var upload = multer({storage: storage});





exports.showLogin = function(req, res){
	res.render('admin/login', {
		title: 'Kinms后台管理'
	})
}

exports.login = function(req, res) {
	if( req.body.username && req.body.password ){

		var _username = req.body.username;
		var _password = req.body.password;
		
		var _user = User.findOne({
			where: {
				'username': _username
			}
		}).then(function(project){
			if( !project ){
				console.log('没有该用户')
				res.redirect('/admin/login')
				return;
			} else {
				if( _password == project.dataValues.password ){
					res.redirect('/admin/index');
					return;
				} else {
					res.redirect('/admin/login')
					return;
				}
			}
		})
	} else {
		res.redirect('/admin/login')
	}
}

exports.showIndex = function(req, res){
	res.render('admin/index', {
		title: 'Kinms后台管理'
	})
}

exports.showListZone = function(req, res){

	Zone.findAll({}).then(function(project){
		// console.log(project)
		res.render('admin/listZone', {
			title: 'Kinms后台管理',
			zones: project
		})
		return project;
	});
	
}

exports.showAddZone = function(req, res) {
	res.render('admin/addZone', {
		title: 'Kinms后台管理'
	})
}


exports.uploadZoneFileList = upload.fields([{
										name: 'uploadLittleimg',
										maxCount: 1
									}, {
										name: 'uploadImg',
										maxCount: 1
									}, {
										name: 'uploadVoice',
										maxCount: 1
									}]);

exports.uploadZoneFile = function(req, res, next){

	var _uploadLittleimg = req.files.uploadLittleimg;
	var _uploadImg = req.files.uploadImg;
	var _uploadVoice = req.files.uploadVoice;

	if(_uploadLittleimg) req.body.littleimg = "/uploads/" + _uploadLittleimg[0].filename;
	if(_uploadImg) req.body.img = "/uploads/" + _uploadImg[0].filename;
	if(_uploadVoice) req.body.voice = "/uploads/" + _uploadVoice[0].filename;
	next();

}

exports.addZone = function(req, res){
	console.log(req.body.title)
	var project = Zone.build({
		littleimg: req.body.littleimg,
		title: req.body.title,
		pinyintitle: req.body.pinyintitle,
		img: req.body.img,
		voice: req.body.voice,
		intro: req.body.intro,
		type: req.body.type,
		opentime: req.body.opentime,
		address: req.body.address,
		phone: req.body.phone,
		route: req.body.route
	})
	project.save().then(function(project){
		if(project){
			console.log('插入成功');
			res.redirect('/admin/addZone');
			return;
		} else {
			console.log('插入失败')
			return;
		}
	})
}

// 修改
exports.updateZone = function(req, res){
	
	var _id = req.params.id;

	Zone.findById(_id).then(function(project){
		if(project){

			res.render('admin/addZone', {
				title: 'Kinms后台管理',
				zone: project
			})
		}
	})

	
}

// 删除
exports.removeZone = function(req, res){
	// console.log('执行删除' + req.params.id)

	Zone.destroy({where: {id: req.params.id}}).then(function(project){
		if(project){
			res.redirect('/admin/listZone')
		}
		return;
	})
	

}