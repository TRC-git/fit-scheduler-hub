const approvedTimeOff = [
  { name: "Heath Graham", approver: "Manager Name" },
  { name: "Jay Duquette", approver: "Manager Name" },
];

export const ApprovedTimeOff = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-fitness-text mb-4">
        Approved Time Off
      </h2>
      <div className="space-y-2">
        {approvedTimeOff.map((item, index) => (
          <div
            key={index}
            className={`p-3 rounded-md text-fitness-text ${
              index % 2 === 0 ? 'bg-[#202020]' : 'bg-[#171717]'
            }`}
          >
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-gray-400">Approved: {item.approver}</p>
          </div>
        ))}
      </div>
    </div>
  );
};