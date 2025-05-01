export function StatCard({ title, value }) {
    return (
      <div className="p-4 bg-white rounded-xl shadow">
        <h5 className="text-sm font-medium text-gray-500">{title}</h5>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    );
  }
  