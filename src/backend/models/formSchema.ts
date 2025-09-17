import {Schema, model} from "mongoose";

const formSchema = new Schema({
    name: {type: String, required: true},
    mail: {type: String, required: true},
    message: {type: String, required: true},
    date: {type: Date, default: Date.now},
    read: { type: Boolean, default: false },
});

const Form = model("Form", formSchema);
export default Form;