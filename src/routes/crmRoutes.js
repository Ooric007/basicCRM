import { addNewContact, 
        getContacts, 
        getContactWithID, 
        updateContact, 
        deleteContact} from '../controllers/crmController';

const routes = (app) => {
    app.route('/contact')
    // get all contacts
    .get((req,res, next) => {
        // middleware
        console.log(`Request from: ${req.originalUrl}`)
        console.log(`Request type: ${req.method}`)
        next();  
    }, getContacts)

    // post new contact
    .post(addNewContact);

    app.route('/contact/:contactId')

    // get specific contact
    .get(getContactWithID)

    // update a contact
    .put(updateContact)

    // delete a contact
    .delete(deleteContact)
}

export default routes;
