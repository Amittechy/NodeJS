const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let favouriteSchema = new Schema ({
favdishes :[
    { 
        type: mongoose.Schema.Types.ObjectId,
         ref: 'Dish',
         unique:true
         
    
}],
    
users : {
   type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
}
}, {

    timestamps: true
})
let Favourites= mongoose.model('Favourite',favouriteSchema);
module.exports = Favourites;