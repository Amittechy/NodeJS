
const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Favourites = require('../models/favourites');

const favRouter = express.Router();

favRouter.use(bodyParser.json());

favRouter.route('/')
.options(cors.corsWithOptions,(req,res) => {res.sendStatus(200);})
.get(cors.cors,authenticate.verifyUser,authenticate.verifyAdmin,(re,res,next) => {
    Favourites.find({})
    .populate('users') 
   .populate('favdishes')
    .then((favourites) => {
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(favourites);
    },(err)=>next(err))
    .catch((err)=> next(err));

})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    let userId= req.user.id;//getting logged in user id from passport session
    let favdishId = req.body.map(x => x.id); //Fetching dish from the post body
        Favourites.findOne({'users':userId})//finding respective dish with the userid
        .then((favourites)=>{
            if(favourites!=null )
            { // if Favdish is  available for the userId
                favdishId.forEach((i)=>{  //comparing two array
                    if(favourites.favdishes.indexOf(i)<0)
                    {
                        favourites.favdishes.push(i);
                       
                     }//inner-if
                     

                })
                favourites.save()
                     .then((favourites)=>{
                         res.statusCode = 200;
                         res.setHeader('Content-Type', 'application/json');
                         res.json(favourites);
                         },(err)=>next(err));
                
            }//outer-if

            else{ //If Dish is not null
               
            Favourites.create({favdishes:favdishId,users:userId})
            .then((favourites)=>{
                console.log('Fav Dish document Created ', favourites);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favourites);
            }, (err) => next(err))
                
            }
           
        })
           
        .catch((err) => next(err));
           
            
        

        })

        .put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
            res.statusCode = 403;
            res.end('PUT operation not supported on /favourites');
        })
        .delete(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
            let userId= req.user.id;//getting logged in user id from passport session
            Favourites.findOne({'users':userId})
            
                .then((favourites) => 
                {
                    if(favourites!=null){

                        favourites.remove({}) //removing the favourites doument respective to the userID 
                            .then((favourites)=>{
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.end('Dish Deleted');
                                },(err) => next(err)) 
                                
                        
                    }//if-ends-here
                    
                   
                    
                }, (err) => next(err)) //then-ends-here

                .catch((err) => next(err));
        });
    



favRouter.route('/:favdishId')
.options(cors.corsWithOptions,(req,res) => {res.sendStatus(200);})
.get(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /favourites/:id');
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    let userId= req.user.id;//getting logged in user id from passport session
    let favdishId = req.params.favdishId;
            Favourites.findOne({'users':userId})
            
                .then((favourites) => 
                   {
    
                    if( favourites.favdishes.indexOf(favdishId) <0 ) { //checking whether favdishId is available in favdishes
                        
                       favourites.favdishes.push(favdishId); //inserting the favdishId in the array
                       favourites.save()
                       .then((favourites)=>{
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favourites);
                            },(err) => next(err)) 
                       

                    }
                    else{
                        err = new Error('Dish ' + req.params.favdishId + ' is already  available');
                        err.status = 404;
                        return next(err);
                    }
       
                },(err)=>next(err))//then -ends-here
    
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favourites/:id');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    let userId= req.user.id;//getting logged in user id from passport session
    let favdishId = req.params.favdishId;
            Favourites.findOne({'users':userId})
            
                .then((favourites) => 
                {
                    if( favourites.favdishes.includes(favdishId) === false) { //checking whether favdishId is available in favdishes
                        
                        favourites.favdishes.remove(favdishId); //removeing favdish from array
                        favourites.save()
                        .then((favourites)=>{
                                 res.statusCode = 200;
                                 res.setHeader('Content-Type', 'application/json');
                                 res.json(favourites);
                             },(err) => next(err)) 
                        
 
                     }
                     else{
                         err = new Error('FavDish ' + req.params.favdishId + ' not found');
                         err.status = 404;
                         return next(err);
                     }
                })
})


module.exports = favRouter;