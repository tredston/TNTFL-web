import { Configuration } from "./configuration";
/**
 *
 * @export
 */
export declare const COLLECTION_FORMATS: {
    csv: string;
    ssv: string;
    tsv: string;
    pipes: string;
};
/**
 *
 * @export
 * @interface FetchAPI
 */
export interface FetchAPI {
    (url: string, init?: any): Promise<Response>;
}
/**
 *
 * @export
 * @interface FetchArgs
 */
export interface FetchArgs {
    url: string;
    options: any;
}
/**
 *
 * @export
 * @class BaseAPI
 */
export declare class BaseAPI {
    protected basePath: string;
    protected fetch: FetchAPI;
    protected configuration: Configuration;
    constructor(configuration?: Configuration, basePath?: string, fetch?: FetchAPI);
}
/**
 *
 * @export
 * @class RequiredError
 * @extends {Error}
 */
export declare class RequiredError extends Error {
    field: string;
    name: "RequiredError";
    constructor(field: string, msg?: string);
}
/**
 *
 * @export
 * @interface Achievement
 */
export interface Achievement {
    /**
     * Name of the achievement
     * @type {string}
     * @memberof Achievement
     */
    name: string;
    /**
     * A brief description of the achievement
     * @type {string}
     * @memberof Achievement
     */
    description: string;
    /**
     * Timestamp of when the achievement was earned
     * @type {number}
     * @memberof Achievement
     */
    time?: number;
}
/**
 *
 * @export
 * @interface AchievementCount
 */
export interface AchievementCount {
    /**
     * Name of the achievement
     * @type {string}
     * @memberof AchievementCount
     */
    name: string;
    /**
     * A brief description of the achievement
     * @type {string}
     * @memberof AchievementCount
     */
    description: string;
    /**
     * Timestamp of when the achievement was earned
     * @type {number}
     * @memberof AchievementCount
     */
    time?: number;
    /**
     * Number of times awarded
     * @type {number}
     * @memberof AchievementCount
     */
    count: number;
}
/**
 *
 * @export
 * @interface ActivePlayers
 */
export interface ActivePlayers {
    /**
     *
     * @type {number}
     * @memberof ActivePlayers
     */
    count: number;
}
/**
 *
 * @export
 * @interface Belt
 */
export interface Belt {
    /**
     * Longest holder
     * @type {Streak}
     * @memberof Belt
     */
    best: Streak;
    /**
     * Current holder
     * @type {Streak}
     * @memberof Belt
     */
    current: Streak;
}
/**
 *
 * @export
 * @interface Game
 */
export interface Game {
    /**
     * The unix timestamp of when the game was added
     * @type {number}
     * @memberof Game
     */
    date: number;
    /**
     * Whether or not the players swapped ladder position
     * @type {boolean}
     * @memberof Game
     */
    positionSwap: boolean;
    /**
     *
     * @type {Performance}
     * @memberof Game
     */
    blue: Performance;
    /**
     *
     * @type {Performance}
     * @memberof Game
     */
    red: Performance;
    /**
     *
     * @type {GameDeleted}
     * @memberof Game
     */
    deleted?: GameDeleted;
}
/**
 *
 * @export
 * @interface GameDeleted
 */
export interface GameDeleted {
    /**
     * Unix time game was deleted at
     * @type {number}
     * @memberof GameDeleted
     */
    at: number;
    /**
     * User that deleted the game
     * @type {string}
     * @memberof GameDeleted
     */
    by: string;
}
/**
 *
 * @export
 * @interface GamesLink
 */
export interface GamesLink {
    /**
     *
     * @type {string}
     * @memberof GamesLink
     */
    href: string;
}
/**
 *
 * @export
 * @interface GamesPerWeekItem
 */
export interface GamesPerWeekItem {
    /**
     * Unix time
     * @type {number}
     * @memberof GamesPerWeekItem
     */
    date: number;
    /**
     *
     * @type {number}
     * @memberof GamesPerWeekItem
     */
    count: number;
}
/**
 *
 * @export
 * @interface GlobalRecords
 */
export interface GlobalRecords {
    /**
     * Longest winning streak
     * @type {Streak}
     * @memberof GlobalRecords
     */
    winningStreak: Streak;
    /**
     * Games with largest skill transfer
     * @type {Array&lt;Game&gt;}
     * @memberof GlobalRecords
     */
    mostSignificant: Array<Game>;
    /**
     * Games with smallest skill transfer
     * @type {Array&lt;Game&gt;}
     * @memberof GlobalRecords
     */
    leastSignificant: Array<Game>;
    /**
     * Games with most goals played
     * @type {Game}
     * @memberof GlobalRecords
     */
    longestGame: Game;
}
/**
 *
 * @export
 * @interface GlobalTotals
 */
export interface GlobalTotals {
    /**
     * Number of games played
     * @type {number}
     * @memberof GlobalTotals
     */
    games: number;
    /**
     * Number of players
     * @type {number}
     * @memberof GlobalTotals
     */
    players: number;
    /**
     * Number of active players
     * @type {number}
     * @memberof GlobalTotals
     */
    activePlayers: number;
    /**
     * Accumulated achievements
     * @type {Array&lt;AchievementCount&gt;}
     * @memberof GlobalTotals
     */
    achievements: Array<AchievementCount>;
}
/**
 *
 * @export
 * @interface LadderEntry
 */
export interface LadderEntry {
    /**
     * Player's rank
     * @type {number}
     * @memberof LadderEntry
     */
    rank?: number;
    /**
     * Player's name
     * @type {string}
     * @memberof LadderEntry
     */
    name?: string;
    /**
     * Player's skill
     * @type {number}
     * @memberof LadderEntry
     */
    skill?: number;
    /**
     * Link to detailed player stats
     * @type {string}
     * @memberof LadderEntry
     */
    href?: string;
    /**
     *
     * @type {Player}
     * @memberof LadderEntry
     */
    player?: Player;
    /**
     * Player's skill point trend
     * @type {Array&lt;TrendItem&gt;}
     * @memberof LadderEntry
     */
    trend?: Array<TrendItem>;
}
/**
 *
 * @export
 * @interface PerPlayerStat
 */
export interface PerPlayerStat {
    /**
     * Opponent's ID
     * @type {string}
     * @memberof PerPlayerStat
     */
    opponent: string;
    /**
     * Skill transfer
     * @type {number}
     * @memberof PerPlayerStat
     */
    skillChange: number;
    /**
     * Goals scored
     * @type {number}
     * @memberof PerPlayerStat
     */
    for: number;
    /**
     * Goals conceded
     * @type {number}
     * @memberof PerPlayerStat
     */
    against: number;
    /**
     * Number of games
     * @type {number}
     * @memberof PerPlayerStat
     */
    games: number;
    /**
     * Number of wins
     * @type {number}
     * @memberof PerPlayerStat
     */
    wins: number;
    /**
     * Number of losses
     * @type {number}
     * @memberof PerPlayerStat
     */
    losses: number;
}
/**
 * Resource representing how a player performed in a game
 * @export
 * @interface Performance
 */
export interface Performance {
    /**
     * Player's cfl username
     * @type {string}
     * @memberof Performance
     */
    name: string;
    /**
     * Goals scored by this player
     * @type {number}
     * @memberof Performance
     */
    score: number;
    /**
     * Skill value change for this player
     * @type {number}
     * @memberof Performance
     */
    skillChange: number;
    /**
     * Ladder rank change for this player
     * @type {number}
     * @memberof Performance
     */
    rankChange: number;
    /**
     * New ladder rank of this player
     * @type {number}
     * @memberof Performance
     */
    newRank: number;
    /**
     * Link to get player's information
     * @type {string}
     * @memberof Performance
     */
    href: string;
    /**
     * Achievements earned during this performance
     * @type {Array&lt;Achievement&gt;}
     * @memberof Performance
     */
    achievements: Array<Achievement>;
}
/**
 * Resource representing information about a player
 * @export
 * @interface Player
 */
export interface Player {
    /**
     * Player's cfl username
     * @type {string}
     * @memberof Player
     */
    name: string;
    /**
     * Player's current ladder rank
     * @type {number}
     * @memberof Player
     */
    rank: number;
    /**
     * Link to get all games for this player
     * @type {GamesLink}
     * @memberof Player
     */
    games: GamesLink;
    /**
     * Player's activity level
     * @type {number}
     * @memberof Player
     */
    activity: number;
    /**
     * The player's skill value in the ranking system
     * @type {number}
     * @memberof Player
     */
    skill: number;
    /**
     * Statistics for the player
     * @type {PlayerTotals}
     * @memberof Player
     */
    total: PlayerTotals;
}
/**
 *
 * @export
 * @interface PlayerTotals
 */
export interface PlayerTotals {
    /**
     * The total number of goals the player has scored
     * @type {number}
     * @memberof PlayerTotals
     */
    for: number;
    /**
     * The total number of goals scored against the player
     * @type {number}
     * @memberof PlayerTotals
     */
    against: number;
    /**
     * The total number of games the player has won
     * @type {number}
     * @memberof PlayerTotals
     */
    wins: number;
    /**
     * The total number of games the player has lost
     * @type {number}
     * @memberof PlayerTotals
     */
    losses: number;
    /**
     * The total number of games the player has played
     * @type {number}
     * @memberof PlayerTotals
     */
    games: number;
    /**
     * The total number of games the player has played so far today
     * @type {number}
     * @memberof PlayerTotals
     */
    gamesToday?: number;
    /**
     * The total number of games the player has played as red.
     * @type {number}
     * @memberof PlayerTotals
     */
    gamesAsRed?: number;
}
/**
 *
 * @export
 * @interface Prediction
 */
export interface Prediction {
    /**
     * Ratio of goals that blue is expected to score
     * @type {number}
     * @memberof Prediction
     */
    blueGoalRatio?: number;
}
/**
 *
 * @export
 * @interface Punditry
 */
export interface Punditry {
    /**
     *
     * @type {Array&lt;string&gt;}
     * @memberof Punditry
     */
    facts: Array<string>;
}
/**
 *
 * @export
 * @interface Speculated
 */
export interface Speculated {
    /**
     * Ladder entries
     * @type {Array&lt;LadderEntry&gt;}
     * @memberof Speculated
     */
    entries: Array<LadderEntry>;
    /**
     * Ladder entries
     * @type {Array&lt;Game&gt;}
     * @memberof Speculated
     */
    games: Array<Game>;
}
/**
 *
 * @export
 * @interface Stats
 */
export interface Stats {
    /**
     *
     * @type {GlobalTotals}
     * @memberof Stats
     */
    totals: GlobalTotals;
    /**
     *
     * @type {GlobalRecords}
     * @memberof Stats
     */
    records: GlobalRecords;
    /**
     *
     * @type {Belt}
     * @memberof Stats
     */
    belt: Belt;
    /**
     *
     * @type {Array&lt;GamesPerWeekItem&gt;}
     * @memberof Stats
     */
    gamesPerWeek: Array<GamesPerWeekItem>;
}
/**
 *
 * @export
 * @interface Streak
 */
export interface Streak {
    /**
     * The player's name
     * @type {string}
     * @memberof Streak
     */
    player: string;
    /**
     * Length of streak
     * @type {number}
     * @memberof Streak
     */
    count: number;
}
/**
 *
 * @export
 * @interface TrendItem
 */
export interface TrendItem {
    /**
     * Unix time
     * @type {number}
     * @memberof TrendItem
     */
    date: number;
    /**
     *
     * @type {number}
     * @memberof TrendItem
     */
    skill: number;
}
/**
 * GamesApi - fetch parameter creator
 * @export
 */
export declare const GamesApiFetchParamCreator: (configuration?: Configuration) => {
    addGame(redPlayer: string, redScore: number, bluePlayer: string, blueScore: number, options?: any): FetchArgs;
    getGame(gameId: number, options?: any): FetchArgs;
    getGames(begin: number, end: number, includeDeleted?: number, options?: any): FetchArgs;
    getHeadToHeadGames(player1: string, player2: string, options?: any): FetchArgs;
    getPunditry(at: string, options?: any): FetchArgs;
    getRecent(limit?: number, options?: any): FetchArgs;
    predict(redElo: number, blueElo: number, options?: any): FetchArgs;
};
/**
 * GamesApi - functional programming interface
 * @export
 */
export declare const GamesApiFp: (configuration?: Configuration) => {
    addGame(redPlayer: string, redScore: number, bluePlayer: string, blueScore: number, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Game>;
    getGame(gameId: number, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Game>;
    getGames(begin: number, end: number, includeDeleted?: number, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Game[]>;
    getHeadToHeadGames(player1: string, player2: string, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Game[]>;
    getPunditry(at: string, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<{
        [key: string]: Punditry;
    }>;
    getRecent(limit?: number, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Game[]>;
    predict(redElo: number, blueElo: number, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Prediction>;
};
/**
 * GamesApi - factory interface
 * @export
 */
export declare const GamesApiFactory: (configuration?: Configuration, fetch?: FetchAPI, basePath?: string) => {
    addGame(redPlayer: string, redScore: number, bluePlayer: string, blueScore: number, options?: any): Promise<Game>;
    getGame(gameId: number, options?: any): Promise<Game>;
    getGames(begin: number, end: number, includeDeleted?: number, options?: any): Promise<Game[]>;
    getHeadToHeadGames(player1: string, player2: string, options?: any): Promise<Game[]>;
    getPunditry(at: string, options?: any): Promise<{
        [key: string]: Punditry;
    }>;
    getRecent(limit?: number, options?: any): Promise<Game[]>;
    predict(redElo: number, blueElo: number, options?: any): Promise<Prediction>;
};
/**
 * GamesApi - object-oriented interface
 * @export
 * @class GamesApi
 * @extends {BaseAPI}
 */
export declare class GamesApi extends BaseAPI {
    /**
     * Add a game.
     * @summary Add a game
     * @param {} redPlayer The player on red
     * @param {} redScore The red team score
     * @param {} bluePlayer The player on blue
     * @param {} blueScore The blue team score
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof GamesApi
     */
    addGame(redPlayer: string, redScore: number, bluePlayer: string, blueScore: number, options?: any): Promise<Game>;
    /**
     * Get a game.
     * @summary Get a game
     * @param {} gameId Timestamp of the game
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof GamesApi
     */
    getGame(gameId: number, options?: any): Promise<Game>;
    /**
     * Get games.
     * @summary Get games
     * @param {} begin Timestamp to filter from.
     * @param {} end Timestamp to filter to.
     * @param {} [includeDeleted] Use value &#39;1&#39; to include deleted games.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof GamesApi
     */
    getGames(begin: number, end: number, includeDeleted?: number, options?: any): Promise<Game[]>;
    /**
     * Get shared games.
     * @summary Get shared games
     * @param {} player1 Name of player 1
     * @param {} player2 Name of player 2
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof GamesApi
     */
    getHeadToHeadGames(player1: string, player2: string, options?: any): Promise<Game[]>;
    /**
     * Get game punditry.
     * @summary Get game punditry
     * @param {} at CSV of timestamps
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof GamesApi
     */
    getPunditry(at: string, options?: any): Promise<{
        [key: string]: Punditry;
    }>;
    /**
     * Get recent games.
     * @summary Get recent games
     * @param {} [limit] Maximum number of games to return
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof GamesApi
     */
    getRecent(limit?: number, options?: any): Promise<Game[]>;
    /**
     * Predict the outcome of a game.
     * @summary Predict the outcome of a game
     * @param {} redElo Elo of red player
     * @param {} blueElo Elo of blue player
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof GamesApi
     */
    predict(redElo: number, blueElo: number, options?: any): Promise<Prediction>;
}
/**
 * LadderApi - fetch parameter creator
 * @export
 */
export declare const LadderApiFetchParamCreator: (configuration?: Configuration) => {
    getLadder(showInactive?: number, players?: number, options?: any): FetchArgs;
    getLadderBetween(begin: number, end: number, showInactive?: number, players?: number, options?: any): FetchArgs;
    speculate(showInactive?: number, players?: number, previousGames?: string, options?: any): FetchArgs;
};
/**
 * LadderApi - functional programming interface
 * @export
 */
export declare const LadderApiFp: (configuration?: Configuration) => {
    getLadder(showInactive?: number, players?: number, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<LadderEntry[]>;
    getLadderBetween(begin: number, end: number, showInactive?: number, players?: number, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<LadderEntry[]>;
    speculate(showInactive?: number, players?: number, previousGames?: string, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Speculated>;
};
/**
 * LadderApi - factory interface
 * @export
 */
export declare const LadderApiFactory: (configuration?: Configuration, fetch?: FetchAPI, basePath?: string) => {
    getLadder(showInactive?: number, players?: number, options?: any): Promise<LadderEntry[]>;
    getLadderBetween(begin: number, end: number, showInactive?: number, players?: number, options?: any): Promise<LadderEntry[]>;
    speculate(showInactive?: number, players?: number, previousGames?: string, options?: any): Promise<Speculated>;
};
/**
 * LadderApi - object-oriented interface
 * @export
 * @class LadderApi
 * @extends {BaseAPI}
 */
export declare class LadderApi extends BaseAPI {
    /**
     * Get the ladder.
     * @summary Get the ladder
     * @param {} [showInactive] Include inactive players
     * @param {} [players] Include detailed player info
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof LadderApi
     */
    getLadder(showInactive?: number, players?: number, options?: any): Promise<LadderEntry[]>;
    /**
     * Get the ladder.
     * @summary Get the ladder
     * @param {} begin Timestamp to filter from.
     * @param {} end Timestamp to filter to.
     * @param {} [showInactive] Include inactive players
     * @param {} [players] Include detailed player info
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof LadderApi
     */
    getLadderBetween(begin: number, end: number, showInactive?: number, players?: number, options?: any): Promise<LadderEntry[]>;
    /**
     * Get the ladder.
     * @summary Get the ladder
     * @param {} [showInactive] Include inactive players
     * @param {} [players] Include detailed player info
     * @param {} [previousGames] CSV of speculative games
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof LadderApi
     */
    speculate(showInactive?: number, players?: number, previousGames?: string, options?: any): Promise<Speculated>;
}
/**
 * PlayersApi - fetch parameter creator
 * @export
 */
export declare const PlayersApiFetchParamCreator: (configuration?: Configuration) => {
    getActive(at?: string, options?: any): FetchArgs;
    getPerPlayerStats(player: string, options?: any): FetchArgs;
    getPlayer(player: string, options?: any): FetchArgs;
    getPlayerAchievements(player: string, options?: any): FetchArgs;
    getPlayerGames(player: string, options?: any): FetchArgs;
};
/**
 * PlayersApi - functional programming interface
 * @export
 */
export declare const PlayersApiFp: (configuration?: Configuration) => {
    getActive(at?: string, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<{
        [key: string]: ActivePlayers;
    }>;
    getPerPlayerStats(player: string, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<PerPlayerStat[]>;
    getPlayer(player: string, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Player>;
    getPlayerAchievements(player: string, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Achievement[]>;
    getPlayerGames(player: string, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Game[]>;
};
/**
 * PlayersApi - factory interface
 * @export
 */
export declare const PlayersApiFactory: (configuration?: Configuration, fetch?: FetchAPI, basePath?: string) => {
    getActive(at?: string, options?: any): Promise<{
        [key: string]: ActivePlayers;
    }>;
    getPerPlayerStats(player: string, options?: any): Promise<PerPlayerStat[]>;
    getPlayer(player: string, options?: any): Promise<Player>;
    getPlayerAchievements(player: string, options?: any): Promise<Achievement[]>;
    getPlayerGames(player: string, options?: any): Promise<Game[]>;
};
/**
 * PlayersApi - object-oriented interface
 * @export
 * @class PlayersApi
 * @extends {BaseAPI}
 */
export declare class PlayersApi extends BaseAPI {
    /**
     * Get number of active players.
     * @summary Get number of active players
     * @param {} [at] CSV of timestamps
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PlayersApi
     */
    getActive(at?: string, options?: any): Promise<{
        [key: string]: ActivePlayers;
    }>;
    /**
     * Get per player stats.
     * @summary Get per player stats
     * @param {} player ID of the player
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PlayersApi
     */
    getPerPlayerStats(player: string, options?: any): Promise<PerPlayerStat[]>;
    /**
     * Get player info.
     * @summary Get player info
     * @param {} player ID of the player
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PlayersApi
     */
    getPlayer(player: string, options?: any): Promise<Player>;
    /**
     * Get player's achievements.
     * @summary Get player's achievements
     * @param {} player ID of the player
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PlayersApi
     */
    getPlayerAchievements(player: string, options?: any): Promise<Achievement[]>;
    /**
     * Get player's games.
     * @summary Get player's games
     * @param {} player ID of the player
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PlayersApi
     */
    getPlayerGames(player: string, options?: any): Promise<Game[]>;
}
/**
 * StatsApi - fetch parameter creator
 * @export
 */
export declare const StatsApiFetchParamCreator: (configuration?: Configuration) => {
    getStats(options?: any): FetchArgs;
};
/**
 * StatsApi - functional programming interface
 * @export
 */
export declare const StatsApiFp: (configuration?: Configuration) => {
    getStats(options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Stats>;
};
/**
 * StatsApi - factory interface
 * @export
 */
export declare const StatsApiFactory: (configuration?: Configuration, fetch?: FetchAPI, basePath?: string) => {
    getStats(options?: any): Promise<Stats>;
};
/**
 * StatsApi - object-oriented interface
 * @export
 * @class StatsApi
 * @extends {BaseAPI}
 */
export declare class StatsApi extends BaseAPI {
    /**
     * Get global stats.
     * @summary Get global stats
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof StatsApi
     */
    getStats(options?: any): Promise<Stats>;
}
