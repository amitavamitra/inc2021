const  express = require('express')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
require('dotenv/config');
const fs = require('fs')

const app = express()

app.use(express.static('public'))
app.set('view engine' , 'ejs')
app.use(bodyParser.urlencoded({extended:true}))


mongoose.connect(process.env.MONGO_URL,
	{ useNewUrlParser: true, useUnifiedTopology: true }, err => {
		console.log('connected')
	});



// Step 5 - set up multer for storing uploaded files

var multer = require('multer');

var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads')
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + '-' + Date.now())
	}
});

var upload = multer({ storage: storage });


// Step 6 - load the mongoose model for Image

var imgModel = require('./model');




// app.get('/', function(req,res){
//     res.render('register')
// })

// Step 7 - the GET request handler that provides the HTML UI

app.get('/', (req, res) => {
	imgModel.find({}, (err, items) => {
		if (err) {
			console.log(err);
			res.status(500).send('An error occurred', err);
		}
		else {
			res.render('image');
            // res.render('register' , { items: items })
		}
	});
});



app.get('/thankyou',function(req,res){
	res.render('thankyou')
})
// Step 8 - the POST handler for processing the uploaded file

app.post('/', upload.single('image'), (req, res, next) => {

	var obj = {
		name: req.body.name,
		email: req.body.email,
		car : req.body.car,
		img: {
			data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
			contentType: 'image/png'
		}
	}
	imgModel.create(obj, (err, item) => {
		if (err) {
			console.log(err);
		}
		else {
			item.save();
			res.redirect('/thankyou');
		}
	});
});


// app.post('/', function(req,res){

//     const name = req.body.name;
//     const email = req.body.email;
//     const car = req.body.car;
    
//     console.log(name , email , car)

// })


app.listen(3001,()=>{console.log('Register at port 3001')} )