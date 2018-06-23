/**
 * Command router for Roll20 chat commands
 *
 * @module r20-command-router
 *
 * @author Draico Dorath
 * @copyright 2018
 * @license MIT
 */

import { version } from "../package.json";

/**
 * Configures the command router with the given command prefix and routes. Returns a function that
 * can be registered on chat:message events to listen for any matching chat commands and respond
 * with the appropriate module call
 *
 * @param commandPrefix {String} The prefix of your API chat commands
 * @param routes {Object} Maps command names to module functions
 *
 * @returns {Function(msg)} a message event handler function
 *
 * @example
 * on("ready", () => {
 *   const myPrefix = "!alal-"; // prefix for Alchemy Almanac API commands
 *   const routes = {
 *     "gather": AlchemyAlmanac.gather, // !alal-gather should invoke AlchemyAlmanac.gather
 *     "harvest": AlchemyAlmanac.harvest // !alal-harvest should invoke AlchemyAlmanac.harvest
 *   };
 *
 *   on("chat:message", ApiRouter.route(myPrefix, routes));
 * });
 */
export default function route(commandPrefix, routes) {
    // Partially apply all setup functions
    const isMatch = isCommand(commandPrefix);
    const command = parseCommand(commandPrefix);
    const exec = execute(routes);

    return (msg) => {
        if (!isMatch(msg)) { return; }

        exec(command(msg), parseInput(msg));
    };
}

// isCommand :: String -> (msg -> Boolean)
function isCommand(commandPrefix) {
    return (msg) => {
        return (
            (msg.type === "api") &&
            msg.content.startsWith(commandPrefix)
        );
    };
}

// parseCommand :: String -> (msg -> String)
function parseCommand(commandPrefix) {
    return (msg) => {
        return msg.content
            .split(" ")[0]
            .toLowerCase()
            .replace(commandPrefix, "");
    };
}

// parseInput :: msg -> String
function parseInput(msg) {
    // Dumb implementation; will break if e.g. needs to accept text strings with spaces in them
    return _.tail(msg.content.split(/\s+/));
}

// execute :: Object -> (String -> String -> void)
function execute(routes) {
    return (command, input) => {
        if (!(routes[command] && (typeof routes[command] === "function"))) {
            return;
        }

        routes[command](...input);
    };
}

on("ready", () => { log(`[API Router] v${version} loaded.`); });