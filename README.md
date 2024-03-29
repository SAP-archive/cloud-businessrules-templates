![](https://img.shields.io/badge/STATUS-NOT%20CURRENTLY%20MAINTAINED-red.svg?longCache=true&style=flat)

# Important Notice
This public repository is read-only and no longer maintained.


# Use SAPUI5 Application Template to Author and Manage SAP Cloud Platform Business Rules
As an application developer or OEM partners, you can use this template to embed SAPUI5 Rule Builder control, of SAP Cloud Platform Business Rules, in your smart process application and enable business users to modify their business policies directly from the application, without the need to know the application logic.

## Solution Diagram
![Solution Diagram](https://github.com/SAP/cloud-businessrules-templates/blob/master/rulesmanager/webapp/images/BusinessRules_RulesBuilderControl_Diagram.png)

## Getting Started
1. Download the content from the git: https://github.com/SAP/cloud-businessrules-templates
2. Extract the content into local file system
3. Zip all the content inside /cloud-businessrules-templates-master/rulesmanager folder
4. Open SAP Web IDE Full-Stack and import the project zip using File --> Import --> From File System option.
Note: While importing ensure that the project name is rulesmanager

### Prerequisites
You need to have the following for **rulesmanager** template:
1. SAP Cloud Platform (Neo) account with an active subscription to Business Rules service.Refer [here](https://blogs.sap.com/2017/04/26/sap-cloud-platform-business-rules-try-it-yourself/) for information on getting a free trial account of SAP Cloud Platform and how to enable SAP Cloud Platform Business Rules Service.
2. **RuleSuperUser** role for Runtime and Repository operations.
3. Developer role to create and deploy SAPUI5 applications in SAP Cloud Platform.
4. SAP WebIDE Full-Stack service enabled in SAP Cloud Platform.

You need to have the following for **rulesprojects** template:
1. SAP Cloud Platform (Neo) account with an active subscription to Business Rules service.Refer [here](https://blogs.sap.com/2017/04/26/sap-cloud-platform-business-rules-try-it-yourself/) for information on getting a free trial account of SAP Cloud Platform and how to enable SAP Cloud Platform Business Rules Service.
2. **RuleSuperUser** role for Runtime and Repository operations.

You need to have the following for **workflow** template:
1. SAP Cloud Platform (Neo) account with an active subscription to Business Rules and Workflow service. 
2. **WorkflowDeveloper** role to deploy workflow.
3. Developer role to create and deploy SAPUI5 applications in SAP Cloud Platform.
4. SAP WebIDE Full-Stack service enabled in SAP Cloud Platform.

## Project Overview
Here are the details of templates:
- rulesmanager
  - An SAPUI5 Application which helps you understand how to embed decision table control in your custom application.
    - It has these standard folder structure:
      - webapp/view/app.view.js - This is the main file where you will learn how-to embed the RulesBuilder SAPUI5 control in the application.
      - webapp/controller/app.controller.js - This file will contain the implementation to (a) Initialize business rules vocabulary and decision table models, (b) Setup Rule Builder control and associate rule expression language to it and (c) Implement button control to drive the lifecycle of the business rules like Edit, Save, Activate and Deploy.
      - webapp/snippets - This folder contains the code snippets that will be inserted in the template during the learning session.
      - webapp/resources - This folder contains the source files for view and controller for reference.

- workflows
  - SAP Cloud Platform Workflow template project **/workflow/purchaseorderapprovaltemplate.zip** which shows how to consume business rules in workflow. 

- rulesprojects
  - SAP Cloud Platform Business Rules templates that can be imported and extended to learn on how to author and deploy business rules in SAP Cloud Platform.

## Deployment
There are different deployment routes to these templates:
- After you have implemented the view and controller in **rulemanager** template, you can deploy the SAPUI5 application in your SAP Cloud Platform account. To do so, right click on the project and choose option: **Deploy --> Deploy to SAP Cloud Platform**.
- After you have configured **workflow** template for service task, you need to deploy the template project and workflow. 
- After you have extended the authoring of the **rulesprojects** templates, you need to deploy the respective business rules service from the Manage Rules Application in SAP Cloud Platform Business Rules service

## Authors
Archana Shukla

## Copyright and License
Copyright (c) 2017 SAP SE. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. 
You may obtain a copy of the License at > http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an 
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
