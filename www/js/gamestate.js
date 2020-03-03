/*
 * Copyright 2020 Tim Hunt
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * Represents the current state during play of a game of winks.
 *
 * @property {WinksGameSetup} setup the setup of the game we are representing.
 * @property {WinkColour} squidgeOffWinner the colour that won the squidge-off.
 * @property {string} currentState one of the constants defined at the end of this file.
 *      Depending on the state, only some of the remaining properties are relevant.
 * @property {number} timeRemaining if state is PAUSED, this is how much time remains to play.
 * @property {Date} endTime if state is MAIN_TIME, this is the time when time will expire.
 * @property {number} currentRound if state is ROUNDS, this is the current round number.
 * @property {WinkColour} colourPlaying if state is ROUNDS, this is the player currently playing.
 *
 */
class WinksGameState {
    /**
     * Create an instance.
     *
     * @param {WinksGameSetup} setup the setup.
     * @param {WinkColour} squidgeOffWinner who won the squidge-off.
     */
    constructor(setup, squidgeOffWinner) {
        this.setup = setup;
        this.squidgeOffWinner = squidgeOffWinner;
        this.currentState = WinksGameState.PAUSED;
        this.timeRemaining = setup.timelLimit;
        this.endTime = null;
        this.currentRound = null;
        this.colourPlaying = null;
    }

    verifyState(expectedState) {
        if (this.currentState !== expectedState) {
            throw new Error("Illegal game state. Expected " + expectedState +
                    " but currently " + this.currentState);
        }
    }

    /**
     * Start the timer.
     *
     * Can only be called if the state is currently PAUSED.
     */
    start() {
        this.verifyState(WinksGameState.PAUSED);
        this.endTime = Date.now() + this.timeRemaining;
        this.timeRemaining = null;
        this.currentState = WinksGameState.MAIN_TIME;
    }

    /**
     * Pause the timer.
     *
     * Can only be called if the state is currently MAIN_TIME.
     */
    pause() {
        this.verifyState(WinksGameState.MAIN_TIME);
        this.timeRemaining = this.endTime - Date.now();
        this.endTime = null;
        this.currentState = WinksGameState.PAUSED;
    }

    /**
     * The game finished.
     *
     * This could be either the end of rounds, a pot-out, Thorpe's ring, or
     * a deliberate interference with the winks.
     */
    gameFinished() {
        this.timeRemaining = null;
        this.endTime = null;
        this.currentRound = null;
        this.colourPlaying = null;
        this.currentState = WinksGameState.FINISHED;
    }

    /**
     * Handle that the time expired.
     *
     * Can only be called if the state is currently MAIN_TIME.
     *
     * @param {WinkColour} colourPlaying the colour who is playing,
     *      or who just completed a turn after time expired.
     */
    timeExpired(colourPlaying) {
        this.verifyState(WinksGameState.MAIN_TIME);
        this.endTime = null;
        this.currentRound = 0;
        this.colourPlaying = colourPlaying;
        this.currentState = WinksGameState.ROUNDS;
        this.shotPlayed();
    }

    /**
     * Record a shot being played.
     *
     * Can only be called if the state is currently ROUNDS.
     */
    shotPlayed() {
        this.verifyState(WinksGameState.ROUNDS);
        if (this.colourPlaying === this.squidgeOffWinner) {
            if (this.currentRound === 5) {
                this.gameFinished();
                return;
            } else {
                this.currentRound += 1;
            }
        }
        this.colourPlaying = this.colourPlaying.next();
    }
}

/**
 * @type {string} Possible value for state, when the timer is paused.
 */
WinksGameState.PAUSED = "Paused";

/**
 * @type {string} Possible value for state, when the timer is running.
 */
WinksGameState.MAIN_TIME = "Main time";

/**
 * @type {string} Possible value for state, once the timed period is over.
 */
WinksGameState.ROUNDS = "In rounds";

/**
 * @type {string} Possible value for state, once the timed period is over.
 */
WinksGameState.FINISHED = "Finished";
