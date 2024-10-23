const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    const token = authHeader.split(' ')[1];
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach decoded user information to the request object
      next();
    } catch (error) {
      console.error(error.message);
      return res.status(403).json({ message: 'Invalid token' });
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        // Cari user berdasarkan username atau email
        const user = await UserModel.findOne({
            where: {
                [Op.or]: [{ username: username },{ email: username }]
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        // Verifikasi password menggunakan bcrypt.compare
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            // Buat JWT token
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET, // Gunakan secret key dari env
                { expiresIn: "1h" }
            );

            // Simpan token dalam user
            user.jwt_token = token;
            await user.save();

            // Kirim response dengan token
            return res.status(200).json({ token });
        } else {
            return res.status(401).json({ message: "Kredensial salah" });
        }

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message || "Terjadi kesalahan server" });
    }
};


const logoutUser = async (req, res) => {
    try {
        // Ambil token dari header Authorization
        const token = req.headers.authorization?.split(' ')[1]; // Format: "Bearer <token>"

        if (!token) {
            return res.status(401).json({ message: "Token tidak ditemukan" });
        }

        // Verifikasi token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Cari user berdasarkan userId dari token yang di-decode
        const user = await UserModel.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        // Cek apakah token yang dikirim sama dengan token yang tersimpan di database
        if (user.jwt_token !== token) {
            return res.status(401).json({ message: "Token tidak valid" });
        }

        // Hapus token JWT dengan mengosongkan kolom jwt_token
        user.jwt_token = null;
        await user.save();

        res.status(200).json({ message: "Logout berhasil" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
};

module.exports = { loginUser, logoutUser, verifyJWT };
