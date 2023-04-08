const mongoose=require('mongoose');
mongoose.set('strictQuery', true);

const expenseSchema=new mongoose.Schema({
    expense: {
        type: Number,
        required: true
    },
    patient: {
        type: String,
        ref: 'Patient'
    },
    disease: {
        type: String,
        ref: 'Disease'
    }
})

const Expense=mongoose.model('Expense',expenseSchema);
module.exports=Expense;