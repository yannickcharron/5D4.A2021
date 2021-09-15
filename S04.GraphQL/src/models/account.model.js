import mongoose from 'mongoose';

const schema = mongoose.Schema(
    {
        displayName: { type: String, require:true },
        fourDigits: {type: Number, require:true},
        email: { type: String, required: true, unique: true },
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        hash: { type:String, required:true },
        salt: { type:String, require:true },
        createdDate: { type: Date, default: Date.now },
    },
    {
        collection: 'accounts',
        strict:'throw'
        
    }
);

schema.index({displayName:1, fourDigits:1}, {unique:true});

schema.virtual('tweets', {
    ref:'Tweet',
    localField:'_id',
    foreignField:'author',
    justOne:false
});

export default mongoose.model('Account', schema);