const mongoose=require('mongoose');
mongoose.set('strictQuery', true);

const patientSchema=new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    patient_id: {
        type: String,
        required: true
    }
})

const Patient=mongoose.model('Patient',patientSchema);
module.exports=Patient;