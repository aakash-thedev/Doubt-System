const Doubt = require('../models/doubt');
const Comment = require('../models/comment');

//------------------------- Create a doubt ------------------------- //

module.exports.createDoubt = async function(req, res){

    try{
        const user = req.user._id;
        const title = req.body.title;
        const description = req.body.description;

        await Doubt.create({
            user: user,
            title: title,
            description: description
        });

        res.redirect('back');
    }

    catch(err){

        console.log(err);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

// ----------------------- Create a comment on the doubt ---------------------------- //

module.exports.createComment = async function(req, res){

    try{

        // find the doubt in the database if the doubt exists then only create the comment
        const doubt = await Doubt.findById(req.body.doubt);

        if(!doubt){
            return res.redirect('back');
        }
        
        const newComment = await Comment.create({
            comment: req.body.comment,
            user: req.body.user,
            doubt: req.body.doubt
        });

        doubt.comments.push(newComment._id);
        doubt.save();

        res.redirect('back');
    }

    catch(err){

        console.log(err);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

// ------------------------ Resolve a doubt -------------------------- //

module.exports.resolveDoubt = async function(req, res){

    try{

        const doubtId = req.query.doubtId;
        const taId = req.query.taId;
        const answer = req.body.answer;

        const updatedDoubt = await Doubt.findByIdAndUpdate(doubtId, {

            isResolved: true,
            resolvedBy: taId,
            resolvedAnswer: answer

        }, {
            useFindAndModify: false
        });

        if(!updatedDoubt){
            return res.send("<h1> Doubt not found !! Refresh the page </h1>")
        }

        return res.redirect('/ta/home');

    }

    catch(err){

        console.log(err);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

// ------------------------ Escalate a doubt -------------------------- // 

module.exports.escalateDoubt = async function(req, res){

    try{

        const doubtId = req.query.doubtId;
        const taId = req.query.taId;

        const updatedDoubt = await Doubt.findById(doubtId);

        if(!updatedDoubt){
            return res.send("<h1> Doubt not found !! Refresh the page </h1>")
        }

        updatedDoubt.escalatedBy.push(taId);
        updatedDoubt.save();

        return res.redirect('/ta/home');

    }

    catch(err){

        console.log(err);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}