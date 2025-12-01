async function ensureDefaultAdmin() {
    const email = "admin@gmail.com";
    const password = "admin1234";

    try {
        let admin = await Admin.findOne({ email });

        if (!admin) {
            await Admin.create({
                name: "Admin User",
                email: email,
                password: password
            });
            console.log("✅ Default admin created:", email);
        } else {
            admin.password = password;
            await admin.save();
            console.log("🔄 Admin password updated:", email);
        }
    } catch (err) {
        console.error("❌ Error ensuring default admin:", err);
    }
}

