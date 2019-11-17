let mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let model = mongoose.Schema({
	id: String,
    title: String,
    content: String,
    author: String,
    publishDate: String
});

let Posts = mongoose.model( 'holas', model );


let PostsCrudo = {
	get : function(){
		return Posts.find()
				.then( posts => {
                    return posts
				})
				.catch( error => {
					throw Error( error );
				});
    },
    getAuthor : function(author){
		return Posts.findOne({author:author})
				.then( post => {
                    return post
				})
				.catch( error => {
					throw Error( error );
				});
	},
	post : function( newPost ){
		return Posts.create( newPost )
				.then( post => {
					return PostsCrudo.get()
                            .then(posts => {
                                return posts;
                            })
                            .catch(error => {
                                throw Error( error );
                            });
				})
				.catch( error => {
					throw Error(error);
				});
    },
    update: function( id, data ){
        return Posts.updateOne({id: id}, {$set: data})
                .then( result => {
                    return Posts.findOne({id: id})
                            .then(post => {
                                return post;
                            })
                            .catch(error => {
                                return Error(error);
                            });
                })
                .catch( error => {
                    return Error(error);   
                });
    },
    delete: function(id){
        return Posts.deleteOne({id:id})
                .then(() =>{
                    return true;
                })
                .catch(error => {
                    return Error(error);
                })
    }
};

module.exports = { PostsCrudo };


