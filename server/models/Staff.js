import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
    name : {
        type : String,
    },
    email : {
        type : String,
        unique : true,
    },
    phone : {
        type : String,
    },
    role : {
        type : String,
        default : "staff",
    },
    restaurant : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Restaurant",
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    },
    subscriptionPlan : {
        type : String,
        enum : ["free" , "basic" , "premium"],
        default : "free",
    },
    accessPermissions : {
        billing : { type : Boolean , default : true },
        reports : { type : Boolean , default : true },
        menuManagement : { type : Boolean , default : true },
        staffManagement : { type : Boolean , default : true },
        settings : { type : Boolean , default : true },
    },
    dateJoined : {
        type : Date,
    },
    isActive : {
        type : Boolean,
        default : true,
    },
} , { timestamps: true });

const Staff = mongoose.model('Staff' , staffSchema);
export default Staff;