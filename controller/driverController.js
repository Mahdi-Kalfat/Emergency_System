const Ambulance = require('../model/Ambulance');
const { User, Patient, Personal, Doctor, Nurse, Driver, Worker, ServiceChief } = require('../model/User');


async function createAmbulance(req, res, next) {
        const id = req.body.id_driver;
        const foundDriver = await Driver.findOne({ id_driver: id });
        const foundPersonal = await Personal.findOne({ _id: id });
        const foundUser = await User.findOne({ _id: foundPersonal.id_personal });
        if (foundUser.role === 'Driver') {
        // important to add the driver license number and affect it to the ambulance
        const driverexp = foundDriver.experience;
        // add And ambulance and its based on the driver level of experience
        // if driver is beginner, the ambulance can only be Standard
        if (driverexp === 'Beginner') {
                const ambulance = new Ambulance({
                        id_driver: id,
                        matricule: req.body.matricule,
                        admission_date: req.body.admission_date,
                        brand: req.body.brand,
                        plate_number: req.body.plate_number,
                        ambulance_type: 'Standard'
                });
                await ambulance.save();
                res.status(201).json(ambulance);
        }
        // if driver is Intermediate the ambulance can be Standard or Urgent
        if (driverexp === 'Intermediate') {
                const ambulance = new Ambulance({
                        id_driver: id,
                        matricule: req.body.matricule,
                        admission_date: req.body.admission_date,
                        brand: req.body.brand,
                        plate_number: req.body.plate_number,
                        ambulance_type: 'Standard' || 'Urgent'
                });
                await ambulance.save();
                res.status(201).json(ambulance);
        }
        // if driver is Expert the ambulance can be Standard, Urgent or Very Urgent or Immediate
        if (driverexp === 'Expert') {
                const ambulance = new Ambulance({
                        id_driver: id,
                        matricule: req.body.matricule,
                        admission_date: req.body.admission_date,
                        brand: req.body.brand,
                        plate_number: req.body.plate_number,
                        ambulance_type: 'Standard' || 'Urgent' || 'Very Urgent' || 'Immediate'
                });
                await ambulance.save();
                
                res.status(201).json(ambulance);
        }

        }
}

module.exports = { createAmbulance };