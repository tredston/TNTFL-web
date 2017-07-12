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
     * Whether or not the system considers the player active
     */
    "active": boolean;
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
export declare const GamesApiFetchParamCreactor: {
    addGame(params: {
        redPlayer: string;
        redScore: number;
        bluePlayer: string;
        blueScore: number;
    }): FetchArgs;
    addGameRedirect(params: {
        redPlayer: string;
        redScore: number;
        bluePlayer: string;
        blueScore: number;
    }): FetchArgs;
    getGame(params: {
        gameId: number;
    }): FetchArgs;
    getGames(params: {
        begin: number;
        end: number;
    }): FetchArgs;
    getHeadToHeadGames(params: {
        player1: string;
        player2: string;
    }): FetchArgs;
    getPunditry(params: {
        gameId: number;
    }): FetchArgs;
    getRecent(params: {
        limit?: number;
    }): FetchArgs;
    predict(params: {
        redElo: number;
        blueElo: number;
    }): FetchArgs;
};
/**
 * GamesApi - functional programming interface
 */
export declare const GamesApiFp: {
    addGame(params: {
        redPlayer: string;
        redScore: number;
        bluePlayer: string;
        blueScore: number;
    }): (fetch: FetchAPI, basePath?: string) => Promise<Game>;
    addGameRedirect(params: {
        redPlayer: string;
        redScore: number;
        bluePlayer: string;
        blueScore: number;
    }): (fetch: FetchAPI, basePath?: string) => Promise<any>;
    getGame(params: {
        gameId: number;
    }): (fetch: FetchAPI, basePath?: string) => Promise<Game>;
    getGames(params: {
        begin: number;
        end: number;
    }): (fetch: FetchAPI, basePath?: string) => Promise<Game[]>;
    getHeadToHeadGames(params: {
        player1: string;
        player2: string;
    }): (fetch: FetchAPI, basePath?: string) => Promise<Game[]>;
    getPunditry(params: {
        gameId: number;
    }): (fetch: FetchAPI, basePath?: string) => Promise<string[]>;
    getRecent(params: {
        limit?: number;
    }): (fetch: FetchAPI, basePath?: string) => Promise<Game[]>;
    predict(params: {
        redElo: number;
        blueElo: number;
    }): (fetch: FetchAPI, basePath?: string) => Promise<Prediction>;
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
        redPlayer: string;
        redScore: number;
        bluePlayer: string;
        blueScore: number;
    }): Promise<Game>;
    /**
     * Add a game
     * Add a game.
     * @param redPlayer The player on red
     * @param redScore The red team score
     * @param bluePlayer The player on blue
     * @param blueScore The blue team score
     */
    addGameRedirect(params: {
        redPlayer: string;
        redScore: number;
        bluePlayer: string;
        blueScore: number;
    }): Promise<any>;
    /**
     * Get a game
     * Get a game.
     * @param gameId Timestamp of the game
     */
    getGame(params: {
        gameId: number;
    }): Promise<Game>;
    /**
     * Get games
     * Get games.
     * @param begin Timestamp to filter from.
     * @param end Timestamp to filter to.
     */
    getGames(params: {
        begin: number;
        end: number;
    }): Promise<Game[]>;
    /**
     * Get shared games
     * Get shared games.
     * @param player1 Name of player 1
     * @param player2 Name of player 2
     */
    getHeadToHeadGames(params: {
        player1: string;
        player2: string;
    }): Promise<Game[]>;
    /**
     * Get game punditry
     * Get game punditry.
     * @param gameId Timestamp of game
     */
    getPunditry(params: {
        gameId: number;
    }): Promise<string[]>;
    /**
     * Get recent games
     * Get recent games.
     * @param limit Maximum number of games to return
     */
    getRecent(params: {
        limit?: number;
    }): Promise<Game[]>;
    /**
     * Predict the outcome of a game
     * Predict the outcome of a game.
     * @param redElo Elo of red player
     * @param blueElo Elo of blue player
     */
    predict(params: {
        redElo: number;
        blueElo: number;
    }): Promise<Prediction>;
}
/**
 * GamesApi - factory interface
 */
export declare const GamesApiFactory: (fetch?: FetchAPI, basePath?: string) => {
    addGame(params: {
        redPlayer: string;
        redScore: number;
        bluePlayer: string;
        blueScore: number;
    }): Promise<Game>;
    addGameRedirect(params: {
        redPlayer: string;
        redScore: number;
        bluePlayer: string;
        blueScore: number;
    }): Promise<any>;
    getGame(params: {
        gameId: number;
    }): Promise<Game>;
    getGames(params: {
        begin: number;
        end: number;
    }): Promise<Game[]>;
    getHeadToHeadGames(params: {
        player1: string;
        player2: string;
    }): Promise<Game[]>;
    getPunditry(params: {
        gameId: number;
    }): Promise<string[]>;
    getRecent(params: {
        limit?: number;
    }): Promise<Game[]>;
    predict(params: {
        redElo: number;
        blueElo: number;
    }): Promise<Prediction>;
};
/**
 * LadderApi - fetch parameter creator
 */
export declare const LadderApiFetchParamCreactor: {
    getLadder(params: {
        showInactive?: number;
        players?: number;
    }): FetchArgs;
    getLadderBetween(params: {
        begin: number;
        end: number;
        showInactive?: number;
        players?: number;
    }): FetchArgs;
    speculate(params: {
        showInactive?: number;
        players?: number;
        previousGames?: string;
    }): FetchArgs;
};
/**
 * LadderApi - functional programming interface
 */
export declare const LadderApiFp: {
    getLadder(params: {
        showInactive?: number;
        players?: number;
    }): (fetch: FetchAPI, basePath?: string) => Promise<LadderEntry[]>;
    getLadderBetween(params: {
        begin: number;
        end: number;
        showInactive?: number;
        players?: number;
    }): (fetch: FetchAPI, basePath?: string) => Promise<LadderEntry[]>;
    speculate(params: {
        showInactive?: number;
        players?: number;
        previousGames?: string;
    }): (fetch: FetchAPI, basePath?: string) => Promise<Speculated>;
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
        showInactive?: number;
        players?: number;
    }): Promise<LadderEntry[]>;
    /**
     * Get the ladder
     * Get the ladder.
     * @param begin Timestamp to filter from.
     * @param end Timestamp to filter to.
     * @param showInactive Include inactive players
     * @param players Include detailed player info
     */
    getLadderBetween(params: {
        begin: number;
        end: number;
        showInactive?: number;
        players?: number;
    }): Promise<LadderEntry[]>;
    /**
     * Get the ladder
     * Get the ladder.
     * @param showInactive Include inactive players
     * @param players Include detailed player info
     * @param previousGames CSV of speculative games
     */
    speculate(params: {
        showInactive?: number;
        players?: number;
        previousGames?: string;
    }): Promise<Speculated>;
}
/**
 * LadderApi - factory interface
 */
export declare const LadderApiFactory: (fetch?: FetchAPI, basePath?: string) => {
    getLadder(params: {
        showInactive?: number;
        players?: number;
    }): Promise<LadderEntry[]>;
    getLadderBetween(params: {
        begin: number;
        end: number;
        showInactive?: number;
        players?: number;
    }): Promise<LadderEntry[]>;
    speculate(params: {
        showInactive?: number;
        players?: number;
        previousGames?: string;
    }): Promise<Speculated>;
};
/**
 * PlayersApi - fetch parameter creator
 */
export declare const PlayersApiFetchParamCreactor: {
    getActive(params: {
        at?: string;
    }): FetchArgs;
    getPerPlayerStats(params: {
        player: string;
    }): FetchArgs;
    getPlayer(params: {
        player: string;
    }): FetchArgs;
    getPlayerAchievements(params: {
        player: string;
    }): FetchArgs;
    getPlayerGames(params: {
        player: string;
    }): FetchArgs;
};
/**
 * PlayersApi - functional programming interface
 */
export declare const PlayersApiFp: {
    getActive(params: {
        at?: string;
    }): (fetch: FetchAPI, basePath?: string) => Promise<{
        [key: string]: ActivePlayers;
    }>;
    getPerPlayerStats(params: {
        player: string;
    }): (fetch: FetchAPI, basePath?: string) => Promise<PerPlayerStat[]>;
    getPlayer(params: {
        player: string;
    }): (fetch: FetchAPI, basePath?: string) => Promise<Player>;
    getPlayerAchievements(params: {
        player: string;
    }): (fetch: FetchAPI, basePath?: string) => Promise<Achievement[]>;
    getPlayerGames(params: {
        player: string;
    }): (fetch: FetchAPI, basePath?: string) => Promise<Game[]>;
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
        at?: string;
    }): Promise<{
        [key: string]: ActivePlayers;
    }>;
    /**
     * Get per player stats
     * Get per player stats.
     * @param player ID of the player
     */
    getPerPlayerStats(params: {
        player: string;
    }): Promise<PerPlayerStat[]>;
    /**
     * Get player info
     * Get player info.
     * @param player ID of the player
     */
    getPlayer(params: {
        player: string;
    }): Promise<Player>;
    /**
     * Get player&#39;s achievements
     * Get player&#39;s achievements.
     * @param player ID of the player
     */
    getPlayerAchievements(params: {
        player: string;
    }): Promise<Achievement[]>;
    /**
     * Get player&#39;s games
     * Get player&#39;s games.
     * @param player ID of the player
     */
    getPlayerGames(params: {
        player: string;
    }): Promise<Game[]>;
}
/**
 * PlayersApi - factory interface
 */
export declare const PlayersApiFactory: (fetch?: FetchAPI, basePath?: string) => {
    getActive(params: {
        at?: string;
    }): Promise<{
        [key: string]: ActivePlayers;
    }>;
    getPerPlayerStats(params: {
        player: string;
    }): Promise<PerPlayerStat[]>;
    getPlayer(params: {
        player: string;
    }): Promise<Player>;
    getPlayerAchievements(params: {
        player: string;
    }): Promise<Achievement[]>;
    getPlayerGames(params: {
        player: string;
    }): Promise<Game[]>;
};
/**
 * StatsApi - fetch parameter creator
 */
export declare const StatsApiFetchParamCreactor: {
    getStats(): FetchArgs;
};
/**
 * StatsApi - functional programming interface
 */
export declare const StatsApiFp: {
    getStats(): (fetch: FetchAPI, basePath?: string) => Promise<Stats>;
};
/**
 * StatsApi - object-oriented interface
 */
export declare class StatsApi extends BaseAPI {
    /**
     * Get global stats
     * Get global stats.
     */
    getStats(): Promise<Stats>;
}
/**
 * StatsApi - factory interface
 */
export declare const StatsApiFactory: (fetch?: FetchAPI, basePath?: string) => {
    getStats(): Promise<Stats>;
};
