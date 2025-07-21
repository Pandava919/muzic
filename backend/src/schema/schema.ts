import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
    },
},
{
    timestamps: true,
    versionKey: false
});

export const User = model('User', UserSchema);


const StreamsSchema = new Schema({
    userId :{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    url: {
        type: String,
        required: true,
    }
})

export const Streams = model('Streams', StreamsSchema);

