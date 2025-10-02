const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const upload = multer(); // In-memory saqlash

app.use(cors());
app.use(express.json());

// Endpoint: PDFni qabul qilib emailga yuborish
app.post('/send-email', upload.single('file'), async (req, res) => {
    try {
        const email = req.body.email;
        const file = req.file;

        if (!email || !file) {
            return res.status(400).json({ message: "Email yoki fayl topilmadi!" });
        }

        // Nodemailer transporter
        let transporter = nodemailer.createTransport({
            service: 'gmail', // Gmail SMTP
            auth: {
                user: process.env.EMAIL_USER, // .env faylida saqlanadi
                pass: process.env.EMAIL_PASS
            }
        });

        // Email sozlamalari
        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Sertifikatingiz tayyor!',
            text: 'Sizning sertifikatingiz ilova qilindi. Iltimos, tekshirib oling.',
            attachments: [
                {
                    filename: file.originalname,
                    content: file.buffer
                }
            ]
        };

        // Email yuborish
        await transporter.sendMail(mailOptions);

        res.json({ message: 'Sertifikat muvaffaqiyatli yuborildi!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Xatolik yuz berdi', error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ${PORT} portda ishlayapti`));
