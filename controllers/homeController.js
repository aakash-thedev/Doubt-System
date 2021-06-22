const Doubt = require('../models/doubt');

module.exports.home = function(req, res){
    return res.render('userSetup');
}

module.exports.ta = function(req, res){
    return res.render('ta');
}

module.exports.student = function(req, res){
    return res.render('student');
}

module.exports.dashBoard = function(req, res){
    return res.render('dashboard');
}

module.exports.studentHome = async function(req, res){

    // fetch all the doubts
    const doubts = await Doubt.find({}).sort('-createdAt').populate('user').populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    });
    // console.log(req.user);

    return res.render('studentHome', {
        user: req.user,
        doubts: doubts
    });
}

module.exports.taHome = async function(req, res){

    const pendingDoubts = await Doubt.find({isResolved: false}).sort('-createdAt');

    return res.render('taHome', {
        user: req.user,
        pendingDoubts: pendingDoubts
    });
}

module.exports.dedicated_doubt_page = async function(req, res) {

    try{

        const doubtId = req.query.pendingDoubtId;
        const taAcceptedId = req.query.taAcceptedId;

        const doubt = await Doubt.findById(doubtId).populate('user').populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        });

        doubt.acceptedBy.push(taAcceptedId);
        doubt.save();

        if(!doubt){
            return res.redirect('back');
        }

        return res.render('dedicatedDoubtPage', {
            user: req.user,
            doubt: doubt
        });
    }
    catch(err){
        return res.send("Internal Server Error");
    }
}