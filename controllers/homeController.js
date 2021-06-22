const Doubt = require('../models/doubt');

module.exports.home = function(req, res){

    if(req.isAuthenticated()){
        if(req.user.userType == 'ta'){
            return res.redirect('/ta/home');
        }
        else{
            return res.redirect('/student/home');
        }
    }
    return res.render('userSetup');
}

module.exports.ta = function(req, res){

    if(req.isAuthenticated()){
        if(req.user.userType == 'ta'){
            return res.redirect('/ta/home');
        }
    }

    return res.render('ta');
}

module.exports.student = function(req, res){

    if(req.isAuthenticated()){

        if(req.user.userType == 'student'){
            return res.redirect('/student/home');
        }
    }

    return res.render('student');
}

module.exports.dashBoard = function(req, res){
    return res.render('dashboard');
}

module.exports.studentHome = async function(req, res){

    if(req.user.userType != 'student'){
        return res.redirect('back');
    }

    // fetch all the doubts
    const doubts = await Doubt.find({}).sort('-createdAt').populate('user').populate('resolvedBy').populate({
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

    if(req.user.userType != 'ta'){
        return res.redirect('back');
    }

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

        // not everytime same doubt could be accepted by same user again and again so thats why
        const id = doubt.acceptedBy.find((id) => {return id == taAcceptedId});
        
        if(id == undefined){
            doubt.acceptedBy.push(taAcceptedId);
            doubt.save();
        }

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