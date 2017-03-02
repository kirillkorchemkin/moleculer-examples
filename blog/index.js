/*
 * moleculer
 * Copyright (c) 2017 Ice Services (https://github.com/ice-services/moleculer)
 * MIT Licensed
 */

"use strict";

const ServiceBroker = require("moleculer").ServiceBroker;
const Cachers = require("moleculer").Cachers;
const Transporters = require("moleculer").Transporters;

// const winston = require("winston");
// winston.level = "debug";

function getCacher() {
	switch(process.env.MOL_CACHER) {
	case "memory": return new Cachers.Memory();
	case "redis": return new Cachers.Redis(process.env.MOL_REDIS_URI);
	}
}

function getTransporter() {
	switch(process.env.MOL_TRANSPORTER) {
	case "nats": return new Transporters.NATS(process.env.MOL_NATS_URI);
	case "mqtt": return new Transporters.MQTT(process.env.MOL_MQTT_URI);
	}
}

// Get cacher
let cacher = getCacher();

// Get transporter
let transporter = getTransporter();

// Create broker
const broker = new ServiceBroker({
	cacher,
	transporter,
	//metrics: true,
	//statistics: true,

	logger: console,
	//logger: winston,
	logLevel: process.env.MOL_LOGLEVEL || "info",
});

// Load services
let serviceList;
if (process.env.MOL_SERVICES)
	serviceList = process.env.MOL_SERVICES.split(",");

broker.loadServices("./services", serviceList);

broker.start();