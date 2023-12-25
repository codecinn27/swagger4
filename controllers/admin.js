const {Visit} = require('../model/user');

module.exports.readVisitsData = async(req,res)=>{
    try {
        const allVisits = await Visit.find({});
        res.send(allVisits);
    } catch (error) {
        console.error('Error fetching visits:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }  
}