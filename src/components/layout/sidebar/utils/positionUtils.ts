export const getPositionName = (member: any) => {
  // First check employeepositions array for primary position
  const primaryPosition = member.employeepositions?.find(
    (ep: any) => ep.is_primary
  )?.positions?.positionname;

  // If no primary position in employeepositions, check direct position
  if (!primaryPosition && member.positions) {
    return member.positions.positionname;
  }

  // If primary position found, return it
  if (primaryPosition) {
    return primaryPosition;
  }

  // Default fallback
  return "No Position";
};