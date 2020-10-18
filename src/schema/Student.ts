import mongoose, { mongo, Schema,Document, Mongoose } from "mongoose";
import { logger } from "../winston";
import Professor from "./Professor";
import {studentSchemaInterface, professorSchemaInterface} from "./schemaInterface";

const studentSchema = new mongoose.Schema({
    name: String,
    phone: Number,
    age : Number,
    sex : String,
    professor : { type: Schema.Types.ObjectId, ref:Professor},
});
studentSchema.post<studentSchemaInterface>("save", async (data)=> {
    logger.info("STUDENT WAS CREATED ✅",data._id);
});
studentSchema.post("deleteOne",(data)=>{
    logger.info("STUDENT WAS DELETED ✅",data._id);
});
const model = mongoose.model<studentSchemaInterface>("Sturendt", studentSchema, "Student");
export default model;