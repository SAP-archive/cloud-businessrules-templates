//Step 3A: Initialize business rules vocabulary model
this.oVocabularyModel = new sap.ui.model.odata.v2.ODataModel({
	serviceUrl: "/bpmrulesrepository/vocabulary_srv/",
	defaultBindingMode: sap.ui.model.BindingMode.TwoWay,
	defaultCountMode: sap.ui.model.odata.CountMode.None
});



// Step 3B: Initialize business rules decision table model
this.oRuleModel = new sap.ui.model.odata.v2.ODataModel({
	serviceUrl: "/bpmrulesrepository/rule_srv/",
	defaultBindingMode: sap.ui.model.BindingMode.TwoWay,
	defaultCountMode: sap.ui.model.odata.CountMode.None
});

var oDTConfig = new sap.rules.ui.DecisionTableConfiguration({
	enableSettings: true
});



// /Step 3C: Setup rule model to Rules Builder UI control
var oRuleBuilder = this.getView().byId("ruleBuilder");
oRuleBuilder.setModel(this.oRuleModel);
oRuleBuilder.setDecisionTableConfiguration(oDTConfig);



// Step 3D: Setup expression language to Rules Builder UI control
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
	error: function(data) { // alert(data);
	}
});



// Step 4A: Load and setup the result data object to the Rules Builder UI control”
oRuleModel.read(sRulePath, {
	success: function() {
		var sResultDataObjectIdProp = sRulePath + "/ResultDataObjectId";
		var sResultDataObjectId = oRuleModel.getProperty(sResultDataObjectIdProp);
		// If no result data object id provided, take default from Vocabulary
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



// Step 4B: Implementation for Activate Button press event
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



// Step 4C: Implementation for Edit Button press event. This function will enable to the decision table to be edited
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

// Step 4D: Implementation for Cancel Button press event. This function will
// cancel the decision editing.

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



// Step 4E: Implementation for Deploy Button press event. This function will deploy the changes in the decision table
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