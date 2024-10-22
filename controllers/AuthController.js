const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
    try {
        const { login, password } = req.body;

        // Cari user berdasarkan username atau email
        const user = await UserModel.findOne({
            $or: [{ email: login }, { username: login }]
        });

        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        // Verifikasi password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Password salah" });
        }

        // Buat JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET, // Gunakan secret key dari env
            { expiresIn: "1h" }
        );

        // Simpan token JWT ke kolom jwt_token di database
        user.jwt_token = token;
        await user.save();

        // Kirim respons dengan token
        res.status(200).json({ token });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Terjadi kesalahan server" });
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

module.exports = { loginUser, logoutUser };
