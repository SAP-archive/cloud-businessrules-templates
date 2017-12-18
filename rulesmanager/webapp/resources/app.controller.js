sap.ui.define([
	"sap/ui/core/mvc/Controller"
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
			this.oVocabularyModel = new sap.ui.model.odata.v2.ODataModel({
				serviceUrl: "/bpmrulesrepository/vocabulary_srv/",
				defaultBindingMode: sap.ui.model.BindingMode.TwoWay,
				defaultCountMode: sap.ui.model.odata.CountMode.None
			});

			//Step 3B: Initialize business rules decision table model
			this.oRuleModel = new sap.ui.model.odata.v2.ODataModel({
				serviceUrl: "/bpmrulesrepository/rule_srv/",
				defaultBindingMode: sap.ui.model.BindingMode.TwoWay,
				defaultCountMode: sap.ui.model.odata.CountMode.None
			});

			var oDTConfig = new sap.rules.ui.DecisionTableConfiguration({
				enableSettings: true
			});

			//Step 3C: Setup rule model to Rules Builder UI control
			var oRuleBuilder = this.getView().byId("ruleBuilder");
			oRuleBuilder.setModel(this.oRuleModel);
			oRuleBuilder.setDecisionTableConfiguration(oDTConfig);

			//Step 3D: Setup expression language to Rules Builder UI control
			this.oVocabularyModel.read(sVocabularyPath, {
				urlParameters: {
					"$expand": "DataObjects/Associations,DataObjects/Attributes"
				},
				success: function(data) {
					if (!oExpressionLanguage) {
						oExpressionLanguage = new sap.rules.ui.services.ExpressionLanguage();
						oRuleBuilder.setExpressionLanguage(oExpressionLanguage);
					}
					oExpressionLanguage.setData(data);
					oVocabularyJson = data;
					oRuleBuilder.setBindingContextPath("/Rules(Id='" + ruleId + "',Version='" + ruleVersion + "')");
				},
				error: function(data) { //alert(data); 
				}
			});
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
			oRuleModel.read(sRulePath, {
				success: function() {
					var sResultDataObjectIdProp = sRulePath + "/ResultDataObjectId";
					var sResultDataObjectId = oRuleModel.getProperty(sResultDataObjectIdProp);
					//If no result data object id provided, take default from Vocabulary
					if (!sResultDataObjectId && oVocabularyJson.DataObjects && oVocabularyJson.DataObjects.results) {
						oVocabularyJson.DataObjects.results.forEach(function(oDataObject) {
							if (oDataObject.Usage === "RESULT" && !sResultDataObjectId) {
								sResultDataObjectId = oDataObject.Id;
							}
						});
						if (sResultDataObjectId) {
							oRuleModel.callFunction("/SetRuleResultDataObject", {
								method: "POST",
								urlParameters: {
									"RuleId": ruleId,
									"ResultDataObjectId": sResultDataObjectId
								},
								success: function(oRuleModel2, oResponseData2) {
									oRuleModel.refresh();
								},
								error: function(oError) {
									sap.m.MessageBox.error(oError);
								}
							});
						}
					}
				}
			});

		},

		// Step 4B: Implementation for Activate Button press event. 
		onActivatePress: function() {
			var ruleBuilderId = this.getView().byId("ruleBuilder");

			//********* INSERT THE CODE HERE **************************
			var oFIParam = {
				name: "ActivateRule",
				ruleBuilder: ruleBuilderId,
				method: "POST",
				async: false,
				success: function(oResponseData) {
					var oRuleModel = ruleBuilderId.getModel();
					oRuleModel.refresh(true, true);
				}.bind(this)
			};
			this.handleActionPress(oFIParam);
		},

		// Step 4C: Implementation for Edit Button press event. This function will enable to the decision table to be edited
		onEditPress: function() {
			var ruleBuilderId = this.getView().byId("ruleBuilder");
			ruleBuilderId.setEditable(true);

			this.getView().byId("cancelButton").setVisible(true);
			this.getView().byId("deployButton").setVisible(true);

			//********* INSERT THE CODE HERE **************************
			var oFIParam = {
				name: "EditRule",
				ruleBuilder: ruleBuilderId,
				method: "POST",
				success: function(oResponseData) {
					var oRuleModel = ruleBuilderId.getModel();
					this.setResultDataObject();
					oRuleModel.refresh(true);
				}.bind(this)
			};
			this.handleActionPress(oFIParam);
		},

		// Step 4D: Implementation for Cancel Button press event. This function will cancel the decision editing.
		onCancelPress: function() {
			var ruleBuilderId = this.getView().byId("ruleBuilder");
			ruleBuilderId.setEditable(false);

			//********* INSERT THE CODE HERE **************************
			var oFIParam = {
				name: "DeleteRuleDraft",
				ruleBuilder: ruleBuilderId,
				method: "POST",
				success: function(oResponseData) {
					var oRuleModel = ruleBuilderId.getModel();
					oRuleModel.resetChanges();
					oRuleModel.refresh(true, true);
				}.bind(this)
			};
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
						this.getView().byId("cancelButton").setVisible(false);
						this.getView().byId("deployButton").setVisible(false);
					}
				}),
				endButton: new sap.m.Button({
					text: 'No',
					press: function() {
						oCancelDialog.close();
						ruleBuilderId.setEditable(true);
						this.getView().byId("cancelButton").setVisible(true);
						this.getView().byId("deployButton").setVisible(true);
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
			var ruleBuilderId = this.getView().byId("ruleBuilder");
			var ruleServiceID = jQuery.sap.getUriParameters().get("ruleService");

			//********* INSERT THE CODE HERE **************************
			$.ajax({
				url: "/bpmrulesruntime/v1/rules/xsrf-token",
				method: "GET",
				contentType: "application/json",
				datatype: "json",
				async: false,
				headers: {
					"X-CSRF-Token": "Fetch"
				},
				success: function(resultXCRF, xhrRuleXCRF, dataRuleXCRF) {
					var token = dataRuleXCRF.getResponseHeader("X-CSRF-Token");
					$.ajax({
						url: "/bpmrulesruntime/v1/rules/deploy?RuleServiceId=%27" + ruleServiceID +
							"%27&RuleServiceVersion=%27000001%27&TargetRuntime=%27JAVA%27&TargetRuntimeVariant=%27Cloud%27",
						method: "POST",
						contentType: "application/json",
						datatype: "json",
						async: false,
						headers: {
							"X-CSRF-Token": token
						},
						success: function(resultRuleDeploy, xhrRuleDeploy, dataRuleDeploy) {
							sap.m.MessageToast.show("Rule deployed successfully");
						},
						error: function(oError) {
							sap.m.MessageBox.error(oError.responseText);
						}
					});
				},
				error: function(oError) {
					sap.m.MessageBox.error(oError.responseText);
				}
			});
			ruleBuilderId.setEditable(false);
			cancelButton.setVisible(false);
			deployButton.setVisible(false);
		}

	});
});