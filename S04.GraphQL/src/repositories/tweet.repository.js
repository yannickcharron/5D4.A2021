import Tweets from '../models/tweet.model.js';

class TweetRepository {
    create(body) {
        const idAccount = '612ff2cddca6713bb8e8333e';
        const tweet = new Tweets({body:body, author:idAccount});
        return tweet.save();
    }

    retrieveAll() {
        return Tweets.find();
    }

    likeTweet(id) {
        return Tweets.findOneAndUpdate({_id:id}, {$inc:{'stats.likes':1}}, {new:true});
    }
}

export default new TweetRepository();