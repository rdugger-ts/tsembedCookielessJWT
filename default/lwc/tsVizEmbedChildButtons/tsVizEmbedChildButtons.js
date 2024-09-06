import { LightningElement, api, track, wire } from 'lwc';

export default class TsVizEmbedChildButtons extends LightningElement {
    clickedButtonLabel;
    @api fieldsInfo;

    // flag to control display of edit button
    //@track showEditButton = true; 

    // handleClickForVizMenu(event) {
    //     this.clickedButtonLabel = event.target.label;
    //     console.log("onclick event handler Viz Menu @ buttons lwc", this.clickedButtonLabel);

    //     // create variable called "vizMenuEvent" and assign value of custom event called "vizmenu" 
    //     // which routes the pdf export button click to parent lwc
    //     const vizMenuEvent = new CustomEvent('vizmenu', {
            
    //         // pass onclick data in custom event
    //         // note: we don't need to pass this data for this event
    //         // but this is how we would pass values
    //         // e.g. filter values
    //         detail: this.clickedButtonLabel
    //     });
        
    //     // dispatch the custom event
    //     this.dispatchEvent(vizMenuEvent);

    // }

    // handleClickForHome(event) {
    //     this.clickedButtonLabel = event.target.label;
    //     console.log("onclick event handler Home Page @ buttons lwc", this.clickedButtonLabel);

    //      // create variable called "goHomeEvent" and assign value of custom event called "gohome" 
    //     // which routes the pdf export button click to parent lwc
    //     const goHomeEvent = new CustomEvent('gohome', {
            
    //         // pass onclick data in custom event
    //         // note: we don't need to pass this data for this event
    //         // but this is how we would pass values
    //         // e.g. filter values
    //         detail: this.clickedButtonLabel
    //     });
        
    //     // dispatch the custom event
    //     this.dispatchEvent(goHomeEvent);

    // }
    
    // handleClickForRevertViz(event) {
    //     this.clickedButtonLabel = event.target.label;
    //     console.log("onclick event handler Revert Viz @ buttons lwc", this.clickedButtonLabel);

    //      // create variable called "vizRevertEvent" and assign value of custom event called "vizrevert" 
    //     // which routes the pdf export button click to parent lwc
    //     const vizRevertEvent = new CustomEvent('vizrevert', {
            
    //         // pass onclick data in custom event
    //         // note: we don't need to pass this data for this event
    //         // but this is how we would pass values
    //         // e.g. filter values
    //         detail: this.clickedButtonLabel
    //     });
        
    //     // dispatch the custom event
    //     this.dispatchEvent(vizRevertEvent);

    // }

    handleClickForRefresh(event) {
        this.clickedButtonLabel = event.target.label;
        console.log("onclick event handler Refresh @ buttons lwc", this.clickedButtonLabel);

         // create variable called "RefreshEvent" and assign value of custom event called "refresh" 
        // which routes the refresh button click to parent lwc
        const RefreshEvent = new CustomEvent('refresh', {
            
            // pass onclick data in custom event
            // note: we don't need to pass this data for this event
            // but this is how we would pass values
            // e.g. filter values
            detail: this.clickedButtonLabel
        });
        
        // dispatch the custom event
        this.dispatchEvent(RefreshEvent);

    }

    handleClickForPDFexport(event) {
        this.clickedButtonLabel = event.target.label;
        console.log("onclick event handler PDF Export @ buttons lwc", this.clickedButtonLabel);

         // create variable called "pdfExportEvent" and assign value of custom event called "pdf" 
        // which routes the pdf export button click to parent lwc
        const pdfExportEvent = new CustomEvent('pdf', {
            
            // pass onclick data in custom event
            // note: we don't need to pass this data for this event
            // but this is how we would pass values
            // e.g. filter values
            detail: this.clickedButtonLabel
        });
        
        // dispatch the custom event
        this.dispatchEvent(pdfExportEvent);

    }

    // standard web api "onclick" global event calls this event handler function
    handleClickForPNGexport(event) {
        this.clickedButtonLabel = event.target.label;
        console.log("onclick event handler PNG Export @ buttons lwc", this.clickedButtonLabel);

        // create variable called "pngExportEvent" and assign value of custom event called "png" 
        // which routes the png export button click to parent lwc
        const pngExportEvent = new CustomEvent('png', {
            
            // pass onclick data in custom event
            // note: we don't need to pass this data for this event
            // but this is how we would pass values
            // e.g. filter values
            detail: this.clickedButtonLabel
        });
        
        // dispatch the custom event
        this.dispatchEvent(pngExportEvent);

    }

    // standard web api "onclick" global event calls this event handler function
    handleClickForEdit(event) {
        this.clickedButtonLabel = event.target.label;
        console.log("onclick event handler Edit @ buttons lwc", this.clickedButtonLabel);

        // create variable called "editEvent" and assign value of custom event called "edit" 
        // which routes the edit button click to parent lwc
        const editEvent = new CustomEvent('lbedit', {
            
            // pass onclick data in custom event
            // note: we don't need to pass this data for this event
            // but this is how we would pass values
            // e.g. filter values
            detail: this.clickedButtonLabel
        });
        
        // dispatch the custom event
        this.dispatchEvent(editEvent);

    }

    // standard web api "onclick" global event calls this event handler function
    handleClickForGetFilters(event) {
        this.clickedButtonLabel = event.target.label;
        console.log("onclick event handler GetFilters @ buttons lwc", this.clickedButtonLabel);

        // create variable called "getfiltersEvent" and assign value of custom event called "getfilters" 
        // which routes the edit button click to parent lwc
        const editEvent = new CustomEvent('getfilters', {
            
            // pass onclick data in custom event
            // note: we don't need to pass this data for this event
            // but this is how we would pass values
            // e.g. filter values
            detail: this.clickedButtonLabel
        });
        
        // dispatch the custom event
        this.dispatchEvent(editEvent);

    }

    // // standard web api "onclick" global event calls this event handler function
    // handleClickForImageExport(event) {
    //     this.clickedButtonLabel = event.target.label;
    //     console.log("onclick event handler Image Export @ buttons lwc", this.clickedButtonLabel);

    //      // create variable called "ImageExportEvent" and assign value of custom event called "image" 
    //     // which routes the image export button click to parent lwc
    //     const ImageExportEvent = new CustomEvent('image', {
            
    //         // pass onclick data in custom event
    //         // note: we don't need to pass this data for this event
    //         // but this is how we would pass values
    //         // e.g. filter values
    //         detail: this.clickedButtonLabel
    //     });
        
    //     // dispatch the custom event
    //     this.dispatchEvent(ImageExportEvent);

    // }

    // // standard web api "onclick" global event calls this event handler function
    // handleClickForDataExport(event) {
    //     this.clickedButtonLabel = event.target.label;
    //     console.log("onclick event handler Data Export @ buttons lwc", this.clickedButtonLabel);

    //      // create variable called "DataExportEvent" and assign value of custom event called "datax" 
    //     // which routes the image export button click to parent lwc
    //     const DataExportEvent = new CustomEvent('datax', {
            
    //         // pass onclick data in custom event
    //         // note: we don't need to pass this data for this event
    //         // but this is how we would pass values
    //         // e.g. filter values
    //         detail: this.clickedButtonLabel
    //     });
        
    //     // dispatch the custom event
    //     this.dispatchEvent(DataExportEvent);

    // }

    // // standard web api "onclick" global event calls this event handler function
    // handleClickForWebEdit(event) {
    //     this.clickedButtonLabel = event.target.label;
    //     console.log("onclick event handler Web Edit @ buttons lwc", this.clickedButtonLabel);

    //      // create variable called "webEditEvent" and assign value of custom event called "pdf" 
    //     // which routes the pdf export button click to parent lwc
    //     const webEditEvent = new CustomEvent('webedit', {
            
    //         // pass onclick data in custom event
    //         // note: we don't need to pass this data for this event
    //         // but this is how we would pass values
    //         // e.g. filter values
    //         detail: this.clickedButtonLabel
    //     });
        
    //     // dispatch the custom event
    //     this.dispatchEvent(webEditEvent);

    // }

}