import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import productRoutes from './routes/product.route.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CSP and Security Headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'strict-dynamic'"],
      styleSrc: ["'self'", "'strict-dynamic'"],
      imgSrc: ["'self'", "data:"],
      frameAncestors: ["'none'"],
    }
  },
  xContentTypeOptions: true // ✅ Ensures the header is set
}));

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff"); // ✅ Explicitly set in responses
  next();
});


app.disable('x-powered-by');

app.use((req, res, next) => {
  res.removeHeader('Server');
  next();
});

// Block access to hidden files (e.g., .env, .git, .DS_Store)
app.use((req, res, next) => {
  if (req.url.match(/^\/\./)) {
    return res.status(403).send("Access Denied");
  }
  next();
});

// CORS Middleware
const allowedOrigins = ['http://localhost:5173'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Ensure `sitemap.xml` and `robots.txt` are served correctly
app.use('/sitemap.xml', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'sitemap.xml');
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send("Sitemap not found");
  }
});


app.use('/robots.txt', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'robots.txt');
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send("Robots.txt not found");
  }
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use('/', authRoutes);
app.use("/api/products", productRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log('Server started at http://localhost:' + PORT);
});
