import mongoose from 'mongoose';

const tweetSchema = mongoose.Schema({
    body: {type: String, required: true},
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required:true
    },
    tweetDate: {type: Date, default: Date.now},
    stats: {
        views:{type:Number, default:0},
        likes:{type:Number, default:0},
        retweets:{type:Number, default:0}
    }
}, {
   collection:'tweets', strict:'throw', timestamps:true 
});

export default mongoose.model('Tweet', tweetSchema);


