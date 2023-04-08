const mongoose=require('mongoose');
mongoose.set('strictQuery', true);

const diseaseSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    doctor_name: {
        type: String,
        required: true
    }
})


const Disease=mongoose.model('Disease',diseaseSchema);
module.exports=Disease;