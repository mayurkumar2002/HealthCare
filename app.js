const express=require('express');
const app=express();
const path=require('path');
const mongoose=require('mongoose');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
mongoose.set('strictQuery', true);

const Patient=require('./models/patients');
const Disease=require('./models/diseases');
const Expense=require('./models/expenses');

mongoose.connect('mongodb://127.0.0.1:27017/patientData')
    .then(()=>{
        console.log("Connection Open!");;
    })
    .catch(err=>{
        console.log("Error",err);
    })

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')));

app.get('/',async (req,res)=>{ 
    res.render('home');
})
app.get('/patients',async (req,res)=>{
    const patients=await Patient.find({});
    res.render('patients/index',{patients});
})

app.get('/patients/new',(req,res)=>{
    res.render('patients/new');
})

app.post('/patients',async (req,res)=>{
    const newPatient=new Patient(req.body);
    await newPatient.save();
    res.redirect(`patients/${newPatient._id}`);
})

app.get('/patients/:id',async (req,res)=>{
    const {id}=req.params;
    const patient=await Patient.findById(id);
    const fees=await Expense.find({patient:id});
    let filled=true; 
    if(!fees.length){
        filled=false;
    }
    res.render('patients/show',{patient,filled});
})

app.get('/patients/:id/edit',async (req,res)=>{
    const {id}=req.params;
    const patient=await Patient.findById(id);
    res.render('patients/edit',{patient});
})

app.put('/patients/:id',async(req,res)=>{
    const {id} = req.params;
    const patient= await Patient.findByIdAndUpdate(id,req.body,{runValidators: true, new: true});
    res.redirect(`/patients/${patient._id}`);
})

app.delete('/patients/:id',async(req,res)=>{
    const {id}=req.params;
    const deletedPatient =await Patient.findByIdAndDelete(id);
    res.redirect('/patients');
})

app.get('/diseases',async (req,res)=>{
    const diseases=await Disease.find({});
    let filled=true;
    const expense =await Expense.find();
    let x=expense.length;
    if(x){
        filled=false;
    }
    res.render('diseases/index',{diseases,filled});
})

app.get('/diseases/new',(req,res)=>{
    res.render('diseases/new');
})

app.post('/diseases',async (req,res)=>{
    const disease=new Disease(req.body);
    await disease.save();
    res.redirect(`/diseases/${disease._id}`);
})

app.get('/diseases/:id',async (req,res)=>{
    const {id}=req.params;
    const disease=await Disease.findById(id);
    res.render('diseases/show',{disease});
})

app.get('/diseases/:id/edit',async (req,res)=>{
    const {id}=req.params;
    const disease=await Disease.findById(id);
    res.render('diseases/edit',{disease});
})

app.put('/diseases/:id',async(req,res)=>{
    const {id} = req.params;
    const disease= await Disease.findByIdAndUpdate(id,req.body,{runValidators: true, new: true});
    res.redirect(`/diseases/${disease._id}`);
})

app.delete('/diseases/:id',async(req,res)=>{
    const {id}=req.params;
    const deletedDisease =await Disease.findByIdAndDelete(id);
    res.redirect('/diseases');
})

//Create new Expenses
app.get('/expenses/:id/new',async(req,res)=>{
    const {id}=req.params;
    const patient = await Patient.findById(id);
    const diseases = await Disease.find();
    res.render('expenses/new',{patient,diseases});
})

app.post('/expenses/:id',async(req,res)=>{
    const {id}=req.params;
    const data=req.body;
    for(let disease in data){
        const Addscore={};
        Addscore.patient=id;
        Addscore.disease=disease;
        Addscore.expense=data[disease];
        const dta= new Expense(Addscore);
        await dta.save();
    }
    res.redirect(`/expenses/${id}`);
})

//Show Expenses
app.get('/expenses/:id',async(req,res)=>{
    const {id}=req.params;
    const patient = await Patient.findById(id);
    const fees= await Expense.find({patient:id});
    const subExpense={};
    for(let expense of fees){
        const disease = await Disease.findById(expense.disease);
        const subName = disease.name;
        subExpense[subName]=expense.expense;
    }
    let totalFees=0;
    let cnt=0;
    for(let expense in subExpense){
        totalFees+=subExpense[expense];
        cnt++;
    }
    let percentage = (totalFees/cnt).toFixed(2);

    res.render('expenses/index.ejs',{patient,subExpense,totalFees,percentage});
})

app.listen(3000,()=>{
    console.log("App is listening on port 3000");
})