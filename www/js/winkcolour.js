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
 * This class has four instances, for the four colours in the game.
 */
class WinkColour {
    next() {
        throw new Error('Subclass responsibility');
    }
}

WinkColour.YELLOW = class extends WinkColour {
    next() {
        return WinkColour.BLUE;
    }
    toString() {
        return "yellow";
    }
};

WinkColour.RED = class extends WinkColour {
    next() {
        return WinkColour.YELLOW;
    }
    toString() {
        return "red";
    }
};

WinkColour.GREEN = class extends WinkColour {
    next() {
        return WinkColour.RED;
    }
    toString() {
        return "green";
    }
};

WinkColour.BLUE = class extends WinkColour {
    next() {
        return WinkColour.GREEN;
    }
    toString() {
        return "blue";
    }
};

WinkColour.fromString = function (colourName) {
    switch (colourName) {
        case "blue":
            return WinkColour.BLUE;
        case "green":
            return WinkColour.GREEN;
        case "red":
            return WinkColour.RED;
        case "yellow":
            return WinkColour.YELLOW;
        default:
            throw new Error("Unknown wink colour " + colourName);
    }
};

WinkColour.canonicalize = function (colour) {
    return WinkColour.fromString(colour.toString());
};
