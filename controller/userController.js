const { User, Patient, Personal, Doctor, Nurse, Driver, Worker, ServiceChief } = require('../model/User');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const axios = require("axios");
require('dotenv').config();

// Start Of the Add User (CRUD) Operations

async function createPersonal(user, req) {
    const personal = new Personal({
        id_personal: user._id,
        age: req.body.age,
        admission_date: req.body.admission_date,
        conge: req.body.conge,
        nbr_conge: req.body.nbr_conge,
    });
    await personal.save();
    return personal;
}

async function createRoleSpecificRecord(role, personal, req) {
    if (role === "Doctor") {
        const doctor = new Doctor({
            id_doctor: personal._id,
            speciality: req.body.speciality,
            grade: req.body.grade,
        });
        await doctor.save();
    } else if (role === "Nurse") {
        const nurse = new Nurse({
            id_nurse: personal._id,
            poste_inf: req.body.poste_inf,
            grade_inf: req.body.grade_inf,
        });
        await nurse.save();
    } else if (role === "Driver") {
        const driver = new Driver({
            id_driver: personal._id,
            experience: req.body.experience,
            garde: req.body.garde,
        });
        await driver.save();
    } else if (role === "Chef") {
        const servicechief = new ServiceChief({
            id_chef: personal._id,
            speciality_chief: req.body.speciality_chief,
            garde: req.body.garde,
        });
        await servicechief.save();
    } else if (role === "worker") {
        const worker = new Worker({
            id_worker: personal._id,
            poste: req.body.poste,
        });
        await worker.save();
    } else {
        throw new Error("Invalid role");
    }
}

async function adduser(req, res, next) {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const validRoles = ["Patient", "Doctor", "Nurse", "Driver", "Chef", "worker"];
        if (!validRoles.includes(req.body.role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const pass = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const cryPass = await bcrypt.hash(pass, salt);

        const user = new User({
            name: req.body.name,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            role: req.body.role,
            country: req.body.country,
            city: req.body.city,
            password: cryPass,
        });

        await user.save();

        if (user.role === "Patient") {
            const patient = new Patient({
                id_patient: user._id,
                allergies: req.body.allergies,
                chronicDiseases: req.body.chronicDiseases,
                creation_date: Date.now(),
            });
            await patient.save();
        } else {
            const personal = await createPersonal(user, req);
            
            await createRoleSpecificRecord(user.role, personal, req);
        }

        res.json({ message: "User created successfully" });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
}
// End Of the Add User (CRUD) Operations

// Start Of the Edit User (CRUD) Operations

async function deleteRoleSpecificRecord(role, userId) {
    if (role === "Doctor") {
        await Doctor.deleteOne({ id_doctor: userId });
    } else if (role === "Nurse") {
        await Nurse.deleteOne({ id_nurse: userId });
    } else if (role === "Driver") {
        await Driver.deleteOne({ id_driver: userId });
    } else if (role === "Chef") {
        await ServiceChief.deleteOne({ id_chef: userId });
    } else if (role === "worker") {
        await Worker.deleteOne({ id_worker: userId });
    }
}

async function editUser(req, res, next) {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        const personal = await Personal.findOne({ id_personal: user._id });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const newRole = req.body.role;
        const oldRole = user.role;
        user.name = req.body.name || user.name;
        user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;
        user.country = req.body.country || user.country;
        user.city = req.body.city || user.city;

        await user.save();
        if(oldRole !== newRole && oldRole == "Patient") {
            await Patient.deleteOne({ id_patient: id });
            const newPersonal = await createPersonal(user, req);
            await createRoleSpecificRecord(user.role, newPersonal, req);
        }else if (oldRole == newRole && oldRole == "Patient") {
            const patient = await Patient.findById(user._id);
            await Patient.updateOne({ id_patient: user._id }, {
                allergies: req.body.allergies || patient.allergies,
                chronicDiseases: req.body.chronicDiseases || patient.chronicDiseases,
            });
        }else if (newRole !== "Patient") {
            const personal = await Personal.findOne({ id_personal: user._id });
            await Personal.updateOne({ id_personal: user._id }, {
                age: req.body.age || personal.age,
                admission_date: req.body.admission_date || personal.admission_date,
                conge: req.body.conge || personal.conge,
                nbr_conge: req.body.nbr_conge || personal.nbr_conge,
            });
            if (oldRole !== newRole){
                await deleteRoleSpecificRecord(oldRole, personal._id);
                createRoleSpecificRecord(user.role, personal, req);
            }else if(oldRole === newRole){
                if (newRole === "Doctor") {
                    await Doctor.updateOne({ id_doctor: personal._id }, {
                        speciality: req.body.speciality,
                        grade: req.body.grade,
                    });
                } else if (newRole === "Nurse") {
                    await Nurse.updateOne({ id_nurse: personal._id }, {
                        poste_inf: req.body.poste_inf,
                        grade_inf: req.body.grade_inf,
                    });
                } else if (newRole === "Driver") {
                    await Driver.updateOne({ id_driver: personal._id }, {
                        experience: req.body.experience,
                        garde: req.body.garde,
                    });
                } else if (newRole === "Chef") {
                    await ServiceChief.updateOne({ id_chef: personal._id }, {
                        speciality_chief: req.body.speciality_chief,
                        garde: req.body.garde,
                    });
                } else if (newRole === "worker") {
                    await Worker.updateOne({ id_worker: personal._id }, {
                        poste: req.body.poste,
                    });
                }
            } 
        } 
        res.json({ message: "User updated successfully" });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
}

// End Of the Edit User (CRUD) Operations

// Start Of the Delete User (CRUD) Operations

async function delUser(req, res, next) {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }else {
            if (user.role === "Patient") {
                await Patient.deleteOne({ id_patient: user._id });
            }else if (user.role !== "Patient"){
                const personal = await Personal.findOne({id_personal: user._id})
                await deleteRoleSpecificRecord(user.role,personal._id)
                await Personal.deleteOne({id_personal: user._id});
            }
            await User.findByIdAndDelete(user.id)
        }
        res.json({ message: "User Deleted successfully" });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
}

// End Of the Delete User (CRUD) Operations

// Start Of the Get User (CRUD) Operations

async function displayUser(req, res, next) {
    try {
        const users = await User.find();
        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        const userDetailsList = await Promise.all(users.map(async (user) => {
            let userDetails = {
                id: user._id,
                name: user.name,
                phoneNumber: user.phoneNumber,
                email: user.email,
                role: user.role,
                country: user.country,
                city: user.city,
            };

            if (user.role === "Patient") {
                const patient = await Patient.findOne({ id_patient: user._id });
                userDetails = {
                    ...userDetails,
                    allergies: patient.allergies,
                    chronicDiseases: patient.chronicDiseases
                };
            } else {
                const personal = await Personal.findOne({ id_personal: user._id });
                userDetails = {
                    ...userDetails,
                    age: personal.age,
                    admission_date: personal.admission_date,
                    conge: personal.conge,
                    nbr_conge: personal.nbr_conge
                };

                if (user.role === "Doctor") {
                    const doctor = await Doctor.findOne({ id_doctor: personal._id });
                    userDetails = {
                        ...userDetails,
                        speciality: doctor.speciality,
                        grade: doctor.grade
                    };
                } else if (user.role === "Nurse") {
                    const nurse = await Nurse.findOne({ id_nurse: personal._id });
                    userDetails = {
                        ...userDetails,
                        poste_inf: nurse.poste_inf,
                        grade_inf: nurse.grade_inf
                    };
                } else if (user.role === "Driver") {
                    const driver = await Driver.findOne({ id_driver: personal._id });
                    userDetails = {
                        ...userDetails,
                        experience: driver.experience,
                        garde: driver.garde
                    };
                } else if (user.role === "Chef") {
                    const servicechief = await ServiceChief.findOne({ id_chef: personal._id });
                    userDetails = {
                        ...userDetails,
                        speciality_chief: servicechief.speciality_chief,
                        garde: servicechief.garde
                    };
                } else if (user.role === "worker") {
                    const worker = await Worker.findOne({ id_worker: personal._id });
                    userDetails = {
                        ...userDetails,
                        poste: worker.poste
                    };
                }
            }

            return userDetails;
        }));

        res.json(userDetailsList);
    } catch (error) {
        console.error('Error displaying users:', error);
        res.status(500).json({ message: 'Error displaying users', error: error.message });
    }
}

// End Of the Get User (CRUD) Operations

// Start Of Login Function 

async function login(req, res, next) {
    try {
        const { email, password, recaptchaToken } = req.body;

        // Validate reCAPTCHA token
        const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY; // Store your reCAPTCHA secret key in .env
        const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${recaptchaToken}`;

        const recaptchaResponse = await axios.post(recaptchaUrl);
        if (!recaptchaResponse.data.success) {
            return res.status(400).json({ message: "reCAPTCHA verification failed. Please try again." });
        }

        // Proceed with login logic
        const foundUser = await User.findOne({ email: email });
        if (!foundUser) {
            return res.status(400).json({ message: "Email not found" });
        }

        const currentPass = foundUser.password;
        const isValidPassword = await bcrypt.compare(password, currentPass);
        if (!isValidPassword) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: foundUser._id, email: foundUser.email, role: foundUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            message: "User connected",
            auth_token: token,
            user: {
                id: foundUser._id,
                name: foundUser.name,
                email: foundUser.email,
                role: foundUser.role,
                phone: foundUser.phoneNumber,
                country: foundUser.country,
                city: foundUser.city,
            },
        });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ message: "Error in login", error: error.message });
    }
}

// End Of Login Function

// Start of Forget Password Function 
 
    async function forgetPassword(req, res, next) {
        const email = req.body.email;
        const foundUser = await User.findOne({ email: email });
        if (!foundUser) {
            return res.status(400).json({ message: "Email not found" });
        }
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'noreplay.infinitystack@gmail.com',
            pass: 'dwpf ienb ltmg tvgb'
        }
    });

    async function forgetPassword(req, res, next) {
        try {
            const email = req.body.email;
            const foundUser = await User.findOne({ email: email });
            if (!foundUser) {
                return res.status(400).json({ message: "Email not found" });
            }
    
            const token = crypto.randomBytes(20).toString('hex');
    
            foundUser.resetPasswordToken = token;
            foundUser.resetPasswordExpires = Date.now() + 3600000;
            await foundUser.save();
    
            const mailOptions = {
                to: foundUser.email,
                from: 'noreplay.infinitystack@gmail.com',
                subject: 'Emergency Password Reset Request',
                html: `
                    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                        <div style="background-color: #007BFF; padding: 20px; text-align: center; color: white;">
                            <h1 style="margin: 0;">Hospital Emergency System</h1>
                            <p style="margin: 5px 0 0;">Your safety and security are our priority.</p>
                        </div>
                        <div style="padding: 20px;">
                            <h2 style="color: #007BFF;">Password Reset Request</h2>
                            <p>Hello ${foundUser.name},</p>
                            <p>We received a request to reset your password for the Hospital Emergency System. If you did not make this request, please ignore this email.</p>
                            <p>To reset your password, please click the button below:</p>
                            <a href="http://localhost:5173/resetPass/${token}" 
                               style="display: inline-block; background-color: #007BFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
                                Reset Password
                            </a>
                            <p>If the button above does not work, copy and paste the following link into your browser:</p>
                            <p style="word-break: break-all;">http://localhost:5173/resetPass/${token}</p>
                            <p>This link will expire in <strong>1 hour</strong>.</p>
                            <p>If you have any questions or need further assistance, please contact our support team immediately.</p>
                            <p>Stay safe,</p>
                            <p><strong>Hospital Emergency System Team</strong></p>
                        </div>
                        <div style="background-color: #f8f9fa; padding: 10px; text-align: center; font-size: 12px; color: #666;">
                            <p>This is an automated message. Please do not reply to this email.</p>
                        </div>
                    </div>
                `
            };
    
            transporter.sendMail(mailOptions, (err, response) => {
                if (err) {
                    console.error('There was an error: ', err);
                    return res.status(500).json({ message: 'Error sending email', error: err.message });
                } else {
                    res.status(200).json({ message: 'Recovery email sent' });
                }
            });
        } catch (error) {
            console.error('Error in forgetPassword:', error);
            res.status(500).json({ message: 'Error in forgetPassword', error: error.message });
        }
    }

// End of Forget Password Function

// Start of Reset Password Function

async function resetPassword(req, res, next) {
    try {
        const token = req.params.token;
        const newPassword = req.body.password;

        const foundUser = await User.findOne({ 
            resetPasswordToken: token, 
            resetPasswordExpires: { $gt: Date.now() } 
        });

        if (!foundUser) {
            return res.status(400).json({ message: "Password reset token is invalid or has expired." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        foundUser.password = hashedPassword;
        foundUser.resetPasswordToken = undefined;
        foundUser.resetPasswordExpires = undefined;

        await foundUser.save();

        // Hospital-themed email template
        const mailOptions = {
            to: foundUser.email,
            from: 'noreplay.infinitystack@gmail.com',
            subject: 'Password Reset Successful',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                    <div style="background-color: #007BFF; padding: 20px; text-align: center; color: white;">
                        <h1 style="margin: 0;">Hospital Emergency System</h1>
                        <p style="margin: 5px 0 0;">Your safety and security are our priority.</p>
                    </div>
                    <div style="padding: 20px;">
                        <h2 style="color: #007BFF;">Password Reset Successful</h2>
                        <p>Hello ${foundUser.name},</p>
                        <p>Your password for the Hospital Emergency System has been successfully reset.</p>
                        <p>If you did not make this change, please contact our support team immediately to secure your account.</p>
                        <p>For your safety, we recommend:</p>
                        <ul>
                            <li>Keeping your password secure and not sharing it with anyone.</li>
                            <li>Using a strong, unique password that you don't use elsewhere.</li>
                            <li>Enabling two-factor authentication if available.</li>
                        </ul>
                        <p>If you have any questions or need further assistance, please don't hesitate to contact us.</p>
                        <p>Stay safe,</p>
                        <p><strong>Hospital Emergency System Team</strong></p>
                    </div>
                    <div style="background-color: #f8f9fa; padding: 10px; text-align: center; font-size: 12px; color: #666;">
                        <p>This is an automated message. Please do not reply to this email.</p>
                    </div>
                </div>
            `
        };

        transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
                console.error('Error sending email:', err);
                return res.status(500).json({ message: 'Password reset successful, but failed to send email notification.', error: err.message });
            } else {
                res.status(200).json({ message: "Password has been reset successfully. Notification email sent." });
            }
        });

    } catch (error) {
        console.error('Error in resetPassword:', error);
        res.status(500).json({ message: 'Error in resetPassword', error: error.message });
    }
}

// End of Reset Password Function

// Start of Find User By Email Function
async function findUserByEmail(req, res, next) {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const UserToSend = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phoneNumber: user.phoneNumber,
            city: user.city,
            country: user.country,
        };

        const personal = await Personal.findOne({ id_personal: user._id });
        const personalInfo = {
            age: personal.age,
            admission_date: personal.admission_date,
            conge: personal.conge,
            nbr_conge: personal.nbr_conge,
        };

        let userInfo = { ...UserToSend, ...personalInfo };

        if (user.role === "Doctor") {
            const doctor = await Doctor.findOne({ id_doctor: personal._id });
            userInfo = {
                ...userInfo,
                speciality: doctor.speciality,
                grade: doctor.grade,
            };
        } else if (user.role === "Nurse") {
            const nurse = await Nurse.findOne({ id_nurse: personal._id });
            userInfo = {
                ...userInfo,
                poste_inf: nurse.poste_inf,
                grade_inf: nurse.grade_inf,
            };
        } else if (user.role === "Driver") {
            const driver = await Driver.findOne({ id_driver: personal._id });
            userInfo = {
                ...userInfo,
                experience: driver.experience,
                garde: driver.garde,
            };
        } else if (user.role === "Chef") {
            const servicechief = await ServiceChief.findOne({ id_chef: personal._id });
            userInfo = {
                ...userInfo,
                speciality_chief: servicechief.speciality_chief,
                garde: servicechief.garde,
            };
        } else if (user.role === "worker") {
            const worker = await Worker.findOne({ id_worker: personal._id });
            userInfo = {
                ...userInfo,
                poste: worker.poste,
            };
        }

        res.status(200).json(userInfo);
    } catch (error) {
        console.error('Error in findUserByEmail:', error);
        res.status(500).json({ message: 'Error in findUserByEmail', error: error.message });
    }
}

// End of Find User By Email Function

//Start Of count Personelle function 
async function countPersonelle(req, res, next) {
    try {
        const countd = await Doctor.countDocuments();
        const countn = await Nurse.countDocuments();
        const countdr = await Driver.countDocuments();
        const countw = await Worker.countDocuments();
        const countsc = await ServiceChief.countDocuments();
        const count = countd + countn + countdr + countw + countsc;

        res.json(count);
    }catch (error) {
        console.error('Error in findUserByEmail:', error);
        res.status(500).json({ message: 'Error in findUserByEmail', error: error.message });
    }
}
//End Of count Personelle function

//Start Of count Patient function 
async function countPatient(req, res, next) {
    try {
        const count = await Patient.countDocuments();
        res.json(count);
    }catch (error) {
        console.error('Error in findUserByEmail:', error);
        res.status(500).json({ message: 'Error in findUserByEmail', error: error.message });
    }
}
//End Of count patient function

async function editUserPersonalInfo(req, res, next) {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        const personal = await Personal.findOne({ id_personal: user._id });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.name = req.body.name || user.name;
        user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
        user.email = user.email;
        user.role = user.role;
        user.country = user.country;
        user.city = user.city;

        await user.save();
        
        res.json({ message: "User info updated successfully" });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
}

async function editUserAdresslInfo(req, res, next) {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        const personal = await Personal.findOne({ id_personal: user._id });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.name = user.name;
        user.phoneNumber = user.phoneNumber;
        user.email = user.email;
        user.role = user.role;
        user.country = req.body.country || user.country;
        user.city = req.body.city || user.city;

        await user.save();
        
        res.json({ message: "User adress updated successfully" });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
}

async function editEmail(req, res, next) {
    try {
        const { oldEmail, newEmail } = req.body;

        // Validate input
        if (!oldEmail || !newEmail) {
            return res.status(400).json({ message: "Both old and new email addresses are required." });
        }

        // Check if the old email exists in the database
        const user = await User.findOne({ email: oldEmail });
        if (!user) {
            return res.status(404).json({ message: "Old email address not found." });
        }

        // Generate a token for email confirmation
        const token = crypto.randomBytes(20).toString('hex');

        // Save the token and expiration in the user's record
        user.resetEmailToken = token;
        user.resetEmailExpires = Date.now() + 3600000; // 1 hour
        user.newEmail = newEmail; // Temporarily store the new email
        await user.save();

        // Configure the email transport
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'noreplay.infinitystack@gmail.com',
                pass: 'dwpf ienb ltmg tvgb'
            }
        });

        // Email content
        const mailOptions = {
            to: oldEmail,
            from: 'noreplay.infinitystack@gmail.com',
            subject: 'Email Change Confirmation',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                    <div style="background-color: #007BFF; padding: 20px; text-align: center; color: white;">
                        <h1 style="margin: 0;">Hospital Emergency System</h1>
                        <p style="margin: 5px 0 0;">Your safety and security are our priority.</p>
                    </div>
                    <div style="padding: 20px;">
                        <h2 style="color: #007BFF;">Email Change Confirmation</h2>
                        <p>Hello ${user.name},</p>
                        <p>You requested to change your email address to <strong>${newEmail}</strong>.</p>
                        <p>Please confirm this change by clicking the button below:</p>
                        <a href="http://localhost:5173/confirmEmail/${token}" 
                           style="display: inline-block; background-color: #007BFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
                            Confirm Email Change
                        </a>
                        <p>If the button above does not work, copy and paste the following link into your browser:</p>
                        <p style="word-break: break-all;">http://localhost:5173/confirmEmail/${token}</p>
                        <p>This link will expire in <strong>1 hour</strong>.</p>
                        <p>If you did not make this request, please ignore this email.</p>
                        <p>Stay safe,</p>
                        <p><strong>Hospital Emergency System Team</strong></p>
                    </div>
                    <div style="background-color: #f8f9fa; padding: 10px; text-align: center; font-size: 12px; color: #666;">
                        <p>This is an automated message. Please do not reply to this email.</p>
                    </div>
                </div>
            `
        };

        // Send the email
        transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
                console.error('Error sending email:', err);
                return res.status(500).json({ message: 'Failed to send confirmation email.', error: err.message });
            } else {
                res.status(200).json({ message: 'Confirmation email sent successfully.' });
            }
        });
    } catch (error) {
        console.error('Error in editEmail:', error);
        res.status(500).json({ message: 'Error in editEmail', error: error.message });
    }
}

async function confirmEmailChange(req, res, next) {
    try {
        const { token } = req.params;

        // Find the user by the token and ensure it has not expired
        const user = await User.findOne({
            resetEmailToken: token,
            resetEmailExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Email change token is invalid or has expired." });
        }

        // Update the email address
        user.email = user.newEmail;
        user.newEmail = undefined; // Clear the temporary new email
        user.resetEmailToken = undefined;
        user.resetEmailExpires = undefined;

        await user.save();

        res.status(200).json({ message: "Email updated successfully." });
    } catch (error) {
        console.error('Error in confirmEmailChange:', error);
        res.status(500).json({ message: 'Error in confirmEmailChange', error: error.message });
    }
}





module.exports = { adduser , editUser , delUser , displayUser , login , forgetPassword , resetPassword,findUserByEmail , countPersonelle , countPatient,editUserPersonalInfo , editUserAdresslInfo , editEmail, confirmEmailChange };