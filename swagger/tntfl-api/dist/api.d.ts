export interface FetchAPI {
    (url: string, init?: any): Promise<any>;
}
export interface FetchArgs {
    url: string;
    options: any;
}
export declare class BaseAPI {
    basePath: string;
    fetch: FetchAPI;
    constructor(fetch?: FetchAPI, basePath?: string);
}
export interface Achievement {
    /**
     * Name of the achievement
     */
    "name": string;
    /**
     * A brief description of the achievement
     */
    "description": string;
    /**
     * Timestamp of when the achievement was earned
     */
    "time"?: number;
}
export interface AchievementCount {
    /**
     * Name of the achievement
     */
    "name": string;
    /**
     * A brief description of the achievement
     */
    "description": string;
    /**
     * Timestamp of when the achievement was earned
     */
    "time"?: number;
    /**
     * Number of times awarded
     */
    "count": number;
}
export interface ActivePlayers {
    "count": number;
}
export interface Belt {
    /**
     * Longest holder
     */
    "best": Streak;
    /**
     * Current holder
     */
    "current": Streak;
}
export interface Game {
    /**
     * The unix timestamp of when the game was added
     */
    "date": number;
    /**
     * Whether or not the players swapped ladder position
     */
    "positionSwap": boolean;
    "blue": Performance;
    "red": Performance;
    "deleted"?: GameDeleted;
}
export interface GameDeleted {
    /**
     * Unix time game was deleted at
     */
    "at": number;
    /**
     * User that deleted the game
     */
    "by": string;
}
export interface GamesLink {
    "href": string;
}
export interface GamesPerWeekItem {
    /**
     * Unix time
     */
    "date": number;
    "count": number;
}
export interface GlobalRecords {
    /**
     * Longest winning streak
     */
    "winningStreak": Streak;
    /**
     * Games with largest skill transfer
     */
    "mostSignificant": Array<Game>;
    /**
     * Games with smallest skill transfer
     */
    "leastSignificant": Array<Game>;
    /**
     * Games with most goals played
     */
    "longestGame": Game;
}
export interface GlobalTotals {
    /**
     * Number of games played
     */
    "games": number;
    /**
     * Number of players
     */
    "players": number;
    /**
     * Number of active players
     */
    "activePlayers": number;
    /**
     * Accumulated achievements
     */
    "achievements": Array<AchievementCount>;
}
export interface LadderEntry {
    /**
     * Player's rank
     */
    "rank"?: number;
    /**
     * Player's name
     */
    "name"?: string;
    /**
     * Player's skill
     */
    "skill"?: number;
    /**
     * Link to detailed player stats
     */
    "href"?: string;
    "player"?: Player;
    /**
     * Player's skill point trend
     */
    "trend"?: Array<TrendItem>;
}
export interface PerPlayerStat {
    /**
     * Opponent's ID
     */
    "opponent": string;
    /**
     * Skill transfer
     */
    "skillChange": number;
    /**
     * Goals scored
     */
    "for": number;
    /**
     * Goals conceded
     */
    "against": number;
    /**
     * Number of games
     */
    "games": number;
    /**
     * Number of wins
     */
    "wins": number;
    /**
     * Number of losses
     */
    "losses": number;
}
/**
 * Resource representing how a player performed in a game
 */
export interface Performance {
    /**
     * Player's cfl username
     */
    "name": string;
    /**
     * Goals scored by this player
     */
    "score": number;
    /**
     * Skill value change for this player
     */
    "skillChange": number;
    /**
     * Ladder rank change for this player
     */
    "rankChange": number;
    /**
     * New ladder rank of this player
     */
    "newRank": number;
    /**
     * Link to get player's information
     */
    "href": string;
    /**
     * Achievements earned during this performance
     */
    "achievements": Array<Achievement>;
}
/**
 * Resource representing information about a player
 */
export interface Player {
    /**
     * Player's cfl username
     */
    "name": string;
    /**
     * Player's current ladder rank
     */
    "rank": number;
    /**
     * Link to get all games for this player
     */
    "games": GamesLink;
    /**
     * Player's activity level
     */
    "activity": number;
    /**
     * The player's skill value in the ranking system
     */
    "skill": number;
    /**
     * Statistics for the player
     */
    "total": PlayerTotals;
}
export interface PlayerTotals {
    /**
     * The total number of goals the player has scored
     */
    "for": number;
    /**
     * The total number of goals scored against the player
     */
    "against": number;
    /**
     * The total number of games the player has won
     */
    "wins": number;
    /**
     * The total number of games the player has lost
     */
    "losses": number;
    /**
     * The total number of games the player has played
     */
    "games": number;
    /**
     * The total number of games the player has played so far today
     */
    "gamesToday"?: number;
    /**
     * The total number of games the player has played as red.
     */
    "gamesAsRed"?: number;
}
export interface Prediction {
    /**
     * Ratio of goals that blue is expected to score
     */
    "blueGoalRatio"?: number;
}
export interface Punditry {
    "facts": Array<string>;
}
export interface Speculated {
    /**
     * Ladder entries
     */
    "entries": Array<LadderEntry>;
    /**
     * Ladder entries
     */
    "games": Array<Game>;
}
export interface Stats {
    "totals": GlobalTotals;
    "records": GlobalRecords;
    "belt": Belt;
    "gamesPerWeek": Array<GamesPerWeekItem>;
}
export interface Streak {
    /**
     * The player's name
     */
    "player": string;
    /**
     * Length of streak
     */
    "count": number;
}
export interface TrendItem {
    /**
     * Unix time
     */
    "date": number;
    "skill": number;
}
/**
 * GamesApi - fetch parameter creator
 */
export declare const GamesApiFetchParamCreator: {
    addGame(params: {
        "redPlayer": string;
        "redScore": number;
        "bluePlayer": string;
        "blueScore": number;
    }, options?: any): FetchArgs;
    addGameRedirect(params: {
        "redPlayer": string;
        "redScore": number;
        "bluePlayer": string;
        "blueScore": number;
    }, options?: any): FetchArgs;
    getGame(params: {
        "gameId": number;
    }, options?: any): FetchArgs;
    getGames(params: {
        "begin": number;
        "end": number;
    }, options?: any): FetchArgs;
    getHeadToHeadGames(params: {
        "player1": string;
        "player2": string;
    }, options?: any): FetchArgs;
    getPunditry(params: {
        "at": string;
    }, options?: any): FetchArgs;
    getRecent(params: {
        "limit"?: number;
    }, options?: any): FetchArgs;
    predict(params: {
        "redElo": number;
        "blueElo": number;
    }, options?: any): FetchArgs;
};
/**
 * GamesApi - functional programming interface
 */
export declare const GamesApiFp: {
    addGame(params: {
        "redPlayer": string;
        "redScore": number;
        "bluePlayer": string;
        "blueScore": number;
    }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Game>;
    addGameRedirect(params: {
        "redPlayer": string;
        "redScore": number;
        "bluePlayer": string;
        "blueScore": number;
    }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<any>;
    getGame(params: {
        "gameId": number;
    }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Game>;
    getGames(params: {
        "begin": number;
        "end": number;
    }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Game[]>;
    getHeadToHeadGames(params: {
        "player1": string;
        "player2": string;
    }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Game[]>;
    getPunditry(params: {
        "at": string;
    }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<{
        [key: string]: Punditry;
    }>;
    getRecent(params: {
        "limit"?: number;
    }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Game[]>;
    predict(params: {
        "redElo": number;
        "blueElo": number;
    }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Prediction>;
};
/**
 * GamesApi - object-oriented interface
 */
export declare class GamesApi extends BaseAPI {
    /**
     * Add a game
     * Add a game.
     * @param redPlayer The player on red
     * @param redScore The red team score
     * @param bluePlayer The player on blue
     * @param blueScore The blue team score
     */
    addGame(params: {
        "redPlayer": string;
        "redScore": number;
        "bluePlayer": string;
        "blueScore": number;
    }, options?: any): Promise<Game>;
    /**
     * Add a game
     * Add a game.
     * @param redPlayer The player on red
     * @param redScore The red team score
     * @param bluePlayer The player on blue
     * @param blueScore The blue team score
     */
    addGameRedirect(params: {
        "redPlayer": string;
        "redScore": number;
        "bluePlayer": string;
        "blueScore": number;
    }, options?: any): Promise<any>;
    /**
     * Get a game
     * Get a game.
     * @param gameId Timestamp of the game
     */
    getGame(params: {
        "gameId": number;
    }, options?: any): Promise<Game>;
    /**
     * Get games
     * Get games.
     * @param begin Timestamp to filter from.
     * @param end Timestamp to filter to.
     */
    getGames(params: {
        "begin": number;
        "end": number;
    }, options?: any): Promise<Game[]>;
    /**
     * Get shared games
     * Get shared games.
     * @param player1 Name of player 1
     * @param player2 Name of player 2
     */
    getHeadToHeadGames(params: {
        "player1": string;
        "player2": string;
    }, options?: any): Promise<Game[]>;
    /**
     * Get game punditry
     * Get game punditry.
     * @param at CSV of timestamps
     */
    getPunditry(params: {
        "at": string;
    }, options?: any): Promise<{
        [key: string]: Punditry;
    }>;
    /**
     * Get recent games
     * Get recent games.
     * @param limit Maximum number of games to return
     */
    getRecent(params: {
        "limit"?: number;
    }, options?: any): Promise<Game[]>;
    /**
     * Predict the outcome of a game
     * Predict the outcome of a game.
     * @param redElo Elo of red player
     * @param blueElo Elo of blue player
     */
    predict(params: {
        "redElo": number;
        "blueElo": number;
    }, options?: any): Promise<Prediction>;
}
/**
 * GamesApi - factory interface
 */
export declare const GamesApiFactory: (fetch?: FetchAPI, basePath?: string) => {
    addGame(params: {
        "redPlayer": string;
        "redScore": number;
        "bluePlayer": string;
        "blueScore": number;
    }, options?: any): Promise<Game>;
    addGameRedirect(params: {
        "redPlayer": string;
        "redScore": number;
        "bluePlayer": string;
        "blueScore": number;
    }, options?: any): Promise<any>;
    getGame(params: {
        "gameId": number;
    }, options?: any): Promise<Game>;
    getGames(params: {
        "begin": number;
        "end": number;
    }, options?: any): Promise<Game[]>;
    getHeadToHeadGames(params: {
        "player1": string;
        "player2": string;
    }, options?: any): Promise<Game[]>;
    getPunditry(params: {
        "at": string;
    }, options?: any): Promise<{
        [key: string]: Punditry;
    }>;
    getRecent(params: {
        "limit"?: number;
    }, options?: any): Promise<Game[]>;
    predict(params: {
        "redElo": number;
        "blueElo": number;
    }, options?: any): Promise<Prediction>;
};
/**
 * LadderApi - fetch parameter creator
 */
export declare const LadderApiFetchParamCreator: {
    getLadder(params: {
        "showInactive"?: number;
        "players"?: number;
    }, options?: any): FetchArgs;
    getLadderBetween(params: {
        "begin": number;
        "end": number;
        "showInactive"?: number;
        "players"?: number;
    }, options?: any): FetchArgs;
    speculate(params: {
        "showInactive"?: number;
        "players"?: number;
        "previousGames"?: string;
    }, options?: any): FetchArgs;
};
/**
 * LadderApi - functional programming interface
 */
export declare const LadderApiFp: {
    getLadder(params: {
        "showInactive"?: number;
        "players"?: number;
    }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<LadderEntry[]>;
    getLadderBetween(params: {
        "begin": number;
        "end": number;
        "showInactive"?: number;
        "players"?: number;
    }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<LadderEntry[]>;
    speculate(params: {
        "showInactive"?: number;
        "players"?: number;
        "previousGames"?: string;
    }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Speculated>;
};
/**
 * LadderApi - object-oriented interface
 */
export declare class LadderApi extends BaseAPI {
    /**
     * Get the ladder
     * Get the ladder.
     * @param showInactive Include inactive players
     * @param players Include detailed player info
     */
    getLadder(params: {
        "showInactive"?: number;
        "players"?: number;
    }, options?: any): Promise<LadderEntry[]>;
    /**
     * Get the ladder
     * Get the ladder.
     * @param begin Timestamp to filter from.
     * @param end Timestamp to filter to.
     * @param showInactive Include inactive players
     * @param players Include detailed player info
     */
    getLadderBetween(params: {
        "begin": number;
        "end": number;
        "showInactive"?: number;
        "players"?: number;
    }, options?: any): Promise<LadderEntry[]>;
    /**
     * Get the ladder
     * Get the ladder.
     * @param showInactive Include inactive players
     * @param players Include detailed player info
     * @param previousGames CSV of speculative games
     */
    speculate(params: {
        "showInactive"?: number;
        "players"?: number;
        "previousGames"?: string;
    }, options?: any): Promise<Speculated>;
}
/**
 * LadderApi - factory interface
 */
export declare const LadderApiFactory: (fetch?: FetchAPI, basePath?: string) => {
    getLadder(params: {
        "showInactive"?: number;
        "players"?: number;
    }, options?: any): Promise<LadderEntry[]>;
    getLadderBetween(params: {
        "begin": number;
        "end": number;
        "showInactive"?: number;
        "players"?: number;
    }, options?: any): Promise<LadderEntry[]>;
    speculate(params: {
        "showInactive"?: number;
        "players"?: number;
        "previousGames"?: string;
    }, options?: any): Promise<Speculated>;
};
/**
 * PlayersApi - fetch parameter creator
 */
export declare const PlayersApiFetchParamCreator: {
    getActive(params: {
        "at"?: string;
    }, options?: any): FetchArgs;
    getPerPlayerStats(params: {
        "player": string;
    }, options?: any): FetchArgs;
    getPlayer(params: {
        "player": string;
    }, options?: any): FetchArgs;
    getPlayerAchievements(params: {
        "player": string;
    }, options?: any): FetchArgs;
    getPlayerGames(params: {
        "player": string;
    }, options?: any): FetchArgs;
};
/**
 * PlayersApi - functional programming interface
 */
export declare const PlayersApiFp: {
    getActive(params: {
        "at"?: string;
    }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<{
        [key: string]: ActivePlayers;
    }>;
    getPerPlayerStats(params: {
        "player": string;
    }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<PerPlayerStat[]>;
    getPlayer(params: {
        "player": string;
    }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Player>;
    getPlayerAchievements(params: {
        "player": string;
    }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Achievement[]>;
    getPlayerGames(params: {
        "player": string;
    }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Game[]>;
};
/**
 * PlayersApi - object-oriented interface
 */
export declare class PlayersApi extends BaseAPI {
    /**
     * Get number of active players
     * Get number of active players.
     * @param at CSV of timestamps
     */
    getActive(params: {
        "at"?: string;
    }, options?: any): Promise<{
        [key: string]: ActivePlayers;
    }>;
    /**
     * Get per player stats
     * Get per player stats.
     * @param player ID of the player
     */
    getPerPlayerStats(params: {
        "player": string;
    }, options?: any): Promise<PerPlayerStat[]>;
    /**
     * Get player info
     * Get player info.
     * @param player ID of the player
     */
    getPlayer(params: {
        "player": string;
    }, options?: any): Promise<Player>;
    /**
     * Get player&#39;s achievements
     * Get player&#39;s achievements.
     * @param player ID of the player
     */
    getPlayerAchievements(params: {
        "player": string;
    }, options?: any): Promise<Achievement[]>;
    /**
     * Get player&#39;s games
     * Get player&#39;s games.
     * @param player ID of the player
     */
    getPlayerGames(params: {
        "player": string;
    }, options?: any): Promise<Game[]>;
}
/**
 * PlayersApi - factory interface
 */
export declare const PlayersApiFactory: (fetch?: FetchAPI, basePath?: string) => {
    getActive(params: {
        "at"?: string;
    }, options?: any): Promise<{
        [key: string]: ActivePlayers;
    }>;
    getPerPlayerStats(params: {
        "player": string;
    }, options?: any): Promise<PerPlayerStat[]>;
    getPlayer(params: {
        "player": string;
    }, options?: any): Promise<Player>;
    getPlayerAchievements(params: {
        "player": string;
    }, options?: any): Promise<Achievement[]>;
    getPlayerGames(params: {
        "player": string;
    }, options?: any): Promise<Game[]>;
};
/**
 * StatsApi - fetch parameter creator
 */
export declare const StatsApiFetchParamCreator: {
    getStats(options?: any): FetchArgs;
};
/**
 * StatsApi - functional programming interface
 */
export declare const StatsApiFp: {
    getStats(options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Stats>;
};
/**
 * StatsApi - object-oriented interface
 */
export declare class StatsApi extends BaseAPI {
    /**
     * Get global stats
     * Get global stats.
     */
    getStats(options?: any): Promise<Stats>;
}
/**
 * StatsApi - factory interface
 */
export declare const StatsApiFactory: (fetch?: FetchAPI, basePath?: string) => {
    getStats(options?: any): Promise<Stats>;
};
