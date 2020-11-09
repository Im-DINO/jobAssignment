import mongoose from "mongoose";
import { professorSchemaInterface } from "./schemaInterface";

const professorSchema = new mongoose.Schema({
    name: String,
    phone: Number,
    age: Number,
    sex: String,
});

const Professor = mongoose.model<professorSchemaInterface>("Professor", professorSchema, "Professor");
export default Professor;