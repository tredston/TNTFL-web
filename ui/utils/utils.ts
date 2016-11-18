import * as React from 'react';
import * as moment from 'moment';

export function getLadderLeagueClass(rank: number, numActivePlayers: number) {
  var league = "";
  if (rank == -1)
    league = "inactive";
  else if (rank == 1)
    league = "ladder-first";
  else if (1 < rank && rank <= numActivePlayers * 0.1)
    league = "ladder-silver";
  else if (0.1 * numActivePlayers < rank && rank <= numActivePlayers * 0.3)
    league = "ladder-bronze";
  return league;
}

function formatDate(date: moment.Moment) {
  if (date.isBefore(moment().subtract(7, 'days'))) {
    return date.format("YYYY-MM-DD HH:mm");
  }
  else if (date.isBefore(moment().startOf('day'))) {
    return date.format("ddd HH:mm");
  }
  else {
    return date.format("HH:mm");
  }
}

export function formatEpoch(epoch: number) {
  return formatDate(moment.unix(epoch));
}

export function getParameterByName(name: string): string {
  const url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) {
    const split = url.split("/");
    return split[split.length - 2];
  }
  if (!results[2]){
    return '';
  }
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export function formatRankChange(rankChange: number): string {
  return (rankChange > 0 ? '⬆' : '⬇') + Math.abs(rankChange);
}
