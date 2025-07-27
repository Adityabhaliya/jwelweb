const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwtHelper = require('../config/token');
const crypto = require('crypto');
const emailTemp = require('../config/email');

// Register
exports.register = async (req, res) => {
  try {
    const { name, lastname, email, password, role } = req.body;

    if (!email || !password ) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Missing required fields',
      });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({
        success: false,
        status: 409,
        message: 'Email already registered',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      lastname,
      email,
      password: hashedPassword,
      role: 2,
    });

    return res.status(201).json({
      success: true,
      status: 201,
      message: 'User registered successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Registration failed',
    });
  }
};

// Login for User (role = 2)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email, role: 2 } });
    if (!user) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'User not found or role mismatch',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        status: 401,
        message: 'Invalid credentials',
      });
    }

    await user.update({ last_login: new Date() });

    const token = jwtHelper.generateToken(user.id, user.role);

    return res.status(200).json({
      success: true,
      status: 200,
      message: 'Login successful',
      token,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Login failed',
    });
  }
};

// Login for Admin (role = 1)
exports.adminlogin = async (req, res) => {
  try {
    const { email, password, name, is_sub_admin } = req.body;
    if (is_sub_admin === true) {
      const user = await User.findOne({
        where: {
          name,
          is_sub_admin: true
        }
      });
      if (!user) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: 'Admin not found or role mismatch',
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          status: 401,
          message: 'Invalid credentials',
        });
      }

      await user.update({ last_login: new Date() });

      const token = jwtHelper.generateToken(user.id, user.role);

      return res.status(200).json({
        success: true,
        status: 200,
        message: 'Login successful',
        token,
        data: {
          id: user.id,
          name: user.name,
          role: user.role,
        },
      });
    } else {
      const user = await User.findOne({
        where: {
          email, role: 1
        }
      });
      if (!user) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: 'Admin not found or role mismatch',
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(200).json({
          success: false,
          status: 401,
          message: 'Invalid credentials',
        });
      }

      await user.update({ last_login: new Date() });

      const token = jwtHelper.generateToken(user.id, user.role);

      return res.status(200).json({
        success: true,
        status: 200,
        message: 'Login successful',
        token,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Admin login failed',
    });
  }
};

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'reset_token'] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      status: 200,
      message: 'Profile fetched successfully',
      data: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Failed to fetch profile',
    });
  }
};

exports.access = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'reset_token'] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      status: 200,
      message: 'access_json fetched successfully',
      data: user.access_json,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Failed to fetch access_json',
    });
  }
};


exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(200).json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(resetToken, 10);

    await User.update(
      { reset_token: hashedToken },
      { where: { email } }
    );

    await emailTemp.sendOtpEmail(email, resetToken);

    return res.status(200).json({ success: true, message: 'Password reset email sent successfully', email });
  } catch (error) {
    console.error("Forget password error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    const user = await User.findOne({ where: { reset_token: token } });
    if (!user || !user.reset_token) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    // Convert password to a string (important fix)
    const passwordString = newPassword.toString();

    // Hash new password
    const hashedPassword = await bcrypt.hash(passwordString, 10);

    // Update password and clear reset token
    await User.update(
      { password: hashedPassword, reset_token: null },
      { where: { reset_token: token } }
    );

    return res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


exports.resetChangePassword = async (req, res) => {
  try {
    const { old_password, new_password, confirm_password } = req.body;

    if (!new_password || !confirm_password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (new_password !== confirm_password) {
      return res.status(200).json({ success: false, message: "Passwords do not match" });
    }

    // Find user by token
    const user = await User.findOne({ where: { role: 1 } });

    if (!user) {
      return res.status(200).json({ success: false, message: "Invalid or expired token" });
    }

    // If old password is provided, verify it
    if (old_password) {
      const isMatch = await bcrypt.compare(old_password, user.password);
      if (!isMatch) {
        return res.status(200).json({ success: false, message: "Old password is incorrect" });
      }
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(new_password.toString(), 10);

    // Update password and remove reset token
    await User.update(
      { password: hashedPassword },
      { where: { id: user.id } }
    );

    return res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


exports.createSubadmin = async (req, res) => {
  try {
    const { name, email, password ,access_json } = req.body;

    const checkName = await User.findOne({ where: { name, is_sub_admin: true } })
    if (checkName) {
      return res.status(400).json({
        success: false,
        message: 'Subadmin with this name already exists',
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const subadmin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 3,
      is_sub_admin: true,
      access_json
    });

    res.status(201).json({
      success: true,
      message: 'Subadmin created successfully',
      data: subadmin
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error creating subadmin', error: err.message });
  }
};

exports.changeSubadminPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { old_password, new_password } = req.body;

    const subadmin = await User.findOne({ where: { id, role: 3 } });
    if (!subadmin) return res.status(404).json({ success: false, message: 'Subadmin not found' });
    const isMatch = await bcrypt.compare(old_password, subadmin.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Old password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    await subadmin.update({ password: hashedPassword });

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to change password', error: err.message });
  }
};