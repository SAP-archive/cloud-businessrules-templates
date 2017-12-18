# Template to Embed SAPUI5 Rule Builder Control in your Application
As an application developer or OEM partners, you can use this template to embed SAPUI5 Rule Builder control, of SAP Cloud Platform Business Rules, in your smart process application and enable business users to modify their business policies directly from the application, without the need to know the application logic.

## Solution Diagram
![Solution Diagram](https://github.com/SAP/cloud-businessrules-templates/blob/master/rulesmanagertemplate/webapp/images/BusinessRules_RulesBuilderControl_Diagram.png)

## Getting Started
Clone the repository, git clone https://github.com/SAP/cloud-businessrules-templates

### Prerequisites
You need to have the following:
1. SAP Cloud Platform (Neo) tenant with an active subscription to Business Rules service.Refer [here](https://blogs.sap.com/2017/04/26/sap-cloud-platform-business-rules-try-it-yourself/) for information on getting a free trial account of SAP Cloud Platform and how to enable SAP Cloud Platform Business Rules Service.
2. RuleSuperUser role for Runtime and Repository operations.
3. Developer role to create and deploy SAPUI5 applications in SAP Cloud Platform.
4. SAP WebIDE Full-Stack service enabled in SAP Cloud Platform.

## Project Overview
This template is an SAPUI5 Application with standard folder structure. The key files description are as follows:
1. webapp/view/app.view.js - This is the main file where you will learn how-to embed the RulesBuilder SAPUI5 control in the application.
2. webapp/controller/app.controller.js - This file will contain the implementation to (a) Initialize business rules vocabulary and decision table models, (b) Setup Rule Builder control and associate rule expression language to it and (c) Implement button control to drive the lifecycle of the business rules like Edit, Save, Activate and Deploy 

## Deployment
After you have implemented the view and controller, you can deploy the SAPUI5 application in your SAP Cloud Platform tenant. To do so, right click on the project and choose option: Deploy --> Deploy to SAP Cloud Platform

## Authors
Archana Shukla

## Copyright and License
Copyright (c) 2017 SAP SE. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. 
You may obtain a copy of the License at > http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an 
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
