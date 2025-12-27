export default function EmptyState({ 
  icon = '📋', 
  title = 'No items found', 
  message = 'Get started by creating a new item.',
  action 
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md">{message}</p>
      {action && action}
    </div>
  );
}

