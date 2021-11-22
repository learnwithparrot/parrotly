export function convertNumToStringRatings(rating: number) {
  const fullRating = Math.floor(rating)
  const emptyStar = '☆';
  const fullStar = '★';
  const ratingTransformed = new Array(fullRating).fill(null).map((_) => fullStar);
  for (let i = 0; i < 5 - rating; i++) {
    ratingTransformed.push(emptyStar);
  }
  return ratingTransformed.join('');
}
