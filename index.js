let express = require("express");
let bodyParser = require("body-parser");
let uuid = require("uuid");
let {DATABASE_URL, PORT} = require("./config");
let {PostsCrudo} = require("./blog-post-model");
let mongoose = require("mongoose")

app.use( express.static( "public" ) );

let app = express();
let par = bodyParser.json();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/blog-posts", function(req, res){
    PostsCrudo.get().then(blogs => {
        res.status(200).json(blogs);
    })
    .catch(e => {
        console.log("ño");
        console.log(e);
        
    })
/*     res.status(200);
    res.statusMessage = "OK";
    res.json(data); */
});

app.get("/blog-post", function(req, res){
    if(req.query.author === ""){
        res.status(406);
        res.statusMessage = "No author";
        res.send();
    }
    else{
        let ret = data.filter((value, index, array) =>{
            return value.author === req.query.author;
        });

        if(ret.length == 0){
            res.status(404);
            res.statusMessage = "Author not found";
            res.send();
        }
        else{
            res.status(200);
            res.statusMessage = "OK";
            res.json(ret)
        }
    }
});

app.post("/blog-posts", function(req, res){

    let got = req.body;
    let validation =
        got.title !== undefined &&
        got.content !== undefined &&
        got.author !== undefined &&
        got.publishDate !== undefined;
    
    if(validation === true){
        let eras = uuid.v4();
        
        got.id = eras;

        PostsCrudo.post(got)
            .then(blogs => {
                res.statusMessage = "OK";
                res.status(200).json(blogs);
            })
            .catch(e => {
                console.log("ño");
                console.log(e);
                
            })


    }
    else{
        res.status(406);
        res.statusMessage = "Incomplete post";
        res.send();
    }

/*     let got = req.body;
    console.log(got);
    let validation =
        got.title !== undefined &&
        got.content !== undefined &&
        got.author !== undefined &&
        got.publishDate !== undefined;
    
    if(validation === true){
        let eras = uuid.v4();
        console.log(eras);
        got.id = eras;
        console.log(got);
        data.push(got);
        res.statusMessage = "OK";
        res.status(201);
        res.json(data);
    }
    else{
        res.status(406);
        res.statusMessage = "Incomplete post";
        res.send();
    } */
    
});

app.delete("/blog-posts/:id", function(req,res){
    let id = req.params.id;
    PostsCrudo.delete(id)
            .then(() =>{
                res.statusMessage = "OK";
                res.status(200);
                res.send();
                return true;
            })
            .catch(error => {
                res.statusMessage = "Not found";
                res.status(404);
                res.send();
                return error;
            })

    /* let idDel = data.findIndex((value, index, arr) =>{
        return (value.id === req.params.id);
    });

    if(idDel === -1){
        res.statusMessage = "Not found";
        res.status(404);
    }
    else{
        data.splice(idDel, 1);
        res.statusMessage = "OK";
        res.status(200);
    }
    res.send(); */
});

app.put("/blog-posts/:id", function(req, res){
    if(req.body.id === undefined){
        res.status(406);
        res.statusMessage = "No id in body";
        res.send();
        return;
    }
    if(req.body.id != req.params.id){
        res.status(409);
        res.statusMessage = "Not same id in body and params";
        res.send();
        return;
    }

    PostsCrudo.update(req.body.id, req.body)
            .then(r => {
                res.status(202); 
                res.statusMessage = "OK";
                res.json(r);
            })
            .catch(r => {
                res.status(404);
                res.statusMessage = "Post not found";
                res.send();
                return;
            })

    /* let ddd = data.find((val) => {
        return (val.id == req.body.id);
    });

    if(ddd === undefined){
        res.status(404);
        res.statusMessage = "Post not found";
        res.send();
        return;
    }

    for(let a in req.body){
        if(a == "id"){
            continue;
        }
        ddd[a] = req.body[a];
    }

    res.status(202); 
    res.statusMessage = "OK";
    res.json(ddd); */
});

let data = [
    {
        id: uuid.v4(),
        title: "Buenos dias",
        content: "Hoy amanecio a 25 °C con una humedad del 35% con baja posibilidad de lluvia. La presión atmosferica rebasa la atmosfera por alrededor del 0.2%, condiciones agradables. Radiación UV en minimo. Alta nubosidad con baja vista al sol.",
        author: "Anon",
        publishDate: new Date().getDate()
    }
]


let server;

function runServer(port, databaseUrl){
	return new Promise( (resolve, reject ) => {
		mongoose.connect(databaseUrl, response => {
			if ( response ){
				return reject(response);
			}
			else{
				server = app.listen(port, () => {
					console.log( "App is running on port " + port );
					resolve();
				})
				.on( 'error', err => {
					mongoose.disconnect();
					return reject(err);
				})
			}
		});
	});
}

function closeServer(){
	return mongoose.disconnect()
		.then(() => {
			return new Promise((resolve, reject) => {
				console.log('Closing the server');
				server.close( err => {
					if (err){
						return reject(err);
					}
					else{
						resolve();
					}
				});
			});
		});
}

runServer( PORT, DATABASE_URL )
	.catch( err => {
		console.log( err );
	});

module.exports = { app, runServer, closeServer };