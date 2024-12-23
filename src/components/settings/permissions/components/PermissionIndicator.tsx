interface PermissionIndicatorProps {
  value: boolean;
}

export const PermissionIndicator = ({ value }: PermissionIndicatorProps) => {
  const indicatorColor = value ? 'bg-[#00f127]' : 'bg-[#ff0101]';
  
  return (
    <div 
      className={`w-2 h-2 rounded-full ${indicatorColor}`} 
    />
  );
};