///////////////////////////////////////
//Prototype for TS Liveboard Embed  

// High-level steps:
//   : Update CORS and CSP settings in ThoughtSpot (Developer -> Security) - your Salesforce url(s)
//   : Update CORS and CSP settings in Salesforce - your thoughtspot cluster url
//   : Upload the ThoughtSpot SDK (js) into SF as Static Resource
//   : Update the configuration parameters in the LWC - ThoughtSpot URL & liveboard GUID

///////////////////////////////////////

import { LightningElement, api, track, wire } from 'lwc';
import getUserInfoByEmail from '@salesforce/apex/TSForSFUtils.getUserInfoByEmail';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import thoughtSpotSDK from '@salesforce/resourceUrl/thoughtSpotSDKv1280alpha5';
import { loadScript } from 'lightning/platformResourceLoader';
import httpGetTokenReq from '@salesforce/apex/TSForSFUtils.httpGetTokenReq';

export default class TsEmbedv2 extends LightningElement {
    @api objectApiName;
    @api recordId;
    
    advancedFilterValue;

    @api embedType;
    @api tsObjectGuid;
    @api orgID;
    @api tsURL;
    @api hideLiveboardHeader;
    @api showLiveboardTitle;
    @api fullHeight;

    // Use hashnames for private fields when that is accepted
    _filterOnRecordId = false;
    _tsAdvancedFilter;
    _sfAdvancedFilter;

    @track fieldsInfo=[];
    
    viz_height = 0;
    viz_width = 0;

    userEmail;
    @track userName;
    answerGuid;



    label = {
        //TsOrgID,
        //TsValidityTime,
        //liveBoardId
    };

    //showChildButtons - this child LWC creates a customized header above embedded Liveboard with events for downloading PDF, PNG, filter data, Refresh etc.
    //You can disable if needed.
    get showChildButtons() {
        if(this.embedType === 'Liveboard') {
            return true;
        }
        else {
            return false;
        }
    }

    @wire(getRecord, {
        recordId: '$recordId',
        fields: '$sfAdvancedFilter'
    })
    getRecord({ error, data }) {
        if (data) {
            console.log("RECORD DATA: ", JSON.stringify(data));
            this.advancedFilterValue = getFieldValue(
                data,
                this.sfAdvancedFilter
            );
            if (this.advancedFilterValue === undefined) {
                //c/childButtonsthis.errorMessage = `Failed to retrieve value for field ${this.sfAdvancedFilter}`;
            } else {
                //console.log("getRecord: no record found");
            }
        } else if (error) {
            //console.log("Failed to retrieve record data: ", error);
            }
        }

        @api
        get filterOnRecordId() {
            return this._filterOnRecordId;
        }
        set filterOnRecordId(val) {
            this._filterOnRecordId = val;
            console.log("FILTER on RECORD: ",  this._filterOnRecordId);
        }

        @api
        get tsAdvancedFilter() {
            return this._tsAdvancedFilter;
        }
        set tsAdvancedFilter(val) {
            this._tsAdvancedFilter = val;
            console.log("tsAdvancedFilter: ", this._tsAdvancedFilter);    
        }
    
        @api
        get sfAdvancedFilter() {
            return this._sfAdvancedFilter;
        }
        set sfAdvancedFilter(val) {
            this._sfAdvancedFilter = val;
            console.log("sfAdvancedFilter: ", this._sfAdvancedFilter);
        }

    handleRefresh(event) {
        // get the data passed in from the custom event detail
        console.log("onrefresh event handler @ parentViz lwc:", event);
        this.embedObj.render();
    }
    handlePDFexport(event) {
        // get the data passed in from the custom event detail
        console.log("onpdf event handler @ parentViz lwc:", event);
       
        console.log("###DOWNLOAD: ", tsembed.HostEvent.DownloadAsPdf);
        this.embedObj.trigger(tsembed.HostEvent.DownloadAsPdf);
    }
    handlePNGexport(event) {
        // get the data passed in from the custom event detail
        console.log("onpng event handler @ parentViz lwc:", event);
        console.log("ANSWER GUID: ", this.answerGuid);
        this.embedObj.trigger(tsembed.HostEvent.DownloadAsPng,{vizId: this.answerGuid});
    }
    handleLBEdit(event) {
        // get the data passed in from the custom event detail
        console.log("onlbedit event handler @ parentViz lwc:", event);
        console.log("*** TS Viz2: ",this.vizId);
        this.embedObj.trigger(tsembed.HostEvent.Edit,{vizId: this.answerGuid});
       
         
    }

    handleGetFilters(event) {
        // get the data passed in from the custom event detail
        console.log("ongetfilters event handler @ parentViz lwc:", event);
        // console.log("*** TS Viz2: ", this.vizID);
        
        this.embedObj.trigger(tsembed.HostEvent.GetFilters).then(f => {
            //console.log("### FILTER VALUES: ", JSON.stringify(f));
            const filterVals = f.liveboardFilters[0].filters[0].filterContent[0].value;
            console.log("FILTER VALUES: ", filterVals);
            console.log('this.obj ', JSON.stringify(filterVals));

            let myData = JSON.parse(JSON.stringify(filterVals));
            let keys = myData.map(item => item.key);
            console.log("KEY: "+ keys);

            this.fieldsInfo = myData.map(item => {
                return { label: item.key, value: item.key };
            }).filter(item => item.value != null);
    
        });
    }

    async connectedCallback() {
        //vfilterID is used to show how you can pull a value from SF and use as a filter in TS.
        getUserInfoByEmail()
            .then(data => {
                let filterID = data.Division;
                let userEmail = data.Email;
                this.userName = data.Username;
                
                localStorage.removeItem('vfilterID');
                
                window.localStorage.setItem("vfilterID", filterID);
                console.log("*** SET FILTER VALUE: ", filterID);
                console.log("*** Logged in user Email: ", userEmail);
                console.log("*** Logged in user Username: ", this.userName);
                console.log("*** TS URL: ", this.tsURL);
                //console.log("*** TS Viz: ", this.vizID);

                this.loadTSSDK();
        })
    }

    loadTSSDK() {
        loadScript(this, thoughtSpotSDK)
            .then(() => {
                // ThoughtSpot library loaded successfully
                this.initSDKEmbed();
            })
            .catch(error => {
                // Error occurred while loading the ThoughtSpot library
                this.handleError(error);
            });
    }

    async initSDKEmbed() {
        const containerDiv = this.template.querySelector(
            'div.thoughtspot-insightsJWT'
        );

        if (this.viz_height === 0) {
            let tempDiv = this.template.querySelector('div.thoughtspot-insightsJWT');
            this.viz_height = tempDiv.offsetHeight;
            this.viz_width = tempDiv.offsetWidth;
            console.log('LWC: Captured viz width of => ' + this.viz_width);
            console.log('LWC: Captured viz height of => ' + this.viz_height);
        }

        try {
            const thoughtSpotHost = this.tsURL;

            this.embedInit = tsembed.init({
                thoughtSpotHost: thoughtSpotHost,
                // https://developers.thoughtspot.com/docs/embed-auth
                authType: tsembed.AuthType.TrustedAuthTokenCookieless,
                autoLogin: true,
                customizations: {
                    style: {
                      customCSSUrl: "https://cdn.jsdelivr.net/gh/thoughtspot/custom-css-demo/css-variables.css", // location of your style sheet
                
                      // To apply overrides for your style sheet in this init, provide variable values below, eg
                      customCSS: {
                        variables: {
                          "--ts-var-button--secondary-background": "#c9c9c9",
                          "--ts-var-button--secondary--hover-background": "#5c5c5c",
                          "--ts-var-button--primary--hover-background":"#c9c9c9",
                          "--ts-var-button--primary-background": "#ffba90",

                          "--ts-var-root-background": "#ffba90",
                          "--ts-var-viz-border-radius": "22px",
                          "--ts-var-viz-title-font-family": "Helvetica",
                          "--ts-var-viz-background": "#ffffff",
                          
                          "--ts-var-menu-background": "#",
                          "--ts-var-menu--hover-background": "#666666",
                          "--ts-var-menu-font-family": "Helvetica",

                          "--ts-var-chip-border-radius": "22px",
                          "--ts-var-chip-box-shadow": false,
                          "--ts-var-chip-background": "#666666",
                          "--ts-var-chip--active-color": "#CF112C",
                          "--ts-var-chip--active-background": "grey",
                          "--ts-var-chip--hover-color": "red",
                          "--ts-var-chip--hover-background": "blue",
                          "--ts-var-chip-color": "grey",


                        },
                      },
                    },
                  },
                getAuthToken: ()=>this.makePostRequest(),
                   
            });

            if( this.embedType === "Liveboard") {

                console.log("###Embed Type: ", this.embedType);
                console.log("###data.accountId", this.recordId);
                console.log("TS Object Id -->", this.tsObjectGuid);
                tsembed.resetCachedAuthToken();

                this.embedObj = new tsembed.LiveboardEmbed(containerDiv, {
                    frameParams: {
                    },
                    fullHeight: true,
                    hideLiveboardHeader: false,
                    showLiveboardTitle: true,
                    showLiveboardDescription: true, 
                    liveboardId: this.tsObjectGuid
                    
                });
            } else if(this.embedType === "Sage") {

                console.log("###SAGE EmbedObj: ", this.embedObj);
                console.log("###SAGE Embed Type: ", this.embedType);

                this.embedObj = new tsembed.SageEmbed(containerDiv, {
                    frameParams: {
                    height: 800,
                    },
                    fullHeight: true,
                    
                    dataSource: this.tsObjectGuid,
                    hideSageAnswerHeader: false,
                    hideSearchBarTitle: false,
                });
            } else {
                console.log("###ERROR: No embed type selected in meta xml");
            }


            //Event for custom action (not priority for PoC)
            this.embedObj.on(tsembed.EmbedEvent.CustomAction, (data) => {
                console.log("### Data: ", JSON.stringify(data));
            });

            //Event for custom action (not priority for PoC)
            this.embedObj.on(tsembed.EmbedEvent.VizPointClick, ({data}) => {
                this.answerGuid = data.vizId;
                
            });

            this.embedObj.on(tsembed.EmbedEvent.LiveboardRendered, (payload) => {
            });

            this.embedObj.render();

            }
            catch (error) {
                console.error('Error:', error);
            }
    }

   async  makePostRequest() {
        //use of tempID is optional. The purpose of this variable is to show how you can use soql to identify values to filter liveboard data via runtime filter.
        let tempID = window.localStorage.getItem('vfilterID');
        console.log("*** APPLY FILTER VALUE:", tempID);
        let postData = '';
        
        if( this.embedType === "Liveboard" && this.recordId != null) {
            //recordId != null esentially means you are embedding in a page with access to SF record info. This pages can leverage context filtering.
            // Data to be sent in the POST request body
            postData = {
                username: this.userName,
                org_id: this.orgID,
                "user_parameters": {
                    "runtime_filters": [
                        // {
                        //     "column_name": "Account Id",
                        //     "operator": "EQ",
                        //     "values": [this.recordId],
                        //      "persist": false,
                        //    },
                     ],
                     "parameters": [
                    
                     ]
                   }
            }
            console.log('POST DATA for Liveboard Embed with Record ID: '+postData); 

            const response = await this.makeCallout(postData);
            return response.token;

        } else if( this.embedType === "Liveboard" && this.recordId == null) {
            //recordId == null esentially means you are embedding in a page with NO access to SF record info. This pages can not leverage context filtering.
            // Data to be sent in the POST request body
            postData = {
                username: this.userName,
                "user_parameters": {
                    "runtime_filters": [
                        
                     ],
                     "parameters": [
                    
                     ]
                   }
            } 
            console.log('POST DATA for Liveboard Embed with no Record ID: '+postData);            

            const response = await this.makeCallout(postData);
            return response.token;

        } else if(this.embedType === "Sage") {

            // Data to be sent in the POST request body
            postData = {
                username: this.userName,
                "user_parameters": {
                    "runtime_filters": [
                       
                     ],
                     "parameters": [
                     
                     ]
                   }
            } 

            const response = await this.makeCallout(postData);
            return response.token;

        } else {
          console.log("###ERROR: No embed type selected in meta xml");
        }

        console.log("###POST DATA: ", postData);

        
    } //End makePostRequest

    handleError(error) {
        // Handle errors gracefully
        console.error('Error loading TS library:', error.message || error);
    }



    //Make secure request for trusted auth token
    makeCallout(postData) {
        console.log('POST DATA In callapex method'+ JSON.stringify(postData));
        return new Promise((resolve, reject) => {
            httpGetTokenReq({ postData: postData })
            .then(result => {
                let data = JSON.parse(result)
                console.log('Auth Response:', data);
                resolve(data);
            })
            .catch(error => {
                console.error('Error: ', error);
                reject(error);
            });
        });
    }
}
