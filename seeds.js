const mongoose=require('mongoose');
mongoose.set('strictQuery', true);

const Patient=require('./models/patients');

mongoose.connect('mongodb://127.0.0.1:27017/patientData')
    .then(()=>{
        console.log("Connection Open!");
    })
    .catch(err=>{
        console.log("Error",err);
    })

const seedPatients = [
    {
        name: 'Mayur Kumar',
        date: "2023-04-14T00:00:00.000Z",
        age: 21,
        patient_id: '1201'
    },
    {
        name: 'Krish Kumar',
        date: "2023-04-14T00:00:00.000Z",
        age: 21,
        patient_id: '1202'
    },
    {
        name: 'Yash Garg',
        date: "2023-04-14T00:00:00.000Z",
        age: 21,
        patient_id: '1203'
    },
    {
        name: 'Shivam Kumar',
        date: "2023-04-14T00:00:00.000Z",
        age: 21,
        patient_id: '1204'
    },
    {
        name: 'Ritesh Kumar',
        date: "2023-04-14T00:00:00.000Z",
        age: 21,
        patient_id: '1205'
    },
]


Patient.insertMany(seedPatients)
.then(res=>{
    console.log(res);
})
.catch(e=>{
    console.log(e);
})