sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/rules/ui/services/ExpressionLanguage"
], function(Controller) {
	"use strict";

	var projectId;
	var ruleId;
	var ruleVersion;
	var oVocabularyJson;

	return Controller.extend("com.sap.cloud.samples.businessrules.rulesmanager.controller.app", {
		
		// Step 3: Create an instance of the Business Rules model in Application Controller.
		loadDecisionTable: function() {
			projectId = jQuery.sap.getUriParameters().get("ruleProjectID");
			ruleId = jQuery.sap.getUriParameters().get("ruleID");
			ruleVersion = jQuery.sap.getUriParameters().get("ruleVersion");

			var sVocabularyPath = "/Vocabularies('" + projectId + "')";
			var oExpressionLanguage;
			
			//apply compact density for desktop, the cozy design otherwise
			this.getView().addStyleClass(sap.ui.Device.system.desktop ? "sapUiSizeCompact" : "sapUiSizeCozy");

			//Step 3A: Initialize business rules vocabulary model
			

			//Step 3B: Initialize business rules decision table model
		

			//Step 3C: Setup rule model to Rules Builder UI control
			
			
			//Step 3D: Setup expression language to Rules Builder UI control
			
		},

		onAfterRendering: function() {
			this.loadDecisionTable();
		},

		//Handle isDraft formatter
		formatterIsDraft: function(d) {
			return d;
		},
		formatterNotIsDraft: function(d) {
			return !d;
		},
		//************************************************************************************************************************//

		// Step 4: Implement the button controls to manage lifecycle of rule
		handleActionPress: function(oFIParam) {
			var _oMessageHandler;
			var hasResponseErrors = function(oResponseData) {
				var sError;
				if (oResponseData.__batchResponses) {
					oResponseData.__batchResponses.forEach(function(oResponse) {
						if (oResponse.response) {
							var oJsonMessage = JSON.parse(oResponse.response.body);
							if (oJsonMessage.error) {
								sError = sError + oJsonMessage.error.message.value + " (" + oJsonMessage.error.code + ")" + "\n";
							}
						}
					});
				}
				return sError;
			};

			var performFunctionImport = function(oResponseData, oInFIParam) {
				if (!oResponseData || !hasResponseErrors(oResponseData)) {
					oInFIParam.ruleBuilder.getModel().callFunction("/" + oInFIParam.name, {
						method: oInFIParam.method,
						urlParameters: {
							"RuleId": ruleId
						},
						success: oInFIParam.success,
						error: function(oError) {
							if (!_oMessageHandler) {
								jQuery.sap.require("sap.rulesserviceRulesManager.controller.MessageHandler");
								_oMessageHandler = new sap.rulesserviceRulesManager.controller.MessageHandler();
							}
							_oMessageHandler.showErrorMessage(oError);
						}
					});
				}
			};
			if (oFIParam.ruleBuilder.getModel().hasPendingChanges()) {
				oFIParam.ruleBuilder.getModel().submitChanges({
					success: function(oResponseData) {
						return performFunctionImport(oResponseData, oFIParam);
					},
					error: function(oError) {
						if (!_oMessageHandler) {
							jQuery.sap.require("sap.rulesserviceRulesManager.controller.MessageHandler");
							_oMessageHandler = new sap.rulesserviceRulesManager.controller.MessageHandler();
						}
						_oMessageHandler.showErrorMessage(oError);
					}
				});
			} else {
				return performFunctionImport(null, oFIParam);
			}
		},

		//Step 4A: Load and setup the result data object to the Rules Builder UI control
		setResultDataObject: function() {
			var oRuleBuilder = this.getView().byId("ruleBuilder");
			var oRuleModel = oRuleBuilder.getModel();
			var sRulePath = oRuleBuilder.getBindingContextPath();

			//********* INSERT THE CODE HERE **************************
			
		},

		// Step 4B: Implementation for Activate Button press event. 
		onActivatePress: function() {
			var ruleBuilderId = this.getView().byId("ruleBuilder");
			
			//********* INSERT THE CODE HERE **************************
			
			
			this.handleActionPress(oFIParam);
		},

		// Step 4C: Implementation for Edit Button press event. This function will enable to the decision table to be edited
		onEditPress: function() {
			var ruleBuilderId = this.getView().byId("ruleBuilder");

			this.getView().byId("cancelButton").setVisible(true);
			this.getView().byId("deployButton").setVisible(true);
			this.getView().byId("editButton").setVisible(false);

			//********* INSERT THE CODE HERE **************************
		
			
			this.handleActionPress(oFIParam);
		},

		// Step 4D: Implementation for Cancel Button press event. This function will cancel the decision editing.
		onCancelPress: function() {
			var ruleBuilderId = this.getView().byId("ruleBuilder");
			var cancelButton = this.getView().byId("cancelButton");
			var deployButton = this.getView().byId("deployButton");
			var editButton = this.getView().byId("editButton");
			
			ruleBuilderId.setEditable(false);

			//********* INSERT THE CODE HERE **************************
			

			var handleActionPress = this.handleActionPress.bind(this);
			var oCancelDialog = new sap.m.Dialog({
				title: 'Cancel Rule Changes',
				type: 'Message',
				content: new sap.m.Text({
					text: 'Do you really want to cancel your changes?'
				}),
				beginButton: new sap.m.Button({
					text: 'Yes',
					press: function() {
						oCancelDialog.close();
						handleActionPress(oFIParam);
						ruleBuilderId.setEditable(false);
						cancelButton.setVisible(false);
						deployButton.setVisible(false);
						editButton.setVisible(true);
					}
				}),
				endButton: new sap.m.Button({
					text: 'No',
					press: function() {
						oCancelDialog.close();
						ruleBuilderId.setEditable(true);
						cancelButton.setVisible(true);
						deployButton.setVisible(true);
						editButton.setVisible(false);
					}
				})
			});

			oCancelDialog.open();
		},

		// Step 4E: Implementation for Deploy Button press event. 
		//This function will deploy the changes in the decision table
		onDeployPress: function() {
			//First Activate and then deploy
			this.onActivatePress();

			var cancelButton = this.getView().byId("cancelButton");
			var deployButton = this.getView().byId("deployButton");
			var editButton = this.getView().byId("editButton");
			
			var ruleBuilderId = this.getView().byId("ruleBuilder");
			var ruleServiceID = jQuery.sap.getUriParameters().get("ruleService");
			
			//********* INSERT THE CODE HERE **************************
			

		}

	});
});
