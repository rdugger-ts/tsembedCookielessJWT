public with sharing class TSForSFUtils {
    @AuraEnabled(cacheable=true)
    public static User getUserInfoByEmail(String emailAddress) {
        try {
            // Querying user information based on provided email address
            String userEmail = UserInfo.getUserEmail();
            String userName  = UserInfo.getUserName();

            User userInfo = [ SELECT Division, Email, Username                              
                              FROM User 
                              WHERE Username = :userName
                              AND alias != 'guest'
                              LIMIT 1 ];
            return userInfo;
        } catch (Exception e) {
            // Handling any exceptions or errors
            System.debug('Error occurred while retrieving user information from getUserInfoByEmail: ' + e.getMessage());
            return null;
        }
    }

    @AuraEnabled(cacheable=true)
    //public static String makeHttpRequest(Map<String, Object> postData) {
    public static String httpGetTokenReq(Map<String, Object> postData) {
                
        system.debug('TOKEN postData'+postData);
        //  secret key from External Credential
        postData.put('secret_key', '{!$Credential.tsEmbedExtCred.password}');//External credentials
        postData.put('validity_time_in_sec', System.Label.TsValidityTime);//custom label
        //postData.put('org_id', System.Label.TsOrgId);//custom label
        
        
        // Convert postData to JSON
        String jsonBody = JSON.serialize(postData);
        system.debug('TOKEN JSON BODY'+jsonBody); 
        
        // HTTP request 
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint('callout:tsEmbedNamedCred'); // Named Credential
        request.setMethod('POST');
        request.setHeader('Content-Type','application/json');
        request.setHeader('Accept','application/json');
        request.setBody(jsonBody);
        HttpResponse response = http.send(request);
        system.debug('TOKEN response'+response);
        return response.getBody();
    }
}
