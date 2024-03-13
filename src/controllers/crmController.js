import mongoose from 'mongoose';
import { ContactSchema } from '../models/crmModel';

const Contact = mongoose.model('Contact', ContactSchema);

//#region VALIDATIONS
const validateFirstName = (firstName) => {
    // Check if the first name length is between 1 and 26 characters
    if (firstName.length < 1 || firstName.length > 26) {
        return false;
    }

    // Check if the first name contains only valid characters
    if (!/^[a-zA-Z](?!.*[ '-]{2,})[a-zA-Z' -]*$/.test(firstName)) {
        return false;
    }

    return true;
};

const validateLastName = (lastName) => {
    // Check if the last name length is between 1 and 38 characters
    if (lastName.length < 1 || lastName.length > 38 || !lastName.trim()) {
        return false;
    }

    // Check if the last name contains only valid characters
    if (!/^[a-zA-Z](?!.*[ '-]{2,})[a-zA-Z' -]*$/.test(lastName)) {
        return false;
    }

    return true;
};

const validateCompany = (companyName) => {
    // Check if the company length is between 1 and 60 characters
    if (companyName.length < 1 || companyName.length > 60) {
        return false;
    }

    // Check if the company contains only valid characters
    if (!/^[a-zA-Z0-9](?!.*([ '-@]){2})[a-zA-Z0-9' -@]*[a-zA-Z0-9]$/.test(companyName)) {
        return false;
    }

    return true;
};

const validatePhoneNumber = (phoneNumber) => {
    phoneNumber = String(phoneNumber);

    // Check if the phone number starts with 0 or 1 in the 1st and 4th positions
    if (phoneNumber.charAt(0) === '0' || phoneNumber.charAt(3) === '0' ||
        phoneNumber.charAt(0) === '1' || phoneNumber.charAt(3) === '1') 
    {
        return false;
    }

    // Check if the phone number has exactly 10 digits
    if (!/^\d{10}$/.test(phoneNumber)) {
        return false;
    }

    return true;
};

const validateEmail = (email) => {
    // Regular expression pattern for validating email address
    const emailPattern = /^(?!.*(?:[\W_]{2,}))[a-zA-Z0-9](?:[a-zA-Z0-9._+-]{0,62}[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,253}[a-zA-Z0-9]\.)+[a-zA-Z]{2,63}$/;
    
    // Check if the email matches the pattern and total length does not exceed 320 characters
    return emailPattern.test(email) && email.length <= 320;
};
//#endregion

//#region Add/Get/Update/Delete
export const addNewContact = async (req, res) => { 
    try { 
        let newContact = new Contact(req.body); 

        if (!newContact.firstName || !newContact.lastName) {
            return res.status(400).json({ error: 'Missing required fields', message: 'Both first and last name are required' });
        }

        if (!validateFirstName(newContact.firstName)) {
            return res.status(422).json({ error: 'Invalid first name', message: 'You must enter a valid name (a-Z, space, -, \')' });
        }
        if (!validateLastName(newContact.lastName)) {
            return res.status(422).json({ error: 'Invalid last name', message: 'You must enter a valid name (a-Z, space, -, \')' });
        }
        if (newContact.company && !validateCompany(newContact.company)) {
            return res.status(422).json({ error: 'Invalid company name', message: 'You must enter a valid name' });
        }
        if (newContact.phone && !validatePhoneNumber(newContact.phone)) {
            return res.status(422).json({ error: 'Invalid phone number', message: 'You must enter a valid 10-digit US phone number' });
        }
        if (newContact.email && !validateEmail(newContact.email)) {
            return res.status(422).json({ error: 'Invalid email address', message: 'You must enter a valid email address' });
        }

        const contact = await newContact.save(); 
        res.status(201).json(contact);
    } 
    catch (err) { 
        res.status(500).send(err); 
    } 
};

export const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find({});
        res.json(contacts);
    } catch (err) {
        res.status(500).send(err);
    }
};

export const getContactWithID = async (req, res) => {
    try {
        const contactId = req.params.contactId;

        // Check if the contactId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(contactId)) {
            return res.status(400).json({ error: 'Invalid contact ID', message: 'The provided contact ID is not valid' });
        }
        
        const findContact = await Contact.findById(req.params.contactId);
        res.json(findContact);
    } catch (err) {
        res.status(500).send(err);
    }
};

export const updateContact = async (req, res) => {
    try {
        const update = req.body;
        const contactId = req.params.contactId;

        // Check if the contactId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(contactId)) {
            return res.status(400).json({ error: 'Invalid contact ID', message: 'The provided contact ID is not valid' });
        }

        if (update.firstName !== undefined && !validateFirstName(update.firstName)) {
            return res.status(422).json({ error: 'Invalid first name', message: 'You must enter a valid name (a-Z, space, -, \')' });
        }
        if (update.lastName !== undefined && !validateLastName(update.lastName)) {
            return res.status(422).json({ error: 'Invalid last name', message: 'You must enter a valid name (a-Z, space, -, \')' });
        }
        if (update.company && !validateCompany(update.company)) {
            return res.status(422).json({ error: 'Invalid company name', message: 'You must enter a valid name' });
        }
        if (update.phone && !validatePhoneNumber(update.phone)) {
            return res.status(422).json({ error: 'Invalid phone number', message: 'You must enter a valid 10-digit US phone number' });
        }
        if (update.email && !validateEmail(update.email)) {
            return res.status(422).json({ error: 'Invalid email address', message: 'You must enter a valid email address' });
        }

        const updateContact = await Contact.findOneAndUpdate({ _id: req.params.contactId}, update, { new: true });

        if (!updateContact) {
            return res.status(404).json({ error: 'Contact not found', message: 'No contact with the specified ID was found' });
        }

        res.json(updateContact);
    } catch (err) {
        console.error('Error updating contact:', err);
        res.status(500).json({ error: 'Internal server error', message: 'An unexpected error occurred while updating the contact' });

    }
};

export const deleteContact = async (req, res) => {
    try {
        const contactId = req.params.contactId;

        // Check if the contactId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(contactId)) {
            return res.status(400).json({ error: 'Invalid contact ID', message: 'The provided contact ID is not valid' });
        }

        const contact = await Contact.findById(req.params.contactId);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        await Contact.findByIdAndDelete(req.params.contactId);
        return res.json({ message: 'Successfully deleted contact' });
    } catch (err) {
        return res.status(500).send(err);
    }
};
//#endregion
