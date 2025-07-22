import { Schema, model } from 'mongoose';
import { ref } from 'process';
import { string } from 'zod';
import { required } from 'zod/v4/core/util.cjs';

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
    }
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

