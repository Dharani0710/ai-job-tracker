const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        company:{
            type:String ,
            required:true,
            trim:true,
        },
        role:{
            type:String,
            required:true,
        },
        jobDescription:{
            type:String,
            required: true,
        },
        status:{
            type:String,
            enum:["Applied","Interviewing","Offered","Rejected"],
            default:"Applied",
        },
        atsScore:{
            type:Number,
            default:0,
        },
        missingKeywords:{
            type:[String],
            default:[],
        },
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        lastAnalyzedAt: {
  type: Date,
  default: null,
},
    },
    { timestamps:true }
);

module.exports = mongoose.model("Job", jobSchema);