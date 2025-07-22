import { Schema, model } from 'mongoose';
import { ref } from 'process';

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    role:{
        type: String,
        enum:['user', 'streamer']
    },
    streams:[{
        type:Schema.Types.ObjectId,
        ref: 'Streams'
    }],
    upVotes:[{
        type:Schema.Types.ObjectId,
        ref:'UpVotes'
    }],

},
{
    timestamps: true,
    versionKey: false
});

export const User = model('User', UserSchema);


const StreamsSchema = new Schema({
    type: {
        type: String,
        enum:['youtube', 'spotify']
    },
    active: {
        type: Boolean,
        default:false
    },
    upvotes: {
        type: Number,
    },
    user :{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    upVotes:[{
        type:Schema.Types.ObjectId,
        ref:'UpVotes'
    }],
    url: {
        type: String,
        required: true,
    },
    extractedId: {
        type:String
    }
})

export const Streams = model('Streams', StreamsSchema);


const upVotesSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
        unique:true
    },
    stream: {
        type:Schema.Types.ObjectId,
        ref:'Streams',
        unique:true

    }
})

export const upVotes = model('UpVotes', upVotesSchema)

