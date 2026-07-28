const Table = ({ columns, data, renderRow, emptyMessage = 'No data found' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="card overflow-hidden">
        <div className="p-12 text-center">
          <p className="text-gray-400 dark:text-gray-500 text-sm">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-dark-border">
              {columns.map((col, index) => (
                <th key={index} className="table-header">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
            {data.map((item, index) => renderRow(item, index))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
