import * as moment from 'moment';

export function getLadderLeagueClass(rank: number, numActivePlayers: number) {
  var league = "";
  if (rank == -1)
    league = "inactive";
  if (rank == 1)
    league = "ladder-first";
  if (1 < rank && rank <= numActivePlayers * 0.1)
    league = "ladder-silver";
  if (0.1 * numActivePlayers < rank && rank <= numActivePlayers * 0.3)
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
