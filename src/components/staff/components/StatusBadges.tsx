interface StatusBadgesProps {
  isSuspended: boolean;
  isAdmin: boolean;
}

export const StatusBadges = ({ isSuspended, isAdmin }: StatusBadgesProps) => {
  return (
    <>
      {isSuspended && (
        <span className="text-xs bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full">
          Suspended
        </span>
      )}
      {isAdmin && (
        <span className="text-xs bg-[#15e7fb]/10 text-[#15e7fb] px-2 py-0.5 rounded-full">
          Admin
        </span>
      )}
    </>
  );
};