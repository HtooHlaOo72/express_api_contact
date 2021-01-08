const express=require('express');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const cors=require('cors');

const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());


mongoose.connect('mongodb+srv://blog-admin:09785882767Htoo@cluster0.mzxmt.mongodb.net/contactDB?retryWrites=true&w=majority',
 {useNewUrlParser: true, useUnifiedTopology: true});
const contactSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    phone:{type:String,required:true},

});
const Contact=mongoose.model('Contact',contactSchema);

app.get('/',(req,res)=>{
    res.send("Express api for react-contact")
})
app.get('/contacts',(req,res)=>{
    Contact.find({},(err,foundContacts)=>{
        if(!err){
            //console.log(foundContacts)
            res.status(200).json(foundContacts);
        }else{
            res.status(204).end();
        }
    })
    
})
app.post('/contacts/add',(req,res)=>{
    const {name,email,phone}=req.body;
    const newContact=new Contact({
        name,email,phone
    })
    newContact.save().then(()=>{
        Contact.findOne({name,email,phone},(err,foundContact)=>{
            (!err)?res.status(201).json(foundContact)
            :res.status(500).end();
        })
        
    })
    .catch(err=>{
        res.status(500).end()
    })

    
})
app.put('/contacts/edit/:id',(req,res)=>{
    const {name,email,phone,_id}=req.body;
    const id=req.params.id;
    const newContact={id,name,email,phone};
    Contact.findByIdAndUpdate({_id:id},{$set:newContact},(err,foundContact)=>{
        console.log("Put request\n"+foundContact);
        (!err)?res.json(newContact):res.status(500).end();
    })
    
    
    })


app.delete('/contacts/delete/:id',(req,res)=>{
    const _id=req.params.id;
    Contact.findByIdAndDelete({_id},(err,deleteContact)=>{
        if(!err){
            console.log(deleteContact);
            res.status(200).end();
        }else{
            res.status(500).end();
        }
    })
})
app.get('/contacts/:id',(req,res)=>{
    const _id=req.params.id;
    Contact.findById({_id:_id},(err,foundContact)=>{
        if(!err){
            console.log(foundContact);
            res.status(200).json(foundContact);
        }else{
            res.status(500).end();
        }
    })
})
app.listen(process.env.PORT || 8000,()=>{
    console.log("server is running at port",8000);
})