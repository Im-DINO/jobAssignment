import mongoose from "mongoose";

export interface studentSchemaInterface extends mongoose.Document {
    name: {type: String},
    phone: {type: Number},
    professor: {type: String},
    sex: { type: String}
    age : {type:Number},
  };

export interface professorSchemaInterface extends mongoose.Document {
    name: {type: String},
    phone: {type: Number},
    sex: { type: String}
    age : {type:Number},
  };
  