public inherited sharing class RecordCreateController {
    @AuraEnabled(cacheable=true)
    public static list<Account> retriveAccounts() {
        return [SELECT Id, Name, OwnerId  FROM Account LIMIT 10];
    }
}
