let imperial = ['US', 'MM', 'LR'];

export function getDistanceUnitForCountry(country) {
  if (imperial.includes(country)) {
    return 'in';
  } else {
    return 'cm';
  }
}