const ClassTypes = () => {
  return (
    <div>
      <h3 className="text-fitness-text mb-4">Class Types</h3>
      <div className="grid gap-4">
        <div className="p-4 bg-fitness-inner rounded-md">
          <h4 className="text-fitness-text font-medium">CrossFit</h4>
          <p className="text-fitness-text/70 text-sm mt-1">60 min duration</p>
        </div>
        <div className="p-4 bg-fitness-inner rounded-md">
          <h4 className="text-fitness-text font-medium">Yoga</h4>
          <p className="text-fitness-text/70 text-sm mt-1">45 min duration</p>
        </div>
        <div className="p-4 bg-fitness-inner rounded-md">
          <h4 className="text-fitness-text font-medium">HIIT</h4>
          <p className="text-fitness-text/70 text-sm mt-1">30 min duration</p>
        </div>
      </div>
    </div>
  );
};

export default ClassTypes;