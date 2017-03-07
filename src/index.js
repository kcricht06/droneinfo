/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.
    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
        http://aws.amazon.com/apache2.0/
    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, tell Hello World to say hello"
 *  Alexa: "Hello World!"
 */

/**
 * App ID for the skill
 */
var APP_ID = "amzn1.ask.skill.9dfcc021-f0d0-4c96-924a-d10888b6c08b"; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');
var axios = require('axios');

/**
 * DroneInfo is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var DroneInfo = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
DroneInfo.prototype = Object.create(AlexaSkill.prototype);
DroneInfo.prototype.constructor = DroneInfo;

// DroneInfo.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
//     console.log("DroneInfo onSessionStarted requestId: " + sessionStartedRequest.requestId
//         + ", sessionId: " + session.sessionId);
//     // any initialization logic goes here
// };

DroneInfo.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("DroneInfo onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Ask for drone";
    var repromptText = "Ask for drone";
    response.ask(speechOutput, repromptText);
};
//
// DroneInfo.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
//     console.log("DroneInfo onSessionEnded requestId: " + sessionEndedRequest.requestId
//         + ", sessionId: " + session.sessionId);
//     // any cleanup logic goes here
// };

DroneInfo.prototype.intentHandlers = {
    // register custom intent handlers
    "GetRandomDroneIntent": function (intent, session, response) {

      axios.get('http://api.dronestre.am/data')
      .then(function (resp) {
        var random = resp.data.strike.number;
        // var randomNum = random[Math.floor(Math.random() *random.length)];
        var summary = resp.data.strike[642].narrative;
        var date = resp.data.strike[642].date;
        var dateObject = new Date(Date.parse(date));
        var country = resp.data.strike[642];


        response.tellWithCard(dateObject + ". " + summary, "Drone Info", dateObject + ". " + summary ) ;
        console.log(resp);
      })
      .catch(function (error) {
        console.log(error);
      });

    },




    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can say geo mate, tell me about Estonia", "You can say geo mate, where is Latvia");
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the DroneInfo skill.
    var droneInfo = new DroneInfo();
    droneInfo.execute(event, context);
};
