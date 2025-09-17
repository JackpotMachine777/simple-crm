import mongoose from "mongoose";
import express, { type Request, type Response } from "express";
import cors from "cors";
import bcrypt from "bcrypt";

import { sendEmail } from "./services/mailer.ts";
import Admin from "./models/adminSchema.ts";

const MONGO_URL = "mongodb://127.0.0.1:27017/CRM-Database";
const PORT = 5000;

async function start() {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(MONGO_URL);

    console.log("✅ Connected to MongoDB");
    console.log("mongoose readyState:", mongoose.connection.readyState);

    const { default: Form } = await import("./models/formSchema.ts");

    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.get("/", (req: Request, res: Response) => {
      res.send("Server works");
    });

    app.get("/api/forms", async (_req: Request, res: Response) => {
      try {
        const forms = await Form.find().sort({ date: -1 }).lean();
        res.json({ success: true, data: forms });
      } catch (err) {
        console.error("GET /api/forms error:", err);
        res.status(500).json({ success: false, msg: "Server error" });
      }
    });

    app.post("/api/contact", async (req: Request, res: Response) => {
      const time = new Date().toISOString();
      console.log(`\n${time} - POST /api/contact received`);
      console.log("IP:", req.ip || req.socket.remoteAddress);
      console.log("UA:", req.get("user-agent"));
      console.log("Body:", req.body);

      const { name, mail, message } = req.body;
      if (!name || !mail || !message) {
        console.log("Missing fields -> returning 400");
        return res.status(400).json({ success: false, msg: "Missing fields" });
      }

      try {
        const newForm = new Form({ name, mail, message });
        const saved = await newForm.save();
        console.log("Saved document:", saved);

        await sendEmail(mail, name);

        return res.json({ success: true, msg: "Form saved in the database", id: saved._id });
      } catch (err) {
        console.error("POST /api/contact - save error:", err);
        return res.status(500).json({ success: false, msg: "Server error" });
      }
    });

    app.post("/api/admin/login", async(req: Request, res: Response) => {
        const { username, password } = req.body;

        if(!username || !password) return res.status(400).json({ success: false, msg: "Invalid credentials" });

        try{
            const admin = await Admin.findOne({ username });
            if(!admin) return res.status(401).json({ success: false, msg: "Invalid credentials" });

            const isMatch = await bcrypt.compare(password, admin.password);
            if(!isMatch) return res.status(401).json({ success: false, msg: "Invalid credentials" });

            res.json({ success: true, msg: "Login successful" });
        } catch(err){
            console.error(`Login error: ${err}`);
            res.status(500).json({ success: false, msg: "Server error" });
        }
    });

    app.patch("/api/forms/:id/read", async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const form = await Form.findById(id);
            if (!form) return res.status(404).json({ success: false, msg: "Form not found" });
        
            form.read = true;
            await form.save();
        
            res.json({ success: true, msg: "Form marked as read" });
        } catch (err) {
            console.error(`PATCH /forms/:id/read error: ${err}`);
            res.status(500).json({ success: false, msg: "Server error" });
        }
    });

    app.delete("/api/forms/:id", async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
          const deleted = await Form.findByIdAndDelete(id);

          if (!deleted) {
            return res.status(404).json({ success: false, msg: "Form not found" });
          }

          res.json({ success: true, msg: "Form deleted" });
        } catch (err) {
          console.error(`DELETE /api/forms/:id error: ${err}`);
          res.status(500).json({ success: false, msg: "Server error" });
        }
    });



    app.listen(PORT, () => {
      console.log(`Server works on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err);
    process.exit(1);
  }
}

start();
