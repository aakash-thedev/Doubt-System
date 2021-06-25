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
        return res.render('app_home');
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
    
        return res.render('taSetup');
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
    
        return res.render('studentSetup');
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
    
        let pendingDoubts = await Doubt.find({isResolved: false}).sort('-createdAt');

        // remove this TA's escalated doubts from pending doubts array for this TA so that he/she could get only new doubts
        // let taReport = await TaReportsLog.findOne({user: req.user._id});
        // let newPendingDoubts = pendingDoubts.filter(function(doubt) {
        //     return taReport.doubtsEscalated.indexOf(doubt._id) == -1;
        // });
    
        return res.render('taHome', {
            user: req.user,
            pendingDoubts: pendingDoubts
        });
    }

    catch(err){
        console.log("Err", err);
        return res.redirect('back');
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
        let taReport = await TaReportsLog.findOne({user: taAcceptedId});

        if(!taReport){

            return res.redirect('back');
        }

        // now increase the accepted number of this ta by 1 if that doubt isn't accepted by that user already ( in case of refresh page )
        let index = taReport.doubtsAccepted.find((d_id) => {return d_id == doubt.id});

        if(index == undefined){
            taReport.doubtsAccepted.push(doubt._id);
            taReport.save();
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

module.exports.dashBoard = async function(req, res){

    try{

        const taReports = await TaReportsLog.find({}).populate('user');
        const doubts = await Doubt.find({});
        const doubtsResolved = await Doubt.find({isResolved: true});
        let doubtsEscalated = 0;
        let avgDoubtResolvingTime = 0;

        // iterate over TA's accepted doubt

        for(let doubt of doubts){
            avgDoubtResolvingTime += doubt.doubtResolutionTime;
        }

        avgDoubtResolvingTime = (avgDoubtResolvingTime/doubtsResolved.length);

        // Calculate average doubt activity time !! - // TODO at last

        for(let report of taReports) {
            doubtsEscalated += report.doubtsEscalated;
        }

        return res.render('dashboard', {
            taReports: taReports,
            totalDoubts: doubts.length,
            doubtsResolved: doubtsResolved.length,
            doubtsEscalated: doubtsEscalated,
            avgDoubtResolvingTime: avgDoubtResolvingTime
        });
    }

    catch(err){

        console.log("Err", err);
        return res.send("<h1> Internal Server Error </h1>");
    }
}