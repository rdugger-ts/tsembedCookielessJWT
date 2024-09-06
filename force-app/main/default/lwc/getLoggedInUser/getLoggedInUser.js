import {
    LightningElement,
    wire,
    track
} from 'lwc';
import {
    getRecord
} from 'lightning/uiRecordApi';
 
import USER_ID from '@salesforce/user/Id';
 
import NAME_FIELD from '@salesforce/schema/User.Name';
import EMAIL_FIELD from '@salesforce/schema/User.Email';
 
 
export default class Userinfoexample extends LightningElement {
    @track error ;
    @track email ; 
    @track name;
    @wire(getRecord, {
        recordId: USER_ID,
        fields: [NAME_FIELD, EMAIL_FIELD]
    }) wireuser({
        error,
        data
    }) {
        if (error) {
           this.error = error ; 
        } else if (data) {
            this.email = data.fields.Email.value;
            this.name = data.fields.Name.value;
        }
    }
 
}