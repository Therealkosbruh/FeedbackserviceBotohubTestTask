import express from "express";
import dotenv from "dotenv";
import path from "path";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import { authMiddleware } from "./middleware/authMiddleware";
import { register, login, getMe } from "./controllers/userController"; 
import { upvotePost, removeUpvote } from "./controllers/upvoteController";
import { 
    createFeedbackPost, 
    getAllFeedbackPosts, 
    getFeedbackPostById, 
    updateFeedbackPost, 
    deleteFeedbackPost,
    getCategories,
    getStatuses
} from "./controllers/feedbackController";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());  

// Swagger setup
const swaggerDocument = YAML.load("./openapi.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// User routes
app.post("/register", register);
app.post("/login", login);
app.get("/me", authMiddleware, getMe);

// Feedback routes
app.post("/feedback", authMiddleware, createFeedbackPost);
app.get("/feedback", getAllFeedbackPosts);
app.get("/feedback/:id", getFeedbackPostById);
app.put("/feedback/:id", authMiddleware, updateFeedbackPost);
app.delete("/feedback/:id", authMiddleware, deleteFeedbackPost);

// New routes for categories and statuses
app.get("/categories", getCategories);
app.get("/statuses", getStatuses);

// Voting routes
app.post("/upvote/:postId", authMiddleware, upvotePost);
app.delete("/upvote/:postId", authMiddleware, removeUpvote);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Swagger UI доступен по адресу: http://localhost:${port}/api-docs`);
});
