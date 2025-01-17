const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ProjectSchema = new Schema({
    fileType: {
        type: String,
        require: true
    },
    name: String,
    title: {
        type: String,
        require: true
    },
    description: String,
    language:{
        type:String,
        require: true
    },
    tech_tags: [],
    likes: Number,
    dislikes: Number,
    img: String,
    s3_url: String,
    other_url: String,
    video_url: String,
    chat:[{
        body:String,
        date:{
            type:Date,
            default: Date.now
        },
        author_id:{
            type:Schema.ObjectId,
            ref:'User'
        },
        //public vs. private chats
        chat_type: String
    }],
    // recommend, require, active, disabled // can be multiple
    status:[{
        type:String,
        default:'active'
    }],
    owner_id: {
        type: Schema.ObjectId,
        ref: 'User',
    },
    admin_id: [{
        type: Schema.ObjectId,
        ref: 'User',
    }],
    cohort_id: {
        type: Schema.ObjectId,
        ref: 'Cohort',
    },
    fav_users: [{
        type: Schema.ObjectId,
        ref: 'User'
    }],
    done_users: [{
        type: Schema.ObjectId,
        ref: 'User'
    }],

});
module.exports = mongoose.model('Project', ProjectSchema);