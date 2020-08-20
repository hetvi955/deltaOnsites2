const express=require('express');
const path= require('path');
const uploadModel= require('./models/images');

//for image manipulation
const sharp= require('sharp');


//for uploadind files
const multer=require('multer');
const ejs=require('ejs');

//app
const app=express();

//set view enginge
app.set('view engine','ejs');


//public to static folder
app.use(express.static('./public'));

//store in uploads folder
const store= multer.diskStorage({
    destination:'./public/uploads/thumbs',
    filename: (req,file,callback)=>{

//path module has extname included
        callback(null, file.fieldname + '.' +
            Date.now() + path.extname( file.originalname))

    }
});

//fetch data from db
var imgdata= uploadModel.find({});

var image =multer({
    storage:store,
    fileFilter: (req,file,callback)=>{
        typeoffile(file,callback)
    }
}).single('newimage');

//only images allowed
 function typeoffile(file,callback){
    const type= /jpeg|jpg|png|JPEG|JPG|PNG/;

    const extname = type.test(path.extname( file.originalname));
    if(extname){
        return callback(null,true)
    }else{
        callback("Error: you can only upload Images!")
    }
}


app.get('/',(req,res)=>{
    res.render('main')
});

//post
app.post('/uploads', (req,res)=>{
    image(req,res,(error) =>{
        if(error){
            res.render('main',{
                info: error
            });
        }else{
            if(req.file==undefined){
                res.render('main',{
                    info: "you need to select a image!"
                });
            }else{
                var imgfile=sharp(req.file.path).resize(50, 50).toFile('uploads' + 'thumbs' + req.file.originalname, 
                (err, resizeImage) => {
                    if (err) {
                        console.log(err);
                    } else {
                        //console.log(resizeImage);
                        var imgdetails= new uploadModel({
                        filename:imgfile,
                        });
                        imgdetails.save(function(error,doc){
                            imgdata.exec(function(error,data){
                                if(error){
                                    throw error;
                                }else{
                                    res.render('pictures', {
                                        file:`uploads/thumbs/${req.file.filename}`,
                                        data:data
                                    });
                                }
                            })
                           
                        })
                    }
                })
            }
        }
    })
});


app.get('/uploads',(req,res)=>{
    imgdata.exec(function(error,data){
        if(error){
            throw error;
        }else{
            res.render('pictures', {
                file:`uploads/thumbs/${req.file.filename}`,
                data:data

            });
        }
    })
});

//server up
PORT=3000;

app.listen(PORT, ()=>{
    console.log(`server running on ${PORT}`)
});
