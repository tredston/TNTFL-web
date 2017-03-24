# Changelog

## 5.0.1
* Fix linting

## 5.0.0
* Scale skill point transfer by number of goals played
** Scaled linearly with 10 goals being the expected length of a game
* Removed the `overrated` stat from the `player` API endpoint
* Fixed league colours in the `Recent Games` list

## 4.2.1
* Fix rendering of per player stats

## 4.2.0
* Add Mattermost integration
* Allow speculating without reloading page
* Add player's recent skill box plot
* Remove `Overrated` stat
* Remove column restrictions on player page
* Performance improvements

## 4.1.1
* Improve chart performance

## 4.1.0
* Use a faster custom bar chart instead of reactchartjs2 pie chart
* Remove goal charts
* Display number of games played on PvP page
* Improve performance

## 4.0.1
* Prevent entering games where both players are the same

## 4.0.0
* Add pie charts for game outcomes and goals scored
* Add chart for tracking wins and skill transfer between players
* Award achievements once per player
* Add missing achievement icons
* Add punditry, active players, player achievements and PvP API endpoint
* Include achievements earned from recent games endpoint
* Start updating UI to allow unicode
* Show spinner when adding game
* Improve API routing (fewer query parameters)
* Improve API error reporting
* Swaggerize API docs

## 3.12.2
* Fix speculating games

## 3.12.1
* More aggressive form checking

## 3.12.0
* Validate new game form client side
* Speed up adding a new game

## 3.11.0
* Update API page
* Fix adding yellow stripes
* Improve responsiveness of UI when adding games

## 3.10.0
* Add Travis CI
* Add readme and changelog

## 3.9.2
* Fix slice page not limiting the games to the specified range

## 3.9.1
* Fix not showing the game page after adding a new game

## 3.9.0
* Fix The Dominator achievement not being awarded for consecutive dominations.
* Performance improvements

## 3.8.2
* Fix speculating games

## 3.8.1
* Fix player's recent games showing all games

## 3.8.0
* Performance improvements

## 3.7.6
* Update for apache 2.4

## 3.7.5
* Add Up Up And Away achievement
