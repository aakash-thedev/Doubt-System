const Doubt = require('../models/doubt');
const TaReportsLog = require('../models/taReportsLog');
// ------ Default Home Page Rendering with 'logged in already' kind of edge cases -----------//

module.exports.home = function(req, res){

    try{

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

    catch(err){

        console.log("Error", err);
        return res.send("<h1> Internal Server Error </h1>");
    }
}

// ----- TA's Login Page Rendering with all the edge cases covered --------- //

module.exports.ta = function(req, res){

    try{

        if(req.isAuthenticated()){

            if(req.user.userType == 'ta'){

                return res.redirect('/ta/home');
            }
        }
    
        return res.render('ta');
    }

    catch(err){
        console.log("Err", err);
        return res.send("<h1> Internal Server Error </h1>");
    }
}

// -------- Rendering Student's Login Page with all the edge cases covered ---------- //

module.exports.student = function(req, res){

    try{
        if(req.isAuthenticated()){

            if(req.user.userType == 'student'){
                return res.redirect('/student/home');
            }
        }
    
        return res.render('student');
    }

    catch(err){
        console.log("Err", err);
        return res.send("<h1> Internal Server Error </h1>");   
    }
}

// ----------- Rendering Student Home Page with all the edge cases covered ------------ //

module.exports.studentHome = async function(req, res){

    try{
        // edge case , not allow the user to go to Student's home if - 

        if(req.isAuthenticated() && req.user.userType != 'student'){
            return res.redirect('back');
        }
    
        // fetch all the doubts
        const doubts = await Doubt.find({}).sort('-createdAt').populate('user').populate('resolvedBy').populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        });
    
        return res.render('studentHome', {
            user: req.user,
            doubts: doubts
        });
    }

    catch(err){
        console.log("Err", err);
        return res.send("<h1> Internal Server Error </h1>");  
    }
}

// -------------- Rendering TA Home ---------------- //

module.exports.taHome = async function(req, res){

    try{
        // edge case , not allow the user to go to TA's home if - 

        if(req.isAuthenticated() && req.user.userType != 'ta'){
            return res.redirect('back');
        }
    
        const pendingDoubts = await Doubt.find({isResolved: false}).sort('-createdAt');

        // remove this TA's escalated doubts from pending doubts array for this TA so that he/she could get only new doubts
        const taReport = await TaReportsLog.findById(req.user._id);

        pendingDoubts = pendingDoubts.filter(function(doubt) {
            return taReport.doubtsEscalated.indexOf(doubt) == -1;
        });
    
        return res.render('taHome', {
            user: req.user,
            pendingDoubts: pendingDoubts
        });
    }

    catch(err){
        console.log("Err", err);
        return res.send("<h1> Internal Server Error </h1>");    
    }
}

// --------- Rendering a dedicated page to a doubt -------------- //

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

        if(!doubt){
            return res.redirect('back');
        }

        // find that TA in taReportsLog with taAcceptedId
        const taReport = TaReportsLog.findById(taAcceptedId);

        if(!taReport){

            return res.redirect('back');
        }

        // now increase the accepted number of this ta by 1 if that doubt isn't accepted by that user already ( in case of refresh page )
        let index = taReport.doubtsAccepted.find((d_id) => {return d_id == doubt._id});

        if(index == undefined){
            taReport.doubtsAccepted.push(doubt._id);
        }

        return res.render('dedicatedDoubtPage', {
            user: req.user,
            doubt: doubt
        });
    }

    catch(err){
        console.log("Err", err);
        return res.send("<h1> Internal Server Error </h1>");
    }
}

// ---------------------------- Dashboard's data & rendering ------------------------------ //

module.exports.dashBoard = function(req, res){

    try{



        return res.render('dashboard');
    }

    catch(err){

        console.log("Err", err);
        return res.send("<h1> Internal Server Error </h1>");
    }
}