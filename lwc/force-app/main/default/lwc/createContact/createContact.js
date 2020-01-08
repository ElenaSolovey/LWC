import { LightningElement, track, wire } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import getOppdata from '@salesforce/apex/RecordCreateController.retriveAccounts';

const columns = [
  {
    label: 'Account Name',
    fieldName: 'AccountName',
    type: 'text'
  }, {
    label: 'Account Owner',
    fieldName: 'AccountOwner',
    type: 'text'
  }
];

export default class LdsCreateRecord extends LightningElement {
  @track accountId;
  @track data = [];
  @track columns = columns;

  name = '';

  handleNameChange(event) {
    this.name = event.target.value;
  }
  createAccount() {
    const fields = {};
    fields[NAME_FIELD.fieldApiName] = this.name;
    const recordInput = { apiName: ACCOUNT_OBJECT.objectApiName, fields };
    createRecord(recordInput)
      .then(account => {
        this.accountId = account.id;
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Success',
            message: 'Account created',
            variant: 'success',
          }),
        );
      })
      .catch(error => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Error creating record',
            message: error.body.message,
            variant: 'error',
          }),
        );
      });
  }
  @wire(getOppdata)
  opp({error, data}) {
    if (data) {
      let currentData = [];
      data.forEach((row) => {
        let rowData = {};
        rowData.AccountName = row.Name;
        rowData.AccountOwner = row.OwnerId;
      //if (row.Account) {
       // rowData.AccountName = row.Name;
      //  rowData.AccountOwner = row.Owner.Name;
       currentData.push(rowData);
      });

      this.data = currentData;
    } else if (error) {
      window.console.log(error);
    }
  }

}