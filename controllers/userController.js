const User = require('../models/user');
const TaReportsLog = require('../models/taReportsLog');

module.exports.home = function(req, res){
    console.log("Home");
}

// -------------------- To Register a user ---------------------- //

module.exports.register = async function(req, res){

    try{
        // take userType from params
        const userType = req.params.userType; // TA or Student
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        // check if this email already exists
        const user = await User.findOne({email: email});

        if(!user){

            const newUser = await User.create({
                name: name,
                email: email,
                password: password,
                userType: userType
            });
            
            // if newUser.userType is TA then push it into taReportsLog with all values default as 0 so that his/her performance could be tracked
            if(newUser.userType == "ta"){
                
                const newTaReport = await TaReportsLog.create({
                    user: newUser._id
                });
            }

            return res.redirect('back');
        }

        else{
            return res.status(402).json({
                message: `' ${email} ' already exists !!`
            });
        }
    }

    catch(err){
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}


// -------------------- To Log In a user ---------------------- //

module.exports.login = async function(req, res){

    try{

        const userType = req.params.userType;

        if(userType == "student"){
            return res.redirect('/student/home');
        }

        else{
            return res.redirect('/ta/home');
        }
    }
    
    catch(err){
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

// ------------------- Log Out Feature ----------------------- //
module.exports.destroySession = function(req, res){
    req.logout();
    return res.redirect('/');
}