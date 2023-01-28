module.exports.error = function(req, res){
    return res.status(404).json({
        message : 'Page does not exist!'
    });
}